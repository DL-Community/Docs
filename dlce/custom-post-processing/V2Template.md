```ini
; DLCE 自定义 Post Processing 配置文件
; 下方参数均为默认值，直接套用将不会有任何效果

[Ambient Occlusion]
Mode=ScalableAmbientObscurance
Intensity=0.00
Radius=0.00
Quality=Medium
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

[Chromatic Aberration]
Intensity=0
Fast Mode=false

[Depth of Field]
Focus Distance=10
Aperture=5.6
Focal Length=50
Max Blur Size=Medium

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