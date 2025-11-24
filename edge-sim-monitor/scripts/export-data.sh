#!/bin/bash

# Export monitoring results to CSV format
OUTPUT_FILE="monitoring_results.csv"

# Check if the output file already exists
if [ -f "$OUTPUT_FILE" ]; then
    echo "Output file already exists. Overwriting..."
fi

# Write the header to the CSV file
echo "Timestamp,Temperature,Humidity,Light,Wind,Rain" > "$OUTPUT_FILE"

# Fetch data from the ingest server's CSV export endpoint
curl -s http://localhost:3000/api/export >> "$OUTPUT_FILE"

echo "Data exported successfully to $OUTPUT_FILE"