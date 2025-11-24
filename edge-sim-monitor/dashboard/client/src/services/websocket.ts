import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Adjust the URL as needed

export const subscribeToSensorData = (callback: (data: any) => void) => {
    socket.on('sensorData', (data) => {
        callback(data);
    });
};

export const unsubscribeFromSensorData = () => {
    socket.off('sensorData');
};