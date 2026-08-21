# 网站语言维护指南

本文面向网站维护者，说明为 DLCE Docs 增加一种网站语言时需要完成的全部工作。网站默认语言为简体中文，内容位于仓库根目录；其他语言使用独立的路由和文件目录，例如繁体中文使用 `zh-TW/`，英文使用 `en/`。

## 工作范围

新增语言不是只添加一个语言菜单条目。完整支持至少包括：

- 语言注册信息；
- 界面文案字典；
- 与默认语言对应的 Markdown 文档和导航文件；
- 首页、404、分页和必要的兼容路由；
- 旧浏览器提示页；
- 自动化测试与本地页面检查。

## 1. 登记语言

编辑 `lib/supported-languages.js`，在 `DLCE_SUPPORTED_LANGUAGES` 中增加一项。网站顶栏和旧浏览器提示页底部的语言入口都会从这里动态生成。

以下示例使用日语：

```javascript
{
    code: 'ja',
    htmlLang: 'ja',
    label: '日本語',
    path: 'ja',
    home: '/ja/about/home'
}
```

字段用途：

- `code`：网站内部语言代码，也是 `DLCE_I18N` 的字典键。
- `htmlLang`：写入链接和页面的 HTML `lang` 值，应使用有效的 BCP 47 语言标签。
- `label`：语言菜单中始终使用的语言名称。语言名称只从这里读取，不放入界面字典。
- `path`：非默认语言的路由和文件目录，不带首尾斜杠。
- `home`：切换到该语言但当前页面不存在时使用的首页路由。

简体中文是唯一使用空 `path` 的默认语言。新增语言必须使用独立目录，不能与现有语言代码或路由重名。

## 2. 创建界面字典

在新语言目录中创建 `i18n.js`，结构应与根目录 `i18n.js` 一致：

```javascript
(function () {
    'use strict';

    window.DLCE_I18N = window.DLCE_I18N || {};
    window.DLCE_I18N.ja = {
        // 保持与根目录 i18n.js 相同的全部键
    };
}());
```

要求：

- 新字典的键必须与根目录 `i18n.js` 保持一致。
- 不要在界面字典中加入 `language_ja` 之类的语言名称键；语言名称由 `lib/supported-languages.js` 的 `label` 统一提供。
- `pagination_previous` 和 `pagination_next` 必须存在，供文档分页使用。
- 不应删除旧字典键；需要调整键名时应一次性同步所有语言。

随后在 `index.html` 头部加载新字典：

```html
<script src="ja/i18n.js"></script>
```

## 3. 添加文档和导航

在新语言目录中复制默认语言的文档结构并完成翻译。至少应覆盖这些入口和栏目：

```text
ja/
├── _404.md
├── _navbar.md
├── _sidebar.md
├── about/
│   ├── _sidebar.md
│   └── home.md
├── dlce/
│   ├── _sidebar.md
│   └── ...
├── legal/
│   ├── _sidebar.md
│   └── ...
└── social/
    ├── _sidebar.md
    └── ...
```

维护要求：

- 文件路径应尽量与默认语言一致，便于语言切换保留当前页面。
- 新语言 Markdown 中的站内链接必须带该语言前缀，例如 `/ja/dlce/versions`。
- `_sidebar.md` 和 `_navbar.md` 中的链接也必须指向新语言目录。
- 共享声明可继续使用现有 `:include` 文件，但应检查相对路径是否正确。
- 总览页会自动读取当前语言的侧栏，无需手工创建重复的总览页面；侧栏中的特殊注释写法见 `SPECIAL-COMMENTS.md`。
- 如果某篇文档暂时没有翻译，应明确决定回退或隐藏策略，不要创建内容与标题不对应的占位页。

## 4. 配置 Docsify 路由

在 `index.html` 的 `$docsify` 配置中检查并补充以下项目。

### 首页与 404 别名

在 `alias` 中至少添加：

```javascript
'/ja/': '/ja/about/home',
'/ja/404': '/ja/_404.md',
'/ja': '/ja/'
```

如果默认语言已有需要在新语言中继续工作的历史地址，例如旧法律页、游戏设置页或下划线路由，也要添加带 `/ja/` 前缀的对应别名。不要机械复制一个指向不存在译文的别名。

