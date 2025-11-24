import { MqttClient } from 'mqtt';
import { publishTemperature } from './sensors/temperature';
import { publishHumidity } from './sensors/humidity';
import { publishLight } from './sensors/light';
import { publishWind } from './sensors/wind';
import { publishRain } from './sensors/rain';
import { createMqttClient } from '../common/mqtt-client';

const MQTT_BROKER_URL = 'mqtt://localhost:1883';
const TOPIC_PREFIX = 'environment/node1';

const mqttClient: MqttClient = createMqttClient(MQTT_BROKER_URL);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    setInterval(() => {
        publishTemperature(mqttClient, `${TOPIC_PREFIX}/temperature`);
        publishHumidity(mqttClient, `${TOPIC_PREFIX}/humidity`);
        publishLight(mqttClient, `${TOPIC_PREFIX}/light`);
        publishWind(mqttClient, `${TOPIC_PREFIX}/wind`);
        publishRain(mqttClient, `${TOPIC_PREFIX}/rain`);
    }, 5000); // Publish data every 5 seconds
});

mqttClient.on('error', (error) => {
    console.error('MQTT Client Error:', error);
});