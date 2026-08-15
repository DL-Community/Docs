import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function loadDictionary(file, language) {
    const context = vm.createContext({ window: {} });
    vm.runInContext(readFileSync(file, 'utf8'), context, { filename: file });
    return context.window.DLCE_I18N[language];
}

const zh = loadDictionary('i18n.js', 'zh');
const en = loadDictionary('en/i18n.js', 'en');

for (const [dictionary, expected] of [
    [zh, { count: '找到 2 个结果', clear: '清除搜索', result: '搜索结果 1' }],
    [en, { count: 'Found 2 results', clear: 'Clear search', result: 'Search result 1' }]
]) {
    assert.equal(dictionary.search_results_found.replace('{count}', '2'), expected.count);
    assert.ok(dictionary.search_result_found.includes('{count}'));
    assert.equal(dictionary.search_clear, expected.clear);
    assert.equal(dictionary.search_result_label.replace('{index}', '1'), expected.result);
}

function element(properties = {}) {
    const attributes = new Map();
    return Object.assign({
        tagName: 'DIV',
        textContent: '',
        getAttribute(name) {
            return attributes.has(name) ? attributes.get(name) : null;
        },
        setAttribute(name, value) {
            attributes.set(name, String(value));
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        }
    }, properties);
}

const input = element({
    tagName: 'INPUT',
    value: '后处理',
    dispatched: false,
    focused: false,
    dispatchEvent() {
        this.dispatched = true;
    },
    focus() {
        this.focused = true;
    }
});
const hiddenLabel = element();
const clearButton = element({
    tagName: 'BUTTON',
    querySelector(selector) {
        return selector === '.visually-hidden' ? hiddenLabel : null;
    }
});
const results = [element(), element()];
const resultsStatus = element();
const resultsPanel = element({
    querySelectorAll(selector) {
        return selector === '.matching-post' ? results : [];
    },
    replaceChildren() {
        results.length = 0;
    }
});
const shortcuts = [element(), element()];
const search = element({
    querySelector(selector) {
        return {
            'input[type="search"]': input,
            '.clear-button': clearButton,
            '.results-panel': resultsPanel,
            '.results-status': resultsStatus
        }[selector] || null;
    },
    querySelectorAll(selector) {
        return selector === '.kbd-group kbd' ? shortcuts : [];
    }
});
clearButton.closest = selector => selector === '.search' ? search : null;

const languageLinks = [
    element({
        dataset: {
            languageCode: 'zh',
            languagePrefix: '',
            languageHome: '/about/home',
            languageLabelKey: 'language_zh'
        }
    }),
    element({
        dataset: {
            languageCode: 'en',
            languagePrefix: '/en',
            languageHome: '/en/about/home',
            languageLabelKey: 'language_en'
        },
        getAttribute(name) {
            return name === 'lang' ? 'en' : null;
        }
    })
];
const document = {
    documentElement: { dataset: {} },
    addEventListener() {},
    getElementById() {
        return null;
    },
    querySelector(selector) {
        return selector === '.sidebar .search' ? search : null;
    },
    querySelectorAll(selector) {
        return selector === '#language-menu a[data-language-code]' ? languageLinks : [];
    }
};
const window = {
    DLCE_I18N: { zh, en },
    $docsify: { plugins: [] },
    location: { hash: '#/dlce/settings/general' },
    addEventListener() {},
    clearTimeout() {},
    setTimeout(callback) {
        callback();
        return 1;
    },
    matchMedia() {
        return { addEventListener() {}, matches: false };
    }
};
const context = vm.createContext({
    document,
    window,
    URL,
    URLSearchParams,
    Event: class Event {},
    MutationObserver: class MutationObserver {
        disconnect() {}
        observe() {}
    }
});

vm.runInContext(readFileSync('lib/navigation.js', 'utf8'), context, {
    filename: 'navigation.js'
});

window.DLCE_SEARCH_UI.sync();
assert.equal(resultsStatus.textContent, '找到 2 个结果');
assert.equal(clearButton.getAttribute('aria-label'), '清除搜索');
assert.equal(clearButton.getAttribute('type'), 'button');
assert.equal(results[0].getAttribute('aria-label'), '搜索结果 1');
assert.equal(shortcuts[0].getAttribute('title'), '按 / 开始搜索');

window.location.hash = '#/en/dlce/settings/general';
window.DLCE_SEARCH_UI.sync();
assert.equal(resultsStatus.textContent, 'Found 2 results');
assert.equal(clearButton.getAttribute('aria-label'), 'Clear search');
assert.equal(results[1].getAttribute('aria-label'), 'Search result 2');

results.pop();
window.DLCE_SEARCH_UI.sync();
assert.equal(resultsStatus.textContent, 'Found 1 result');

window.DLCE_SEARCH_UI.clear({
    target: {
        closest(selector) {
            return selector === '.sidebar .search .clear-button' ? clearButton : null;
        }
    }
});
assert.equal(input.value, '');
assert.equal(results.length, 0);
assert.equal(resultsStatus.textContent, '');
assert.equal(input.dispatched, true);
assert.equal(input.focused, true);

const indexSource = readFileSync('index.html', 'utf8');
assert.match(indexSource, /placeholder:\s*docsifyLocalizedSearchText\('search_placeholder'\)/);
assert.match(indexSource, /noData:\s*docsifyLocalizedSearchText\('search_no_results'\)/);
assert.match(indexSource, /pathNamespaces:\s*docsifySearchPathNamespaces\(\)/);

const cssSource = readFileSync('lib/css/docs-app.css', 'utf8');
assert.match(cssSource, /\.sidebar \.search \.results-panel:not\(:empty\)\s*\{\s*display:\s*block;/);
assert.match(
    cssSource,
    /\.sidebar \.search \.clear-button \.visually-hidden\s*\{[^}]*clip-path:\s*inset\(50%\)[^}]*white-space:\s*nowrap/s,
    'The localized clear-search label must stay available to assistive technology without covering the v5 X icon'
);
assert.match(
    cssSource,
    /\.sidebar \.search \.input-wrap\s*\{[^}]*margin-inline:\s*-0\.75rem/s,
    'The v5 search controls must stay inside the visible sidebar edge'
);
assert.match(
    cssSource,
    /\.sidebar \.search \.input-wrap > \.clear-button\s*\{[^}]*width:\s*var\(--_button-size, 20px\)[^}]*padding:\s*0/s,
    'The legacy Themeable clear-button width and padding must not collapse or offset the v5 X icon'
);

console.log('Docsify v5 search UI and localization tests passed.');
