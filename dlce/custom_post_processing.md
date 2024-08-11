# 自定义后期处理效果

?> iOS版本的自定义后处理使用方法与PC端有出入，详见下文中的注释

## 要求

* 适用游戏版本：v1.2.9.0 b2 及更高。

* [Post-Processing 版本：V1](#附件下载)

## 作用

用于在对应游戏关卡中使用自定义的**屏幕后期处理效果**。

## 附件下载

?> 在此处下载上文中适用的各种工具

[适用于Unity Editor的Post-Processing V1 包下载](https://github.com/Unity-Technologies/PostProcessing/tree/v1)

<a href="https://raw.githubusercontent.com/DL-Community/DancingLine-CommunityEdition/main/CustomPost-ProcessingTools.zip" target="_blank"> Post模板以及工具包下载 </a>

## 使用方法

### 1. 关于配置文件

后期处理配置文件将会保存在 `Dancing Line/Dancing Line_Data/Custom/PostProcessing/关卡名称.bytes` 中。

其中 `关卡名称` 用于指定该配置将会用于哪一个关卡，比如，将 `关卡名称`替换为 `Taurus` ,则游戏会将你的配置文件应用在**金牛座**关卡中，更多关卡名见[关卡信息](/dlce/level_information.md)。

> `关卡名称` 必须使用指定的名称，否则不会正常读取。

> 第一次使用此功能请手动创建所需的文件夹。

> 游戏支持同时导入多个配置文件，并自动应用到文件夹名称对应的关卡上。

### 2. 生成配置文件

#### 【方法一】手动编辑配置文件
* 在[附件下载区](#附件下载)中可获取配置文件的模板，在其基础上修改数值后并**导入对应的路径中**即可，[配置文件内的各项配置描述在这里](#配置文件项目介绍)。


* 亦可直接使用[`PostProfileV12Json.cs` 工具](#附件下载)自动将profile转换为bytes文件（需搭配Unity Editor使用），生成的文件将会存放到 `Assets/Custom/PostProcessing/关卡名称/postprofile.bytes` 中。

?> 在iOS版本中，后期处理配置文件格式为 `.txt`，并非与PC端一致的 `.bytes` 格式

### 【方法二】使用 `PostProfileV12Json.cs` 工具

> 使用该工具需要Unity编辑器

* 导入 `PostProfileV12Json.cs` 工具到任意一个Unity工程的 `Assets/Editor` 文件夹中；


* 在上方菜单栏中找到 `Tools/PostProfile V1 To Json` 打开工具（如果找不到，请确保已经导入Post-Processing V1包）；


* 将你制作好的配置文件拖入到 `Post Processing Profile` 中；


*  `Level Name` 中填入每个关卡对应的[内部名](/dlce/level_information.md)（例如：Taurus）；


* 点击 **Create** 按纽将会生成Profile Bytes文件，位于 `Assets/Custom/PostProcessing/关卡名` 中

### 3. 导入配置文件到游戏文件中

* Windows

  * 将生成的 **游戏名称.bytes** 配置文件导入至 `Dancing Line/Dancing Line_Data/Custom/PostProcessing` 中并启动游戏即可。

?> 最终路径样例：`Dancing Line/Dancing Line_Data/Custom/PostProcessing/Taurus.bytes`

* iOS

  * 打开系统自带的 `文件` app，在iPhone文件中找到带有DLCE图标的文件夹（如果没有这个app请去AppStore下载）

  * 在其中创建如下路径的文件夹 `Custom/PostProcessing` （如果没有的话）

  * 其余步骤与Windows端一致

  * [详细步骤参考这里](https://www.bilibili.com/read/cv21812269)
  
?> 在iOS版本中，后期处理配置文件格式为 `.txt`，并非与PC端一致的 `.bytes` 格式

## 配置文件项目介绍

- Profile中每一个不同的特效的配置都会使用 {} 进行包括，例如下文中被{}包括的内容则是与antialiasing有关的配置参数

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

## 配置项介绍

### m_Enabled

- `m_Enabled`：每一个特效配置中都有此配置项，用于控制是否开启该特效。`true` 为开启，`false` 为关闭

      "m_Enabled": false,

### m_Settings

- `m_Settings`：每一个特效配置中都有此配置项，用于调整该特效的具体参数（只有 `m_Enabled` 为 `true` 时才会生效）

      "m_Settings": {
         ...
      }

### intensity

- `intensity`：位于 `m_Settings` 中，大部分特效配置都有此配置项，用于调整该特效的强度

      "intensity": 1.0,

### radius

- `radius`：位于 `m_Settings` 中，大部分特效配置都有此配置项，用于调整该特效的影响范围

      "radius": 0.3,

## 特效配置介绍

?> 开启任一特效均会对游戏帧数产生影响，请在开启前考虑设备性能

### Anti-Aliasing

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

````
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


### Ambient Occlusion

> **环境光遮蔽（AO）**，开启该特效可在物体边缘绘制阴影，增加画面层次感。

- `intensity`：强度，参数范围 `浮点数 0 - 4`


- `radius`：范围，参数范围 `浮点数 0 - 无限（取决于当前设备的最大浮点数上限）`


- `sampleCount`：采样级别，参数范围 `整数 0 - 3`，`0-最低` `1-低` `2-中` `3-高`。


- `downsampling`：对物体向下的面进行采样，参数 `true` `false`，可根据情况选择是否开启


- `forceForwardCompatibility`：强制前向兼容性，参数 `true` `false`，可根据情况选择是否开启


- `ambientOnly`：仅前向光，参数 `true` `false`，可根据情况选择是否开启


- `highPrecision`：高精度模式，参数 `true` `false`，可根据情况选择是否开启



?> 环境光遮蔽不应过强，否则会导致画面变黑变脏，影响视觉效果。

````
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

### Depth of Field

> **景深**，用于模拟人眼以及相机的背景模糊效果。

- `focusDistance`：焦点距离，参数范围 `浮点数 0.1 - 无限（取决于当前设备的最大浮点值上限）`


- `aperture`：Aperture（F-stop），摄像机镜头光圈的大小，参数范围 `浮点数 0.1 - 32`


- `focalLength`：Focus Length (mm)，焦距（毫米），参数范围 `整数 1 - 300`


- `useCameraFov`：使用游戏摄像机的视野（FOV），参数 `true` `false`，可根据情况选择是否开启，开启后 `focalLength` 不再生效


- `kernelSize`：参数范围 `整数 0 - 3`，`0-小` `1-中` `2-大` `3-最大`。

````
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

### Motion Blur

> **运动模糊**，用于模拟物体在运动过程中产生的模糊效果。

````
"motionBlur": {
    "m_Enabled": false,
    "m_Settings": {
        "shutterAngle": 270.0,
        "sampleCount": 10,
        "frameBlending": 0.0
    }
},
````

### Bloom

> **物体外发光效果**，也叫**光溢出**，用于模拟物体在高亮度情况下的发光效果。

````
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

### Color Grading

> **色彩分级**，用于矫正/调节场景颜色，其中的xyz参数代表了颜色的rgb值，通过调整其中的值（**取值范围0-1**）以达到你想要的色彩。

### Chromatic Aberration

> 色差，用于模拟相机镜头散射现象，使得物体边缘产生类似彩虹的颜色

### Vignette

> Vignette 效果可以造成被渲染场景的亮度随距视角中心位置的距离增加而逐渐降低，使屏幕四个角落的亮度变暗。