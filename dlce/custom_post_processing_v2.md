**[返回上级](/dlce/custom_post_processing.md)**

# 自定义后期处理 V2

> **兼容性**<br>DLCE v3.5.0 及以上

## 创建文件
- 新建一个文本文件，按照下面的格式[重命名文件](#文件命名)；
- 参考下方的[后处理特效](#后处理特效)说明向文件中加入你想要使用的效果；
- 数值修改完毕后，参考[导入](#导入)说明，将文件重命名并导入至游戏路径中。

## 文件命名
- 文件名格式为 `关卡代号.postprocessing`；
- `关卡代号` 用于指定该配置将会用于哪一个关卡。请将 `关卡代号` 替换为实际的代号。
比如，将 `关卡代号` 替换为 `Taurus`，则游戏会将你的配置文件应用在**金牛座**关卡中。
- 完整的代号清单详见[关卡信息](/dlce/level_information.md)。
- `关卡代号` 必须使用指定的名称，否则不会正常读取。
- 游戏允许同时导入多个配置文件，并自动应用到 `关卡代号` 对应的关卡上。

## 导入
### 路径与文件名
<!-- tabs:start -->

<!-- tab:Windows -->
#### Windows
- 前往游戏安装目录（安装时指定的路径）。
- 后期处理配置文件保存路径为 

```directory
游戏安装目录/Dancing Line_Data/Custom/PostProcessing/关卡代号.postprocessing
```

<!-- tab:iPhone -->
#### iOS - iPhone
- 打开“文件”app，找到“我的 iPhone”
- 后期处理配置文件保存路径为

```directory
跳舞的线/Custom/PostProcessing/关卡代号.postprocessing
```

<!-- tab:iPad -->
#### iOS - iPad
- 打开“文件”app，找到“我的 iPad”
- 后期处理配置文件保存路径为

```directory
跳舞的线/Custom/PostProcessing/关卡代号.postprocessing
```

<!-- tab:M 芯片 Mac -->
#### iOS - M 芯片 Mac
- 打开 Finder 访达，按下 ` ⌘ ⇧ G`，输入下列路径并回车：

```directory
~/Library/Containers
```

- 找到游戏文件夹，进入 `Data/Documents` 文件夹。
- 后期处理配置文件保存路径为

```directory
Custom/PostProcessing/关卡代号.postprocessing
```

<!-- tab:Android -->
#### Android
- 资料暂缺

<!-- tabs:end -->

## 配置文件语法
| 类型                       | 介绍                                                                                                               | 示例                                                                                                |
|-------------------------------|------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `; 文本`                        | 所有以英文分号开头的文本均为注释，仅作为备注用途，存在与否不会影响配置文件。                                                                           | -                                                                                                 |
| `[Section]`                   | 带有方括号的为 分区 标记，用于区分下列配置项归属于哪个特效。对顺序不敏感，打乱每个 Section 的顺序不会影响配置文件。                                                  | `[Ambient Occlusion]`                                                                             |
| `Property=Value`              | 配置项，等号 `=` 左侧为配置项的名称，右侧为配置项的数值。                                                                                  | `Intensity=0.00`                                                                                  |
| Color<br/>`#RRGGBB`           | 16进制颜色（RGB），在配置项的右侧，以井号 `#` 开头，用于需要设置颜色的配置项。                                                                     | `#FF00FF` 表示 R 通道为 255，G 通道为 0， B 通道为 255。                                                        |
| Color<br/>`#RRGGBBAA`         | 16进制颜色（RGBA），在配置项的右侧，以井号 `#` 开头，用于需要设置颜色的配置项。                                                                    | `#FF00FFFF` 表示 R 通道为 255，G 通道为 0，B 通道为 255，Alpha 通道为 1。                                           |
| Color<br/>`#RRGGBB:Intensity` | 16进制 HDR 颜色（RGB），在配置项的右侧，以井号 `#` 开头，用于需要设置 HDR 颜色的配置项。<br/>`Intensity` 为颜色强度，允许负数，使用冒号 `:` 分割16进制 RGB。强度越高，颜色越亮。 | `#FFFFFF:0.0` 表示 R 通道为 255，G 通道为 255，B 通道为 255，Intensity为 0 的正常白色。                                |
| Boolean                       | 布尔值，只有 `true`（开） 和 `false`（关）两种状态，通常用于只有两种状态的配置项，例如开关。                                                           | `Fast Mode=false` 表示关闭 Fast Mode。                                                                 |
| Vector<br/>`x,y`              | 二维向量，使用英文逗号 `,` 间隔每一个维度，用于定义位置或方向。                                                                               | `Center=0.5,0.5` 表示 Center 位置为 (0.5, 0.5)。                                                        |
| Vector<br/>`x,y,z` `r,g,b`    | 三维向量，使用英文逗号 `,` 间隔每一个维度，用于定义位置、方向或 RGB 颜色（对应XYZ）。                                                                | `Red Channel Mixer=100,0,0` 表示 Red Channel Mixer 颜色的 R 值为 100， G 值为0， B值为0。                       |
| Float                         | 浮点数（小数）。                                                                                                         | `11.00`                                                                                           |
| Integer                       | 整数。                                                                                                              | `11`                                                                                              |
| Enumeration                   | “枚举值”，通常用于定义某个属性的模式，可以是数字或对应的英文名称。                                                                               | 以下文 Ambient Occlusion 的 Mode 属性为例，`Mode=0` 或 `Mode=ScalableAmbientObscurance`，这两种写法都表示将 Mode 设为0。 |

## 后处理特效

?> ⚠️注意：大多数情况下，你并不需要开启全部特效，下列每一个特效或配置项都不是必需品。
如果删除整个特效，游戏会彻底关闭此特效。如果删除某个配置项，游戏会自动应用其默认值。
如果不需要修改某个配置项，请将其从配置文件中移除以提升配置文件读取速度。


### Ambient Occlusion

> **环境光遮蔽（AO）**，开启该特效可在物体边缘绘制阴影，增加画面层次感。

?> 环境光遮蔽不应过强，否则会导致画面变黑变脏，影响视觉效果。

```ini
; 下方参数均为默认值，直接套用将不会有任何效果

[Ambient Occlusion]
Mode=ScalableAmbientObscurance
Intensity=0.00
Radius=0.00
Quality=Medium
Thickness Modifier=1
Color=#000000
```
| 配置项                  | 介绍                                                                                                                                                                            | 取值范围                                                                                                                                                   |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Mode`               | The ambient occlusion method to use.<br/>"Multi Scale Volumetric Obscurance" is higher quality and faster on desktop & console platforms but requires compute shader support. | Enumeration<br/>`0`: `ScalableAmbientObscurance`<br/>`1`: `MultiScaleVolumetricObscurance`                                                             |
| `Intensity`          | The degree of darkness added by ambient occlusion. Higher values produce darker areas.                                                                                        | Float<br/>`0.00 ~ 4.00`                                                                                                                                |
| `Radius`             | The radius of sample points. This affects the size of darkened areas.                                                                                                         | Float<br/>`-999.00 ~ 999.00`<br/>*仅在 `Mode` 为 `0` 或 `ScalableAmbientObscurance` 时有效                                                                    |
| `Quality`            | The number of sample points, which affects quality and performance. Lowest, Low and Medium passes are downsampled. High and Ultra are not and should only be used on high-end | Enumeration<br/>`0`: `Lowest`<br/>`1`: `Low`<br/>`2`: `Medium`<br/>`3`: `High`<br/>`4`: `Ultra`<br/>*仅在 `Mode` 为 `0` 或 `ScalableAmbientObscurance` 时有效 |
| `Thickness Modifier` | This modifies the thickness of occluders. It increases the size of dark areas and also introduces a dark halo around objects.                                                 | Float<br/>`1.00 ~ 10.00`<br/>*仅在 `Mode` 为 `1` 或 `MultiScaleVolumetricObscurance` 时有效                                                                   |
| `Color`              | The custom color to use for the ambient occlusion. The default is black.                                                                                                      | Color<br/>`#RRGGBB`                                                                                                                                    |

### Bloom

> **物体外发光效果**，也叫**光溢出**，用于模拟物体在高亮度情况下的发光效果。

?> bloom过强会导致画面过亮变糊，不推荐过度使用。

```ini
; 下方参数均为默认值，直接套用将不会有任何效果

[Bloom]
Intensity=0
Threshold=1
Soft Knee=0.50
Clamp=65472
Diffusion=7
Anamorphic Ratio=0
Color=#FFFFFF:0.0
Fast Mode=false
```
| 配置项                | 介绍                                                                                                                                                                                                                         | 取值范围                          |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|
| `Intensity`        | Strength of the bloom filter. Values higher than 1 will make bloom contribute more energy to the final render.                                                                                                             | Float<br/>`0.00 ~ ∞`          |
| `Threshold`        | Filters out pixels under this level of brightness. Value is in gamma-space.                                                                                                                                                | Float<br/>`0.00 ~ ∞`          |
| `Soft Knee`        | Makes transitions between under/over-threshold gradual. 0 for a hard threshold, 1 for a soft threshold).                                                                                                                   | Float<br/>`0.00 ~ 1.00`       |
| `Clamp`            | Clamps pixels to control the bloom amount. Value is in gamma-space.                                                                                                                                                        | Float<br/>`-∞ ~ ∞`            |
| `Diffusion`        | Changes the extent of veiling effects. For maximum quality, use integer values. Because this value changes the internal iteration count, You should not animating it as it may introduce issues with the perceived radius. | Float<br/>`1.00 ~ 10.00`      |
| `Anamorphic Ratio` | Distorts the bloom to give an anamorphic look. Negative values distort vertically, positive values distort horizontally.                                                                                                   | Float<br/>`-1.00 ~ 1.00`      |
| `Color`            | Global tint of the bloom filter.                                                                                                                                                                                           | Color<br/>`#RRGGBB:Intensity` |
| `Fast Mode`        | Boost performance by lowering the effect quality. This settings is meant to be used on mobile and other low-end platforms but can also provide a nice performance boost on desktops and consoles.                          | Boolean<br/>`true` `false`    |

### Color Grading

> **色彩分级**，用于调节画面颜色。

```ini
; 下方参数均为默认值，直接套用将不会有任何效果

[Color Grading]
Mode=HighDefinitionRange
Tonemapping Mode=None
Temperature=0
Tint=0
Post-exposure (EV)=0
Color Filter=#FFFFFF:0.0
Hue Shift=0
Saturation=0
Contrast=0
Red Channel Mixer=100,0,0
Green Channel Mixer=0,100,0
Blue Channel Mixer=0,0,100
```

| 配置项                   | 介绍                                                                                                                                                                                                                                                                                                 | 取值范围                                                                                                                  |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `Mode`                | Select a color grading mode that fits your dynamic range and workflow. Use HDR if your camera is set to render in HDR and your target platform supports it. Use LDR for low-end mobiles or devices that don't support HDR. Use External if you prefer authoring a Log LUT in an external software. | Enumeration<br/>`0`: `LowDefinitionRange`<br/>`1`: `HighDefinitionRange`<br/>`2`: `External` (Not Support)            |
| `Tonemapping Mode`    | Select a tonemapping algorithm to use at the end of the color grading process.                                                                                                                                                                                                                     | Enumeration<br/>`0`: `None`<br/>`1`: `Neutral`<br/>`2`: `ACES`                                                        |
| `Temperature`         | Sets the white balance to a custom color temperature.                                                                                                                                                                                                                                              | Float<br/>`-100.00 ~ 100.00`                                                                                          |
| `Tint`                | Sets the white balance to compensate for a green or magenta tint.                                                                                                                                                                                                                                  | Float<br/>`-100.00 ~ 100.00`                                                                                          |
| `Post-exposure (EV)`  | Adjusts the overall exposure of the scene in EV units. This is applied after the HDR effect and right before tonemapping so it won't affect previous effects in the chain.                                                                                                                         | Float<br/>` -∞ ~ ∞`                                                                                                   |
| `Color Filter`        | Tint the render by multiplying a color.                                                                                                                                                                                                                                                            | Color<br/>`#RRGGBB:Intensity`                                                                                         |
| `Hue Shift`           | Shift the hue of all colors.                                                                                                                                                                                                                                                                       | Float<br/>`-180.00 ~ 180.00`                                                                                          |
| `Saturation`          | Pushes the intensity of all colors.                                                                                                                                                                                                                                                                | Float<br/>`-100.00 ~ 100.00`                                                                                          |
| `Contrast`            | Expands or shrinks the overall range of tonal values.                                                                                                                                                                                                                                              | Float<br/>`-100.00 ~ 100.00`                                                                                          |
| `Red Channel Mixer`   | Modifies the influence of the RGB channel within the Red Channel Mixer.                                                                                                                                                                                                                            | Vector<br/>`r,g,b`<br/>`r`:`Float -200.00 ~ 200.00`<br/>`g`:`Float -200.00 ~ 200.00`<br/>`b`:`Float -200.00 ~ 200.00` |
| `Green Channel Mixer` | Modifies the influence of the RGB channel within the Green Channel Mixer.                                                                                                                                                                                                                          | Vector<br/>`r,g,b`<br/>`r`:`Float -200.00 ~ 200.00`<br/>`g`:`Float -200.00 ~ 200.00`<br/>`b`:`Float -200.00 ~ 200.00` |
| `Blue Channel Mixer`  | Modifies the influence of the RGB channel within the Blue Channel Mixer.                                                                                                                                                                                                                           | Vector<br/>`r,g,b`<br/>`r`:`Float -200.00 ~ 200.00`<br/>`g`:`Float -200.00 ~ 200.00`<br/>`b`:`Float -200.00 ~ 200.00` |

### Chromatic Aberration

> 色差，模拟相机镜头散射现象，使得物体边缘产生类似彩虹的颜色

```ini
; 下方参数均为默认值，直接套用将会使用默认效果

[Chromatic Aberration]
Intensity=0
Fast Mode=false
```

| 配置项         | 介绍                                                                                                                                                                                                | 取值范围                       |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| `Intensity` | Amount of tangential distortion.                                                                                                                                                                  | Float<br/>`0.00 ~ 1.00`    |
| `Fast Mode` | Boost performance by lowering the effect quality. This settings is meant to be used on mobile and other low-end platforms but can also provide a nice performance boost on desktops and consoles. | Boolean<br/>`true` `false` |

### Depth of Field

> **景深**，模拟人眼的聚焦与模糊效果。

```ini
; 下方参数均为默认值，直接套用将会使用默认效果

[Depth of Field]
Focus Distance=10
Aperture=5.6
Focal Length=50
Max Blur Size=Medium
```
| 配置项              | 介绍                                                                                                                                                                                       | 取值范围                                                                                 |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| `Focus Distance` | Distance to the point of focus.                                                                                                                                                          | Float<br/>`0.10 ~ ∞`                                                                 |
| `Aperture`       | Ratio of aperture (known as f-stop or f-number). The smaller the value is, the shallower the depth of field is.                                                                          | Float<br/>`0.10 ~ 32.00`                                                             |
| `Focal Length`   | Distance between the lens and the film. The larger the value is, the shallower the depth of field is.                                                                                    | Float<br/>`1.00 ~ 300.00`                                                            |
| `Max Blur Size`  | Convolution kernel size of the bokeh filter, which determines the maximum radius of bokeh. It also affects performances (the larger the kernel is, the longer the GPU time is required). | Enumeration<br/>`0`: `Small`<br/>`1`: `Medium`<br/>`2`: `Large`<br/>`3`: `VeryLarge` |

### Grain

> 模拟屏幕信号干扰时的雪花颗粒效果。

```ini
; 下方参数均为默认值，直接套用将会使用默认效果

[Grain]
Colored=true
Intensity=0
Size=1
Luminance Contribution=0.8
```

| 配置项                      | 介绍                                                                                                      | 取值范围                       |
|--------------------------|---------------------------------------------------------------------------------------------------------|----------------------------|
| `Colored`                | Enable the use of colored grain.                                                                        | Boolean<br/>`true` `false` |
| `Intensity`              | Grain strength. Higher values mean more visible grain.                                                  | Float<br/>`0.00 ~ 1.00`    |
| `Size`                   | Grain particle size.                                                                                    | Float<br/>`0.30 ~ 3.00`    |
| `Luminance Contribution` | Controls the noise response curve based on scene luminance. Lower values mean less noise in dark areas. | Float<br/>`0.00 ~ 1.00`    |

### Motion Blur

> **运动模糊**，用于模拟物体在运动过程中产生的模糊效果。

```ini
; 下方参数均为默认值，直接套用将会使用默认效果

[Motion Blur]
Shutter Angle=270
Sample Count=10
```
| 配置项             | 介绍                                                                 | 取值范围                      |
|-----------------|--------------------------------------------------------------------|---------------------------|
| `Shutter Angle` | The angle of rotary shutter. Larger values give longer exposure.   | Float<br/>`0.00 ~ 360.00` |
| `Sample Count`  | The amount of sample points. This affects quality and performance. | Integer<br/>`4 ~ 32`      |

### Vignette

> Vignette 效果可以造成被渲染场景的亮度随距视角中心位置的距离增加而逐渐降低，使屏幕四个角落的亮度变暗。

```ini
; 下方参数均为默认值，直接套用将会使用默认效果

[Vignette]
Color=#000000FF
Center=0.5,0.5
Intensity=0
Smoothness=0.20
Roundness=1
Rounded=false
```

| 配置项          | 介绍                                                                                                                       | 取值范围                                                                                       |
|--------------|--------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `Color`      | Vignette color.                                                                                                          | Color<br/>`#RRGGBBAA`                                                                      |
| `Center`     | Sets the vignette center point (screen center is [0.5, 0.5]).                                                            | Vector<br/>`x,y,z`<br/>`x`:`Float  -∞ ~ ∞`<br/>`y`:`Float  -∞ ~ ∞`<br/>`z`:`Float  -∞ ~ ∞` |
| `Intensity`  | Amount of vignetting on screen.                                                                                          | Float<br/>`0.00 ~ 1.00`                                                                    |
| `Smoothness` | Smoothness of the vignette borders.                                                                                      | Float<br/>`0.01 ~ 1.00`                                                                    |
| `Roundness`  | Lower values will make a square-ish vignette.                                                                            | Float<br/>`0.00 ~ 1.00`                                                                    |
| `Rounded`    | Set to true to mark the vignette to be perfectly round. False will make its shape dependent on the current aspect ratio. | Boolean<br/>`true` `false`                                                                 |

## 完整配置文件

?> 如果你开启了全部特效，那么你的配置文件看起来是这样。但大多数情况下，你并不需要这么多特效。

[Template.postprocessing](../lib/txt/PostProcessingV2Template.md ':include')