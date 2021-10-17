git clone --depth 1 https://github.com/LLK/scratch-vm.git
git clone --depth 1 --branch scratch-desktop-v3.10.2 https://github.com/LLK/scratch-gui.git
git clone --depth 1 --branch v3.10.4 https://github.com/LLK/scratch-desktop.git
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
cd ../../../
git clone https://github.com/kebhr/scratch3-tello
cp -r scratch3-tello/. ./
rm -rf scratch3-tello/
