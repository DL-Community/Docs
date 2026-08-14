# Settings
<!-- last-modified -->

> - The following options are not available on all platforms. Please refer to the actual in-game version for specifics.
> - Click the menu icon in the lower right corner of the game's main interface to access the settings.

!> **Note**<br>
In the following text, macOS and iOS on Mac refer to different platforms respectively.<br>
The former is the macOS desktop version, while the latter is the iOS version running on Mac computers with M-series chips.

## Language
- Change the display language of the game.
- For details, please refer to [Localizations](/en/dlce/localization.md).

## Synchronization
!> It is **not recommended** to enable multiple automatic adjustments below simultaneously, as doing so may lead to **excessive synchronization correction**.

<!-- tabs:start -->

### **Auto Adjustment**
- When this option is enabled, the game will **dynamically adjust synchronization based on the overall performance during gameplay**.
- When the automatic adjustment feature is disabled, players can **manually adjust the audio delay in the game**. **A larger value results in later audio playback**.

### **Audio Output Latency**
- When enabled, the game will automatically detect and correct audio output latency. It is recommended to enable this when using Bluetooth headphones or car audio systems.

### **Touch Input Latency**
> **Applies to**<br>iOS.
- When enabled, the game will automatically detect and correct touch response latency. This option can be disabled to reduce CPU usage by the game.

<!-- tabs:end -->

### In-Level Synchronization
- After loading into any level, enter the synchronization settings. This configuration only applies to the current level.

## Sound
- Global sound switch for the game.

## Quality
- Adjusts the **scene/visual complexity and quality** in the game.

| Quality                                      | Very Low | Low | Medium  | High      | Ultra     | Extreme (PC Only) |
|----------------------------------------------|----------|-----|---------|-----------|-----------|-------------------|
| **Shadows**                                  | No       | No  | No      | No        | Supported | Supported         |
| **Reflections**                              | No       | No  | Partial | Supported | Supported | High Quality      |
| **Particles**                                | Minimal  | Low | Medium  | High      | High      | Maximum           |
| **Soft Particles**                           | No       | No  | No      | No        | No        | Supported         |
| **Built-In Post-Processing (if applicable)** | No       | No  | No      | Supported | Supported | Supported         |
| **HDR Rendering**                            | No       | No  | No      | No        | No        | Supported         |
| **Deferred Rendering**                       | No       | No  | No      | Partial   | Partial | Supported         |

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

## Anti-Aliasing

<!--details-->
<!--summary-->
   <!--b>Details</b-->
<!--/summary-->

> **Available for**<br>Windows, macOS,  iOS on Mac.
- Choose the Anti-Aliasing (AA) mode

| Mode                                    | Description                                                                                                                                                                                                                         |
|-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Off                                     | No Anti-aliasing                                                                                                                                                                                                                    |
| Multisample AA（MSAA）                    | Hardware-level anti-aliasing method. Best results but low efficiency. Unavailable in some levels using deferred rendering (e.g., The Samurai (HD), The Apocalypse, The Adventure, The Memories, The Firework Paradise, etc.)        |
| Fast Approximate AA（FXAA）               | An anti-aliasing method based on post-processing of the screen, calculating the average value based on adjacent pixels. The effect is slightly inferior, resulting in a blurry image.                                               |
| Subpixel Morphological AA（SMAA）         | An anti-aliasing based on screen post-processing that identifies and eliminates aliasing by analyzing edge and color information in an image. It offers a relatively balanced performance in terms of efficiency and effectiveness. |
| AMD FidelityFX™ Super Resolution（FSR 3） | [AMD FidelityFX™ Super Resolution (FSR)](https://www.amd.com/en/products/graphics/technologies/fidelityfx/super-resolution.html). Currently only available for Windows and macOS.                                                   |

<!--/details-->

## Frame Rate

- Select game frame rate, or vertical sync.

<!--/details-->


## Key Bindings

<!--details-->
<!--summary-->
   <!--b>Details</b-->
<!--/summary-->

> **Available for**<br>Windows, macOS.
- Adjust the key bindings.


### Input HUD
- The HUD interface is displayed at the bottom, showing the keys with corresponding function.

<!--/details-->

## Accessibility
?> See [Accessibility](/en/dlce/settings/accessibility.md).


## Advanced Settings :id=advanced-settings
?> See [Advanced Settings](/en/dlce/settings/advanced.md).

<blockquote>

**Related Topics**
- [Launch Options](/en/dlce/commands.md)

</blockquote>
