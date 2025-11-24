import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust the base URL as needed

export const fetchSensorData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sensors`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        throw error;
    }
};

export const exportDataToCSV = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/export`, {
            responseType: 'blob', // Important for file download
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sensor_data.csv'); // Specify the file name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting data to CSV:', error);
        throw error;
    }
};