import { SensorData } from './types';
import { processSensorData } from './mqtt-subscriber';

export function processIncomingData(data: SensorData) {
    // Process temperature data
    if (data.type === 'temperature') {
        console.log(`Processing temperature data: ${data.value}°C`);
        // Additional processing logic for temperature
    }

    // Process humidity data
    else if (data.type === 'humidity') {
        console.log(`Processing humidity data: ${data.value}%`);
        // Additional processing logic for humidity
    }

    // Process light intensity data
    else if (data.type === 'light') {
        console.log(`Processing light intensity data: ${data.value} lux`);
        // Additional processing logic for light intensity
    }

    // Process wind speed data
    else if (data.type === 'wind') {
        console.log(`Processing wind speed data: ${data.value} m/s`);
        // Additional processing logic for wind speed
    }

    // Process rain data
    else if (data.type === 'rain') {
        console.log(`Processing rain data: ${data.value} mm`);
        // Additional processing logic for rain
    }

    // Handle unknown data types
    else {
        console.warn(`Unknown data type received: ${data.type}`);
    }
}