import React from 'react';

const ExportControls: React.FC = () => {
    const handleExportCSV = () => {
        // Logic to export data as CSV
        console.log("Exporting data as CSV...");
    };

    const handleExportJSON = () => {
        // Logic to export data as JSON
        console.log("Exporting data as JSON...");
    };

    return (
        <div className="export-controls">
            <h3>Export Data</h3>
            <button onClick={handleExportCSV}>Export as CSV</button>
            <button onClick={handleExportJSON}>Export as JSON</button>
        </div>
    );
};

export default ExportControls;