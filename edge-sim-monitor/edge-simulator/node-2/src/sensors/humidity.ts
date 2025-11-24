import { MqttClient } from 'mqtt';
import { generateRandomHumidity } from './utils';

const MQTT_BROKER_URL = 'mqtt://localhost:1883';
const TOPIC = 'environment/humidity/node-2';

const client: MqttClient = new MqttClient(MQTT_BROKER_URL);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    setInterval(() => {
        const humidity = generateRandomHumidity();
        client.publish(TOPIC, JSON.stringify({ humidity }), { qos: 1 });
        console.log(`Published humidity: ${humidity}%`);
    }, 5000); // Publish every 5 seconds
});

client.on('error', (error) => {
    console.error('MQTT Client Error:', error);
});

client.connect();