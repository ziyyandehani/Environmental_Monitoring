import React from 'react';

interface SensorCardProps {
    title: string;
    value: number | string;
    unit: string;
}

const SensorCard: React.FC<SensorCardProps> = ({ title, value, unit }) => {
    return (
        <div className="sensor-card">
            <h3>{title}</h3>
            <p>{value} {unit}</p>
        </div>
    );
};

export default SensorCard;