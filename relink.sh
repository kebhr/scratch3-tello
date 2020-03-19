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