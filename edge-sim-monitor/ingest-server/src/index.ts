import express from 'express';
import bodyParser from 'body-parser';
import { MqttSubscriber } from './mqtt-subscriber';
import { Processor } from './processor';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Initialize MQTT Subscriber
const mqttSubscriber = new MqttSubscriber();
mqttSubscriber.start();

// Initialize Data Processor
const processor = new Processor();

// Endpoint to get processed data
app.get('/data', (req, res) => {
    const data = processor.getProcessedData();
    res.json(data);
});

// Start the server
app.listen(port, () => {
    console.log(`Ingest server is running on http://localhost:${port}`);
});