import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const localizedRoot = 'zh-TW';
const index = readFileSync('index.html', 'utf8');
const footerHook = readFileSync('lib/footer-hook.js', 'utf8');

function filesUnder(directory, extension = '.md') {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) return filesUnder(absolute, extension);
        return path.extname(entry.name) === extension ? [absolute.replaceAll('\\', '/')] : [];
    });
}

function loadDictionary(file, language) {
    const context = vm.createContext({ window: {} });
    vm.runInContext(readFileSync(file, 'utf8'), context, { filename: file });
    return context.window.DLCE_I18N[language];
}

const sourceFiles = [
    '_404.md',
    '_navbar.md',
    '_sidebar.md',
    ...['about', 'dlce', 'legal', 'social'].flatMap((directory) => filesUnder(directory))
].sort();
const localizedFiles = filesUnder(localizedRoot)
    .map((file) => file.slice(localizedRoot.length + 1))
    .sort();

assert.deepEqual(
    localizedFiles,
    sourceFiles,
    'Traditional Chinese must cover every live Chinese Wiki Markdown file'
);

assert.match(
    readFileSync('zh-TW/legal/open-source.md', 'utf8'),
    /\]\(\.\.\/\.\.\/share\/open-source\.md ':include'\)/,
    'Traditional Chinese must include the shared open-source declaration'
);

const zh = loadDictionary('i18n.js', 'zh');
const zhTW = loadDictionary('zh-TW/i18n.js', 'zh-TW');
assert.deepEqual(
    Object.keys(zhTW).sort(),
    Object.keys(zh).sort(),
    'The Traditional Chinese UI dictionary must stay in key parity with Simplified Chinese'
);
assert.equal(zhTW.pagination_previous, '上一篇');
assert.equal(zhTW.pagination_next, '下一篇');

assert.match(index, /<script src="zh-TW\/i18n\.js"><\/script>/);
assert.match(index, /var zhTWUI = window\.DLCE_I18N\['zh-TW'\]/);
assert.match(index, /['"]\/Docs\/zh-TW\/['"]:\s*['"]\/zh-TW\/404['"]/);
assert.match(index, /['"]\/zh-TW\/404['"]:\s*['"]\/zh-TW\/_404\.md['"]/);
assert.match(index, /['"]\/zh-TW\/['"]:\s*zhTWUI\.pagination_previous/);
assert.match(index, /['"]\/zh-TW\/['"]:\s*zhTWUI\.pagination_next/);
assert.match(footerHook, /window\.DLCE_I18N\[lang\]/);
assert.match(footerHook, /isLocalizedRoute \? "\/" \+ lang : ""/);

const simplifiedOnlyCharacters = /[线戏设页账软网频码链务区开关许隐应级选项显导载标这为个与从将门实经获还给过进动学员现问题据时类体达复较边节声场须仅并无则于万条术毕听属]/u;
const unprefixedInternalLink = /\]\(\/(?!zh-TW(?:\/|#|\?|$)|Docs(?:\/|#|\?|$)|\/)[^)]+\)/u;
const unprefixedHashRoute = /href=["']#\/(?!zh-TW(?:\/|#|\?|$))/u;
const relativeInternalLink = /\]\((?!\.\.\/\.\.\/share\/open-source\.md ':include')\.\.?\/[^)]+\)/u;

function localizedTargetExists(route) {
    const cleanRoute = decodeURIComponent(route.split(/[?#]/, 1)[0]);
    const relative = cleanRoute.replace(/^\/zh-TW\/?/, '').replace(/\/$/, '');
    if (!relative) return true;

    const base = path.join(localizedRoot, ...relative.split('/'));
    const candidates = [base, `${base}.md`, path.join(base, 'README.md')];
    return candidates.some((candidate) => existsSync(candidate) && (
        statSync(candidate).isFile()
        || existsSync(path.join(candidate, '_sidebar.md'))
    ));
}

const brokenTargets = [];
for (const file of filesUnder(localizedRoot)) {
    const content = readFileSync(file, 'utf8');
    assert.doesNotMatch(content, simplifiedOnlyCharacters, `${file} still contains Simplified Chinese glyphs`);
    assert.doesNotMatch(content, unprefixedInternalLink, `${file} contains a site link without /zh-TW`);
    assert.doesNotMatch(content, unprefixedHashRoute, `${file} contains a hash route without /zh-TW`);
    assert.doesNotMatch(content, relativeInternalLink, `${file} contains a relative site link instead of /zh-TW`);

    const routes = [
        ...Array.from(content.matchAll(/\]\((\/zh-TW\/[^)\s]+)/g), (match) => match[1]),
        ...Array.from(content.matchAll(/href=["']#(\/zh-TW\/[^"']+)/g), (match) => match[1])
    ];
    for (const route of routes) {
        if (!localizedTargetExists(route)) brokenTargets.push(`${file}: ${route}`);
    }
}

assert.doesNotMatch(
    filesUnder(localizedRoot).map((file) => readFileSync(file, 'utf8')).join('\n'),
    /彙總/u,
    'Traditional Chinese terminology must use 匯總 rather than 彙總'
);

assert.deepEqual(brokenTargets, [], `Traditional Chinese contains broken internal targets:\n${brokenTargets.join('\n')}`);

const socialSidebar = readFileSync('zh-TW/social/_sidebar.md', 'utf8');
const socialHome = readFileSync('zh-TW/social/home.md', 'utf8');
for (const service of ['https://discord.gg/8Ew5n3XadT', 'https://www.youtube.com/@DLCommunityEdition']) {
    assert.ok(socialSidebar.includes(service), `Traditional Chinese social navigation must include ${service}`);
    assert.ok(socialHome.includes(service), `Traditional Chinese social page must include ${service}`);
}

console.log('Traditional Chinese coverage, terminology, routing, and service tests passed.');
