# 编辑 Wiki / Contribute
- 请通过提交 Pull Request 的形式来编辑本 Wiki
- Edit this wiki via Pull Request

## 网站基于 [docsify](https://docsify.js.org/#/zh-cn/) 编写

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
