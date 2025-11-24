import { MqttClient } from 'mqtt';
import { EventPublisher } from '../common/event-publisher';

class TemperatureSensor {
    private client: MqttClient;
    private topic: string;
    private minTemp: number;
    private maxTemp: number;

    constructor(client: MqttClient, topic: string, minTemp: number = 15, maxTemp: number = 30) {
        this.client = client;
        this.topic = topic;
        this.minTemp = minTemp;
        this.maxTemp = maxTemp;
    }

    public generateTemperatureData(): number {
        return Math.random() * (this.maxTemp - this.minTemp) + this.minTemp;
    }

    public publishTemperatureData(): void {
        const temperature = this.generateTemperatureData();
        this.client.publish(this.topic, JSON.stringify({ temperature }), { qos: 1 });
    }
}

const mqttClient = new MqttClient('mqtt://broker.hivemq.com'); // Replace with your broker URL
const temperatureSensor = new TemperatureSensor(mqttClient, 'environment/temperature/node-2');

setInterval(() => {
    temperatureSensor.publishTemperatureData();
}, 5000); // Publish data every 5 seconds