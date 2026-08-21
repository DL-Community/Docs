import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const gateSource = readFileSync('lib/legacy-browser-gate.js', 'utf8');
const pageSource = readFileSync('lib/legacy-browser-page.js', 'utf8');
const languagesSource = readFileSync('lib/supported-languages.js', 'utf8');
const navigationSource = readFileSync('lib/navigation.js', 'utf8');
const index = readFileSync('index.html', 'utf8');

const userAgents = {
    ie11: 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
    edgeLegacy: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Edge/18.19045',
    chrome109: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 Chrome/109.0.0.0 Safari/537.36',
    chrome110: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/110.0.0.0 Safari/537.36',
    edge109: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78',
    edge110: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41',
    firefox115: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0',
    firefox116: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:116.0) Gecko/20100101 Firefox/116.0',
    safari153: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/15.3 Safari/605.1.15',
    safari154: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_3) AppleWebKit/605.1.15 Version/15.4 Safari/605.1.15'
};

function createGate(options = {}) {
    const redirects = [];
    const storage = new Map(options.dismissed ? [['dlce-docs-legacy-browser-dismissed', '1']] : []);
    function Element() {}
    Element.prototype.closest = function () {};
    Element.prototype.matches = function () {};
    Element.prototype.replaceChildren = function () {};
    function NodeList() {}
    NodeList.prototype.forEach = function () {};

    const location = {
        href: options.href || 'https://example.test/Docs/#/about/home',
        hash: options.hash || '#/about/home',
        search: options.search || '',
        replace(value) {
            redirects.push(value);
        }
    };
    const document = {
        cookie: options.cookie || '',
        documentMode: options.documentMode,
        getElementById(id) {
            return id === 'legacy-browser-gate'
                ? { src: 'https://example.test/Docs/lib/legacy-browser-gate.js?v=test' }
                : null;
        },
        querySelector() {}
    };
    const window = {
        Element,
        NodeList,
        Promise,
        fetch() {},
        URL,
        URLSearchParams,
        matchMedia() {},
        history: { replaceState() {} },
        String,
        location,
        sessionStorage: {
            getItem(key) { return storage.get(key) || null; },
            setItem(key, value) { storage.set(key, value); }
        }
    };
    if (options.missingFeature) window[options.missingFeature] = undefined;
    if (options.testMode) window.__DLCE_LEGACY_BROWSER_TEST__ = true;

    const context = vm.createContext({
        window,
        document,
        navigator: { userAgent: options.userAgent || userAgents.chrome110 },
        encodeURIComponent,
        parseInt,
        RegExp,
        String
    });
    vm.runInContext(languagesSource, context, { filename: 'supported-languages.js' });
    if (options.languages) window.DLCE_SUPPORTED_LANGUAGES = options.languages;
    vm.runInContext(gateSource, context, { filename: 'legacy-browser-gate.js' });
    return { api: window.DLCE_LEGACY_BROWSER, redirects, storage };
}

const api = createGate({ testMode: true }).api;
[
    ['Internet Explorer 11', userAgents.ie11],
    ['EdgeHTML', userAgents.edgeLegacy],
    ['Chrome 109', userAgents.chrome109],
    ['Edge 109', userAgents.edge109],
    ['Firefox 115', userAgents.firefox115],
    ['Safari 15.3', userAgents.safari153]
].forEach(([label, userAgent]) => {
    assert.equal(api.inspect(userAgent).unsupported, true, `${label} must be blocked`);
});

[
    ['Chrome 110', userAgents.chrome110],
    ['Edge 110', userAgents.edge110],
    ['Firefox 116', userAgents.firefox116],
    ['Safari 15.4', userAgents.safari154]
].forEach(([label, userAgent]) => {
    assert.equal(api.inspect(userAgent).unsupported, false, `${label} must pass the version gate`);
});

assert.equal(
    createGate({ testMode: true, missingFeature: 'fetch' }).api.isUnsupported(),
    true,
    'Browsers missing a required site API must be blocked even with a recent user agent'
);

