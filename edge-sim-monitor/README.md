# Edge Computing Environmental Monitoring System

This project implements an edge computing-based sensor network for environmental monitoring. It utilizes MQTT for communication between sensor nodes and a broker, allowing real-time data collection and visualization.

## Project Structure

The project is organized into several components:

- **edge-simulator**: Contains the sensor nodes that simulate environmental data.
  - **node-1**: First sensor node with temperature, humidity, light, wind, and rain sensors.
  - **node-2**: Second sensor node with similar sensors.
- **broker**: Contains the Mosquitto MQTT broker configuration.
- **ingest-server**: Subscribes to MQTT topics, processes incoming data, and prepares it for storage.
- **dashboard**: A web application that visualizes the sensor data in real-time and provides options for data export.
- **scripts**: Contains shell scripts for starting components and exporting data.
- **docker-compose.yml**: Defines services for running the application using Docker.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Docker (for running the broker and other services)
- TypeScript (for building the TypeScript files)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd edge-sim-monitor
   ```

2. Install dependencies for each component:
   - For the edge simulator:
     ```
     cd edge-simulator
     npm install
     ```

   - For the ingest server:
     ```
     cd ingest-server
     npm install
     ```

   - For the dashboard client:
     ```
     cd dashboard/client
     npm install
     ```

   - For the dashboard server:
     ```
     cd dashboard/server
     npm install
     ```

3. Configure the MQTT broker by editing `broker/mosquitto/mosquitto.conf` if necessary.

### Running the Application

You can start all components using the provided script:

```
cd scripts
./start-all.sh
```

Alternatively, you can start each component individually:

- Start the MQTT broker:
  ```
  docker-compose up -d
  ```

- Start the edge simulator:
  ```
  cd edge-simulator
  npm start
  ```

- Start the ingest server:
  ```
  cd ingest-server
  npm start
  ```

- Start the dashboard server:
  ```
  cd dashboard/server
  npm start
  ```

- Start the dashboard client:
  ```
  cd dashboard/client
  npm start
  ```

### Accessing the Dashboard

Once all components are running, you can access the dashboard at `http://localhost:3000`.

### Data Export

The application provides functionality to export monitoring results to CSV format. You can use the export controls in the dashboard to download the data.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.