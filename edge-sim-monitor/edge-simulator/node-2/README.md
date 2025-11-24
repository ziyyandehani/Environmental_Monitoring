# edge-sim-monitor/edge-simulator/node-2/README.md

# Node 2 Sensor Simulator

This document provides instructions on how to run the second sensor node in the edge computing-based environmental monitoring system.

## Overview

Node 2 is equipped with various sensors that monitor environmental parameters such as temperature, humidity, light intensity, wind speed, and rainfall. The data collected by these sensors is published to an MQTT broker for further processing and visualization.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)
- MQTT broker (e.g., Mosquitto) running and accessible

## Installation

1. Navigate to the Node 2 directory:

   ```bash
   cd edge-sim-monitor/edge-simulator/node-2
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

## Running the Simulator

To start the sensor node and begin publishing data, run the following command:

```bash
npm start
```

This will initialize the MQTT client and start the data collection process for all sensors.

## Sensors

Node 2 includes the following sensors:

- **Temperature Sensor**: Simulates temperature data and publishes it to the MQTT broker.
- **Humidity Sensor**: Simulates humidity data and publishes it to the MQTT broker.
- **Light Sensor**: Simulates light intensity data and publishes it to the MQTT broker.
- **Wind Sensor**: Simulates wind speed data and publishes it to the MQTT broker.
- **Rain Sensor**: Simulates rainfall data and publishes it to the MQTT broker.

## Data Publishing

The sensor data is published to the following MQTT topics:

- `sensors/node2/temperature`
- `sensors/node2/humidity`
- `sensors/node2/light`
- `sensors/node2/wind`
- `sensors/node2/rain`

## Stopping the Simulator

To stop the simulator, you can use `Ctrl + C` in the terminal where the simulator is running.

## Troubleshooting

If you encounter any issues, ensure that:

- The MQTT broker is running and accessible.
- The correct Node.js version is installed.
- All dependencies are properly installed.

For further assistance, please refer to the main project documentation or contact the development team.