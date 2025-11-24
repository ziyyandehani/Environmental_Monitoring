import fs from 'fs';
import path from 'path';
import { Parser } from 'json2csv';
import { SensorData } from '../types/sensor-data';

const exportToCSV = (data: SensorData[], fileName: string): void => {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    const filePath = path.join(__dirname, `${fileName}.csv`);
    fs.writeFileSync(filePath, csv);
    console.log(`Data exported to ${filePath}`);
};

export { exportToCSV };