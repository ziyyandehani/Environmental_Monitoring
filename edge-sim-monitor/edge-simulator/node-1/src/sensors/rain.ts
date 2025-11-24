import { MqttClient } from 'mqtt';
import { publishEvent } from '../common/event-publisher';

const RAIN_TOPIC = 'environment/rain';

function generateRainData() {
    return Math.random() < 0.5 ? Math.random() * 10 : 0; // Simulate rain data (0-10 mm)
}

export function startRainSensor(client: MqttClient) {
    setInterval(() => {
        const rainData = generateRainData();
        publishEvent(client, RAIN_TOPIC, { rain: rainData });
    }, 5000); // Publish every 5 seconds
}