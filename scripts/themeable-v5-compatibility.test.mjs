import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const index = readFileSync('index.html', 'utf8');
const navigation = readFileSync('lib/navigation.js', 'utf8');
const appCss = readFileSync('lib/css/docs-app.css', 'utf8');
const coreCss = readFileSync('lib/css/docsify-v5-core.min.css', 'utf8');
const tabsCss = readFileSync('lib/css/docsify-tabs.css', 'utf8');

assert.match(
    index,
    /<link rel="stylesheet" href="lib\/css\/docsify-v5-core\.min\.css\?v=\d+">/,
    'The local Docsify v5 core theme must provide the fallback layer'
);
assert.doesNotMatch(
    index,
    /theme-simple(?:-dark)?\.css/,
    'The v4 Themeable stylesheets must not remain in the page'
);
assert.ok(
    index.indexOf('docsify-v5-core.min.css') < index.indexOf('docs-app.css'),
    'The Docsify core fallback must load before the site override'
);
assert.match(
    coreCss,
    /^@layer docsify-base\{/,
    'The official core must remain in a low-priority cascade layer'
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
assert.equal(existsSync('lib/css/theme-simple.css'), false, 'The v4 light theme must be removed');
assert.equal(existsSync('lib/css/theme-simple-dark.css'), false, 'The unused v4 dark theme must be removed');
assert.match(
    appCss,
    /--color-bg:\s*var\(--base-background-color\)/,
    'The site theme must drive Docsify v5 color tokens'
);
assert.match(
    appCss,
    /--docs-theme-color:\s*#147fd6;[\s\S]*--docs-accent:\s*var\(--docs-theme-color\);[\s\S]*--theme-color:\s*var\(--docs-theme-color\)/,
    'The light theme and Docsify v5 fallback must share one site-blue token'
);
assert.match(
    appCss,
    /:root\[data-theme='dark'\]\s*\{[^}]*--docs-theme-color:\s*#55afff/s,
    'The dark theme must use one readable site-blue token'
);
assert.match(
    appCss,
    /\.app-nav > ul > li > a::after\s*\{[^}]*background:\s*var\(--docs-theme-color\)/s,
    'The top-navigation text and underline must share the site theme color'
);
assert.match(
    tabsCss,
    /--docsifytabs-tab-highlight-color:\s*var\(--docs-theme-color/,
    'Markdown tab highlights must share the site theme color'
);
assert.match(
    appCss,
    /:root\[data-theme='dark'\] \.markdown-section \.callout\.caution\s*\{[^}]*--callout-bg:\s*color-mix[\s\S]*:root\[data-theme='dark'\] \.markdown-section \.callout\.note\s*\{[^}]*--callout-bg:\s*var\(--docs-callout-note-background\)[\s\S]*:root\[data-theme='dark'\] \.markdown-section \.callout\.warning\s*\{[^}]*--callout-bg:\s*color-mix/s,
    'Dark semantic callouts must retain subtle type-colored surfaces'
);
assert.match(
    appCss,
    /:root\[data-theme='dark'\] \.markdown-section \.callout code:not\([^}]*\)\s*\{\s*background:\s*var\(--code-inline-background\)/s,
    'Inline code inside dark callouts must remain visually distinct from the tinted surface'
);
assert.match(
    appCss,
    /\.markdown-section \.callout\.caution\s*\{[^}]*--callout-border-color:\s*#fca5a5/s,
    'Light caution callouts must retain a clearly visible red border'
);
assert.match(
    appCss,
    /main > \.content,[\s\S]*transition:\s*margin-left[^;]+;[\s\S]*margin-right/,
    'The site shell must animate content movement for both navigation rails'
);
assert.match(
    appCss,
    /\.markdown-section,[\s\S]*max-width:\s*var\(--content-max-width\);\s*margin:\s*0 auto/,
    'Wide-screen content must remain centered between the navigation rails'
);
assert.match(
    appCss,
    /\.markdown-section li\s*\{[^}]*margin:\s*0/s,
    'Frequently used document lists must retain the site spacing instead of the v5 fallback spacing'
);
assert.match(
    appCss,
    /--sidebar-nav-link-padding:\s*0\.25em 2\.35rem 0\.25em 1\.25rem;[\s\S]*\.sidebar-nav li > a\s*\{[^}]*padding:\s*var\(--sidebar-nav-link-padding\)/s,
    'All sidebar links must share the same horizontal padding token'
);
assert.doesNotMatch(
    appCss,
    /\.sidebar-nav li > a\[target=['"]_blank['"]\]\s*\{[^}]*padding:/s,
    'External sidebar links must not override the shared link padding'
);
assert.match(
    appCss,
    /\.markdown-section \.docsify-tabs__tab\s*\{[^}]*line-height:\s*normal/s,
    'The site tabs must retain their established control height'
);
assert.match(
    appCss,
    /\.markdown-section a:not\(\[class\]\):hover\s*\{[^}]*text-decoration:\s*underline;[^}]*text-decoration-thickness:\s*1px/s,
    'Plain document links must use a thin underline only on hover'
);
assert.match(
    appCss,
    /\.markdown-section :is\(h1, h2, h3, h4, h5, h6\) > a\s*\{[^}]*text-underline-offset:\s*auto/s,
    'Heading anchors must retain the font-native underline position'
);
assert.match(
    appCss,
    /\.markdown-section :is\(h1, h2, h3, h4, h5, h6\) > a:hover\s*\{[^}]*text-decoration-thickness:\s*auto/s,
    'Heading hover underlines must retain the font-native display weight'
);
assert.match(
    appCss,
    /\.markdown-section\s+\.ui-kit-color\s*\{[^}]*display:\s*flex[^}]*overflow-x:\s*auto/s,
    'The official UI Kit palette layout must keep swatches above their code samples'
);
assert.match(
    appCss,
    /\.markdown-section blockquote\s*\{[^}]*background:\s*var\(--blockquote-background\)/s,
    'The site-owned blockquote background must survive the v5 theme migration'
);
assert.doesNotMatch(
    appCss,
    /--blockquote-em-font-style/,
    'The removed Themeable variable must not suppress semantic emphasis'
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
    /@media \(max-width: 30em\)[\s\S]*\.markdown-section \.table-wrapper tbody,[\s\S]*display:\s*block;[\s\S]*\.markdown-section \.table-wrapper thead\s*\{\s*display:\s*none/s,
    'Narrow-screen tables must collapse into labeled row cards and hide the desktop header'
);
assert.match(
    appCss,
    /\.mobile-sidebar-shadow\s*\{[^}]*left:\s*var\(--docs-sidebar-width\);[^}]*width:\s*calc\(100vw - var\(--docs-sidebar-width\)\)/s,
    'The mobile sidebar backdrop must begin after the drawer and cover only the content area'
);
assert.match(
    appCss,
    /\.sidebar\s*\{[^}]*bottom:\s*auto;[^}]*height:\s*calc\(100vh - var\(--docs-header-height\)\);[^}]*height:\s*calc\(100dvh - var\(--docs-header-height\)\);/s,
    'The mobile sidebar must follow the dynamic visual viewport while retaining a legacy viewport fallback'
);
assert.match(
    appCss,
    /\.mobile-sidebar-shadow\s*\{[^}]*bottom:\s*auto;[^}]*height:\s*calc\(100vh - var\(--docs-header-height\)\);[^}]*height:\s*calc\(100dvh - var\(--docs-header-height\)\);/s,
    'The mobile sidebar backdrop must follow the same dynamic visual viewport as the drawer'
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
    appCss,
    /html\.mobile-sidebar-scroll-locked,\s*body\.mobile-sidebar-scroll-locked\s*\{[^}]*overflow:\s*hidden;[^}]*overscroll-behavior:\s*none;/s,
    'Opening the mobile sidebar must disable root-page scrolling and overscroll'
);
assert.match(
    appCss,
    /body\.mobile-sidebar-scroll-locked\s*\{[^}]*position:\s*fixed;[^}]*top:\s*calc\(-1 \* var\(--docs-mobile-sidebar-scroll-y, 0px\)\);/s,
    'The iOS body scroll lock must preserve the document position while the sidebar is open'
);
assert.match(
    appCss,
    /body\.mobile-sidebar-scroll-locked \.sidebar-nav\s*\{[^}]*overscroll-behavior-y:\s*contain;/s,
    'Sidebar momentum must stop at the navigation boundary instead of chaining to the page'
);
assert.match(
    appCss,
    /\.sidebar-nav,\s*\.page-toc-rail\s*\{[^}]*flex:\s*1 1 0;[^}]*min-height:\s*0;/s,
    'The mobile page tree and page outline must divide their available sidebar height evenly'
);
assert.match(
    appCss,
    /\.page-toc-rail\s*\{[^}]*order:\s*3;[^}]*max-height:\s*none;/s,
    'The mobile page outline must not retain the narrower-layout viewport-height cap'
);
assert.match(
    appCss,
    /body\.mobile-sidebar-scroll-locked \.mobile-sidebar-shadow\s*\{[^}]*touch-action:\s*none;/s,
    'Swiping the open drawer backdrop must not pan the page behind it'
);
assert.match(
    navigation,
    /function syncMobileSidebarScrollLock\(locked\)[\s\S]*body\.style\.setProperty\('--docs-mobile-sidebar-scroll-y',[\s\S]*root\.classList\.add\(lockClass\)[\s\S]*body\.classList\.add\(lockClass\)/,
    'The mobile drawer must capture and freeze the current document scroll position'
);
assert.match(
    navigation,
    /restoreLocation === window\.location\.href[\s\S]*window\.scrollTo\(0, restoreScrollY\)/,
    'Closing the drawer without navigating must restore the previous document position'
);
assert.match(
    navigation,
    /syncMobileSidebarScrollLock\(mobile && expanded\);/,
    'The scroll lock must follow the synchronized mobile drawer state'
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
assert.match(
    navigation,
    /header\.removeAttribute\('inert'\)/,
    'Docsify v5 must not make the header-owned mobile toggle inert while the drawer is open'
);
assert.match(
    navigation,
    /if \(mobileNow && !wasMobile\) \{\s*resetDocsifyV5MobileSidebarState\(/,
    'Crossing into the mobile breakpoint must align Docsify v5 sidebar state before the first tap'
);
assert.doesNotMatch(
    appCss,
    /\.docs-header\s*>\s*\.sidebar-toggle:(?:hover|active)\s*\{/,
    'The header menu toggle must not change color or scale on pointer interaction'
);

console.log('Docsify v5 core-layer compatibility tests passed.');
