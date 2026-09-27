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
- 自定义后期处理效果
  <!-- page-desc: "选择一个版本继续阅读。" -->
  <!-- item-desc: "V2 项目描述" -->
  - [V2](/dlce/custom-post-processing/v2)
`)));

assert.equal(metadata.pageTitle, '这是总览页的标题');
assert.equal(metadata.pageDescription, '这是总览页的描述文本');
assert.deepEqual(metadata.items, [
    {
        label: '版本历史',
        href: '/dlce/versions.md',
        id: '',
        description: '这是版本历史项目的描述：包含冒号',
        pageTitle: '',
        pageDescription: '',
        indentation: 0,
        path: ['版本历史']
    },
    {
        label: '自定义后期处理效果',
        href: '',
        id: '',
        description: '',
        pageTitle: '自定义后期处理',
        pageDescription: '选择一个版本继续阅读。',
        indentation: 0,
        path: ['自定义后期处理效果']
    },
    {
        label: 'V2',
        href: '/dlce/custom-post-processing/v2',
        id: '',
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

const descriptionScopes = parse(`
<!-- page-desc: "整个游戏文档目录" -->
<!-- desc: "版本卡片描述" -->
- 版本历史 :id=versions
  <!-- page-desc: "选择一个主要版本。" -->
  <!-- desc: "第三版卡片描述" -->
  - 3.0
    <!-- page-desc: "选择第三版文档。" -->
    - [更新记录](/dlce/versions/v3)
      <!-- page-desc: "没有子页面，应忽略" -->
  - [2.0](/dlce/versions/v2)
- [角色装饰](/dlce/character)
  <!-- page-desc: "不能影响后面的分组" -->
- 游戏设置

<!-- page-desc: "不缩进也绑定上方分组" -->
  - [通用设置](/dlce/settings/general)
- [账号系统](/dlce/account)
<!-- page-desc: "文件末尾的叶节点描述也应忽略" -->
`);
assert.equal(descriptionScopes.pageDescription, '整个游戏文档目录');
assert.deepEqual(Array.from(descriptionScopes.items, item => [item.label, item.pageDescription]), [
    ['版本历史', '选择一个主要版本。'],
    ['3.0', '选择第三版文档。'],
    ['更新记录', ''],
    ['2.0', ''],
    ['角色装饰', ''],
    ['游戏设置', '不缩进也绑定上方分组'],
    ['通用设置', ''],
    ['账号系统', '']
]);
assert.equal(descriptionScopes.items[0].description, '版本卡片描述');
assert.equal(descriptionScopes.items[0].id, 'versions');
assert.equal(descriptionScopes.items[1].description, '第三版卡片描述');

const leafBeforeGroup = parse('- [角色装饰](/dlce/character)\n<!-- page-desc: 忽略 -->\n- 分组\n  - [文档](/guide)');
assert.equal(leafBeforeGroup.pageDescription, '');
assert.ok(leafBeforeGroup.items.every(item => item.pageDescription === ''));
const interruptedPageDescription = parse('- 分组\n普通文本\n<!-- page-desc: 不应跨过普通文本 -->\n  - [文档](/guide)');
assert.equal(interruptedPageDescription.items[0].pageDescription, '');

const gameSidebar = parse(readFileSync('dlce/_sidebar.md', 'utf8'));
assert.equal(gameSidebar.pageDescription, '');
assert.equal(gameSidebar.items.find(item => item.id === 'versions').pageDescription, '选择一个主要版本。');
assert.equal(gameSidebar.items.find(item => item.id === 'custom-post-processing').pageDescription, '选择一个后期处理版本。');
assert.equal(context.DLCE_OVERVIEW_METADATA.sidebarMarkdown(
    '- 版本历史 :id=versions\n<!-- page-desc: "选择版本" -->\n  - [3.0](/dlce/versions/v3)'
), '- 版本历史\n  - [3.0](/dlce/versions/v3)', 'Unindented metadata must not break nested Markdown lists');
assert.equal(context.DLCE_OVERVIEW_METADATA.sidebarMarkdown(null), null);
for (const prefix of ['', 'en/', 'zh-TW/']) {
    const communitySidebar = parse(readFileSync(prefix + 'social/_sidebar.md', 'utf8'));
    assert.ok(communitySidebar.pageDescription, 'Existing top-level localized descriptions must still work');
}

const index = readFileSync('index.html', 'utf8');
const navigation = readFileSync('lib/navigation.js', 'utf8');
const appCss = readFileSync('lib/css/docs-app.css', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const maintenanceGuide = readFileSync('SPECIAL-COMMENTS.md', 'utf8');

assert.match(
    index,
    /<script src="lib\/overview-metadata\.js\?v=\d+"><\/script>\s*<script src="lib\/navigation\.js\?v=\d+"><\/script>/,
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

// Execute the production route handler with controlled HTTP responses.
const customMetadata = parse(`
<!-- desc: "版本说明" -->
- 版本历史 :id=versions
  - [3.0](/dlce/versions/v3)
