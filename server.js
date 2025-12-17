
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TopBot.PwnZ - Low Level Telemetry Server
 * usage: node server.js
 */

const http = require('http');

const PORT = 3001;

// Helper to generate random hex dump
const generateHex = (length) => {
    let result = '';
    const characters = '0123456789ABCDEF';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * 16));
        if (i % 2 === 1) result += ' ';
    }
    return result.trim();
};

const server = http.createServer((req, res) => {
    // Enable CORS for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.url === '/stream') {
        // SSE Setup
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        const sendEvent = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        console.log('Client connected to telemetry stream');

        // Heartbeat / Keep-alive
        const heartbeat = setInterval(() => {
            sendEvent({ type: 'HEARTBEAT', timestamp: Date.now() });
        }, 5000);

        // Simulate Deep Network Traffic
        const traffic = setInterval(() => {
            const protocols = ['TCP', 'UDP', 'TLSv1.3', 'HTTP/2', 'QUIC'];
            const flags = ['SYN', 'ACK', 'FIN', 'RST', 'PSH'];
            
            const packet = {
                type: 'PACKET',
                id: Math.random().toString(36).substr(2, 9),
                protocol: protocols[Math.floor(Math.random() * protocols.length)],
                src: `192.168.1.${Math.floor(Math.random() * 255)}`,
                dest: `10.0.0.${Math.floor(Math.random() * 255)}`,
                port: Math.floor(Math.random() * 65535),
                flags: [flags[Math.floor(Math.random() * flags.length)]],
                size: Math.floor(Math.random() * 1500),
                payload: generateHex(16),
                latency: Math.floor(Math.random() * 100),
                timestamp: Date.now()
            };
            
            sendEvent(packet);
        }, 800); // Burst frequency

        req.on('close', () => {
            clearInterval(heartbeat);
            clearInterval(traffic);
            console.log('Client disconnected');
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`\x1b[32m[TopBot.PwnZ]\x1b[0m Telemetry Server running on port ${PORT}`);
    console.log(`\x1b[36m-> Stream available at http://localhost:${PORT}/stream\x1b[0m`);
});
