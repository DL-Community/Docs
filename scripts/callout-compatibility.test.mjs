import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('lib/css/docs-app.css', 'utf8');

function declarationsFor(selector) {
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));
    assert.ok(match, `Missing compatibility styles for ${selector}`);
    return match[1];
}

const important = declarationsFor('.markdown-section .callout.important');
const importantIcon = declarationsFor('.markdown-section .callout.important::before');
const tip = declarationsFor('.markdown-section .callout.tip');
const tipIcon = declarationsFor('.markdown-section .callout.tip::before');

assert.match(important, /--notice-important-border-color/);
assert.match(important, /--notice-important-background/);
assert.match(important, /--notice-important-color/);
assert.match(importantIcon, /--notice-important-before-background/);

assert.match(tip, /--notice-tip-border-color/);
assert.match(tip, /--notice-tip-background/);
assert.match(tip, /--notice-tip-color/);
assert.match(tipIcon, /--notice-tip-before-background/);

assert.match(
    css,
    /\.markdown-section \.warn,\s*\.markdown-section \.callout\s*\{[^}]*max-width:\s*var\(--docs-prose-max-width\)/s
);

console.log('Docsify v5 legacy callout compatibility tests passed.');
