# 啟動選項
<!-- last-modified -->

> [!IMPORTANT]
> **適用於**<br>Windows、macOS

## 設定檔 :id=configs

### 從遊戲外開啟設定檔

<!-- tabs:start -->

#### **Windows**
- 檔案總管中輸入並進入如下路徑

```directory
%APPDATA%/../LocalLow/YINSU Studio/Dancing Line
```
- 按兩下開啟 `Launch Options.ini`。

#### **macOS**
- 開啟 Finder，按下 ` ⌘ ⇧ G` 輸入如下路徑後按下 Enter

```directory
~/Library/Application Support/YINSU Studio/Dancing Line/Launch Options.ini
```
- 按兩下開啟 `Launch Options.ini`。

<!-- tabs:end -->

### 從遊戲內開啟設定檔
- 進入遊戲設定，點選 `進階設定`

### 設定檔格式範例

```ini
[Command Line Args]
-example_argument ; 此條為範例命令，可以刪除

[Audio]
IOBufferSize=512

[Video]
FrameRate=60

[Network]
Server=0
Timeout=10
```
> [!NOTE]
> 某些設定與[啟動參數](#args)中的命令重合，遊戲會優先使用[啟動參數](#args)中的設定。

| 名稱                  | 描述                                                                                                                          |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [Command Line Args] | 在此標籤下方放置你要使用的 [啟動參數](#args)，每行放置一個。                                                                                         |
| -example_argument   | 範例命令，無實際作用。                                                                                                                 |
| [Audio]             | 音訊設定區。                                                                                                                      |
| IOBufferSize        | 音訊 I/O 緩衝區大小（DSP 緩衝區大小），建議值為 512。<br/>與 `-audio_dsp_buffer_#` 命令作用一致。                                                             |
| [Video]             | 顯示設定區。                                                                                                                      |
| FrameRate           | 遊戲幀率限制，-1代表無限幀率，預設60。<br/>與 `-frame_rate_#` 命令作用一致。                                                                         |
| [Network]           | 網路設定區。                                                                                                                      |
| Server              | 更換遊戲伺服器，<br/>0：預設（相當於不使用命令）<br/>1：Unity Online Services。<br/>2：GitHub<br/>3：Unity Gaming Services<br/>與 `-server_#` 命令作用一致。 |
| Timeout             | 設定資源下載等待時間（秒），超過此時間後仍未下載完成則判定為下載失敗。此設定會影響所有下載行為（例如遊戲初始化、關卡下載和廣告等）。0 代表不設定超時。                                                |


## 啟動參數 :id=args

> [!NOTE]
> 被劃線的命令表明已不在最新版本中受支援

> [!TIP]
> 要應用這些命令，你可以透過命令列啟動參數的方式來應用這些命令，也可以將這些命令放置在上面設定檔的`[Command Line Args]`區段下方。

> [!WARNING]
> 注意，DLCE 懷舊版只支援透過命令列方式應用這些命令，且部分命令在懷舊版中不可用。

| 命令                         | 描述                                                                                                       | 備註                                             |
|:---------------------------|----------------------------------------------------------------------------------------------------------|------------------------------------------------|
| `-multi_touch`             | 允許[多點觸控](/zh-TW/dlce/settings/advanced.md#MultiTouch)                                                              |                                                |
| ~~`-master_volume_#`~~     | 調整遊戲音量，`#` 數值為整數 0 - 100                                                                                 | **❗在 v3.8.2 中移除**                              |
| `-debug_logging`           | 開啟日誌寫入功能。桌面平台（Windows、macOS 等）可在遊戲設定中找到「檢視日誌」選項，點選後會顯示遊戲的執行記錄                                            | v3.1.3.1031 以上版本提供                             |
| `-server_#`                | 將遊戲伺服器切換為 #（數字）<br/>為了確保取得最新關卡資源，請儘可能使用預設伺服器，除非關卡下載速度過慢。<br/>0：預設（相當於不使用命令）<br/>1：Unity Online Services（中國伺服器） | -                                              |
| `-disable_discord_rpc`     | 停用 Discord RPC                                                                                            | -                                              |
| `-always_show_cursor`      | 關卡遊玩過程中不再自動隱藏滑鼠游標                                                                                        | -                                              |
| `-show_fps`                | 在螢幕右下角顯示 FPS                                                                                              |                                                |
| `-frame_rate_#`            | 設定幀率上限為「#」，並停用垂直同步<br />「#」需為不小於-1的整數，-1表示無限                                                             | 在垂直同步關閉的情況下，遊戲預設幀率上限為60                        |
| `-low_quality_mode`        | 強制使用最低畫質，適用於部分裝置調整到高畫質後導致遊戲閃退的情況（無法再進入遊戲）                                                                | v2.6.0.12以上版本提供                               |
| `-audio_dsp_buffer_#`      | 設定遊戲音訊的DSP緩衝區大小為「#」（整數），緩衝區越小，音樂延遲越小，但同時也會導致音訊輸出不穩定（建議值：512）                                             | v2.6.2.0以上版本提供                                |
| ~~`-use_soft_shadows`~~    | 使用柔和陰影模式（物體陰影邊緣虛化）                                                                                       | **❗在2.0.2版本中移除**                               |
| ~~`-force_windowed_mode`~~ | 強制遊戲以視窗模式執行                                                                                              | **❗在2.0.2版本中移除**                               |
| ~~`-low_resolution_mode`~~ | 強制遊戲以800x600解析度模式執行                                                                                      | **❗在2.0.2版本中移除**                               |
| ~~`-disable_shadow`~~      | 在遊戲全域範圍內停用陰影效果                                                                                           | **❗在2.0.2版本中移除**                               |
| ~~`-shadow_distance_#`~~   | 鎖定陰影距離為 「#」（整數）                                                                                          | 「#」 需為不小於0的整數                                  |
| ~~`-disable_sound`~~       | 在遊戲全域範圍內停用聲音（即使設定中已經開啟）                                                                                  | **❗在2.0.2版本中移除**                               |
| ~~`-graphics_tier_#`~~     | 更改影像層為"#"（0-2的整數）<br />0：低<br />1：中<br />2：高                                                             | 影像層越高，渲染消耗越高，不建議手動設定<br />遊戲引擎預設會根據裝置效能自動調整此設定 |

<blockquote>

**相關文件**
- [遊戲設定 > 進階設定](/zh-TW/dlce/settings/advanced.md)

</blockquote>
