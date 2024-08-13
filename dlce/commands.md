# 启动参数


## 游戏内置参数

> 适用于：Windows

?> 被划线的命令表明已不在最新版本中受支持


| 命令                         | 描述                                                            | 备注                                             |
|:---------------------------|---------------------------------------------------------------|------------------------------------------------|
| `-debug_logging`           | 开启日志写入功能，单机平台（Windows、macOS等）可在游戏设置中找到“查看日志”选项，点击后会显示游戏的运行时日志 | v3.1.3.1031及以上版本提供                             |
| `-server_#`                | 更换游戏服务器地区为 #（数字）<br/>0：默认（相当于不使用命令）<br/>1：国际服务器<br/>2：中国大陆服务器 | -                                              |
| `-disable_discord_rpc`     | 禁用Discord RPC                                                 | -                                              |
| `-always_show_cursor`      | 关卡游玩过程中不再自动隐藏鼠标光标                                             | -                                              |
| `-show_fps`                | 在屏幕右下角显示FPS                                                   |                                                |
| `-frame_rate_#`            | 设置帧率上限为“#”，并禁用垂直同步<br />“#”需为不小于-1的整数，-1表示无限                  | 在垂直同步关闭的情况下，游戏默认帧率上限为60                        |
| `-low_quality_mode`        | 强制使用最低画质，适用于部分设备调整到高画质后导致游戏闪退的情况（无法再进入游戏）                     | v2.6.0.12及以上版本提供                               |
| `-audio_dsp_buffer_#`      | 设置游戏音频的DSP缓冲区大小为“#”（整数），缓冲区越小，音乐延迟越小，但同时也会导致音频输出不稳定（推荐值：512）  | v2.6.2.0及以上版本提供                                |
| ~~`-use_soft_shadows`~~    | 使用柔和阴影模式（物体阴影边缘虚化）                                            | **❗在2.0.2版本中移除**                               |
| ~~`-force_windowed_mode`~~ | 强制游戏以窗口模式运行                                                   | **❗在2.0.2版本中移除**                               |
| ~~`-low_resolution_mode`~~ | 强制游戏以800x600分辨率模式运行                                           | **❗在2.0.2版本中移除**                               |
| ~~`-disable_shadow`~~      | 在游戏全局范围内禁用阴影效果                                                | **❗在2.0.2版本中移除**                               |
| ~~`-shadow_distance_#`~~   | 锁定阴影距离为 “#”（整数）                                               | “#” 需为不小于0的整数                                  |
| ~~`-disable_sound`~~       | 在游戏全局范围内禁用声音（即使设置中已经打开）                                       | **❗在2.0.2版本中移除**                               |
| ~~`-graphics_tier_#`~~     | 更改图像层为"#"（0-2的整数）<br />0：低<br />1：中<br />2：高                  | 图像层越高，渲染消耗越高，不建议手动设置<br />游戏引擎默认会根据设备性能自动调节此设定 |

## Unity引擎提供的参数

[查看Unity官方文档](https://docs.unity3d.com/2019.4/Documentation/Manual/PlayerCommandLineArguments.html)

| 命令                            | 描述                                                                                                                                                                                                                                                                                                                      | 备注                            |
|:------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|
| `-force-d3d11-singlethreaded` | Force DirectX 11.0 to be created with a `D3D11_CREATE_DEVICE_SINGLETHREADED flag`.                                                                                                                                                                                                                                      |
| `-force-device-index`         | Make the Standalone Player use a specific GPU device by passing it the index of that GPU. This option is supported for D3D11, D3D12, Metal, and Vulkan graphics APIs, but isn’t supported for OpenGL.                                                                                                                   | 指定游戏使用某个显卡（OpenGL API 下不可用）运行 |
| `-force-glcore`               | Force the application to use the OpenGL core profile for rendering. The Editor tries to use the most recent OpenGL version available, and all OpenGL extensions exposed by the OpenGL drivers. Unity uses Direct3D if the platform doesn’t support OpenGL.                                                              | 强制游戏使用 OpenGL Core 渲染         |
| `-force-glcoreXY`             | Similar to `-force-glcore`, but requests a specific OpenGL context version. Accepted values for XY: 32, 33, 40, 41, 42, 43, 44, or 45.                                                                                                                                                                                  |
| `-force-vulkan`               | Force the application to use Vulkan for rendering.                                                                                                                                                                                                                                                                      | 强制游戏使用 Vulkan  渲染             |
| `-force-metal` (macOS only)   | Make the Standalone Player use Metal as the default graphics API.                                                                                                                                                                                                                                                       | 使游戏默认使用 Metal 渲染（仅限macOS）     |
| `-force-d3d11` (Windows only) | Force the application to use Direct3D 11 for rendering.                                                                                                                                                                                                                                                                 | 强制游戏使用 Direct3D 11 渲染         |
| `-force-d3d12` (Windows only) | Force the application to use Direct3D 12 for rendering.                                                                                                                                                                                                                                                                 | 强制游戏使用  Direct3D 12 渲染        |
| `-monitor N`                  | Run Standalone Player on the specified monitor, indicated by a 1-based index number.                                                                                                                                                                                                                                    | 在指定的 N 号显示器上运行游戏              |
| `-nolog`                      | Do not produce an output log. When you don’t use this argument, Unity writes the `output_log.txt` in the [Log Files](https://docs.unity3d.com/2020.3/Documentation/Manual/LogFiles.html) folder, where the [Debug.Log](https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Debug.Log.html) output is printed. | 禁止游戏在后台输出日志，可在一定程度上提高游戏流畅度    |
| `-no-stereo-rendering`        | Turn off stereo rendering.                                                                                                                                                                                                                                                                                              |
| `-popupwindow`                | Create the window as a pop-up window, without a frame. This command isn’t supported on macOS.                                                                                                                                                                                                                           | 使用 `无边框窗口模式` 运行游戏（不支持 macOS）  |
| `-screen-fullscreen`          | Override the default full-screen state. This must be 0 or 1.                                                                                                                                                                                                                                                            |
| `-screen-height`              | Override the default screen height. This must be an integer from a supported resolution.                                                                                                                                                                                                                                |
| `-screen-width`               | Override the default screen width. This width value must be an integer from a supported resolution.                                                                                                                                                                                                                     |
| `-screen-quality`             | Override the default screen quality. Example usage would be: `/path/to/myGame -screen-quality Beautiful`. The supported options match the [Quality Settings](https://docs.unity3d.com/2020.3/Documentation/Manual/class-QualitySettings.html) names.                                                                    |
| `-window-mode` (Windows only) | Override fullscreen windowed mode. Accepted values are `exclusive` or `borderless`. For more information, see [Standalone Player settings](https://docs.unity3d.com/2020.3/Documentation/Manual/class-PlayerSettingsStandalone.html).                                                                                   |

## 命令使用方法

为游戏主程序“DancingLine.exe”创建快捷方式，右键 快捷方式-属性 在 _**目标 / Target**_ 栏结尾中添加命令。

### 示例

`目标："C:\DancingLine\Dancing Line.exe" -always_show_cursor -disable_discord_rpc`

**格式：**`"游戏exe路径" -命令1 -命令2 -命令3...`

?> 游戏exe路径后方**应有一个空格**，否则命令无法生效。可以同时添加多个命令，需要注意**每个命令之间同样要有一个空格**