# Launch Options

> **Available for**<br>Windows, macOS

## Config File :id=configs

### Open the configuration file from outside of the game

<!-- tabs:start -->

#### **Windows**
- In File Explorer, head to the following path

```directory
%APPDATA%/../LocalLow/YINSU Studio/Dancing Line
```
- Then, open `Launch Options.ini`.

#### **macOS**
-Open Finder, press ` ⌘ ⇧ G`, enter the following path and press Enter:

```directory
~/Library/Application Support/YINSU Studio/Dancing Line/Launch Options.ini
```
- Then, open `Launch Options.ini`

<!-- tabs:end -->

### Open the configuration file from inside the game
- Go to game settings and click `Advanced Settings`

### Configuration File Format Template

```ini
[Command Line Args]
-example_argument ; This is an example commandand and is safe to be removed.

[Audio]
IOBufferSize=512
MasterVolume=100

[Video]
FrameRate=60

[Network]
Server=0
Timeout=10
```
?> If some configurations overlap with commands in [Launch Arguments](#args), the game will prioritize the settings from [Launch Arguments](#args).

| Name                 | Description                                                                                                                          |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [Command Line Args] |Below this label, place the [Launch Arguments](#args) you want to use, one per line.                                                                                         |
| -example_argument   | The example command has no practical effect.                                                                                                                 |
| [Audio]             | Audio configuration                                                                                                                      |
| IOBufferSize        | Audio I/O buffer size (DSP buffer size), recommended value: 512 <br/>This has the same effect as the `-audio_dsp_buffer_#` command.                                                             |
| MasterVolume        | Master volume level, value: 0 - 100. <br/> Same function as the `-master_volume_#` command.                                                                            |
| [Video]             | Video configuration                                                                                                                      |
| FrameRate           | Game frame rate limit; -1 for unlimited frame rate, default: 60 <br/>This has the same effect as the `-frame_rate_#` command.                                                                         |
| [Network]           | Network configuration                                                                                                                    |
| Server              | Change the game server: <br/>0: Default (equivalent to not using the command)<br/>1: Unity Online Services.<br/>2: GitHub<br/>3: Unity Gaming Services<br/>This has the same effect as the `-server_#` command. |
| Timeout             | Set the waiting time (seconds) for resource download. If the download is not completed in time, it will be considered a failure. This setting affects all download behaviors (such as game initialization, level downloads, and advertisements). 0 for no timeout.                                                |


## Launch Arguments :id=args

?> The command with strikethrough format indicates that it is deprecated and no longer available in the latest version

> **Tips**<br>
> To apply these commands, you can either apply them by launching the parameters from the command line or by placing them under the `[Command Line Args]` of the configuration file above. **Do note that，DLCE Classic only supports these commands via command line, and some commands are unavailable in Classic.**

| Commands                        | Description                                                                                                       | Notes                                             |
|:---------------------------|----------------------------------------------------------------------------------------------------------|------------------------------------------------|
| `-multi_touch`             | Enable/Disable [multi-touch](/en/dlce/game-settings.md#MultiTouch)                                                           |
| `-master_volume_#`         | Adjusts game volume，`#` is an integer, accepted value: 0 - 100                                                                                 |
| `-debug_logging`           | Enables log writing. For certain platforms like Windows, macOS, you can find the "View Logs" option in the game settings. Clicking it will display the game's runtime log.                                            | Available from v3.1.3.1031                             |
| `-server_#`                | Changes the game server to # (number) <br/>To ensure you get the latest level resources, please use the default server whenever possible, unless the level downloading is slow.<br/>0: Default (equivalent to not using the command)<br/>1: Unity Online Services (Chinese Server) | -                                              |
| `-disable_discord_rpc`     | Disable Discord RPC                                                                                            | -                                              |
| `-always_show_cursor`      | Always show the mouse cursor during gameplay                                                                                        | -                                              |
| `-show_fps`                | Display FPS in the lower right corner of the screen                                                                                              |                                                |
| `-frame_rate_#`            | Set the frame limiter to "#" and disable V-Sync<br />"#" must be an integer not less than -1, -1 for unlimited                                                             | With V-Sync off, the game's default frame rate limit is set to 60                        |
| `-low_quality_mode`        | Forces the game to use the lowest graphics settings, applicable to situations where the game crashes (cannot be entered) after adjusting to high graphics settings on some devices                                                                | Available from v2.6.0.12                              |
| `-audio_dsp_buffer_#`      | Sets the DSP buffer size for game audio to "#" (integer). A smaller buffer results in less music latency, but also leads to unstable audio output (recommended value: 512)                                             | Available from v2.6.2.0                                |
| ~~`-use_soft_shadows`~~    | Uses soft shadow mode (blurs object shadow edges)                                                                                       | **❗No longer available from version 2.0.2**                               |
| ~~`-force_windowed_mode`~~ | Forces the game to run in Windowed mode                                                                                             | **❗No longer available from version 2.0.2**                                |
| ~~`-low_resolution_mode`~~ | Forces the game to run at 800x600 resolution                                                                                      | **❗No longer available from version 2.0.2**                                |
| ~~`-disable_shadow`~~      | Disables shadow effects globally in the game                                                                                           | **❗No longer available from version 2.0.2**                                |
| ~~`-shadow_distance_#`~~   | Locks shadow distance to "#" (integer)                                                                                          | “#” must be an integer not less than 0                                  |
| ~~`-disable_sound`~~       | Disables sound globally in the game (even if Enabled in Settings)                                                                                  | **❗No longer available from version 2.0.2**                               |
| ~~`-graphics_tier_#`~~     | Changes the graphics tier to "#" (Accpeted value: 0, 1, 2)<br />0: Low<br />1: Medium<br />2: High                                                             | The higher the graphics tier, the higher the rendering time is. Manual setting is not recommended.<br />The game engine will automatically adjust this setting based on device performance by default. |

<blockquote>

**Related Topics**
- [Settings > Advanced Settings](/en/dlce/game-settings.md#advanced-settings)

</blockquote>
