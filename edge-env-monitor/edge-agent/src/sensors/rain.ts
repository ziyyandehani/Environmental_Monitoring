export class RainSensor {
    private rainfall: number;

    constructor() {
        this.rainfall = 0;
    }

    public getRainfall(): number {
        // Simulate reading rainfall data from a sensor
        this.rainfall = Math.random() * 100; // Random value for demonstration
        return this.rainfall;
    }
}