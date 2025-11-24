import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Function to broadcast data to all connected clients
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Example of broadcasting sensor data
setInterval(() => {
    const sensorData = {
        temperature: Math.random() * 30,
        humidity: Math.random() * 100,
        light: Math.random() * 1000,
        wind: Math.random() * 20,
        rain: Math.random() * 10,
    };
    broadcast(sensorData);
}, 5000); // Broadcast every 5 seconds