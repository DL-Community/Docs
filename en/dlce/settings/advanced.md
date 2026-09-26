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
> Due to Mac system limitations, some settings that are not available on Mac will still be displayed.
Settings not listed below are not supported on Mac.

<!-- tabs:start -->
<!-- tab:Audio -->

### Volume
- Adjusts the overall game volume.

### I/O Buffer Size
- Adjusts the audio DSP buffer size. If audio playback is choppy, or the game music disappears, try increasing this value.
- Default Value：512.

<!-- tab:Video -->

### Frame Rate（Expired）
- Adjust the maximum frame rate of the game, up to 120 FPS.

> [!NOTE]
> 120 FPS can only be enabled on a Mac's built-in screen that supports ProMotion or a high refresh rate external display.

> [!IMPORTANT]
> This content becomes invalid after **3.8.0**.

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
- You can choose from the following servers:
  - Default
  - Unity Online Services（alternative）
  - GitHub
  - Unity Gaming Services
    
### Timeout (seconds)
- Set the waiting time (seconds) for resource download. If the download is not completed in time, it will be considered a failure. This setting affects all download behaviors (such as game initialization, level downloads).

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
- Adjusts the audio DSP buffer size. If audio playback is choppy, or the game music disappears, try increasing this value.
- Default Value：512.

<!-- tab:Video -->

### Frame Rate（Expired）
- Adjust the maximum frame rate of the game, up to 120 FPS.

> [!NOTE]
> 120 FPS can only be enabled on a Mac's built-in screen that supports ProMotion or a high refresh rate external display.

> [!IMPORTANT]
> This content becomes invalid after **3.8.0**.

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
- You can choose from the following servers:
  - Default
  - Unity Online Services（alternative）
  - GitHub
  - Unity Gaming Services

### Timeout (seconds)
- Set the waiting time (seconds) for resource download. If the download is not completed in time, it will be considered a failure. This setting affects all download behaviors (such as game initialization, level downloads).

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

### I/O Buffer Size
- Adjusts the audio DSP buffer size. If audio playback is choppy, or the game music disappears, try increasing this value.
- Default Value：512.

### Frame Rate
- Adjust the maximum frame rate of the game, up to 240 FPS.

### Display Frame Rate

- Displays the current frame rate in the lower right corner of the game.

### Server
- Select the region for the level-downloading server.
- You can choose from the following servers:
  - Default
  - Unity Online Services（alternative）
  - GitHub
  - Unity Gaming Services

### Timeout (seconds)
- Set the waiting time (seconds) for resource download. If the download is not completed in time, it will be considered a failure. This setting affects all download behaviors (such as game initialization, level downloads).

### Multi-touch Support :id=MultiTouch-Android
- Allows simultaneous control of the character with multiple fingers.

<!-- tabs:end -->


<blockquote>

**Related Topics**
- [Launch Options](/en/dlce/commands.md)

</blockquote>
