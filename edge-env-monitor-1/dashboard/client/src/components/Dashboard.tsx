import React, { useEffect, useState } from 'react';
import { SensorCard } from './SensorCard';
import { WebSocketService } from '../services/ws';

const Dashboard: React.FC = () => {
    const [sensorData, setSensorData] = useState({
        temperature: null,
        humidity: null,
        light: null,
        wind: null,
        rain: null,
    });

    useEffect(() => {
        const wsService = new WebSocketService();

        wsService.connect();

        wsService.onMessage((data: any) => {
            setSensorData(prevData => ({
                ...prevData,
                ...data,
            }));
        });

        return () => {
            wsService.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Environmental Monitoring Dashboard</h1>
            <div className="sensor-cards">
                <SensorCard title="Temperature" value={sensorData.temperature} unit="°C" />
                <SensorCard title="Humidity" value={sensorData.humidity} unit="%" />
                <SensorCard title="Light Intensity" value={sensorData.light} unit="lx" />
                <SensorCard title="Wind Speed" value={sensorData.wind} unit="m/s" />
                <SensorCard title="Rainfall" value={sensorData.rain} unit="mm" />
            </div>
        </div>
    );
};

export default Dashboard;