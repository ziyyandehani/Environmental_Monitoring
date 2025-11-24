import { EventPublisher } from '../../common/event-publisher';

class RainSensor {
    private rainData: number;

    constructor() {
        this.rainData = 0;
    }

    public generateRainData(): number {
        // Simulate rain data generation (in mm)
        this.rainData = Math.random() * 10; // Random value between 0 and 10 mm
        return this.rainData;
    }

    public publishRainData(): void {
        const data = this.generateRainData();
        EventPublisher.publish('sensor/rain', { value: data });
    }
}

const rainSensor = new RainSensor();
setInterval(() => {
    rainSensor.publishRainData();
}, 5000); // Publish data every 5 seconds