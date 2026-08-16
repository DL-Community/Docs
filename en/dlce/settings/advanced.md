# Advanced Settings :id=advanced-settings
<!-- last-modified -->

<!-- tabs:start -->
### **Windows**

> [!NOTE]
> See [Launch Options](/en/dlce/commands.md)。

### **macOS**
> [!NOTE]
> See [Launch Options](/en/dlce/commands.md)。

### **iOS on Mac**

> [!WARNING]
> **Note**<br>
Due to Mac system limitations, some settings that are not available on Mac will still be displayed.
Settings not listed below are not supported on Mac.

<!-- tabs:start -->
<!-- tab:Audio -->

### Volume
- Adjusts the overall game volume.

### I/O Buffer Size
- Adjusts the audio DSP buffer size. If audio playback is choppy, or the game music disappears after playing ads, try increasing this value.
- Default Value：512。

<!-- tab:Video -->

### Frame Rate
- Adjust the maximum frame rate of the game, up to 120 FPS.

> [!NOTE]
> 120 FPS can only be enabled on a Mac's built-in screen that supports ProMotion or a high refresh rate external display.

### Display Frame Rate

- Displays the current frame rate in the lower right corner of the game.

### Force Low Quality Mode

- When enabled, force the game to run at the lowest graphics settings.

<!-- tab:Network -->
### Login Method
- Choose a method to login the game, either using DLRS GAS or Game Center.

> [!WARNING]
> Game progress does not share between login methods.

### Server
- Select the region for the level-downloading server.

### Timeout (seconds)
- Set the waiting time (seconds) for resource download. If the download is not completed in time, it will be considered a failure. This setting affects all download behaviors (such as game initialization, level downloads, and advertisements).

<!-- tab:Debug -->
### Output Log

- When enabled, you can view the game's debug log in "Finder".
  - Open Finder，press ` ⌘ ⇧ G`，enter the following path and press Enter：

  ```directory
  ~/Library/Containers
  ```

  - Locate the game folder and head to `Data/Documents/Logs` .
  - This folder contains all the logs for the game's current run and the logs from the previous run.

<!-- tabs:end -->

### **iOS**

<!-- tabs:start -->
<!-- tab:Audio -->

### Volume
- Adjusts the overall game volume.

### I/O Buffer Size
- Adjusts the audio DSP buffer size. If audio playback is choppy, or the game music disappears after playing ads, try increasing this value.
- Default Value：512。

<!-- tab:Video -->

### Frame Rate
- Adjust the maximum frame rate of the game, up to 120 FPS.

> [!NOTE]
> 120 FPS can only be enabled on a Mac's built-in screen that supports ProMotion or a high refresh rate external display.

### Display Frame Rate

- Displays the current frame rate in the lower right corner of the game.

### Force Low Quality Mode

- When enabled, force the game to run at the lowest graphics settings.

<!-- tab:Network -->
### Login Method
- Choose a method to login the game, either using DLRS GAS or Game Center.

> [!WARNING]
> Game progress does not share between login methods.

### Server
- Select the region for the level-downloading server.

### Timeout (seconds)
- Set the waiting time (seconds) for resource download. If the download is not completed in time, it will be considered a failure. This setting affects all download behaviors (such as game initialization, level downloads, and advertisements).

<!-- tab:Others -->
### Multi-touch Support :id=MultiTouch
- Allows simultaneous control of the character with multiple fingers.

### Use System Font Settings
- UI text size and weight follow system settings.

<!-- tab:Debug -->
### Output Log
- Once enabled, you can view the game's debug log in the "File" app.

<!-- tabs:end -->

### **Android**

### I/O 缓冲区大小
- 调整音频DSP缓冲区大小，如果音频播放出现卡顿，或播放广告后游戏音乐消失，可以尝试增大此数值。
- 默认值：512。

### 帧率
- 调整游戏帧率上限，最高可设置为240FPS。

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
