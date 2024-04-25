<div align="center">
  <img src="https://user-images.githubusercontent.com/42484226/180014410-6c3868e4-f8ee-44a8-9a87-b89490061e03.png" alt="scratch3-tello Let's fly Tello with Scratch 3.0!" />
</div>
<div align="center">
  <a href="https://scratch3-tello.app/"><img src="https://user-images.githubusercontent.com/42484226/180016745-629f04e3-e7d5-40f3-bfd6-bf2f594ecdf3.png" alt="for more information: click this image" /></a>
</div>

<img width="1238" alt="screenshot of scratch3-tello" src="https://user-images.githubusercontent.com/42484226/199463133-0e678fb1-f309-4dd6-936f-633d8105fd0d.png">

![GitHub all releases](https://img.shields.io/github/downloads/kebhr/scratch3-tello/total?style=for-the-badge)

## Release
You can download the binary from [here](https://github.com/kebhr/scratch3-tello/releases).  

I am seeking sponsors on [Patreon](https://www.patreon.com/scratch3_tello) to continue the development of Scratch3-Tello.

### Instruction
1. Download the binary.
2. Connect to Tello's wifi.
3. Start the app.
4. Activate Tello extension.

**NOTE:**
- If you are having trouble connecting to Tello, close the app, restart Tello and start the app again.  
- Connect to Tello before launching the app. If you connect to Tello after the app is launched, the extension will **not** be able to send commands to Tello.
- If the drone does not take off after sending the `takeoff` command, use the `clear command queue` block.

## Supported languages
- English
- 日本語
- にほんご
- Ру́сский (Thanks to [@cirodil](https://github.com/cirodil))
- Français (Thanks to Ryan Perry)
- Deutsch (Thanks to [@DiWoWet](https://github.com/DiWoWet))
- Български (Thanks to [@aladzhov](https://github.com/aladzhov))
- 繁體中文 (Thanks to James Huang)
- Українська (Thanks to [@MaxVolobuev](https://github.com/MaxVolobuev))

Feel free to create a pull request for adding more languages!

## How to build
```bash
$ mkdir scratch3-tello
$ cd scratch3-tello
$ wget https://raw.githubusercontent.com/kebhr/scratch3-tello/master/build.sh
$ chmod +x build.sh
$ ./build.sh
```

## How to run
```bash
$ cd scratch-desktop
$ npm start
```

If you fail to load Tello extension, please run `relink.sh`.
