#!/bin/bash

# EcoRoute Deployment Script

# Stop script on error
set -e

echo "🚀 Starting EcoRoute deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm run build
cd ..

# Start services with Docker Compose
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo "✅ Deployment completed! Your EcoRoute application should be running at:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000/api"

echo "📝 Logs can be viewed with: docker-compose logs -f" 