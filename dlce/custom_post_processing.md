# 自定义后期处理效果

> 适用于：Windows、iOS、Android（教程暂缺）

## 作用

- 用于在对应游戏关卡中使用自定义的**屏幕后期处理效果**。

## 使用方法

?> Post-Processing V1 将在未来移除支持，请尽可能使用 V2 版本。

### [V2 版本使用教程（推荐）](/dlce/custom_post_processing_v2.md)
### [V1 版本使用教程](/dlce/custom_post_processing_v1.md)

## V2 和 V1 有什么区别？
- V2 使用了 Unity 官方更新后的 Post-Processing V2 版本，对新版本的游戏引擎兼容性更好。
- 随着游戏引擎更新，游戏后续可能不再兼容 V1 版本，故 V1 的支持随时会被移除，因此我们建议玩家尽可能将现有 V1 Profile 移植到 V2.
- 我们为 V2 重写了新的 Profile 格式和读取系统，采用 `ini` 文件格式，对玩家编辑更友好。
- V2 的全平台配置文件名统一使用 `.postprocessing` 结尾，V1 文件后缀名针对 PC 和移动端使用了不同的名称。