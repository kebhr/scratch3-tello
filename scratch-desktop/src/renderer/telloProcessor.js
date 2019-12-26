import {ipcRenderer} from 'electron';


export class TelloProcessor {
    constructor () {
        ipcRenderer.send('tello-initialize');
    }

    connect () {
        this.send('connect');
    }

    send (cmd) {
        ipcRenderer.send('send', cmd);
    }
}
