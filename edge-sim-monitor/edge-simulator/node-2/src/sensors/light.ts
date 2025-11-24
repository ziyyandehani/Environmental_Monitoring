import { MqttClient } from 'mqtt';
import { setInterval } from 'timers';
import { publishData } from '../common/event-publisher';

const LIGHT_TOPIC = 'environment/light';

class LightSensor {
    private client: MqttClient;
    private lightIntensity: number;

    constructor(client: MqttClient) {
        this.client = client;
        this.lightIntensity = this.generateRandomLightIntensity();
    }

    private generateRandomLightIntensity(): number {
        return Math.floor(Math.random() * 100); // Simulating light intensity between 0 and 100
    }

    public start() {
        setInterval(() => {
            this.lightIntensity = this.generateRandomLightIntensity();
            publishData(this.client, LIGHT_TOPIC, { intensity: this.lightIntensity });
        }, 5000); // Publish every 5 seconds
    }
}

export default LightSensor;