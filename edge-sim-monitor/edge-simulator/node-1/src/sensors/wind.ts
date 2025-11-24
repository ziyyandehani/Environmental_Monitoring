import { MqttClient } from 'mqtt';
import { publishEvent } from '../common/event-publisher';

const WIND_TOPIC = 'environment/wind';

export class WindSensor {
    private client: MqttClient;
    private interval: NodeJS.Timeout;

    constructor(client: MqttClient) {
        this.client = client;
    }

    public start() {
        this.interval = setInterval(() => {
            const windSpeed = this.generateWindSpeed();
            this.publishWindData(windSpeed);
        }, 5000); // Publish every 5 seconds
    }

    public stop() {
        clearInterval(this.interval);
    }

    private generateWindSpeed(): number {
        // Simulate wind speed between 0 and 20 m/s
        return Math.random() * 20;
    }

    private publishWindData(windSpeed: number) {
        const message = JSON.stringify({ speed: windSpeed });
        publishEvent(this.client, WIND_TOPIC, message);
    }
}