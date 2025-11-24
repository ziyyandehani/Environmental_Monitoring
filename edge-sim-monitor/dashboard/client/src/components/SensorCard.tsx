import React from 'react';
import { SensorData } from '../types/sensors';

interface SensorCardProps {
    sensorData: SensorData;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensorData }) => {
    return (
        <div className="sensor-card">
            <h3>{sensorData.type} Sensor</h3>
            <p>Value: {sensorData.value} {sensorData.unit}</p>
            <p>Location: {sensorData.location}</p>
            <p>Timestamp: {new Date(sensorData.timestamp).toLocaleString()}</p>
        </div>
    );
};

export default SensorCard;