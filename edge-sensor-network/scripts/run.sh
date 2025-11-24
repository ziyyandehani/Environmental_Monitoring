#!/bin/bash

# Navigate to the infra directory and start the services using Docker Compose
cd infra
docker-compose up -d

# Navigate back to the scripts directory
cd ../scripts

# Optionally, you can add commands to monitor logs or perform other tasks
# For example, to view logs of all services:
# docker-compose logs -f