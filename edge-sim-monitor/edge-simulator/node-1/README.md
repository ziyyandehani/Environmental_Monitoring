# edge-sim-monitor/edge-simulator/node-1/README.md

# Edge Simulator Node 1

This document provides instructions on how to set up and run the first sensor node in the Edge Computing-based Environmental Monitoring project.

## Overview

Node 1 is equipped with various sensors that monitor environmental parameters such as temperature, humidity, light intensity, wind speed, and rainfall. The data collected by these sensors is published to an MQTT broker for further processing and visualization.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Access to an MQTT broker (e.g., Mosquitto)

## Installation

1. Navigate to the Node 1 directory:

   ```bash
   cd edge-sim-monitor/edge-simulator/node-1
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

## Configuration

Before running the simulator, ensure that the MQTT broker is running and accessible. You may need to update the MQTT connection settings in the `src/common/mqtt-client.ts` file if your broker is configured differently.

## Running the Simulator

To start the sensor node and begin data collection, run the following command:

```bash
npm start
```

This will initialize the sensors and start publishing data to the MQTT broker.

## Data Visualization

The data published by this node can be visualized in the dashboard application. Ensure that the dashboard server is running and connected to the same MQTT broker.

## Exporting Data

Data collected by the sensors can be exported for analysis. Refer to the main project documentation for instructions on how to export data.

## Troubleshooting

- If you encounter issues connecting to the MQTT broker, check the broker's configuration and ensure it is running.
- Review the console output for any error messages that may indicate problems with sensor initialization or data publishing.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.