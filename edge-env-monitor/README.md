# Environmental Monitoring System

This project is an Environmental Monitoring System based on edge computing with an event-driven architecture using MQTT. It collects data from various environmental sensors and displays the information on a monitoring dashboard.

## Project Structure

- **edge-agent**: Contains the edge agent responsible for collecting sensor data and publishing it to the MQTT broker.
  - **src**: Source code for the edge agent.
    - **sensors**: Contains individual sensor modules for temperature, humidity, light intensity, wind speed, and rainfall.
    - **mqtt**: Contains the MQTT client and topic definitions.
    - **events**: Contains the event publishing logic.
    - **config**: Configuration settings for the edge agent.
    - **types**: TypeScript type definitions for sensor data.
  - **package.json**: Lists dependencies and scripts for the edge agent.
  - **tsconfig.json**: TypeScript configuration for the edge agent.
  - **README.md**: Documentation for the edge agent.

- **cloud-ingest**: Contains the cloud ingestion service that subscribes to the MQTT broker and processes incoming data.
  - **src**: Source code for the cloud ingestion service.
  - **package.json**: Lists dependencies and scripts for the cloud ingestion service.
  - **tsconfig.json**: TypeScript configuration for the cloud ingestion service.
  - **README.md**: Documentation for the cloud ingestion service.

- **dashboard**: Contains the dashboard application that displays sensor data.
  - **client**: Frontend application built with React.
  - **server**: Backend server for handling WebSocket connections.
  - **package.json**: Lists dependencies and scripts for the dashboard application.
  - **tsconfig.json**: TypeScript configuration for the dashboard application.

- **broker**: Contains the configuration for the Mosquitto MQTT broker.

- **scripts**: Contains shell scripts to start the edge agent and dashboard application.

- **tests**: Contains unit tests for the edge agent and dashboard application.

- **.env.example**: Example environment variables used in the project.

- **docker-compose.yml**: Defines services and configurations for running the project using Docker.

- **package.json**: Lists dependencies and scripts for the overall project.

- **tsconfig.json**: TypeScript configuration for the entire project.

- **.gitignore**: Specifies files and directories to be ignored by version control.

- **LICENSE**: Licensing information for the project.

## Getting Started

1. Clone the repository.
2. Install dependencies for each service:
   - Navigate to `edge-agent`, `cloud-ingest`, and `dashboard/client` and run `npm install`.
3. Configure the MQTT broker settings in the `.env` file.
4. Start the MQTT broker using the provided configuration.
5. Start the edge agent and cloud ingestion service using the provided scripts.
6. Launch the dashboard application to visualize the sensor data.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.