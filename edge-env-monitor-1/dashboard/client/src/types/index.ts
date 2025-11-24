interface SensorData {
    temperature: number;
    humidity: number;
    lightIntensity: number;
    windSpeed: number;
    rainfall: number;
}

interface DashboardState {
    sensorData: SensorData | null;
    loading: boolean;
    error: string | null;
}