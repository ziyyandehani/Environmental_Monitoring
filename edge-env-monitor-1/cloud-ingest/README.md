# Cloud Ingestion Service

This directory contains the cloud ingestion service for the environmental monitoring system. The service is responsible for receiving sensor data from the edge agents via MQTT, processing the data, and storing it in a database.

## Structure

- **src/index.ts**: Entry point for the cloud ingestion service. Initializes the MQTT subscriber.
- **src/mqtt-subscriber.ts**: Contains the MQTTSubscriber class for connecting to the MQTT broker and subscribing to topics.
- **src/processor.ts**: Processes incoming sensor data.
- **src/storage/influx.ts**: Handles storage of processed data in InfluxDB.

## Getting Started

1. **Install Dependencies**: Run `npm install` in the `cloud-ingest` directory to install the required packages.
2. **Configuration**: Update the configuration settings in the `.env` file to connect to your MQTT broker and InfluxDB instance.
3. **Run the Service**: Start the service using `npm start`.

## Usage

The cloud ingestion service listens for sensor data published by the edge agents. It processes the data and stores it in the configured database for further analysis and visualization.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.