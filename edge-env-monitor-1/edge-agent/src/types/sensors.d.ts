interface SensorData {
    timestamp: Date;
    value: number;
}

interface TemperatureSensorData extends SensorData {
    temperature: number;
}

interface HumiditySensorData extends SensorData {
    humidity: number;
}

interface LightSensorData extends SensorData {
    lightIntensity: number;
}

interface WindSensorData extends SensorData {
    windSpeed: number;
}

interface RainSensorData extends SensorData {
    rainfall: number;
}