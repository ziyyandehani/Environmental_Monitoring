#!/bin/bash

# Start the MQTT broker
docker-compose -f ../docker-compose.yml up -d broker

# Start the ingest server
docker-compose -f ../docker-compose.yml up -d ingest-server

# Start the dashboard server
docker-compose -f ../docker-compose.yml up -d dashboard-server

# Start the first sensor node
cd ../edge-simulator/node-1
npm install
npm start &

# Start the second sensor node
cd ../node-2
npm install
npm start &

# Wait for all processes to start
wait

echo "Edge simulator and all components are running."