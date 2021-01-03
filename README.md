# scratch3-tello
Scratch 3.0 for Tello.
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

## Build
```bash
$ mkdir scratch3-tello
$ cd scratch3-tello
$ wget https://raw.githubusercontent.com/kebhr/scratch3-tello/master/build.sh
$ chmod +x build.sh
$ ./build.sh
```

## Run
```bash
$ cd scratch-desktop
$ npm run build-gui
$ npm start
```

If you fail to load Tello extension, please run `relink.sh`.
