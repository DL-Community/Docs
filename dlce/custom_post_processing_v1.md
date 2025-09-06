**[返回上级](/dlce/custom_post_processing.md)**

# 自定义后期处理 V1

?> **过时的文档**<br>Post-Processing V1 将在未来的版本移除支持，此文档现不再维护。推荐使用 [V2 版本](/dlce/custom_post_processing_v2.md)。

<!-- tabs:start -->
<!-- tab:新版 -->
### 新版
> **兼容性**<br>DLCE v3.0.1 及以上

?> DLCE v3.0.1 以下版本和 DLCE 怀旧版不兼容此版本。文档请参考 [旧版](#旧版)

## 制作配置文件
- [加入QQ群](https://qm.qq.com/q/wlrTgLHAHI)在群文件中寻找自定义后处理的配置文件模板；
- 在其基础上修改数值后并**导入对应的路径中**即可；
- [配置文件内的各项配置描述在这里](#配置文件介绍)；
- 配置完毕后，继续阅读下文将文件重命名并导入至游戏。

## 导入配置文件

### Windows 路径
- 前往游戏安装目录（安装时指定的路径）。
- 后期处理配置文件保存在

```directory
Dancing Line/Dancing Line_Data/Custom/PostProcessing/关卡代号.bytes
```

### iOS 路径
- 打开“文件”app，找到“我的iPhone（iPad）”
- 后期处理配置文件保存在

```directory
跳舞的线/Custom/PostProcessing/关卡代号.txt
```

### iOS on Mac 路径
- 打开 Finder 访达，按下 `Command + Shift + G`，输入下列路径并回车：

````directory
~/Library/Containers
````

- 找到游戏文件夹，进入 `Data/Documents` 文件夹。
- 后期处理配置文件保存在

```directory
Custom/PostProcessing/关卡代号.txt
```

<!-- tab:旧版 -->
### 旧版

> **兼容性**<br>DLCE v3.0.0 ～ v1.2.9、DLCE 怀旧版

?> 该版本的自定义后期处理与 [V1 新版](#新版)无实际差异，仅文件路径、文件名有区别。

## 制作配置文件
- [加入QQ群](https://qm.qq.com/q/wlrTgLHAHI)在群文件中寻找自定义后处理的配置文件模板；
- 在其基础上修改数值后并**导入对应的路径中**即可；
- [配置文件内的各项配置描述在这里](#配置文件介绍)；
- 配置完毕后，继续阅读下文将文件重命名并导入至游戏。

## 导入配置文件
### Windows 路径
- 前往游戏安装目录。
- 后期处理配置文件保存在

```directory
Dancing Line/Dancing Line_Data/Custom/PostProcessing/关卡代号/postprofile.bytes
```

<!-- tabs:end -->

### 注意事项

- 其中 `关卡代号` 用于指定该配置将会用于哪一个关卡。比如，将 `关卡代号` 替换为 `Taurus`，则游戏会将你的配置文件应用在**金牛座**关卡中。
- 更多 `关卡代号` 见[关卡信息](/dlce/level_information.md)。
- `关卡代号` 必须使用指定的名称，否则不会正常读取。
- 游戏允许同时导入多个配置文件，并自动应用到 `关卡代号` 对应的关卡上。

## 配置文件介绍

- Profile中每一个不同的特效的配置都会使用 {} 进行包括，例如下文中被{}包括的内容则是与antialiasing有关的配置参数

````json
      "antialiasing": {
        "m_Enabled": false,
        "m_Settings": {
          "method": 0,
              "fxaaSettings": {
                "preset": 2
            },
          "taaSettings": {
            "jitterSpread": 0.75,
            "sharpen": 0.30000001192092898,
            "stationaryBlending": 0.949999988079071,
            "motionBlending": 0.8500000238418579
          }
        }
      },
````

### 通用配置项

#### m_Enabled

- `m_Enabled`：每一个特效配置中都有此配置项，用于控制是否开启该特效。`true` 为开启，`false` 为关闭

      "m_Enabled": false,

#### m_Settings

- `m_Settings`：每一个特效配置中都有此配置项，用于调整该特效的具体参数（只有 `m_Enabled` 为 `true` 时才会生效）

      "m_Settings": {
         ...
      }

#### intensity

- `intensity`：位于 `m_Settings` 中，大部分特效配置都有此配置项，用于调整该特效的强度

      "intensity": 1.0,

#### radius

- `radius`：位于 `m_Settings` 中，大部分特效配置都有此配置项，用于调整该特效的影响范围

      "radius": 0.3,

### 效果配置项

?> 开启任一特效均会对游戏帧数产生影响，请在开启前考虑设备性能

#### Anti-Aliasing

> **抗锯齿（AA）**，开启该特效可让游戏画面更加细腻，但同时也会造成一定的设备性能损耗。

- `method`: 抗锯齿模式, 参数范围 `整数 0 - 1`，`0-快速近似抗锯齿（FXAA）`，`1-时域抗锯齿（TAA）`。


- `fxaaSettings`：FXAA相关设置，仅在使用了FXAA模式生效。
  - `preset`：FXAA模式，参数范围 `整数 0 - 4`，`0-最佳性能` `1-性能` `2-默认` `3-质量` `4-最高质量`。


- `taaSettings`：TAA相关设置，仅在使用了TAA模式生效。
  - `jitterSpread`：TAA采样范围，参数范围 `浮点数 0 - 1`，数字越小，画面越清晰，但锯齿更多，反之亦然。
  - `sharpen`：画面锐化，参数范围 `浮点数 0 - 3`。
  - `stationaryBlending`：固定像素采样的混合系数。控制混合到最终颜色的历史采样的百分比。参数范围 `浮点数 0 - 0.99`，
  - `motionBlending`：动态像素采样的混合系数。控制混合到最终颜色的历史采样的百分比。参数范围 `浮点数 0 - 0.99`，

?> 请勿在游戏内置MSAA（仅PC可用）开启的情况下启用此抗锯齿功能

````json
"antialiasing": {
    "m_Enabled": false,
        "m_Settings": {
            "method": 0,
            "fxaaSettings": {
                "preset": 2
            },
            "taaSettings": {
            "jitterSpread": 0.75,
            "sharpen": 0.30000001192092898,
            "stationaryBlending": 0.949999988079071,
            "motionBlending": 0.8500000238418579
        }
    }
 },
````


#### Ambient Occlusion

> **环境光遮蔽（AO）**，开启该特效可在物体边缘绘制阴影，增加画面层次感。

- `intensity`：强度，参数范围 `浮点数 0 - 4`


- `radius`：范围，参数范围 `浮点数 0 - 无限（取决于当前设备的最大浮点数上限）`


- `sampleCount`：采样级别，参数范围 `整数 0 - 3`，`0-最低` `1-低` `2-中` `3-高`。


- `downsampling`：对物体向下的面进行采样，参数 `true` `false`，可根据情况选择是否开启


- `forceForwardCompatibility`：强制前向兼容性，参数 `true` `false`，可根据情况选择是否开启


- `ambientOnly`：仅前向光，参数 `true` `false`，可根据情况选择是否开启


- `highPrecision`：高精度模式，参数 `true` `false`，可根据情况选择是否开启



?> 环境光遮蔽不应过强，否则会导致画面变黑变脏，影响视觉效果。

````json
"ambientOcclusion": {
    "m_Enabled": false,
    "m_Settings": {
        "intensity": 1.0,
        "radius": 0.30000001192092898,
        "sampleCount": 10,
        "downsampling": true,
        "forceForwardCompatibility": false,
        "ambientOnly": false,
        "highPrecision": false
    }
},
````

#### Depth of Field

> **景深**，用于模拟人眼以及相机的背景模糊效果。

- `focusDistance`：焦点距离，参数范围 `浮点数 0.1 - 无限（取决于当前设备的最大浮点值上限）`


- `aperture`：Aperture（F-stop），摄像机镜头光圈的大小，参数范围 `浮点数 0.1 - 32`


- `focalLength`：Focus Length (mm)，焦距（毫米），参数范围 `整数 1 - 300`


- `useCameraFov`：使用游戏摄像机的视野（FOV），参数 `true` `false`，可根据情况选择是否开启，开启后 `focalLength` 不再生效


- `kernelSize`：参数范围 `整数 0 - 3`，`0-小` `1-中` `2-大` `3-最大`。

````json
"depthOfField": {
    "m_Enabled": false,
    "m_Settings": {
        "focusDistance": 10.0,
        "aperture": 5.599999904632568,
        "focalLength": 50.0,
        "useCameraFov": false,
        "kernelSize": 1
    }
},
````

#### Motion Blur

> **运动模糊**，用于模拟物体在运动过程中产生的模糊效果。

````json
"motionBlur": {
    "m_Enabled": false,
    "m_Settings": {
        "shutterAngle": 270.0,
        "sampleCount": 10,
        "frameBlending": 0.0
    }
},
````

#### Bloom

> **物体外发光效果**，也叫**光溢出**，用于模拟物体在高亮度情况下的发光效果。

````json
"bloom": {
    "m_Enabled": false,
    "m_Settings": {
        "bloom": {
            "intensity": 0.5,
            "threshold": 1.100000023841858,
            "softKnee": 0.5,
            "radius": 4.0,
            "antiFlicker": false
        },
        "lensDirt": {
            "texture": {
                "instanceID": 0
            },
            "intensity": 3.0
        }
    }
},
````

?> bloom过强会导致画面过亮并变糊，不推荐过度使用。

#### Color Grading

> **色彩分级**，用于矫正/调节场景颜色，其中的xyz参数代表了颜色的rgb值，通过调整其中的值（**取值范围0-1**）以达到你想要的色彩。

#### Chromatic Aberration

> 色差，用于模拟相机镜头散射现象，使得物体边缘产生类似彩虹的颜色

#### Vignette

> Vignette 效果可以造成被渲染场景的亮度随距视角中心位置的距离增加而逐渐降低，使屏幕四个角落的亮度变暗。

<blockquote>

## 相关文档
- [自定义后期处理 > V2](/dlce/custom_post_processing_v2.md)
- [自定义后期处理 > V1（旧版）](/dlce/custom_post_processing_legacy.md)
- [游戏设置 > 画质](/dlce/game-settings.md#画质)
- [关卡信息](/dlce/level_information.md)

</blockquote>
