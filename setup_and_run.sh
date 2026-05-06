#!/bin/bash

# Install Node dependencies
echo "Installing Node dependencies..."
npm install

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

# Run the app
echo "Starting the app..."
npm run dev
