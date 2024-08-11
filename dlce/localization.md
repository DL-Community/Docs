# 多语言系统

## 语言
| 语言               | 介绍                                      | 本地化人员            |
|------------------|-----------------------------------------|------------------|
| **中文（简体）**       | 中国大陆简体字，使用大陆词汇、字形                       | 枫炎               |
| **中文（繁體）**       | 中國大陸繁體字，使用大陸詞匯、字形                       | 楓炎               |
| **中文（臺灣）**       | 中國臺灣正體，使用臺灣詞彙、字形                        | 楓炎、Zutek         |
| **中文（香港）**       | 中國香港繁體，使用香港白話詞彙、字形                      | GP0108           |
| **English (US)** | 美式英语，使用美式英语词汇                           | 枫炎               |
| **English (UK)** | 英式英语，使用英式英语词汇                           | Nix（ShadowStar）  |
| **Polski**       | 波兰语                                     | 匿名               |
| **日本語**          | 日语                                      | 枫炎               |
| **Македонски**   | 马其顿语                                    | Kli              |
| **Français**     | 法语                                      | Nouche           |
| **Tiếng Việt**   | 越南语                                     | Bell             |
| **Українська**   | 乌克兰语                                    | FANGO            |
| **Русский**      | 俄罗斯语                                    | ghost            |
| **Íslenska**     | 冰岛语                                     | Brynjar          |
| **Türkçe**       | 土耳其语                                    | Calypso          |
| **Српски**       | 塞尔维亚语                                   | Njider           |
| **文言（華夏）**       | 文言文，大量使用文言词汇。</br>整活性质，非正式游戏语言          | 枫炎、LiGaYB、HatCat |
| **中文（草体）**       | 草体中文，意在模仿生硬英文机翻后的简体中文。</br>整活性质，非正式游戏语言 | 翻译器              |


## 字体系统

> 游戏会根据当前使用的语言自动调用对应的汉字字形（见下表），具体字形取决于你的游戏版本、系统、语言。

?> 请注意，**_游戏本身并不会内置下列大部分字体_**，而是**根据不同游戏语言**，**按照从上到下的顺序作为优先级从系统中调用字体**。
</br>即如果系统中不包含首个字体，则会调用下一个字体，以此类推。如果系统中不包含表中的所有字体，则使用[候补字体](#候补字体)。

### 字体调用优先级

> 从上到下，以最新版本游戏为准

#### 中文（简体）、中文（繁體）、草体中文
- PingFang SC
- Microsoft YaHei UI
- Noto Sans SC
- Noto Sans CJK SC

#### 中文（臺灣）
- PingFang TC
- Microsoft JhengHei UI
- Noto Sans TC
- Noto Sans CJK TC

#### 中文（香港）
- PingFang HK
- Microsoft JhengHei UI
- Noto Sans HK
- Noto Sans CJK HK

#### 文言（華夏）
- [DL社區版明朝體](#DL社區版明朝體)
- MS Mincho
- MingLiU
- NSimSun
- Songti SC
- STSongti SC
- STSongti
- Noto Serif CJK
- Source Han Serif CN

#### 日语
- Hiragino Kaku Gothic ProN
- Hiragino Sans ProN
- Meiryo UI
- Noto Sans JP
- Noto Sans CJK JP

#### 其他语言
- [候补字体](#候补字体)

### DL社區版明朝體

> 我们针对 **文言** 设计了专用的 **明朝体（旧字形宋体）** 字体。

- 该字体基于 [1.Ming](https://github.com/ichitenfont/I.Ming) 修改而来，大部分字形一致，少部分字形经过修改调整
- 该字体**内置于**DL社区版游戏中
- 该字体**不包含完整的字库**，无法用作**DL社区版游戏字体以外**的用途。

<a href="https://github.com/Aaron8052/Aaron8052/raw/main/files/DLCE-MingChao.ttf" target="_blank"> DL社區版明朝體下载 </a>

### 候补字体

?> 取决于当前系统所使用的字体，通常会根据系统版本以及语言有所不同。