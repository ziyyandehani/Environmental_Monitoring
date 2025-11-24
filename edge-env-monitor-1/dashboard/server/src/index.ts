import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupWebSocket } from './websocket';

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

setupWebSocket(io);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});