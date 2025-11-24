#!/bin/bash

# Start the edge agent
cd edge-agent
npm install
npm start &

# Start the cloud ingestion service
cd ../cloud-ingest
npm install
npm start &

# Start the dashboard server
cd ../dashboard/server
npm install
npm start &

# Start the dashboard client
cd ../client
npm install
npm start &

wait