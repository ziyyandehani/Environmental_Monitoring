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

    public generateTemperature(): number {
        return Math.random() * (this.maxTemp - this.minTemp) + this.minTemp;
    }

    public publishTemperature(): void {
        const temperature = this.generateTemperature();
        this.client.publish(this.topic, JSON.stringify({ temperature }), { qos: 1 }, (error) => {
            if (error) {
                console.error('Failed to publish temperature data:', error);
            } else {
                console.log(`Temperature data published: ${temperature}°C`);
            }
        });
    }
}

export default TemperatureSensor;