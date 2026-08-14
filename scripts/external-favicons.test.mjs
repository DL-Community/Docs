import assert from 'node:assert/strict';
import { discoverFaviconUrls, extractExternalLinks } from './external-favicon-utils.mjs';

const links = extractExternalLinks(`
- [Internal](/social/home)
- [External](https://example.com/community)
- [Duplicate](https://example.com/community)
- [Second](https://social.example.net/@dlce "Community")
`);

assert.deepEqual(links, [
    'https://example.com/community',
    'https://social.example.net/@dlce'
]);

const icons = discoverFaviconUrls(`
<!doctype html>
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link href="/icons/light.svg" media="(prefers-color-scheme: light)" rel="icon" type="image/svg+xml">
<link rel="icon" href="icons/dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">
`, 'https://example.com/community/page');

assert.equal(icons.standard, 'https://example.com/icons/light.svg');
assert.equal(icons.dark, 'https://example.com/community/icons/dark.svg');
assert.deepEqual(discoverFaviconUrls('<p>No favicon</p>', 'https://example.com'), {
    standard: '',
    dark: ''
});

console.log('External favicon discovery tests passed.');
