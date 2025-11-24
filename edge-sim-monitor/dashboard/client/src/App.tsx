import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { fetchData } from './services/api';
import './App.css';

const App: React.FC = () => {
    const [sensorData, setSensorData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchData();
                setSensorData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
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
        <div className="App">
            <h1>Environmental Monitoring Dashboard</h1>
            <Dashboard sensorData={sensorData} />
        </div>
    );
};

export default App;