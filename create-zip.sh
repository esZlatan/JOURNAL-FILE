#!/bin/bash

# Create a zip file of the Trading Journal application
echo "Creating zip file of the Trading Journal application..."

# Create the zip file
cd /workspace
zip -r trading-journal-v2.zip trading-journal-v2

echo "Zip file created: /workspace/trading-journal-v2.zip"