export class LightSensor {
    private lightIntensity: number;

    constructor() {
        this.lightIntensity = 0; // Initialize with a default value
    }

    public getLightIntensity(): number {
        // Simulate reading light intensity from a sensor
        this.lightIntensity = Math.random() * 100; // Random value for demonstration
        return this.lightIntensity;
    }
}