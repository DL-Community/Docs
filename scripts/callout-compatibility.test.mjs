import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('lib/css/docs-app.css', 'utf8');

function declarationsFor(selector) {
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));
    assert.ok(match, `Missing compatibility styles for ${selector}`);
    return match[1];
}

const blockquote = declarationsFor('.markdown-section blockquote');
assert.match(blockquote, /border-left-width:\s*var\(--docs-notice-rule-width\)/);
assert.match(blockquote, /border-radius:\s*0 var\(--docs-radius\) var\(--docs-radius\) 0/);

assert.match(
    css,
    /\.markdown-section \.callout\s*\{[^}]*position:\s*relative[^}]*border:\s*solid var\(--callout-border-color\)[^}]*background:\s*var\(--callout-bg\)/s
);
assert.match(
    css,
    /\.markdown-section \.callout::before\s*\{[^}]*inset:\s*var\(--callout-charm-inset\)[^}]*background:\s*var\(--callout-charm-bg\)/s
);

for (const type of ['caution', 'important', 'note', 'tip', 'warning']) {
    const declarations = declarationsFor(`.markdown-section .callout.${type}`);
    assert.match(declarations, /--callout-bg/);
    assert.match(declarations, /--callout-border-color/);
    assert.match(declarations, /--callout-charm-bg/);
}

const nested = declarationsFor('.markdown-section .callout .callout');
assert.match(nested, /margin:\s*1rem 0/);

assert.match(
    css,
    /\.markdown-section blockquote,\s*\.markdown-section \.callout\s*\{[^}]*width:\s*100%[^}]*max-width:\s*var\(--docs-prose-max-width\)/s
);

assert.doesNotMatch(css, /\.markdown-section \.callout\.important::before/);
assert.doesNotMatch(css, /--notice-important-background/);

console.log('Docsify v5 callout styles passed.');
