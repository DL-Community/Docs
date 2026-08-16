import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const componentEngine = readFileSync('lib/markdown-components.js', 'utf8');
const lastModifiedComponent = readFileSync('lib/components/last-modified.js', 'utf8');

function languageLink(code, prefix, htmlLanguage) {
    return {
        dataset: {
            languageCode: code,
            languagePrefix: prefix
        },
        getAttribute(name) {
            return name === 'lang' ? htmlLanguage : null;
        }
    };
}

function createRuntime(manifest, options = {}) {
    const hooks = {};
    const route = options.route || {
        path: '/dlce/localization',
        file: '/Docs/dlce/localization.md'
    };
    const languageLinks = options.languageLinks || [
        languageLink('zh', '', 'zh-CN'),
        languageLink('en', '/en', 'en')
    ];
    const document = {
        baseURI: 'https://example.test/Docs/index.html',
        querySelectorAll(selector) {
            if (selector !== '#language-menu a[data-language-code]') return [];
            return languageLinks;
        }
    };
    const window = {
        DLCE_I18N: {
            zh: { last_modified: '\u6700\u540e\u4fee\u6539\u4e8e {date}' },
            en: { last_modified: 'Last updated on {date}' },
            fr: { last_modified: 'Mis à jour le {date}' }
        },
        $docsify: {
            basePath: '/Docs/',
            plugins: []
        }
    };
    const context = vm.createContext({
        console,
        document,
        fetch: async () => ({
            ok: true,
            json: async () => manifest
        }),
        Intl,
        Number,
        Promise,
        URL,
        window
    });

    vm.runInContext(componentEngine, context, { filename: 'markdown-components.js' });
    vm.runInContext(lastModifiedComponent, context, { filename: 'last-modified.js' });

    assert.equal(window.$docsify.plugins.length, 1);
    window.$docsify.plugins[0]({
        beforeEach(handler) {
            hooks.beforeEach = handler;
        },
        afterEach(handler) {
            hooks.afterEach = handler;
        }
    }, {
        route
    });

    return hooks;
}

function renderAfterEach(hook, html) {
    return new Promise((resolve) => hook(html, resolve));
}

const manifest = {
    schemaVersion: 1,
    files: {
        'dlce/localization.md': {
            updatedAt: '2026-08-13T14:32:10Z',
            commit: 'abc1234'
        }
    }
};
const hooks = createRuntime(manifest);
const placeholder = '<span class="markdown-component-placeholder" data-markdown-component="last-modified"></span>';

const transformed = hooks.beforeEach([
    '**<!-- last-modified -->**',
    '',
    '`<!-- last-modified -->`',
    '',
    '    <!-- last-modified -->',
    '',
    '```md',
    '<!-- last-modified -->',
    '```',
    '',
    '<!-- unknown-component -->'
].join('\n'));

assert.ok(transformed.includes(`**${placeholder}**`));
assert.ok(transformed.includes('`<!-- last-modified -->`'));
assert.ok(transformed.includes('    <!-- last-modified -->'));
assert.ok(transformed.includes('```md\n<!-- last-modified -->\n```'));
assert.ok(transformed.includes('<!-- unknown-component -->'));

const legacySyntaxSource = [
    '?> Legacy info with `inline code`.',
    '',
    '!> Legacy caution.',
    '',
    '> ?> Nested legacy info.',
    '',
    '    ?> Indented code stays unchanged.',
    '',
    '```md',
    '?> Fenced code stays unchanged.',
    '```'
].join('\n');
const legacySyntaxTransformed = hooks.beforeEach(legacySyntaxSource);

assert.equal(
    legacySyntaxTransformed,
    legacySyntaxSource,
    'Legacy ?> and !> syntax must pass through to Docsify v5 without custom mapping'
);

const crlfLegacySyntaxSource = [
    '?> Windows info.',
    '',
    '!> Windows caution.',
    '',
    '> ?> Nested Windows info.'
].join('\r\n');

assert.equal(hooks.beforeEach(crlfLegacySyntaxSource), crlfLegacySyntaxSource);

const rendered = await renderAfterEach(
    hooks.afterEach,
    `<p><strong>${placeholder}</strong></p>`
);

assert.match(rendered, /<p><strong><span class="markdown-component markdown-component--last-modified">/);
assert.match(rendered, /\u6700\u540e\u4fee\u6539\u4e8e/);
assert.match(rendered, /<time datetime="2026-08-13T14:32:10\.000Z">/);
assert.doesNotMatch(rendered, /markdown-component-placeholder/);

const localizedManifest = {
    schemaVersion: 1,
    files: {
        'en/dlce/localization.md': manifest.files['dlce/localization.md'],
        'fr/dlce/localization.md': manifest.files['dlce/localization.md']
    }
};
const englishHooks = createRuntime(localizedManifest, {
    route: {
        path: '/en/dlce/localization',
        file: '/Docs/en/dlce/localization.md'
    }
});
const englishRendered = await renderAfterEach(
    englishHooks.afterEach,
    `<p><strong>${placeholder}</strong></p>`
);

assert.match(englishRendered, /<strong><span class="markdown-component markdown-component--last-modified">/);
assert.match(englishRendered, /Last updated on/);
assert.match(englishRendered, /Last updated on\u00a0<time/);

const futureLanguageHooks = createRuntime(localizedManifest, {
    route: {
        path: '/fr/dlce/localization',
        file: '/Docs/fr/dlce/localization.md'
    },
    languageLinks: [
        languageLink('zh', '', 'zh-CN'),
        languageLink('en', '/en', 'en'),
        languageLink('fr', '/fr', 'fr-FR')
    ]
});
const futureLanguageRendered = await renderAfterEach(
    futureLanguageHooks.afterEach,
    `<p>${placeholder}</p>`
);

assert.match(futureLanguageRendered, /Mis à jour le/);

console.log('Markdown component tests passed.');
