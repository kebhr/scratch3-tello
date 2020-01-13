# scratch3-tello
Scratch 3.0 for Tello.

This repository is under development.

# Build
```bash
git clone --depth 1 https://github.com/LLK/scratch-vm.git
git clone --depth 1 --branch scratch-desktop https://github.com/LLK/scratch-gui.git
git clone --depth 1 https://github.com/LLK/scratch-desktop.git

cd scratch-vm
npm install
npm link

cd ../scratch-gui
npm install
npm link scratch-vm
npm link

cd ../scratch-desktop
npm install
npm link scratch-gui
cd node_modules/scratch-gui
npm link scratch-vm
```

# Run
```bash
cd scratch-desktop
npm start
```
