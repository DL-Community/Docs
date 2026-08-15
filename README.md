# 关于 DLCE 文档站
## 技术
- 网站底层路由和 Markdown 渲染基于 [docsify v5](https://docsify.js.org/#/zh-cn/)，视觉样式由定制层提供。
## 编辑文档站
- 请 fork 本仓库并编辑文档站内容后通过 Pull Request 提交；
- Pull Request 内容经过审核后将被合并到本仓库中并上线至网站；
- 请保证仅修改站内 Markdown 文档内容，不要修改网站底层框架代码和 CSS 样式表。对于试图修改网站底层的 PR 将被退回。

## Markdown 插入式组件

页面可通过 HTML 注释在任意行内位置插入已注册组件：

```md
<!-- last-modified -->

**<!-- last-modified -->**
```

围栏代码块、缩进代码块和行内代码中的标记会保持原样，未注册的 HTML 注释也不会被修改。

组件引擎位于 `lib/markdown-components.js`，具体组件放在 `lib/components/`。新增组件时注册一个唯一名称，并提供同步或异步 `render` 函数：

```js
window.DLCE_MARKDOWN_COMPONENTS.register('example', {
    render: function (context) {
        return '<span>' + context.escapeHtml(context.t('example_text')) + '</span>';
    }
});
```

`context` 提供当前路由、真实 Markdown 文件路径、语言代码、HTML 语言、i18n 查询、HTML 转义和站点资源 URL 解析能力。添加组件脚本后，在 `index.html` 中于 `lib/markdown-components.js` 之后加载即可。
