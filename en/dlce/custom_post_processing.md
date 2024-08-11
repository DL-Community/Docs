# Custom Post-Processing

?> The usage of customizable post-processing on the iOS version may differ from the PC version. Please refer to the notes in the following section for more information.

## Requirements

* Game version: v1.2.9.0 b2 or higher

* [PostProcessing version: V1](#downloads)

## Purpose

Apply custom **screen post-processing effects** to the corresponding levels of the game.

## Usage

### File Save Path

The file for adjusting post-processing settings will be saved in  `Dancing Line/Dancing Line_Data/Custom/PostProcessing/LevelCodename/postprofile.bytes`.

Replace `LevelCodename` with the name of the level where the profile will be used. For example, replace it with `Taurus` , to apply your profile to the level of **The Taurus**, [more level codenames see bottom](#codenames-of-the-levels).

> `LevelCodename` must use the specified codenames, otherwise it will not be read correctly.

> Please create the required folders manually for the first use of this feature.

> The game supports importing multiple Profile files at the same time, and applies them automatically to the corresponding level folder.

### Generate Profile Bytes file

* In the [downloads](#downloads) below, you can get the template file of the profile, modify the values on this basis, and **import it into the corresponding path**. 


* You can also use the [provided `PostProfileV12Json.cs` tool](#downloads) to automatically convert the profile to bytes file (requires Unity Editor), and the generated file will be stored in `Assets/Custom/PostProcessing/LevelName/postprofile.bytes`.

?> In the iOS version, the file format of postprofile is `.txt`, not `.bytes` format consistent with the PC side.

### How to use the PostProfileV12Json tool

* Import the `PostProfileV12Json.cs` tool into the `Assets/Editor` folder of any Unity project;


* Find the `Tools/PostProfile V1 To Json` in the top menu bar to open the tool (if you cannot find it, please make sure that the Post-Processing V1 package has been imported);


* Drag your made Post Profile into `Post Processing Profile`;


* Fill in the corresponding Level Codename (such as: Taurus) in `Level Name`;


* Click the **Create** button to generate the Profile Bytes file, which will be located in `Assets/Custom/PostProcessing/LevelCodename`.


### Import Profile Bytes file into game files

* Windows

  * Import the generated `postprofile.bytes` file into `Dancing Line/Dancing Line_Data/Custom/PostProcessing/LevelCodename/` and start the game.

?> The final path should looks like: `Dancing Line/Dancing Line_Data/Custom/PostProcessing/Taurus/postprofile.bytes`

* iOS

  * Open the `Files` app and locate the folder with the DLCE icon in the iPhone files.

  * Create a folder with the following path: `Custom/PostProcessing`.

  * Follow the same steps as on the Windows platform.

  * [For detailed instructions, please refer to this link](https://www.bilibili.com/read/cv21812269).


## Codenames of the levels

See [Level Information](/en/dlce/level_information.md)

## Downloads

[Post-Processing V1 Package for Unity Editor](https://github.com/Unity-Technologies/PostProcessing/tree/v1)

<a href="https://raw.githubusercontent.com/DL-Community/DancingLine-CommunityEdition/main/CustomPost-ProcessingTools.zip" target="_blank"> Post Template & Tools </a>