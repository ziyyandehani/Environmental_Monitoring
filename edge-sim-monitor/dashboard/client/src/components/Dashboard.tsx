import React, { useEffect, useState } from 'react';
import SensorCard from './SensorCard';
import { fetchSensorData } from '../services/api';

const Dashboard: React.FC = () => {
    const [sensorData, setSensorData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchSensorData();
                setSensorData(data);
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            } finally {
                setLoading(false);
            }
        };

        getData();
        const interval = setInterval(getData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Environmental Monitoring Dashboard</h1>
            <div className="sensor-cards">
                {sensorData.map((sensor, index) => (
                    <SensorCard key={index} sensor={sensor} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;