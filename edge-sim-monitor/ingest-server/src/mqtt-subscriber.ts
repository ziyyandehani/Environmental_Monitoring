import mqtt from 'mqtt';
import { processData } from './processor';

const MQTT_BROKER_URL = 'mqtt://localhost:1883'; // Update with your broker URL
const TOPIC_PREFIX = 'environment/';

const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(`${TOPIC_PREFIX}#`, (err) => {
        if (err) {
            console.error('Failed to subscribe to topics:', err);
        } else {
            console.log('Subscribed to all environment topics');
        }
    });
});

client.on('message', (topic, message) => {
    const payload = JSON.parse(message.toString());
    console.log(`Received message on topic ${topic}:`, payload);
    processData(topic, payload);
});

client.on('error', (err) => {
    console.error('MQTT Client Error:', err);
});