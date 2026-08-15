# 特殊注释与 Markdown 扩展维护指南

本文面向 DLCE Docs 仓库维护者，汇总网站当前支持的 HTML 注释式扩展。它是仓库维护文档，不会出现在网站导航中。

## 基本约定

- 注释名称区分用途，请按本文给出的拼写使用。
- 总览页文本推荐使用双引号；不加引号的旧写法仍然兼容。
- 注释必须写在 Markdown 正文中，不能放进围栏代码块、缩进代码块或行内代码。
- 普通 HTML 注释仍只是一段不可见的维护备注，不会自动获得特殊功能。

## Sidebar 总览页元数据

以下三种注释只在栏目 `_sidebar.md` 中生效，由总览页生成器读取。

### 栏目总览标题与描述

在 `_sidebar.md` 的第一条列表项之前写入：

```md
<!-- page-title: "游戏文档" -->
<!-- page-desc: "选择一个文档开始阅读。" -->

- [版本历史](/dlce/versions.md)
- [多语言](/dlce/localization.md)
```

- `page-title` 替换栏目总览页的一级标题，同时更新面包屑当前项和浏览器标题。
- `page-desc` 替换一级标题下方的介绍文字。
- 两者可以只写一个；缺少的字段继续使用网站现有的栏目名称或多语言默认文案。
- 两者都不存在时，总览页保持原有文案和样式。

### 子节点总览标题与描述

把 `page-title` 和 `page-desc` 放在一个拥有子节点的父条目正上方，它们会绑定到该父条目的子节点总览页：

```md
- [关卡信息](/dlce/level_information)

<!-- page-title: "自定义后期处理" -->
<!-- page-desc: "选择一个版本继续阅读。" -->
- 自定义后期处理效果
  - [V2](/dlce/custom-post-processing/v2)
  - [V1](/dlce/custom-post-processing/v1)
```

同一规则适用于更深层级的父节点。注释与父条目之间可以有空行，但不要插入其他普通文本。

### 条目卡片描述

`desc` 永远绑定到它正下方的下一条列表项：

```md
<!-- desc: "记录各版本的发布日期和主要变化。" -->
- [版本历史](/dlce/versions.md)

- 自定义后期处理效果
  <!-- desc: "第二版后期处理参数与示例。" -->
  - [V2](/dlce/custom-post-processing/v2)
  - [V1](/dlce/custom-post-processing/v1)
```

- 根条目前的 `desc` 显示在栏目总览卡片中。
- 子条目前的 `desc` 显示在对应父节点的子节点总览卡片中。
- 没有 `desc` 的卡片保持原有单标题结构和样式。
- `item-desc` 是 `desc` 的等价别名，但仓库内容推荐统一使用较短的 `desc`。
- 描述按纯文本输出，不会把其中的 Markdown 或 HTML 当作可执行标记。

## Markdown 插入式组件

组件标记可以出现在普通 Markdown 行中的任意位置。当前注册的组件只有 `last-modified`。

### 最后修改时间

```md
# 页面标题
<!-- last-modified -->
```

也可以与其他 Markdown 格式组合：

```md
**<!-- last-modified -->**
```

用途：读取 `lib/data/last-modified.json` 中当前 Markdown 文件的 Git 修改时间，并按当前语言格式显示。若文件没有有效记录或元数据加载失败，标记会安全地输出为空。

组件引擎不会处理代码块、缩进代码块和行内代码里的同名注释。新增组件时，需要在 `lib/components/` 中注册组件并在 `index.html` 中加载脚本；不要只在文档里发明一个新名称。

组件引擎位于 `lib/markdown-components.js`，具体组件放在 `lib/components/`。新增组件时注册一个唯一名称，并提供同步或异步 `render` 函数：

```js
window.DLCE_MARKDOWN_COMPONENTS.register('example', {
    render: function (context) {
        return '<span>' + context.escapeHtml(context.t('example_text')) + '</span>';
    }
});
```

`context` 提供当前路由、真实 Markdown 文件路径、语言代码、HTML 语言、i18n 查询、HTML 转义和站点资源 URL 解析能力。添加组件脚本后，在 `index.html` 中于 `lib/markdown-components.js` 之后加载即可。

## Docsify Tabs

网站使用 `docsify-tabs` 1.6.3，并启用了注释标签和标题标签两种写法。标签页支持嵌套；嵌套块必须保持一致缩进。

### 注释标签写法

```md
<!-- tabs:start -->

<!-- tab:Windows -->

Windows 内容。

<!-- tab:macOS -->

macOS 内容。

<!-- tabs:end -->
```

- `tabs:start` 开始一个标签页组。
- `tab:标签名` 开始一个标签页，并把冒号后的文本作为标签名称。
- `tabs:end` 结束当前标签页组。
- 每个 `tabs:start` 都必须有同层级的 `tabs:end`；不要让不同组交叉。

### 标题标签写法

在 `tabs:start` 与 `tabs:end` 之间，也可以用“标题 + 粗体标签名”创建标签：

```md
<!-- tabs:start -->

### **Windows**

Windows 内容。

### **macOS**

macOS 内容。

<!-- tabs:end -->
```

标题级别可以是 `#` 到 `######`，但同一组应保持一致。此写法适合标签内容本身天然以小标题分组的页面；需要精确控制标签边界时，优先使用 `tab:` 注释。

### 嵌套标签页

```md
<!-- tabs:start -->
<!-- tab:新版 -->

新版内容。

  <!-- tabs:start -->
  <!-- tab:Windows -->

  Windows 子标签内容。

  <!-- tab:iOS -->

  iOS 子标签内容。

  <!-- tabs:end -->

<!-- tab:旧版 -->

旧版内容。

<!-- tabs:end -->
```

内层组及其内容统一缩进两个空格，可避免内外层边界被插件错误配对。标签选择会在同页同名标签间同步，并在当前会话中记住选择。

## Docsify 标题忽略标记

Docsify 核心识别以下两种标题尾注释：

```md
## 不加入当前层级目录的标题 <!-- {docsify-ignore} -->

## 不加入目录且忽略其下级标题 <!-- {docsify-ignore-all} -->
```

- `{docsify-ignore}` 只忽略当前标题。
- `{docsify-ignore-all}` 同时忽略当前标题下的子标题。

本网站的页内目录包含自定义 DOM 生成逻辑。修改或新增这类标记后，必须在桌面端右侧目录和移动端侧栏目录中实际验证，不要仅根据 Markdown 源文件判断结果。

## 普通 HTML 注释

未在本文列出的注释会保留为普通维护备注，并在页面中隐藏：

```md
<!-- 3.0 版本内容加在这个下面 -->
```

普通注释不会自动生成组件、标签页、折叠区域或总览页元数据。若要扩展新的特殊注释，必须同步实现解析逻辑、自动化测试，并更新本文。
