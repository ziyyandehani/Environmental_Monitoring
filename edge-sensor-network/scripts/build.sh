#!/bin/bash

# Build Docker images for all services
docker build -t edge-node ./services/edge-node
docker build -t gateway ./services/gateway
docker build -t collector ./services/collector
docker build -t mosquitto ./infra/mosquitto