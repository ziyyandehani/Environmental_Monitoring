import { MqttClient } from 'mqtt';
import { publishTemperature } from './sensors/temperature';
import { publishHumidity } from './sensors/humidity';
import { publishLight } from './sensors/light';
import { publishWind } from './sensors/wind';
import { publishRain } from './sensors/rain';
import { createMqttClient } from '../common/mqtt-client';

const MQTT_TOPIC_PREFIX = 'environment/node-2';

const mqttClient: MqttClient = createMqttClient();

mqttClient.on('connect', () => {
    console.log('Node-2 connected to MQTT broker');

    // Start publishing sensor data at intervals
    setInterval(() => {
        publishTemperature(mqttClient, MQTT_TOPIC_PREFIX);
        publishHumidity(mqttClient, MQTT_TOPIC_PREFIX);
        publishLight(mqttClient, MQTT_TOPIC_PREFIX);
        publishWind(mqttClient, MQTT_TOPIC_PREFIX);
        publishRain(mqttClient, MQTT_TOPIC_PREFIX);
    }, 5000); // Publish every 5 seconds
});

mqttClient.on('error', (error) => {
    console.error('MQTT Client Error:', error);
});