assert.match(
    createGate({ userAgent: userAgents.chrome109 }).redirects[0],
    /^https:\/\/example\.test\/Docs\/unsupported-browser\.html\?return=/,
    'The default language must use the root warning page'
);
assert.match(
    createGate({ userAgent: userAgents.chrome109, hash: '#/zh-TW/dlce/versions' }).redirects[0],
    /\/Docs\/zh-TW\/unsupported-browser\.html\?return=/,
    'Traditional Chinese routes must use the Traditional Chinese warning page'
);
assert.match(
    createGate({ userAgent: userAgents.chrome109, hash: '#/en/dlce/versions' }).redirects[0],
    /\/Docs\/en\/unsupported-browser\.html\?return=/,
    'English routes must use the English warning page'
);
assert.match(
    createGate({
        userAgent: userAgents.chrome109,
        hash: '#/ja/about/home',
        languages: [
            { code: 'zh', path: '' },
            { code: 'ja', path: 'ja' }
        ]
    }).redirects[0],
    /\/Docs\/ja\/unsupported-browser\.html\?return=/,
    'A newly registered language must work without modifying the browser detector'
);
assert.equal(
    createGate({ userAgent: userAgents.chrome109, dismissed: true }).redirects.length,
    0,
    'A session dismissal must allow the visitor to continue'
);
assert.equal(
    createGate({ userAgent: userAgents.chrome110, search: '?legacy-browser=force' }).redirects.length,
    1,
    'The documented force parameter must open the warning page in a modern browser'
);

const consoleEntry = createGate({ testMode: true, hash: '#/en/about/home' });
consoleEntry.api.force();
assert.match(
    consoleEntry.redirects[0],
    /\/Docs\/en\/unsupported-browser\.html\?return=/,
    'The console force command must remain available and language-aware'
);

assert.ok(
    index.indexOf('lib/supported-languages.js') < index.indexOf('id="legacy-browser-gate"'),
    'The shared language registry must load before the browser gate'
);
assert.match(
    index,
    /DLCE_RENDER_SITE_LANGUAGE_MENU\(document\.getElementById\('language-menu'\)\)/,
    'The site language menu must be generated from the same registry as the warning pages'
);
assert.doesNotMatch(
    index,
    /<a\s+id="language-(?:zh|zh-TW|en)"/,
    'The site language menu must not duplicate a hard-coded language list'
);
assert.ok(
    index.indexOf('id="legacy-browser-gate"') < index.indexOf('<script src="i18n.js"'),
    'The old-browser gate must execute before the modern site shell scripts'
);

[
    ['unsupported-browser.html', '当前浏览器已经过时'],
    ['zh-TW/unsupported-browser.html', '目前的瀏覽器已經過時'],
    ['en/unsupported-browser.html', 'Your browser is out of date']
].forEach(([filePath, heading]) => {
    const html = readFileSync(filePath, 'utf8');
    assert.match(html, new RegExp(heading), `${filePath} must contain localized warning copy`);
    assert.match(html, /id="legacy-browser-continue"/, `${filePath} must provide a continue action`);
    assert.match(html, /Microsoft Edge[\s\S]*Google Chrome[\s\S]*Mozilla Firefox[\s\S]*Apple Safari/, `${filePath} must list the recommended browsers`);
    assert.equal((html.match(/data-language-path=/g) || []).length, 3, `${filePath} must link all supported languages`);
    assert.ok(
        html.indexOf('supported-languages.js') < html.indexOf('id="legacy-browser-page-script"'),
        `${filePath} must load the shared language registry before rendering language links`
    );
});

[gateSource, pageSource, languagesSource].forEach((source) => {
    assert.doesNotMatch(source, /\b(?:const|let|class)\b|=>|\?\.|\?\?/, 'Old-browser scripts must stay ES5-compatible');
});

const languagesContext = vm.createContext({ window: {} });
vm.runInContext(languagesSource, languagesContext, { filename: 'supported-languages.js' });
const registeredLanguageCodes = JSON.parse(JSON.stringify(
    languagesContext.window.DLCE_SUPPORTED_LANGUAGES.map((language) => language.code)
));
for (const languageCode of ['zh', 'zh-TW', 'en']) {
    assert.ok(registeredLanguageCodes.includes(languageCode), `The language registry must contain ${languageCode}`);
}
assert.doesNotMatch(
    languagesSource,
    /labelKey|data-language-label-key/,
    'Language definitions must use label directly instead of dictionary label keys'
);
assert.match(
    navigationSource,
    /label:\s*link\.dataset\.languageLabel[\s\S]*currentLanguageLabel\.textContent\s*=\s*currentLanguage\.label[\s\S]*definition\.link\.textContent\s*=\s*definition\.label/,
    'The site shell must keep language names from the supported-language labels'
);
for (const dictionaryPath of ['i18n.js', 'zh-TW/i18n.js', 'en/i18n.js']) {
    assert.doesNotMatch(
        readFileSync(dictionaryPath, 'utf8'),
        /^\s*language_(?!switch\b)[A-Za-z0-9_]+\s*:/m,
        `${dictionaryPath} must not duplicate language names from the supported-language registry`
    );
}
assert.match(
    pageSource,
    /DLCE_SUPPORTED_LANGUAGES[\s\S]*createElement\('a'\)[\s\S]*localizedPageUrl/,
    'Warning-page language links must be generated from the shared registry'
);

