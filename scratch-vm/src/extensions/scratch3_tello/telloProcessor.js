const dgram = require('dgram');

class TelloProcessor {
    initialize () {
        this.queue = []; // command queue
        this.timer = null;

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
            const readableMessage = message.toString().trim();
            
            // Clear timeout since we got a response
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            // Mark as not executing so we can send the next command
            this.executing = false;

            // Update flying state based on successful commands
            if (readableMessage === 'ok') {
                if (this.executingCommand === 'takeoff') this.flying = true;
                if (this.executingCommand === 'land') this.flying = false;
            } 
            // Note: We do NOT set flying=false on error, because a failed 'flip' 
            // shouldn't prevent us from sending 'land' later.

            // Dequeue and proceed
            this.queue.shift();
            this.inquire();
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
            // If we are on the ground and try to fly/flip, skip it silently or log warning
            // But we must dequeue it to prevent blocking
            this.queue.shift();
            this.inquire();
            return;
        }
        
        this.executing = true;
        this.executingCommand = cmd;

        // Set watchdog timer
        this.timer = setTimeout(() => {
            // console.warn(`[Tello] Timeout waiting for '${cmd}'. Skipping.`);
            this.executing = false;
            this.queue.shift();
            this.inquire();
        }, 3000);

        this.client.send(msg, 0, msg.length, 8889, '192.168.10.1', (err, bytes) => {
            if (err) {
                // console.error(`[Tello] Send error: ${err}`);
                // Don't crash, just try to recover
                clearTimeout(this.timer);
                this.executing = false;
                this.queue.shift();
                this.inquire();
            }
        });
    }

    resetQueue () {
        this.queue = [];
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        // We generally don't want to reset 'flying' state here blindly 
        // because the drone might still be in the air.
        // But for safety/reset purposes as originally intended:
        this.flying = false; 
        this.executing = false;
    }
}

module.exports = TelloProcessor;
