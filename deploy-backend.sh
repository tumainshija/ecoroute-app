#!/bin/bash

# Backend Deployment Script for Render
echo "🚀 Deploying backend to Render..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Backend preparation complete!"
echo "📋 To deploy your API to Render:"
echo "1. Go to https://dashboard.render.com"
echo "2. Connect your GitHub repository"
echo "3. Create a new Web Service with the following settings:"
echo "   - Name: ecoroute-api"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: node app.js"
echo "4. Add these environment variables:"
echo "   - NODE_ENV: production"
echo "   - PORT: 5000"
echo "   - MONGO_URI: (your MongoDB connection string)"
echo "   - JWT_SECRET: (a secure random string)"
echo "   - FRONTEND_URL: https://ecoroute-app.vercel.app"
echo ""
echo "Your API will be available at: https://ecoroute-api.onrender.com/api" 