#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Building React frontend..."
npm --prefix frontend install
npm --prefix frontend run build

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
flask db upgrade

echo "Build complete!"