### 404 页面选择

在 `notFoundPage` 中添加部署路径和本地路径两项：

```javascript
'/Docs/ja/': '/ja/404',
'/ja/': '/ja/404'
```

较长的语言前缀应位于默认的 `'/'` 规则之前。

### 分页文案

当前分页插件配置仍需要显式字典变量。先在 `$docsify` 配置之前取得新字典：

```javascript
var jaUI = window.DLCE_I18N.ja;
```

然后分别加入上一页和下一页映射：

```javascript
previousText: {
    '/ja/': jaUI.pagination_previous
},
nextText: {
    '/ja/': jaUI.pagination_next
}
```

保留配置中已有的其他语言和默认 `'/'` 项。

### 搜索与导航

搜索命名空间、搜索占位文案、顶部语言菜单、侧栏、本页目录、页脚和最后修改时间会读取语言注册表或 `DLCE_I18N`，通常不需要为新语言另写分支。仍应实际验证：

- 搜索只返回当前语言目录中的文档；
- 切换语言时优先保留当前页面，不存在对应译文时回到新语言首页；
- 顶栏、侧栏、面包屑、总览页和页脚使用新语言文案；
- HTML 根元素的 `lang` 值与 `htmlLang` 一致。

`fallbackLanguages` 不是网站语言菜单的来源。除非已确认 Docsify 的回退行为符合预期，不要仅为了登记新语言而修改它。

## 5. 添加旧浏览器提示页

在新语言目录创建 `unsupported-browser.html`。可以复制现有页面作为模板，但必须翻译标题、说明、推荐浏览器标题、“忽略并继续浏览”按钮、风险提示和语言区域的无障碍标签。

页面底部的语言入口由 `lib/supported-languages.js` 动态生成，不要把新语言逐个写入已有提示页。新页面需要加载：

```html
<script src="../lib/supported-languages.js?v=1"></script>
<script
    id="legacy-browser-page-script"
    data-language-code="ja"
    src="../lib/legacy-browser-page.js?v=1"
></script>
```

提示页必须继续使用保守 HTML、CSS 和 ES5 JavaScript；不要为了视觉一致性加入只在现代浏览器可用的必要依赖。详细机制和强制测试入口见 `LEGACY-BROWSER.md`。

## 6. 增加和更新测试

为新语言增加语言完整性测试，或把已有语言测试扩展为覆盖新目录。测试至少应检查：

- 新语言字典与默认字典键集合一致；
- 默认语言中要求翻译的 Markdown 在新语言目录中都有对应文件；
- 站内链接带正确语言前缀，目标文件存在；
- `_navbar.md`、各级 `_sidebar.md`、首页和 404 页面存在；
- `index.html` 已加载字典并包含首页、404 和分页配置；
- 旧浏览器检测能够从新语言路由进入新语言提示页；
- 顶栏和提示页底部会从注册表生成新语言入口。

将新增测试加入 `package.json` 的 `npm test` 链。旧浏览器模块已有可扩展性测试，不应把“语言总数必须等于 3”之类的固定数量重新写入测试。

## 7. 本地验收

启动网站：

```powershell
npm.cmd run dev
```

至少检查这些地址：

```text
http://127.0.0.1:4173/Docs/#/ja/about/home
http://127.0.0.1:4173/Docs/#/ja/dlce/
http://127.0.0.1:4173/Docs/#/ja/not-found-test
http://127.0.0.1:4173/Docs/?legacy-browser=force#/ja/about/home
```

然后运行：

```powershell
npm.cmd test
git diff --check
```

提交前还应手工确认桌面端和移动端的语言菜单、搜索、总览页、文档分页、404、浏览器前进后退和直接打开带锚点链接均正常。

## 完成清单

- [ ] 已登记语言代码、HTML 标签、固定显示名称、路径和首页。
- [ ] 已创建完整界面字典，并在所有字典中加入新语言名称键。
- [ ] 已在 `index.html` 加载字典。
- [ ] 已建立完整文档、导航和 404 文件结构。
- [ ] 已补充首页、404、分页和必要的历史地址配置。
- [ ] 已创建本地化旧浏览器提示页。
- [ ] 已增加语言完整性与路由测试。
- [ ] 已通过自动化测试和桌面、移动页面检查。
