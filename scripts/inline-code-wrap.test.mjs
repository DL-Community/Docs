import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const appCss = readFileSync('lib/css/docs-app.css', 'utf8');
const coreCss = readFileSync('lib/css/docsify-v5-core.min.css', 'utf8');

const inlineCode = appCss.match(
    /\.markdown-section code:not\(\[class\*=['"]lang-['"]\]\):not\(\[class\*=['"]language-['"]\]\)\s*\{([^}]*)\}/
);

assert.ok(inlineCode, 'Missing narrow-screen inline-code wrapping override');
assert.match(inlineCode[1], /white-space:\s*break-spaces/);
assert.match(inlineCode[1], /overflow-wrap:\s*anywhere/);
assert.match(inlineCode[1], /word-break:\s*break-word/);

assert.match(
    coreCss,
    /\.markdown-section pre\[data-lang\]\{[^}]*white-space:pre/,
    'Fenced code blocks must preserve preformatted whitespace and horizontal scrolling'
);

console.log('Inline-code wrapping compatibility tests passed.');
