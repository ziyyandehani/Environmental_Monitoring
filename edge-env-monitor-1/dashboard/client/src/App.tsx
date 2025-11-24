import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { connectWebSocket } from './services/ws';

const App: React.FC = () => {
    const [sensorData, setSensorData] = useState<any[]>([]);

    useEffect(() => {
        const ws = connectWebSocket((data: any) => {
            setSensorData(prevData => [...prevData, data]);
        });

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div>
            <h1>Environmental Monitoring Dashboard</h1>
            <Dashboard sensorData={sensorData} />
        </div>
    );
};

export default App;