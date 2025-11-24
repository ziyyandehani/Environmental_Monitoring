#!/bin/bash

# Start the MQTT broker
docker-compose up -d broker

# Start the edge simulator nodes
docker-compose up -d edge-simulator-node-1
docker-compose up -d edge-simulator-node-2

# Start the ingest server
docker-compose up -d ingest-server

# Start the dashboard server
docker-compose up -d dashboard-server

echo "All components have been started."