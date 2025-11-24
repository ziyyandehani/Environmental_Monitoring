# Edge Environmental Monitoring System

This project implements an environmental monitoring system using edge computing and an event-driven architecture. The system collects data from various sensors and publishes it to an MQTT broker, which can then be ingested and displayed on a monitoring dashboard.

## Project Structure

- **edge-agent**: Contains the edge agent responsible for collecting sensor data.
  - **src**: Source code for the edge agent.
    - **sensors**: Contains individual sensor modules (temperature, humidity, light, wind, rain).
    - **mqtt**: Contains MQTT client and topic definitions.
    - **events**: Contains event publishing and data mapping functionalities.
    - **config**: Configuration settings for the edge agent.
    - **types**: TypeScript type definitions for sensor data.
  - **package.json**: Lists dependencies and scripts for the edge agent.
  - **tsconfig.json**: TypeScript configuration for the edge agent.
  
- **cloud-ingest**: Contains the cloud ingestion service that subscribes to the MQTT broker.
  - **src**: Source code for the cloud ingestion service.
    - **storage**: Contains storage functionalities (e.g., InfluxDB).
  - **package.json**: Lists dependencies and scripts for the cloud ingestion service.
  - **tsconfig.json**: TypeScript configuration for the cloud ingestion service.
  
- **dashboard**: Contains the dashboard application for visualizing sensor data.
  - **client**: Frontend application built with React.
  - **server**: Backend server for handling WebSocket connections.
  
- **broker**: Contains the configuration for the MQTT broker (Mosquitto).
  
- **scripts**: Shell scripts for starting the edge agent and dashboard.
  
- **tests**: Contains unit tests for the edge agent and dashboard.
  
- **.env.example**: Example environment variables for the project.
  
- **docker-compose.yml**: Docker configuration for running the project.
  
- **README.md**: Documentation for the overall project.
  
- **LICENSE**: Licensing information for the project.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd edge-env-monitor
   ```

2. **Install dependencies**:
   Navigate to each service directory (`edge-agent`, `cloud-ingest`, `dashboard/client`, `dashboard/server`) and run:
   ```
   npm install
   ```

3. **Start the MQTT broker**:
   Use the provided Mosquitto configuration to run the broker.

4. **Start the edge agent**:
   Run the script:
   ```
   ./scripts/start-edge.sh
   ```

5. **Start the dashboard**:
   Run the script:
   ```
   ./scripts/start-dashboard.sh
   ```

6. **Access the dashboard**:
   Open your web browser and navigate to `http://localhost:<dashboard-port>` to view the monitoring dashboard.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.