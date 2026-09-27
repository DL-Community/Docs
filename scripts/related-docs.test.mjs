import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Load the site's actual bundled Markdown lexer without starting Docsify's UI.
const element = { style: {}, classList: { add() {}, contains() { return false; } },
    getAttribute() { return null; }, querySelectorAll() { return []; }, appendChild() {} };
const languages = [
    { code: 'zh', prefix: '', htmlLanguage: 'zh-CN' },
    { code: 'en', prefix: '/en', htmlLanguage: 'en' },
    { code: 'zh-TW', prefix: '/zh-TW', htmlLanguage: 'zh-TW' }
];
function createRuntime(files = {}) {
    const hooks = {};
    const requests = [];
    const document = {
        baseURI: 'https://example.test/Docs/index.html',
        body: element, head: element, documentElement: element, readyState: 'loading',
        addEventListener() {}, querySelector() { return null; }, getElementsByTagName() { return []; },
        createElement() { return { ...element }; },
        querySelectorAll(selector) {
            return selector === '#language-menu a[data-language-code]' ? languages.map(language => ({
                dataset: { languageCode: language.code, languagePrefix: language.prefix },
                getAttribute() { return language.htmlLanguage; }
            })) : [];
        }
    };
    const window = {
        document, addEventListener() {}, setTimeout, clearTimeout,
        getComputedStyle() { return { getPropertyValue() { return ''; } }; },
        Prism: { manual: true }, navigator: { userAgent: 'Node.js' },
        location: { protocol: 'https:', host: 'example.test', href: document.baseURI },
        $docsify: { basePath: '/Docs/', plugins: [] }
    };
    const runtime = vm.createContext({ window, document, Element: class {},
        getComputedStyle: window.getComputedStyle, navigator: window.navigator, location: window.location,
        console, URL, URLSearchParams, AbortController, setTimeout, clearTimeout,
        // Only text extraction is stubbed; the Markdown parser is the real bundled version.
        DOMParser: class {
            parseFromString(html) {
                return { body: { textContent: html.replace(/<[^>]*>/g, '').replace(/&(amp|lt|gt|quot|#39);/g,
                    (_, entity) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" })[entity]) } };
            }
        },
        fetch: async url => {
            const file = decodeURIComponent(new URL(url).pathname.replace('/Docs/', ''));
            requests.push(file);
            return { ok: Object.hasOwn(files, file), text: async () => files[file] };
        }
    });
    for (const file of ['lib/docsify.min.js', 'lib/overview-metadata.js', 'i18n.js', 'en/i18n.js',
        'zh-TW/i18n.js', 'lib/markdown-components.js', 'lib/components/related-docs.js']) {
        vm.runInContext(readFileSync(file, 'utf8'), runtime, { filename: file });
    }
    const app = {
        route: { path: '/dlce/source', file: '/Docs/dlce/source.md' },
        router: { getFile(path) {
            if (path === '/dlce/old') path = '/dlce/article';
            return '/Docs' + path + (path.endsWith('/') ? 'README.md' : '.md');
        } }
    };
    window.$docsify.plugins[0]({
        beforeEach(callback) { hooks.before = callback; },
        afterEach(callback) { hooks.after = callback; }
    }, app);
    return { hooks, requests, app, window, async render(markdown) {
        const html = window.marked.parse(hooks.before(markdown));
        return new Promise(resolve => hooks.after(html, resolve));
    } };
}
const block = source => `<!-- related-docs:start -->\n${source}\n<!-- related-docs:end -->`;
const sidebar = `<!-- page-title: "游戏文档" -->
- 版本历史 :id=versions
  - [3.0](/dlce/versions/v3.md)
- 后期处理 :id=processing
  - [V1](/dlce/article.md)
- 设置 :id=settings
  - [通用](settings/general.md)
- 同名目录 :id=collision
  - [子文档](/dlce/child.md)
`;
const runtime = createRuntime({
    'dlce/_sidebar.md': sidebar,
    'dlce/article.md': '# Article H1\n### 新版 :id=New\n### Repeat\n### Repeat\n',
    'dlce/settings/general.md': '# General\n## 画质',
    'dlce/unlisted.md': '# **独立标题** &amp; 内容\n\n```md\n# False\n```',
    'dlce/collision.md': '# 真实文档',
    'en/dlce/_sidebar.md': '- [Currency](/en/dlce/coins.md)',
    'dlce/source.md': '# Source\n## 本页锚点',
    'dlce/html-error.md': '<!doctype html><html><h1>Not found</h1></html>'
});
let html = await runtime.render(block(`<!-- desc: "Writer's guide <safe>" -->
- /dlce/article.md#New
- /dlce/settings/general.md#画质
- /dlce/unlisted.md
- /dlce/old.md
- /dlce/collision
- /dlce/versions
- /dlce/__overview/path-dlce~versions~v3
- /dlce/`));
assert.match(html, /相关文档/);
assert.match(html, /后期处理 › V1 › 新版/);
assert.match(html, /href="#\/dlce\/article\?id=new"/);
assert.match(html, /Writer&#39;s guide &lt;safe&gt;/);
assert.match(html, /设置 › 通用 › 画质/);
assert.match(html, /独立标题 &amp; 内容/);
assert.match(html, /href="#\/dlce\/old"[^]*?后期处理 › V1/);
assert.match(html, /真实文档/);
assert.doesNotMatch(html, /同名目录/);
assert.equal((html.match(/related-docs-name">版本历史</g) || []).length, 2);
assert.match(html, /related-docs-name">游戏文档</);
assert.equal(runtime.requests.filter(file => file === 'dlce/article.md').length, 1);
assert.equal(runtime.requests.filter(file => file === 'dlce/_sidebar.md').length, 1);
assert.doesNotMatch(html, /markdown-component-placeholder|related-docs:start/);

html = await runtime.render(block(`<!-- title: "延伸阅读" -->
- /dlce/article.md?id=repeat-1
- ./settings/general.md
- #本页锚点
- #/dlce/article?id=new
- /en/dlce/coins.md
- /dlce/missing.md
- /dlce/html-error.md
- [**手写名称**](/dlce/article.md)
- [旧版说明](/dlce/article.md#New)
- [Official](https://example.com/docs)`));
assert.match(html, /aria-label="延伸阅读"/);
assert.match(html, /后期处理 › V1 › Repeat/);
assert.match(html, /href="#\/dlce\/article\?id=repeat-1"/);
assert.match(html, /Source › 本页锚点/);
assert.match(html, /related-docs-name">Currency</);
assert.match(html, /related-docs-name">\/dlce\/missing</);
assert.match(html, /related-docs-name">\/dlce\/html-error</);
assert.match(html, /related-docs-name">手写名称</);
assert.match(html, /href="#\/dlce\/article\?id=new"[^]*?related-docs-name">旧版说明</);
assert.match(html, /target="_blank" rel="noopener noreferrer"/);
assert.doesNotMatch(html, /related-docs-description/);

runtime.app.route = { path: '/en/dlce/source', file: '/Docs/en/dlce/source.md' };
assert.match(await runtime.render(block('- /dlce/article')), /aria-label="Related documents"/);
assert.equal((await runtime.render(block(''))).trim(), '');
assert.equal((await runtime.render(block('- javascript:alert(1)\n- data:text/plain,no\n- //evil.test/x'))).trim(), '');

// Code examples and malformed blocks must remain untouched, never consume later prose.
for (const source of [
    '```md\n' + block('- /dlce/article') + '\n```',
    '~~~\n' + block('- /dlce/article') + '\n~~~',
    block('- /dlce/article').split('\n').map(line => '    ' + line).join('\n'),
    '`<!-- related-docs:start -->`',
    '<!-- related-docs:start -->\n- /dlce/article',
    block(block('- /dlce/article')),
    block('unexpected prose\n- /dlce/article'),
    block('```md\n<!-- related-docs:end -->\n```\n- /dlce/article')
]) assert.equal(runtime.hooks.before(source), source);
html = await runtime.render(block('- /dlce/article') + '\n## Following heading');
assert.match(html, /<h2>Following heading<\/h2>/);

// Every migrated document renders its full list using repository metadata.
const { readdirSync } = await import('node:fs');
const files = {};
for (const root of ['dlce', 'en/dlce', 'zh-TW/dlce']) {
    for (const path of readdirSync(root, { recursive: true })) {
        if (path.endsWith('.md')) files[root + '/' + path] = readFileSync(root + '/' + path, 'utf8');
    }
}
const site = createRuntime(files);
let migrated = 0;
for (const [file, source] of Object.entries(files)) {
    const match = source.match(/<!-- related-docs:start -->\n([\s\S]*?)\n<!-- related-docs:end -->/);
    if (!match) continue;
    site.app.route = { path: '/' + file.replace(/\.md$/, ''), file: '/Docs/' + file };
    const result = await site.render(match[0]);
    assert.equal((result.match(/class="related-docs-card"/g) || []).length,
        match[1].split('\n').filter(line => line.startsWith('- ')).length, file);
    assert.doesNotMatch(result, /related-docs-name">\//, 'Unresolved document name: ' + file);
    migrated++;
}
assert.ok(migrated > 0, 'Verify the related-docs blocks used by the site.');
console.log(`Related document parsing, routing, localization and ${migrated} document blocks passed.`);
