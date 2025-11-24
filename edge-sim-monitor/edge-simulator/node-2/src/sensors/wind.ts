import { EventPublisher } from '../../common/event-publisher';

class WindSensor {
    private windSpeed: number;

    constructor() {
        this.windSpeed = 0;
    }

    public generateWindData(): number {
        // Simulate wind speed data (0 to 20 m/s)
        this.windSpeed = Math.random() * 20;
        return this.windSpeed;
    }

    public publishWindData(): void {
        const windData = this.generateWindData();
        EventPublisher.publish('sensors/wind', { windSpeed: windData });
    }
}

const windSensor = new WindSensor();
setInterval(() => {
    windSensor.publishWindData();
}, 5000); // Publish data every 5 seconds