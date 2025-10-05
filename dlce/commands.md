# 启动选项
> **适用于**<br>Windows、macOS

## 配置文件 :id=configs

### 从游戏外打开配置文件

<!-- tabs:start -->

#### **Windows**
- 文件资源管理器中输入并进入如下路径

```directory
%APPDATA%/../LocalLow/YINSU Studio/Dancing Line
```
- 双击打开 `Launch Options.ini`。

#### **macOS**
- 打开访达 Finder，按下 ` ⌘ ⇧ G` 输入如下路径后回车

```directory
~/Library/Application Support/YINSU Studio/Dancing Line/Launch Options.ini
```
- 双击打开 `Launch Options.ini`。

<!-- tabs:end -->

### 从游戏内打开配置文件
- 进入游戏设置，点击 `高级设置`

### 配置文件格式示例

```ini
[Command Line Args]
-example_argument ; 此条为示例命令，可以删除

[Audio]
IOBufferSize=512
MasterVolume=100

[Video]
FrameRate=60

[Network]
Server=0
Timeout=10
```
?> 某些配置与[启动参数](#args)中的命令重合，游戏会优先使用[启动参数](#args)中的设置。

| 名称                  | 描述                                                                                                                          |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [Command Line Args] | 在此标签下方放置你要使用的 [启动参数](#args)，每行放置一个。                                                                                         |
| -example_argument   | 示例命令，无实际作用。                                                                                                                 |
| [Audio]             | 音频配置区。                                                                                                                      |
| IOBufferSize        | 音频I/O缓冲区大小（DSP缓冲区大小），推荐512。<br/>与 `-audio_dsp_buffer_#` 命令作用一致。                                                             |
| MasterVolume        | 游戏音量大小，0 - 100。<br/>与 `-master_volume_#` 命令作用一致。                                                                            |
| [Video]             | 显示配置区。                                                                                                                      |
| FrameRate           | 游戏帧率限制，-1代表无限帧率，默认60。<br/>与 `-frame_rate_#` 命令作用一致。                                                                         |
| [Network]           | 网络配置区。                                                                                                                      |
| Server              | 更换游戏服务器，<br/>0：默认（相当于不使用命令）<br/>1：Unity Online Services。<br/>2：GitHub<br/>3：Unity Gaming Services<br/>与 `-server_#` 命令作用一致。 |
| Timeout             | 设置资源下载等待时间（秒），超过此时间后仍未下载完成则判定为下载失败。此设置会影响所有下载行为（例如游戏初始化、关卡下载和广告等）。0 代表不设置超时。                                                |


## 启动参数 :id=args

?> 被划线的命令表明已不在最新版本中受支持

> **提示**<br>
> 要应用这些命令，你可以通过命令行启动参数的方式来应用这些命令，也可以将这些命令放置在上面配置文件的`[Command Line Args]`分区下方。**注意，DLCE 怀旧版只支持通过命令行方式应用这些命令，且部分命令在怀旧版中不可用**

| 命令                         | 描述                                                                                                       | 备注                                             |
|:---------------------------|----------------------------------------------------------------------------------------------------------|------------------------------------------------|
| `-multi_touch`             | 允许[多点触控](/dlce/game-settings.md#MultiTouch)                                                              |
| `-master_volume_#`         | 调节游戏音量，`#` 数值为整数 0 - 100                                                                                 |
| `-debug_logging`           | 开启日志写入功能，单机平台（Windows、macOS等）可在游戏设置中找到“查看日志”选项，点击后会显示游戏的运行时日志                                            | v3.1.3.1031及以上版本提供                             |
| `-server_#`                | 更换游戏服务器为 #（数字）<br/>为了确保获取最新关卡资源，请尽可能使用默认服务器，除非关卡速度慢。<br/>0：默认（相当于不使用命令）<br/>1：Unity Online Services (国服) | -                                              |
| `-disable_discord_rpc`     | 禁用Discord RPC                                                                                            | -                                              |
| `-always_show_cursor`      | 关卡游玩过程中不再自动隐藏鼠标光标                                                                                        | -                                              |
| `-show_fps`                | 在屏幕右下角显示FPS                                                                                              |                                                |
| `-frame_rate_#`            | 设置帧率上限为“#”，并禁用垂直同步<br />“#”需为不小于-1的整数，-1表示无限                                                             | 在垂直同步关闭的情况下，游戏默认帧率上限为60                        |
| `-low_quality_mode`        | 强制使用最低画质，适用于部分设备调整到高画质后导致游戏闪退的情况（无法再进入游戏）                                                                | v2.6.0.12及以上版本提供                               |
| `-audio_dsp_buffer_#`      | 设置游戏音频的DSP缓冲区大小为“#”（整数），缓冲区越小，音乐延迟越小，但同时也会导致音频输出不稳定（推荐值：512）                                             | v2.6.2.0及以上版本提供                                |
| ~~`-use_soft_shadows`~~    | 使用柔和阴影模式（物体阴影边缘虚化）                                                                                       | **❗在2.0.2版本中移除**                               |
| ~~`-force_windowed_mode`~~ | 强制游戏以窗口模式运行                                                                                              | **❗在2.0.2版本中移除**                               |
| ~~`-low_resolution_mode`~~ | 强制游戏以800x600分辨率模式运行                                                                                      | **❗在2.0.2版本中移除**                               |
| ~~`-disable_shadow`~~      | 在游戏全局范围内禁用阴影效果                                                                                           | **❗在2.0.2版本中移除**                               |
| ~~`-shadow_distance_#`~~   | 锁定阴影距离为 “#”（整数）                                                                                          | “#” 需为不小于0的整数                                  |
| ~~`-disable_sound`~~       | 在游戏全局范围内禁用声音（即使设置中已经打开）                                                                                  | **❗在2.0.2版本中移除**                               |
| ~~`-graphics_tier_#`~~     | 更改图像层为"#"（0-2的整数）<br />0：低<br />1：中<br />2：高                                                             | 图像层越高，渲染消耗越高，不建议手动设置<br />游戏引擎默认会根据设备性能自动调节此设定 |

<blockquote>

**相关文档**
- [游戏设置 > 高级设置](/dlce/game-settings.md#advanced-settings)

</blockquote>