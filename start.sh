#!/bin/bash

echo "Starting Sen Gallery..."
echo "The server will start at http://localhost:3001"

# Make sure the script is executable
chmod +x start.sh

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the server
npm run server 