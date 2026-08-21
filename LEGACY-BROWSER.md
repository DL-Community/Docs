# 旧浏览器提示维护指南

网站在 `index.html` 中、Docsify 和其他站点脚本启动前加载 `lib/legacy-browser-gate.js`。检测命中后会跳转到独立的多语言提示页；提示页只使用 ES5 语法和保守 CSS，不依赖 Docsify。

## 当前判定范围

- Internet Explorer 和 EdgeHTML 版 Microsoft Edge：全部提示升级。
- Chrome、Chromium 及 Chromium 内核 Edge：109 及更早版本提示升级。
- Firefox：115 及更早版本提示升级。
- Safari：15.3 及更早版本提示升级。
- 其他浏览器：缺少网站必需的 Promise、Fetch、URL、媒体查询、DOM 操作等关键 API 时提示升级。

未知且具备所需功能的浏览器不会只因无法识别品牌而被拦截。调整版本阈值时应同步修改 `scripts/legacy-browser.test.mjs`，并重新运行测试。

## 多语言提示页

- 简体中文：`unsupported-browser.html`
- 繁體中文：`zh-TW/unsupported-browser.html`
- English：`en/unsupported-browser.html`

公共逻辑位于 `lib/legacy-browser-page.js`，样式位于 `lib/css/unsupported-browser.css`。语言选择会保留原始返回地址。

### 新增语言

语言列表统一维护在 `lib/supported-languages.js`，网站顶栏语言菜单和旧浏览器提示页底部都由它动态生成。完整的新增语言流程见 [LANGUAGES.md](LANGUAGES.md)。

完成语言登记并创建对应目录的 `unsupported-browser.html` 后，检测器会自动将该语言的哈希路由映射到提示页，所有已有提示页也会自动显示新语言入口；不需要修改 `legacy-browser-gate.js` 或逐个编辑已有提示页。

## 测试入口

启动本地服务器：

```powershell
npm.cmd run dev
```

在 URL 的 `#` 之前加入 `?legacy-browser=force`，可在现代浏览器强制显示提示页。例如：

```text
http://127.0.0.1:4173/Docs/?legacy-browser=force#/about/home
http://127.0.0.1:4173/Docs/?legacy-browser=force#/zh-TW/about/home
http://127.0.0.1:4173/Docs/?legacy-browser=force#/en/about/home
```

也可以在网站页面的开发者工具控制台执行：

```javascript
DLCE_LEGACY_BROWSER.force()
```

自动化测试命令：

```powershell
node scripts/legacy-browser.test.mjs
```

“忽略并继续浏览”会同时写入会话存储和会话 Cookie，只对当前浏览器会话生效。强制测试参数优先于该忽略状态，因此可反复测试。
