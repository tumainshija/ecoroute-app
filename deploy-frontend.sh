#!/bin/bash

# Frontend Deployment Script for Vercel
echo "🚀 Deploying frontend to Vercel..."

# Navigate to frontend directory
cd frontend

# Install Vercel CLI if not already installed
echo "📦 Installing Vercel CLI..."
npm install -g vercel

# Build the project for production
echo "🏗️ Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployment complete!"
echo "📋 Your application will be available at: https://ecoroute-app.vercel.app" 