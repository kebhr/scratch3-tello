import {ipcRenderer} from 'electron';

const dgram = require('dgram');

export class TelloProcessor {
    constructor () {
        this.server = dgram.createSocket('udp4');
        this.client = dgram.createSocket('udp4');
    }

    send (cmd) {
        const message = Buffer.from(cmd);
        this.client.send(message, 0, message.length, 8889, '192.168.10.1', (err, bytes) => {
            if (err) {
                console.error('Error', err);
                throw err;
            }
        });
    }

    log () {
        alert('log');
    }

    takeoff () {

    }
}
