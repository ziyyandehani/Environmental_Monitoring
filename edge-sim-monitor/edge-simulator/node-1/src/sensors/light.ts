import { EventPublisher } from '../common/event-publisher';

class LightSensor {
    private lightIntensity: number;
    private publisher: EventPublisher;

    constructor() {
        this.lightIntensity = this.generateRandomLightIntensity();
        this.publisher = new EventPublisher();
        this.startDataGeneration();
    }

    private generateRandomLightIntensity(): number {
        return Math.floor(Math.random() * 1001); // Simulating light intensity from 0 to 1000 lux
    }

    private startDataGeneration(): void {
        setInterval(() => {
            this.lightIntensity = this.generateRandomLightIntensity();
            this.publishData();
        }, 5000); // Publish data every 5 seconds
    }

    private publishData(): void {
        const topic = 'environment/light';
        const message = JSON.stringify({ intensity: this.lightIntensity });
        this.publisher.publish(topic, message);
    }
}

export default LightSensor;