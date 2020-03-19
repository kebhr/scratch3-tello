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

    async state () {
        ipcRenderer.send('state');

        const response = await this.statePromise();
        return response;
    }

    statePromise () {
        return new Promise(resolve => {
            ipcRenderer.once('state-reply', (ev, arg) => {
                resolve(arg);
            });
        });
    }
}
