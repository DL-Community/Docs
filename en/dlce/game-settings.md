# Settings

> - The following options are not available on all platforms. Please refer to the actual in-game version for specifics.
> - Click the menu icon in the lower right corner of the game's main interface to access the settings.

!> **Note**<br>
In the following text, macOS and iOS on Mac refer to different platforms respectively.<br>
The former is the macOS desktop version, while the latter is the iOS version running on Mac computers with M-series chips.

## Language
- Change the display language of the game.
- For details, please refer to [Localizations](/en/about/localization.md).

## Synchronization
!> It is **not recommended** to enable multiple automatic adjustments below simultaneously, as doing so may lead to **excessive synchronization correction**.

<!-- tabs:start -->

### **Auto Adjustment**
- When this option is enabled, the game will **dynamically adjust synchronization based on the overall performance during gameplay**.
- When the automatic adjustment feature is disabled, players can **manually adjust the audio delay in the game**. **A larger value results in later audio playback**.

### **Audio Output Latency**
- When enabled, the game will automatically detect and correct audio output latency. It is recommended to enable this when using Bluetooth headphones or car audio systems.

### **Touch Input Latency**
> **Applies to**<br>iOS, Android.
- When enabled, the game will automatically detect and correct touch response latency. This option can be disabled to reduce CPU usage by the game.

<!-- tabs:end -->

### In-Level Synchronization
- After loading into any level, enter the synchronization settings. This configuration only applies to the current level.

## Sound
- Global sound switch for the game.

## Quality
- Adjusts the **scene/visual complexity and quality** in the game.

| Quality               | Shadows   | Reflections     | Particle Effects | Post-Processing Effects (if applicable) |  
|-----------------------|-----------|-----------------|------------------|-----------------------------------------|  
| **Very Low**          | None      | None            | Minimal or None  | None                                    |  
| **Low**               | None      | None            | Low              | None                                    |  
| **Medium**            | None      | Partial or None | Medium           | None                                    |  
| **High**              | None      | Supported       | High             | Supported                               |  
| **Very High**         | Supported | Supported       | High             | Supported                               |  
| **Extreme (PC Only)** | Supported | High Quality    | Maximum          | Supported                               |

## Resolution
<!-- tabs:start -->

### **Windows**
- Click to open the resolution selection panel, which offers multiple aspect ratios for both landscape and portrait orientations.

### **macOS**
- Click to open the resolution selection panel, which offers multiple aspect ratios for both landscape and portrait orientations.

### **iOS on Mac**
- Click to switch between resolution modes: Very Low / Low / Medium / High / Ultra.

### **iOS**
- Click to switch between resolution modes: Very Low / Low / Medium / High / Ultra.

### **Android**
- Click to switch between resolution modes: Very Low / Low / Medium / High / Ultra.

<!-- tabs:end -->

?> Lower resolutions provide smoother gameplay performance.

## Display Mode

<!-- tabs:start -->
### **Windows**

| Mode                 | Description                                                                                                                                                                                |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Exclusive Fullscreen | The game **exclusively occupies GPU resources**. The desktop is suspended, providing optimal performance, but switching between the game and the desktop is slower.                        |
| Borderless Window    | **Hides window borders and stretches the game to full screen proportionally**. Fast window switching speed, with GPU resources shared with the desktop.                                    |
| Windowed             | Windowed mode. **Window borders are not hidden, and the game is not stretched proportionally to full screen**. Fastest window switching speed, with GPU resources shared with the desktop. |

### **macOS**

| Mode              | Description                                                                                                                                                                                |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Borderless Window | The game enters macOS full-screen mode.                                                                                                                                                    |
| Windowed          | Windowed mode. **Window borders are not hidden, and the game is not stretched proportionally to full screen**. Fastest window switching speed, with GPU resources shared with the desktop. |

<!-- tabs:end -->

## 抗锯齿

<!--details-->
<!--summary-->
   <!--b>详情</b-->
<!--/summary-->

> **适用于**<br>Windows、macOS、iOS on Mac、Android。
- 选择抗锯齿模式。

