import { MqttClient } from 'mqtt';
import { SensorData } from '../types/sensors';

export class EventPublisher {
    private client: MqttClient;
    private topic: string;

    constructor(client: MqttClient, topic: string) {
        this.client = client;
        this.topic = topic;
    }

    public publish(data: SensorData): void {
        const message = JSON.stringify(data);
        this.client.publish(this.topic, message, { qos: 1 }, (error) => {
            if (error) {
                console.error('Publish error:', error);
            } else {
                console.log('Data published to topic:', this.topic);
            }
        });
    }
}