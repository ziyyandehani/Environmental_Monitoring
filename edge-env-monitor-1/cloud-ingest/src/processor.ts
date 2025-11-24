export function processData(data: any) {
    // Example processing logic
    const processedData = {
        temperature: data.temperature,
        humidity: data.humidity,
        lightIntensity: data.lightIntensity,
        windSpeed: data.windSpeed,
        rainfall: data.rainfall,
        timestamp: new Date().toISOString(),
    };

    // Here you can add further processing or validation if needed

    return processedData;
}