| 模式                   | 介绍                                                                                                                                                                    |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 关闭                   | 不使用抗锯齿。                                                                                                                                                               |
| 多重采样抗锯齿（MSAA）        | 一种硬件级抗锯齿。效果佳但效率较低。在部分使用了延迟渲染技术的关卡中不可用（例如：武士 HD、启示录、冒险、回忆、花火之都等）。                                                                                                      |
| 快速近似抗锯齿（FXAA）        | 一种基于屏幕后期处理的抗锯齿，基于相邻像素计算出平均值。效果略差，会导致图像模糊                                                                                                                              |
| 时域抗锯齿（TAA）           | 一种基于屏幕后期处理的抗锯齿，在时间上进行多采样，用帧与帧之间的差异来计算抗锯齿。效果优于FXAA。                                                                                                                    |
| 子像素抗锯齿（SMAA）         | 一种基于屏幕后期处理的抗锯齿，通过分析图像中的边缘和颜色信息来识别并消除锯齿。在效率和效果上较为平均。                                                                                                                   |
| AMD 超级分辨率锐画技术（FSR 3） | [AMD FidelityFX™ Super Resolution (FSR)](https://www.amd.com/zh-cn/products/graphics/technologies/fidelityfx/super-resolution.html)。目前仅对 Windows 和 macOS 版本开放，不支持移动端。 |

<!--/details-->

## 垂直同步

<!--details-->
<!--summary-->
   <!--b>详情</b-->
<!--/summary-->

> **适用于**<br>Windows、macOS、iOS on Mac、Android。
- 开启或关闭垂直同步。

<!--/details-->


## 键位映射

<!--details-->
<!--summary-->
   <!--b>详情</b-->
<!--/summary-->

> **适用于**<br>Windows、macOS。
- 调整键位绑定。


### 键位指示器
- 在底部显示 HUD 界面，显示当前键盘键位的功能。

<!--/details-->

## 辅助功能
?> 见 [Accessibility](/en/dlce/game-settings-accessibility.md)。


## Advanced Settings :id=advanced-settings

<!-- tabs:start -->
### **Windows**

?> 见 [Launch Options](/en/dlce/commands.md)。

### **macOS**
?> 见 [Launch Options](/en/dlce/commands.md)。

### **iOS on Mac**

!> **注意**<br>
受 Mac 系统限制，部分在 Mac 上不可用的设置依然会显示出来。
未在下方列出的设置表明不在 Mac 上受支持。

<!-- tabs:start -->
<!-- tab:音频 -->

### 音量
- 调整游戏总音量

### I/O 缓冲区大小
- 调整音频DSP缓冲区大小，如果音频播放出现卡顿，或播放广告后游戏音乐消失，可以尝试增大此数值。
- 默认值：512。

<!-- tab:视频 -->

### 帧率
- 调整游戏帧率上限，最高可设置为120FPS。

?> 只有在支持ProMotion的Mac内置屏幕或高刷新率的外置显示器上才能启用120FPS。

### 显示帧率
- 在游戏右下角显示当前帧率。

### 强制低画质模式
- 开启后，游戏会强制以最低画质运行。

<!-- tab:网络 -->
### Login Method
- Choose to login the game using DLRS GAS or Game Center.

!> Game progress does not share between login methods.

### 服务器
- 选择关卡下载服务器的地区。

### 超时（秒）
- 设置资源下载等待时间（秒），超过此时间后仍未下载完成则判定为下载失败。
  此设置会影响所有下载行为（例如游戏初始化、关卡下载和广告等）。

<!-- tab:调试 -->
### 输出日志
- 开启后可前往“Finder”下查看游戏的调试日志。
  - 打开 Finder 访达，按下 ` ⌘ ⇧ G`，输入下列路径并回车：

  ```directory
  ~/Library/Containers
  ```

  - 找到游戏文件夹，进入 `Data/Documents/Logs` 文件夹。
  - 该文件夹内包含本次游戏运行日志和上一次运行的日志。

<!-- tabs:end -->

### **iOS**

<!-- tabs:start -->
<!-- tab:音频 -->

### 音量
- 调整游戏总音量

### I/O 缓冲区大小
- 调整音频DSP缓冲区大小，如果音频播放出现卡顿，或播放广告后游戏音乐消失，可以尝试增大此数值。
- 默认值：512。

<!-- tab:视频 -->
### 帧率
- 调整游戏帧率上限，最高可设置为120FPS。

?> 只有在支持ProMotion的设备上才能启用120FPS。

### 显示帧率
- 在游戏右下角显示当前帧率。

### 强制低画质模式
- 开启后，游戏会强制以最低画质运行。

<!-- tab:网络 -->
### Login Method
- Choose to login the game using DLRS GAS or Game Center.

!> Game progress does not share between login methods.

### 服务器
- 选择关卡下载服务器的地区。

### 超时（秒）
- 设置资源下载等待时间（秒），超过此时间后仍未下载完成则判定为下载失败。
此设置会影响所有下载行为（例如游戏初始化、关卡下载和广告等）。

<!-- tab:其他 -->
### 多点触控支持 :id=MultiTouch
- 允许同时使用多个手指控制角色。

### 使用系统字体设置
- UI 文本大小、粗细跟随系统设置。

<!-- tab:调试 -->
### 输出日志
- 开启后可前往“文件”app下查看游戏的调试日志。

<!-- tabs:end -->

### **Android**

### I/O 缓冲区大小
- 调整音频DSP缓冲区大小，如果音频播放出现卡顿，或播放广告后游戏音乐消失，可以尝试增大此数值。
- 默认值：512。

### 帧率
- 调整游戏帧率上限，最高可设置为120FPS。

### 显示帧率
- 在游戏右下角显示当前帧率。

### 服务器
- 选择关卡下载服务器的地区。

### 超时（秒）
- 设置资源下载等待时间（秒），超过此时间后仍未下载完成则判定为下载失败。
  此设置会影响所有下载行为（例如游戏初始化、关卡下载和广告等）。

### 多点触控支持 :id=MultiTouch-Android
- 允许同时使用多个手指控制角色。

<!-- tabs:end -->

<blockquote>

**Related Topics**
- [Launch Options](/en/dlce/commands.md)

</blockquote>