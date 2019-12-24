const dgram = require('dgram');

class TelloProcessor {
    initialize () {
        
        this.client = dgram.createSocket('udp4');

        this.send('command');
    }

    send (cmd) {
        const msg = Buffer.from(cmd);
        this.client.send(msg, 0, msg.length, 8889, '192.168.10.1', (err, bytes) => {
            if (err) throw err;
        });
    }
}

export default TelloProcessor;
