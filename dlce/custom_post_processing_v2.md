# 自定义后期处理效果（V2）

> 适用于：Windows、iOS、Android（教程暂缺）

## 作用

- 用于在对应游戏关卡中使用自定义的**屏幕后期处理效果**。

## 制作配置文件
- [加入QQ群](https://qm.qq.com/q/wlrTgLHAHI)在群文件中寻找自定义后处理的配置文件模板；
- 在其基础上修改数值后并**导入对应的路径中**即可；
- [配置文件内的各项配置描述在这里](#配置文件介绍)；
- 配置完毕后，继续阅读下文将文件重命名并导入至游戏。

## 导入配置文件
### Windows 路径
- 前往游戏安装目录（安装时指定的路径）。
- 后期处理配置文件保存在 `Dancing Line/Dancing Line_Data/Custom/PostProcessing/关卡代号.postprocessing` 中。

### iOS 路径
- 打开“文件”app，找到“我的iPhone（iPad）”
- 后期处理配置文件保存在 `跳舞的线/Custom/PostProcessing/关卡代号.postprocessing` 中。

### M 芯片 Mac 路径（iOS 版本）
- 打开 Finder 访达，按下 `Command + Shift + G`，输入下列路径并回车：
````
~/Library/Containers
````
- 找到游戏文件夹，进入 `Data/Documents` 文件夹。
- 后期处理配置文件保存在 `Custom/PostProcessing/关卡代号.postprocessing` 中。

### 注意事项

- 其中 `关卡代号` 用于指定该配置将会用于哪一个关卡。比如，将 `关卡代号` 替换为 `Taurus`，则游戏会将你的配置文件应用在**金牛座**关卡中。
- 更多 `关卡代号` 见[关卡信息](/dlce/level_information.md)。
- `关卡代号` 必须使用指定的名称，否则不会正常读取。
- 游戏允许同时导入多个配置文件，并自动应用到 `关卡代号` 对应的关卡上。

## 配置文件介绍

### 语法
| 语法                  | 介绍                                                                                                                         | 示例                                                                         |
|---------------------|----------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| `; 文本`              | 所有以英文分号开头的文本均为注释，仅作为备注用途，存在与否不会影响配置文件。                                                                                     | -                                                                          |
| `[Section]`         | 带有方括号的为 Section 标记，用于区分下列配置项归属于哪个效果。对顺序不敏感，打乱每个 Section 的顺序不会影响配置文件。                                                       | `[Ambient Occlusion]`                                                      |
| `Property=Value`    | 配置项，左侧为配置项的名称，右侧为配置项的数值，使用等号 `=` 间隔。                                                                                       | `Intensity=0.00`                                                           |
| `#RRGGBB`           | 16进制颜色（RGB），在配置项的右侧，以井号 `#` 开头，用于需要设置颜色的配置项。                                                                               | `#FF00FF` 表示 R 通道为 255，G 通道为 0， B 通道为 255                                  |
| `#RRGGBBAA`         | 16进制颜色（RGBA），在配置项的右侧，以井号 `#` 开头，用于需要设置颜色的配置项。                                                                              | `#FF00FFFF` 表示 R 通道为 255，G 通道为 0，B 通道为 255，Alpha 通道为 1                     |
| `#RRGGBB:Intensity` | 16进制 HDR 颜色（RGB），在配置项的右侧，以井号 `#` 开头，用于需要设置 HDR 颜色的配置项。<br/>`Intensity` 为 RGB 通道的颜色强度，允许负数，使用冒号 `:` 与16进制 RGB 间隔。强度越高，颜色越亮。 | `#FFFFFF:0.0` 表示 R 通道为 255，G 通道为 255，B 通道为 255，Intensity为 0 的正常白色。         |
| `Boolean`           | 布尔值，只有 `true`（开） 和 `false`（关）两种状态，通常用于只有两种状态的配置项，例如开关。                                                                     | `Fast Mode=false` 表示关闭 Fast Mode                                           |
| `x,y`               | 二维向量，使用英文逗号 `,` 间隔每一个维度，用于定义位置或方向。                                                                                         | `Center=0.5,0.5` 表示 Center 位置为 (0.5, 0.5)                                  |
| `x,y,z`             | 三维向量，使用英文逗号 `,` 间隔每一个维度，用于定义位置、方向或 RGB 颜色（对应XYZ）。                                                                          | `Red Channel Mixer=100,0,0` 表示 Red Channel Mixer 颜色的 R 值为 100， G 值为0， B值为0 |
| `Float`             | 浮点数（小数）                                                                                                                    | `11.00`                                                                    |
| `Integer`           | 整数                                                                                                                         | `11`                                                                       |

### 备注
- 下列每一个 Section 或配置项都不是必需品，如果删除整个 Section 或某个配置项，游戏会自动应用默认值
- 如果不需要修改某个配置项，请将其从配置文件中移除以提升游戏读取速度。

### Ambient Occlusion

> **环境光遮蔽（AO）**，开启该特效可在物体边缘绘制阴影，增加画面层次感。

?> 环境光遮蔽不应过强，否则会导致画面变黑变脏，影响视觉效果。

```ini
; 这些是每一个配置项的默认值

[Ambient Occlusion]
Mode=0
Intensity=0.00
Radius=0.00
Quality=2
Thickness Modifier=1
Color=#000000
```
| 配置项                  | 介绍                                                                                                                                                                            | 取值范围                                                                                           |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| `Mode`               | The ambient occlusion method to use.<br/>"Multi Scale Volumetric Obscurance" is higher quality and faster on desktop & console platforms but requires compute shader support. | `0`: Scalable Ambient Obscurance<br/>`1`: Multi Scale Volumetric Obscurance                    |
| `Intensity`          | The degree of darkness added by ambient occlusion. Higher values produce darker areas.                                                                                        | `Float 0.00 ~ 4.00`                                                                            |
| `Radius`             | The radius of sample points. This affects the size of darkened areas.                                                                                                         | `Float -999.00 ~ 999.00`<br/>*仅在 `Mode` 为 `0` 时有效                                              |
| `Quality`            | The number of sample points, which affects quality and performance. Lowest, Low and Medium passes are downsampled. High and Ultra are not and should only be used on high-end | `0`: Lowest<br/>`1`: Low<br/>`2`: Medium<br/>`3`: High<br/>`4`: Ultra<br/>*仅在 `Mode` 为 `0` 时有效 |
| `Thickness Modifier` | This modifies the thickness of occluders. It increases the size of dark areas and also introduces a dark halo around objects.                                                 | `Float 1.00 ~ 10.00`<br/>*仅在 `Mode` 为 `1` 时有效                                                  |
| `Color`              | The custom color to use for the ambient occlusion. The default is black.                                                                                                      | `#RRGGBB`                                                                                      |

### Bloom

> **物体外发光效果**，也叫**光溢出**，用于模拟物体在高亮度情况下的发光效果。

?> bloom过强会导致画面过亮变糊，不推荐过度使用。

```ini
; 这些是每一个配置项的默认值

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
| 配置项                | 介绍                                                                                                                                                                                                                         | 取值范围                 |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| `Intensity`        | Strength of the bloom filter. Values higher than 1 will make bloom contribute more energy to the final render.                                                                                                             | `Float 0.00 ~ ∞`     |
| `Threshold`        | Filters out pixels under this level of brightness. Value is in gamma-space.                                                                                                                                                | `Float 0.00 ~ ∞`     |
| `Soft Knee`        | Makes transitions between under/over-threshold gradual. 0 for a hard threshold, 1 for a soft threshold).                                                                                                                   | `Float 0.00 ~ 1.00`  |
| `Clamp`            | Clamps pixels to control the bloom amount. Value is in gamma-space.                                                                                                                                                        | `Float  -∞ ~ ∞`      |
| `Diffusion`        | Changes the extent of veiling effects. For maximum quality, use integer values. Because this value changes the internal iteration count, You should not animating it as it may introduce issues with the perceived radius. | `Float 1.00 ~ 10.00` |
| `Anamorphic Ratio` | Distorts the bloom to give an anamorphic look. Negative values distort vertically, positive values distort horizontally.                                                                                                   | `Float -1.00 ~ 1.00` |
| `Color`            | Global tint of the bloom filter.                                                                                                                                                                                           | `#RRGGBB:Intensity`  |
| `Fast Mode`        | Boost performance by lowering the effect quality. This settings is meant to be used on mobile and other low-end platforms but can also provide a nice performance boost on desktops and consoles.                          | `true` `false`       |

### Color Grading

> **色彩分级**，用于矫正/调节场景颜色，其中的xyz参数代表了颜色的rgb值，通过调整其中的值（**取值范围0-1**）以达到你想要的色彩。

```ini
; 这些是每一个配置项的默认值

[Color Grading]
Mode=1
Tonemapping Mode=0
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

### Chromatic Aberration

> 色差，用于模拟相机镜头散射现象，使得物体边缘产生类似彩虹的颜色

```ini
; 这些是每一个配置项的默认值

[Chromatic Aberration]
Intensity=0
Fast Mode=false
```

### Depth of Field

> **景深**，用于模拟人眼以及相机的背景模糊效果。

```ini
; 这些是每一个配置项的默认值

[Depth of Field]
Focus Distance=10
Aperture=5.6
Focal Length=50
Max Blur Size=1
```
| 配置项              | 介绍                                                                                                                                                                                       | 取值范围                                                         |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| `Focus Distance` | Distance to the point of focus.                                                                                                                                                          | `Float 0.10 ~ ∞`                                             |
| `Aperture`       | Ratio of aperture (known as f-stop or f-number). The smaller the value is, the shallower the depth of field is.                                                                          | `Float 0.10 ~ 32.00`                                         |
| `Focal Length`   | Distance between the lens and the film. The larger the value is, the shallower the depth of field is.                                                                                    | `Float 1.00 ~ 300.00`                                        |
| `Max Blur Size`  | Convolution kernel size of the bokeh filter, which determines the maximum radius of bokeh. It also affects performances (the larger the kernel is, the longer the GPU time is required). | `0`: Small<br/>`1`: Medium<br/>`2`: Large<br/>`3`: VeryLarge |

### Grain

> 模拟屏幕信号干扰时的雪花颗粒效果。

```ini
; 这些是每一个配置项的默认值

[Grain]
Colored=true
Intensity=0
Size=1
Luminance Contribution=0.8
```

### Motion Blur

> **运动模糊**，用于模拟物体在运动过程中产生的模糊效果。

```ini
; 这些是每一个配置项的默认值

[Motion Blur]
Shutter Angle=270
Sample Count=10
```
| 配置项             | 介绍                                                                 | 取值范围                  |
|-----------------|--------------------------------------------------------------------|-----------------------|
| `Shutter Angle` | The angle of rotary shutter. Larger values give longer exposure.   | `Float 0.00 ~ 360.00` |
| `Sample Count`  | The amount of sample points. This affects quality and performance. | `Integer 4 ~ 32`      |

### Vignette

> Vignette 效果可以造成被渲染场景的亮度随距视角中心位置的距离增加而逐渐降低，使屏幕四个角落的亮度变暗。

```ini
; 这些是每一个配置项的默认值

[Vignette]
Color=#000000FF
Center=0.5,0.5
Intensity=0
Smoothness=0.20
Roundness=1
Rounded=false
```

## 完整配置文件及其默认值
```ini
; DLCE 自定义 Post Processing 配置文件
; 每行以分号 “;” 开始的为备注，不会影响实际配置
; 每个配置项使用等号 “=” 分割名称与数值
; 配置项下方通常包含对应的备注，注明其作用或取值范围等
; 将配置项删除后游戏会使用默认值（或不使用此项）。也可以在配置项前面加上分号，将其变为备注，同样可以达到删除的效果
    
[Ambient Occlusion]
Mode=0
Intensity=0.00
Radius=0.00
Quality=2
Thickness Modifier=1
Color=#000000
    
[Bloom]
Intensity=0
Threshold=1
Soft Knee=0.50
Clamp=65472
Diffusion=7
Anamorphic Ratio=0
Color=#FFFFFF:0.0
Fast Mode=false
    
[Color Grading]
Mode=1
Tonemapping Mode=0
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
    
[Chromatic Aberration]
Intensity=0
Fast Mode=false
    
[Depth of Field]
Focus Distance=10
Aperture=5.6
Focal Length=50
Max Blur Size=1
    
[Grain]
Colored=true
Intensity=0
Size=1
Luminance Contribution=0.8

[Motion Blur]
Shutter Angle=270
Sample Count=10
    
[Vignette]
Color=#000000FF
Center=0.5,0.5
Intensity=0
Smoothness=0.20
Roundness=1
Rounded=false
```