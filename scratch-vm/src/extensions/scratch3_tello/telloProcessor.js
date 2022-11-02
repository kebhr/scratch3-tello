const dgram = require('dgram');

class TelloProcessor {
    initialize () {
        this.queue = []; // command queue

        this.client = dgram.createSocket('udp4');
        this.server = dgram.createSocket('udp4');

        this.client.bind({
            address: '0.0.0.0',
            port: 40001,
            exclusive: true
        });

        this.flying = false;
        this.send('command');

        this.client.on('message', (message, remote) => {
            const readableMessage = message.toString();
            
            // Previous command executed
            if (readableMessage === 'ok') {
                this.executing = false;

                if (this.executingCommand === 'takeoff') this.flying = true;
                if (this.executingCommand === 'land') this.flying = false;

                // Dequeue
                this.queue.shift();

                // Send next element
                this.inquire();
            } else if (readableMessage.includes('error')) {
                this.executing = false;
                this.flying = false;

                // Dequeue
                this.queue.shift();

                // Send next element
                this.inquire();
            }
        });

        // Tello State
        this.server.on('message', (message, remote) => {
            // remote: { address: '192.168.10.1', family: 'IPv4', port: 8889, size: 127 }
            // message: <Buffer 70 69 74 63 68 ... >
            const readableMessage = message.toString();
            this.data = {};
            for (const e of readableMessage.slice(0, -1).split(';')) {
                this.data[e.split(':')[0]] = e.split(':')[1];
            }
        });

        this.server.bind(8890, '0.0.0.0');
    }
    

    request (cmd) {
        // Enqueue
        this.queue.push(cmd);

        this.inquire();
    }

    state () {
        return this.data;
    }

    // If executing command is nothing and waiting queue has some element, send first command to Tello
    inquire () {
        if (!this.executing && this.queue.length > 0) {
            this.send(this.queue[0]);
        }
    }

    send (cmd) {
        const msg = Buffer.from(cmd);
        // While grounding, `command`, `mon`, `mdirection 2` and `takeoff` are only executable
        if (!this.flying && cmd !== 'command' && cmd !== 'mon' && cmd !== 'mdirection 2' && cmd !== 'takeoff') {
            this.queue.shift();
            return;
        }
        this.executing = true;
        this.executingCommand = cmd;
        this.client.send(msg, 0, msg.length, 8889, '192.168.10.1', (err, bytes) => {
            if (err) throw err;
        });
    }

    resetQueue () {
        this.queue = [];
        this.flying = false;
        this.executing = false;
    }
}

module.exports = TelloProcessor;