function createPageContext() {
    const pageUrl = 'https://example.test/Docs/en/unsupported-browser.html?return=' +
        encodeURIComponent('https://example.test/Docs/?legacy-browser=force#/en/about/home');

    class FakeElement {
        constructor(tagName = '') {
            this.tagName = tagName.toUpperCase();
            this.children = [];
            this.attributes = new Map();
            this._href = '';
        }

        appendChild(child) {
            this.children.push(child);
            return child;
        }

        removeChild(child) {
            this.children.splice(this.children.indexOf(child), 1);
            return child;
        }

        get firstChild() {
            return this.children[0] || null;
        }

        setAttribute(name, value) {
            this.attributes.set(name, String(value));
        }

        getAttribute(name) {
            return this.attributes.get(name) || null;
        }

        set href(value) {
            this._href = new URL(value, pageUrl).href;
        }

        get href() { return this._href; }
        get protocol() { return new URL(this._href).protocol; }
        get host() { return new URL(this._href).host; }
        get pathname() { return new URL(this._href).pathname; }
    }

    const continueLink = new FakeElement('a');
    const languageContainer = new FakeElement('p');
    const pageScript = new FakeElement('script');
    pageScript.src = 'https://example.test/Docs/lib/legacy-browser-page.js?v=test';
    pageScript.setAttribute('data-language-code', 'en');

    const elements = new Map([
        ['legacy-browser-continue', continueLink],
        ['legacy-browser-languages', languageContainer],
        ['legacy-browser-page-script', pageScript]
    ]);
    const document = {
        cookie: '',
        getElementById(id) { return elements.get(id) || null; },
        querySelectorAll() { return []; },
        createElement(tagName) { return new FakeElement(tagName); },
        createTextNode(value) { return { nodeType: 3, textContent: String(value) }; }
    };
    const window = {
        location: { href: pageUrl, search: new URL(pageUrl).search },
        sessionStorage: { setItem() {} }
    };
    const context = vm.createContext({ window, document, decodeURIComponent, encodeURIComponent, String, URL });
    vm.runInContext(languagesSource, context, { filename: 'supported-languages.js' });
    const originalLanguageCount = window.DLCE_SUPPORTED_LANGUAGES.length;
    window.DLCE_SUPPORTED_LANGUAGES.push({
        code: 'test-lang',
        htmlLang: 'x-test',
        label: 'Test language',
        path: 'test-lang',
        home: '/test-lang/about/home'
    });
    vm.runInContext(pageSource, context, { filename: 'legacy-browser-page.js' });
    const siteMenu = new FakeElement('div');
    window.DLCE_RENDER_SITE_LANGUAGE_MENU(siteMenu);
    return { continueLink, languageContainer, originalLanguageCount, siteMenu };
}

const renderedPage = createPageContext();
assert.equal(
    renderedPage.languageContainer.children.length,
    renderedPage.originalLanguageCount + 1,
    'A newly registered language must appear on every warning page'
);
assert.equal(
    renderedPage.languageContainer.children.at(-1).href,
    'https://example.test/Docs/test-lang/unsupported-browser.html?return=' +
        encodeURIComponent('https://example.test/Docs/#/en/about/home'),
    'The generated language link must target the new language directory and retain the return route'
);
assert.equal(
    renderedPage.languageContainer.children.find((link) => link.lang === 'en').getAttribute('aria-current'),
    'page',
    'The generated language list must identify the current language'
);
assert.equal(
    renderedPage.continueLink.href,
    'https://example.test/Docs/#/en/about/home',
    'The continue action must remove the force parameter after dynamic language rendering'
);
assert.equal(
    renderedPage.siteMenu.children.length,
    renderedPage.originalLanguageCount + 1,
    'The site language menu must receive the newly registered language'
);
assert.equal(renderedPage.siteMenu.children.at(-1).id, 'language-test-lang', 'The new site language entry must use a stable language id');
assert.equal(
    renderedPage.siteMenu.children.at(-1).getAttribute('data-language-home'),
    '/test-lang/about/home',
    'The new site language entry must retain its configured home route'
);

console.log('Legacy-browser gate and localized warning-page tests passed.');
