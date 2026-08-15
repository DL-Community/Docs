import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync('lib/navigation-scope.js', 'utf8');
const context = vm.createContext({ URL });
vm.runInContext(source, context, { filename: 'navigation-scope.js' });

const belongs = context.DLCE_NAVIGATION_SCOPE.hrefBelongsToDocsRoute;
const tabKey = context.DLCE_NAVIGATION_SCOPE.normalizedTabTargetKey;
const current = 'https://dl-community.github.io/Docs/index.html#/about/home';

assert.equal(belongs('#/dlce/', current, '/Docs/', 'hash'), true);
assert.equal(belongs('https://dl-community.github.io/Docs/#/social/', current, '/Docs/', 'hash'), true);
assert.equal(belongs('https://dl-community.github.io/Docs/index.html#/social/', current, '/Docs/', 'hash'), true);

assert.equal(belongs('#section', current, '/Docs/', 'hash'), false);
assert.equal(belongs('/Docs', current, '/Docs/', 'hash'), false);
assert.equal(belongs('/Docs/', current, '/Docs/', 'hash'), false);
assert.equal(belongs('/Docs/assets/logo.png', current, '/Docs/', 'hash'), false);
assert.equal(belongs('/', current, '/Docs/', 'hash'), false);
assert.equal(belongs('https://dl-community.github.io', current, '/Docs/', 'hash'), false);
assert.equal(belongs('/Docs-other/page#/guide', current, '/Docs/', 'hash'), false);
assert.equal(belongs('https://example.com/Docs/#/guide', current, '/Docs/', 'hash'), false);
assert.equal(belongs('mailto:docs@example.com', current, '/Docs/', 'hash'), false);
assert.equal(belongs('not a valid url://', current, '/Docs/', 'hash'), false);

assert.equal(belongs('/Wiki/guide', 'https://example.com/Wiki/', '/Wiki/', 'history'), true);
assert.equal(belongs('/Docs/guide', 'https://example.com/Wiki/', '/Wiki/', 'history'), false);

assert.equal(tabKey('_10'), tabKey('1.0'));
assert.equal(tabKey('_20'), tabKey('2.0'));
assert.equal(tabKey('_30'), tabKey('**3.0**'));
assert.equal(tabKey('_ios_on_mac'), tabKey('iOS on Mac'));
assert.notEqual(tabKey('_10'), tabKey('2.0'));

console.log('Navigation base-path and router-mode classification tests passed.');
