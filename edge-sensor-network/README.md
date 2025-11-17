# Edge Computing-Based Sensor Network for Environmental Monitoring

This project implements an edge computing-based sensor network designed for environmental monitoring. The architecture is built around a publish-subscribe model using MQTT, allowing for efficient data collection and dissemination.

## Project Structure

```
edge-sensor-network
├── services
│   ├── edge-node          # Edge node service for data collection
│   ├── gateway            # Gateway service for data aggregation
│   └── collector          # Collector service for data storage and API access
├── infra
│   ├── mosquitto          # MQTT broker configuration and Docker setup
│   └── docker-compose.yml  # Orchestration of all services
├── scripts                # Scripts for building and running the services
├── tests                  # Unit tests for each service
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
└── README.md              # Project documentation
```

## Features

- **Multi-threaded Data Collection**: Each sensor node operates independently, collecting data concurrently.
- **Event-Driven Architecture**: Utilizes MQTT for real-time data publishing and subscribing.
- **Containerization**: Each service is containerized using Docker, ensuring easy deployment and scalability.
- **Modular Design**: Services are separated into distinct components for edge nodes, gateways, and collectors.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd edge-sensor-network
   ```

2. Build the Docker images:
   ```
   ./scripts/build.sh
   ```

3. Start the services:
   ```
   ./scripts/run.sh
   ```

### Usage

- The edge nodes will start collecting environmental data and publishing it to the MQTT broker.
- The gateway will subscribe to the relevant topics and aggregate the data.
- The collector will provide an API to access the stored data.

## Testing

Unit tests are provided for each service. To run the tests, navigate to the respective test directory and execute:
```
pytest
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.