export class WindSensor {
    private windSpeed: number;

    constructor() {
        this.windSpeed = 0;
    }

    public getWindSpeed(): number {
        // Simulate reading wind speed from a sensor
        this.windSpeed = Math.random() * 100; // Random value for demonstration
        return this.windSpeed;
    }
}