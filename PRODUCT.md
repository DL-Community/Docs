# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

跳舞的线社区版玩家、需要查询游戏资料的访客，以及维护 Wiki 内容的社区贡献者。

## Product Purpose

提供跳舞的线社区版的官方 Wiki，包括游戏玩法与设置、版本历史、社区入口、法律信息和多语言文档。成功意味着访客能快速确定所在栏目、找到具体页面，并且现有外部链接继续有效。

## Operating Context

网站作为 GitHub Pages 上的静态文档站运行。访客会从游戏客户端、搜索结果、社区链接或带锚点的历史网址进入具体页面，并在桌面或手机上连续查阅相关文档。

## Capabilities and Constraints

- 保持 Docsify 作为文档运行框架。
- Markdown 正文内容和现有 Docsify 特殊语法保持兼容。
- 中文是不带语言前缀的默认内容；英文路径使用 `/en/`。
- 保留 `/Docs/#/...` 形式的历史网址和既有页面命名别名。
- 网站必须支持搜索、移动端导航、浅色/深色模式以及可折叠的多级侧栏。
- 界面文案和页面元信息通过根目录及各语言目录中的键值字典维护。
- 代码和静态资源由 GitHub Pages 托管，不依赖服务端运行时。

## Brand Commitments

- 产品名称为“跳舞的线：社区版 Wiki”。
- 沿用主题蓝 `#2c9cff` 和现有 DLCE 图标资源。
- 顶栏、侧栏和文档层级采用用户指定的 Docusaurus 式信息架构，但不得更换 Docsify。
- GitHub 入口指向 `https://github.com/DL-Community/Docs`。

## Evidence on Hand

- 中文与英文 Markdown 文档分别位于仓库根目录各栏目和 `en/`。
- Wiki 图标位于 `lib/img/`，带透明通道，适合使用 `object-fit: contain`。
- 各栏目已有 `_sidebar.md`，可作为导航层级的内容来源。

## Product Principles

- 先显示全局栏目，再显示当前栏目的局部树。
- 新界面不以牺牲旧网址兼容性为代价。
- 阅读区域保持安静，导航状态必须清晰、可键盘操作。
- 缺少英文翻译时不虚构内容，继续使用现有回退行为。