- 重复分组 :id=versions
  - [2.0](/dlce/versions/v2)
`);
assert.equal(customMetadata.items[0].id, 'versions');
assert.equal(customMetadata.items[0].description, '版本说明');
assert.equal(customMetadata.items[1].id, '');
assert.equal(parse('- 分组 :id=first\n  - 子项\n- 下一个分组').items[2].id, '');
assert.equal(parse('- 分组 :id=').items[0].id, '');
assert.equal(customMetadata.items[0].label, '版本历史');
assert.deepEqual(Array.from(customMetadata.items[1].path), ['版本历史', '3.0']);
const nestedIds = parse('- **版本历史** :id=versions\n  - 旧版本 :id=legacy\n    - [1.0](/dlce/versions/v1)');
assert.equal(nestedIds.items[0].id, 'versions');
assert.equal(nestedIds.items[1].id, 'legacy');
assert.deepEqual(Array.from(nestedIds.items[2].path), ['版本历史', '旧版本', '1.0']);
const explicitIdLink = '- [文档](/guide ":id=guide-link")';
assert.equal(parse(explicitIdLink).items[0].id, '');
assert.equal(context.DLCE_OVERVIEW_METADATA.sidebarMarkdown(explicitIdLink), explicitIdLink);
assert.equal(context.DLCE_OVERVIEW_METADATA.sidebarMarkdown('# 标题 :id=heading'), '# 标题 :id=heading');
assert.equal(parse('<!-- pathname: "removed" -->\n- 分组\n  - [文档](/guide)').items[0].id, '',
    'The removed pathname comment must no longer define a route');

const routeContext = vm.createContext({
    window: { $docsify: { routes: {} } },
    CATEGORY_ROUTE_SEGMENT: '__overview',
    normalizedOverviewLabel: value => value,
    customCategoryRoutes: Object.create(null),
    normalizeRoute: value => (value || '').replace(/\.md$/, '').replace(/\/$/, ''),
    sectionFromPath: () => 'dlce',
    languageDefinitionForPath: path => ({ code: path.startsWith('/en/') ? 'en' : 'zh' }),
    sectionLandingPath: (section, code) => (code === 'en' ? '/en' : '') + '/' + section + '/',
    loadSectionOverviewMetadata: async () => customMetadata,
    languageTargetResource: path => '/Docs' + path + '.md'
});
vm.runInContext(navigation.slice(navigation.indexOf('    function childMetadataItems('),
    navigation.indexOf('    function addCategoryCardDescription(')), routeContext);
vm.runInContext(navigation.slice(navigation.indexOf('    function customCategoryPath('),
    navigation.indexOf('    function setAttributeIfChanged(')), routeContext);
const routeHandler = Object.values(routeContext.window.$docsify.routes)[0];
async function resolveRoute(path, status, body = '') {
    routeContext.window.fetch = async resource => {
        assert.equal(resource, '/Docs' + path + '.md');
        return { ok: status === 200, status, text: async () => body };
    };
    return new Promise(resolve => routeHandler(path, [], resolve));
}
assert.equal(await resolveRoute('/dlce/versions', 200, '# 真实文档'), '# 真实文档');
assert.equal(routeContext.customCategoryRoutes['/dlce/versions'], undefined);
assert.match(await resolveRoute('/dlce/versions', 404), /data-category-landing-placeholder/);
assert.equal(routeContext.customCategoryRoutes['/dlce/versions'], 'id:["版本历史"]');
assert.equal(await resolveRoute('/dlce/versions', 200, '# 新增文件'), '# 新增文件');
assert.equal(routeContext.customCategoryRoutes['/dlce/versions'], undefined);
assert.equal(await resolveRoute('/dlce/versions', 500), undefined);
assert.equal(await resolveRoute('/dlce/unknown', 404), undefined);
assert.match(await resolveRoute('/en/dlce/versions', 404), /data-category-landing-placeholder/);
for (const id of ['', '../versions', 'a/b', '__overview', 'x?y']) {
    assert.equal(routeContext.customCategoryPath({ id }, '/dlce/'), '');
}
assert.equal(routeContext.customCategoryPath({ id: 'my-versions_2' }, '/en/dlce/'), '/en/dlce/my-versions_2');
console.log('Custom overview routes: Markdown priority, 404 fallback, localization and validation passed.');
