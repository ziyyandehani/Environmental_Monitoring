import { WebSocket } from 'ws';

const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
    console.log('Connected to the WebSocket server');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received data:', data);
    // Handle the incoming data (e.g., update state in React components)
};

socket.onclose = () => {
    console.log('Disconnected from the WebSocket server');
};

export const sendMessage = (message) => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not open. Unable to send message.');
    }
};