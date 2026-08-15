import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync('lib/overview-metadata.js', 'utf8');
const context = vm.createContext({ JSON });
vm.runInContext(source, context, { filename: 'overview-metadata.js' });

const parse = context.DLCE_OVERVIEW_METADATA.parse;
const metadata = JSON.parse(JSON.stringify(parse(`
<!-- page-title: "这是总览页的标题" -->
<!-- page-desc: 这是总览页的描述文本 -->

<!-- desc: "这是版本历史项目的描述：包含冒号" -->
- [版本历史](/dlce/versions.md)

<!-- page-title: "自定义后期处理" -->
<!-- page-desc: "选择一个版本继续阅读。" -->
- 自定义后期处理效果
  <!-- item-desc: "V2 项目描述" -->
  - [V2](/dlce/custom-post-processing/v2)
`)));

assert.equal(metadata.pageTitle, '这是总览页的标题');
assert.equal(metadata.pageDescription, '这是总览页的描述文本');
assert.deepEqual(metadata.items, [
    {
        label: '版本历史',
        href: '/dlce/versions.md',
        description: '这是版本历史项目的描述：包含冒号',
        pageTitle: '',
        pageDescription: '',
        indentation: 0,
        path: ['版本历史']
    },
    {
        label: '自定义后期处理效果',
        href: '',
        description: '',
        pageTitle: '自定义后期处理',
        pageDescription: '选择一个版本继续阅读。',
        indentation: 0,
        path: ['自定义后期处理效果']
    },
    {
        label: 'V2',
        href: '/dlce/custom-post-processing/v2',
        description: 'V2 项目描述',
        pageTitle: '',
        pageDescription: '',
        indentation: 2,
        path: ['自定义后期处理效果', 'V2']
    }
]);

const escapedTitle = parse('<!-- page-title: "A: \\"quoted\\" title" -->');
assert.equal(escapedTitle.pageTitle, 'A: "quoted" title');

const noMetadata = JSON.parse(JSON.stringify(parse('- [文档](/guide)')));
assert.equal(noMetadata.pageTitle, '');
assert.equal(noMetadata.pageDescription, '');
assert.equal(noMetadata.items[0].description, '');

const interruptedDescription = parse('<!-- desc: 不应跨过普通文本 -->\n普通文本\n- [文档](/guide)');
assert.equal(interruptedDescription.items[0].description, '');

const index = readFileSync('index.html', 'utf8');
const navigation = readFileSync('lib/navigation.js', 'utf8');
const appCss = readFileSync('lib/css/docs-app.css', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const maintenanceGuide = readFileSync('SPECIAL-COMMENTS.md', 'utf8');

assert.match(
    index,
    /<script src="lib\/overview-metadata\.js\?v=2"><\/script>\s*<script src="lib\/navigation\.js\?v=68"><\/script>/,
    'The overview metadata parser must load before the navigation renderer'
);
assert.match(
    navigation,
    /function applySectionOverviewMetadata\([\s\S]*metadata\.pageTitle[\s\S]*metadata\.pageDescription[\s\S]*applyOverviewCardDescriptions/,
    'Section landing pages must apply custom titles, introductions, and item descriptions'
);
assert.match(
    navigation,
    /function applyCategoryOverviewMetadata\([\s\S]*metadataItemForTrail[\s\S]*categoryItem\.pageTitle[\s\S]*childMetadataItems/,
    'Nested category landing pages must apply metadata bound to their parent and child items'
);
assert.match(
    navigation,
    /function mergeConsecutiveSidebarLists\([\s\S]*querySelectorAll\('li'\)[\s\S]*mergeConsecutiveListChildren\(listItem\)[\s\S]*hook\.doneEach\([\s\S]*mergeConsecutiveSidebarLists/,
    'Metadata comments must not make Docsify split root or nested sidebar lists into separate overview groups'
);
assert.match(
    navigation,
    /supportingText\.textContent = description;[\s\S]*card\.setAttribute\('aria-describedby', supportingText\.id\)/,
    'Item descriptions must be inserted as text and exposed as accessible descriptions'
);
assert.match(
    navigation,
    /if \(external\) \{\s*card\.classList\.add\('is-external'\);\s*card\.target = '_blank';\s*card\.rel = 'noopener';/,
    'External overview cards must open in a new tab with the same isolation as sidebar links'
);
assert.match(
    appCss,
    /\.category-card-description\s*\{[^}]*overflow-wrap:\s*anywhere/s,
    'Long overview descriptions must wrap inside their cards'
);
assert.match(
    readme,
    /\[SPECIAL-COMMENTS\.md\]\(SPECIAL-COMMENTS\.md\)/,
    'The repository README must index the maintainer-only syntax guide'
);
[
    '<!-- page-title:',
    '<!-- page-desc:',
    '<!-- desc:',
    '<!-- last-modified -->',
    '<!-- tabs:start -->',
    '<!-- tab:',
    '<!-- tabs:end -->',
    '<!-- {docsify-ignore} -->',
    '<!-- {docsify-ignore-all} -->'
].forEach((marker) => {
    assert.ok(maintenanceGuide.includes(marker), `Missing maintainer documentation for ${marker}`);
});

console.log('Sidebar overview metadata tests passed.');
