export interface SensorData {
    id: string;
    type: 'temperature' | 'humidity' | 'light' | 'wind' | 'rain';
    value: number;
    timestamp: Date;
}

export interface SensorNode {
    id: string;
    location: string;
    data: SensorData[];
}