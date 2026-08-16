import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync('index.html', 'utf8');
const configMatch = index.match(/notFoundPage:\s*(\{[\s\S]*?\})\s*,\s*auto2top/);

assert.ok(configMatch, 'The Docsify not-found-page configuration must remain available');

const notFoundPages = Function(`"use strict"; return (${configMatch[1]});`)();

function resolveNotFoundPage(filePath) {
    const matchingPrefix = Object.keys(notFoundPages)
        .sort((left, right) => right.length - left.length)
        .find((prefix) => new RegExp(`^${prefix}`).test(filePath));

    return matchingPrefix ? notFoundPages[matchingPrefix] : '_404.md';
}

assert.equal(
    resolveNotFoundPage('/Docs/en/missing-page.md'),
    '/en/404',
    'English routes under the deployed /Docs/ base path must load the English 404 page'
);
assert.equal(
    resolveNotFoundPage('/en/missing-page.md'),
    '/en/404',
    'English routes without the deployed base path must keep the local English fallback'
);
assert.equal(
    resolveNotFoundPage('/Docs/missing-page.md'),
    '/404',
    'Default-language routes must continue to load the Chinese 404 page'
);
assert.match(index, /['"]\/en\/404['"]:\s*['"]\/en\/_404\.md['"]/, 'The English 404 alias must target the English Markdown file');

console.log('Language-aware 404 routing tests passed.');
