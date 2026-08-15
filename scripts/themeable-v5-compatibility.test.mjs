import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const index = readFileSync('index.html', 'utf8');
const navigation = readFileSync('lib/navigation.js', 'utf8');
const appCss = readFileSync('lib/css/docs-app.css', 'utf8');

assert.match(
    index,
    /<link rel="stylesheet" href="lib\/css\/theme-simple\.css">/,
    'The Themeable CSS foundation must remain loaded'
);
assert.doesNotMatch(
    index,
    /<script[^>]+docsify-themeable(?:\.min)?\.js/,
    'The legacy docsify-themeable runtime must not be loaded on Docsify v5'
);
assert.equal(
    existsSync('lib/plugins/docsify-themeable.min.js'),
    false,
    'The unused v4 Themeable runtime should not remain in the deployed files'
);
assert.match(
    navigation,
    /function setupResponsiveTableCells\(\)/,
    'The site-owned responsive-table enhancement must remain available'
);
assert.match(
    navigation,
    /cell\.setAttribute\('data-table-label', labels\[columnIndex\] \|\| ''\)/,
    'Responsive table cells must retain their column labels without the legacy Themeable runtime'
);
assert.match(
    appCss,
    /\.markdown-section \.table-wrapper td::before\s*\{[^}]*content:\s*attr\(data-table-label\)/s,
    'Narrow-screen tables must render the site-owned column label'
);
assert.match(
    appCss,
    /\.mobile-sidebar-shadow\s*\{[^}]*left:\s*var\(--docs-sidebar-width\);[^}]*width:\s*calc\(100vw - var\(--docs-sidebar-width\)\)/s,
    'The mobile sidebar backdrop must begin after the drawer and cover only the content area'
);
assert.match(
    appCss,
    /\.mobile-sidebar-shadow\s*\{[^}]*transform:\s*translateX\(calc\(-1 \* var\(--docs-sidebar-width\)\)\);[^}]*transition:\s*opacity var\(--duration-medium\) var\(--ease-drawer\),\s*transform var\(--duration-medium\) var\(--ease-drawer\)/s,
    'The mobile backdrop and drawer must use the same travel distance, duration, and easing'
);
assert.doesNotMatch(
    appCss,
    /\.mobile-sidebar-shadow\s*\{[^}]*width:\s*100vw/s,
    'The mobile sidebar backdrop must never overlap the drawer controls'
);
assert.match(
    appCss,
    /\.mobile-sidebar-shadow::before\s*\{[^}]*background:\s*linear-gradient\(to right,[^}]*\)/s,
    'The mobile drawer edge shadow must fade rightward into the content area'
);
assert.doesNotMatch(
    appCss,
    /\.mobile-sidebar-shadow::before\s*\{[^}]*box-shadow:/s,
    'The mobile drawer edge shadow must not spread back over the sidebar'
);
assert.match(
    appCss,
    /body\.close \.mobile-sidebar-shadow\s*\{[^}]*pointer-events:\s*auto/s,
    'The mobile sidebar backdrop must accept dismissal taps while the drawer is open'
);
assert.match(
    navigation,
    /mobileBackdrop\.addEventListener\('click',[\s\S]*?toggle\.click\(\)/,
    'Clicking the narrow-screen backdrop must close the drawer through its existing toggle'
);
assert.match(
    navigation,
    /mobileBackdrop\.addEventListener\('click', function \(event\) \{\s*if \(event\.target !== mobileBackdrop\) return;/,
    'The mobile sidebar backdrop handler must ignore clicks from nested visual elements'
);
assert.match(
    navigation,
    /mobileBackdrop\.removeAttribute\('inert'\)/,
    'Docsify v5 must not make the site-owned dismissible backdrop inert'
);

console.log('Docsify v5 Themeable compatibility tests passed.');
