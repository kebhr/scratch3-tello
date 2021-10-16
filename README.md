# scratch3-tello
Scratch 3.0 for Tello.

For more information such as how to download, how to build: [scratch3-tello.app](https://scratch3-tello.app/)  
Currently I provide more information by English and Japanese only.

![image](https://user-images.githubusercontent.com/42484226/74595154-93dda080-5081-11ea-8ef0-59eec11274d3.png)

This repository is under development.

## Release
You can download the binary [here](https://github.com/kebhr/scratch3-tello/releases).  

### Instruction
1. Download the binary.
2. Connect to Tello wifi.
3. Start the app.
4. Activate Tello extension.

**NOTE:**
- If you are having trouble connecting to Tello, close the app, restart Tello and start the app again.  
- Connect to Tello before launching the app. If you connect to Tello after the app is launched, the extension will **not** be able to send commands to Tello.

## Supported languages
- English
- 日本語
- にほんご
- Ру́сский (Thanks to [@cirodil](https://github.com/cirodil))

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
$ npm run build-gui
$ npm start
```

If you fail to load Tello extension, please run `relink.sh`.
