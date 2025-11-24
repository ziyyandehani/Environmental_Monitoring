#!/bin/bash

# Navigate to the dashboard client directory and start the React application
cd dashboard/client
npm install
npm start &

# Navigate to the dashboard server directory and start the WebSocket server
cd ../server
npm install
npm start &

# Wait for both processes to finish
wait