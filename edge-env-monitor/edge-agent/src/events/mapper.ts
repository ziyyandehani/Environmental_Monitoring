export function mapSensorData(sensorData: any) {
    return {
        temperature: sensorData.temperature,
        humidity: sensorData.humidity,
        lightIntensity: sensorData.lightIntensity,
        windSpeed: sensorData.windSpeed,
        rainfall: sensorData.rainfall,
        timestamp: new Date().toISOString()
    };
}