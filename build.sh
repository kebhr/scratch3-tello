#!/bin/bash
set -eu

git clone --filter=blob:none https://github.com/scratchfoundation/scratch-vm.git -b 0.2.0-prerelease.20220222132735
git clone --filter=blob:none https://github.com/scratchfoundation/scratch-gui.git -b scratch-desktop-v3.29.0
git clone --filter=blob:none https://github.com/scratchfoundation/scratch-desktop.git -b v3.29.1

cd scratch-vm
npm install
npm link
cd ..

cd scratch-gui
npm install
npm link scratch-vm
npm link
cd ..

cd scratch-desktop
npm install
cd node_modules
rm -rf scratch-gui
ln -s ../../scratch-gui scratch-gui
cd ../../

git clone https://github.com/kebhr/scratch3-tello
cp -r scratch3-tello/. ./
rm -rf scratch3-tello/
