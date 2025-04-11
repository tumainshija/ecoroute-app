# EcoRoute Deployment Guide

This guide explains how to deploy the EcoRoute application to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (https://vercel.com)
- Render account (https://render.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas) or other MongoDB provider

## Deployment Steps

### Step 1: Prepare Your Repository

1. Push your code to a GitHub repository
2. Make sure your repository is public or connected to your Vercel and Render accounts

### Step 2: Set Up MongoDB

1. Create a MongoDB Atlas cluster (or use another MongoDB provider)
2. Create a database named `ecoroute`
3. Configure network access to allow connections from anywhere (or Render's IP range)
4. Create a database user with read/write access
5. Copy your MongoDB connection string for the next steps

### Step 3: Deploy Backend to Render

1. Go to https://dashboard.render.com
2. Click "New" and select "Web Service"
3. Connect to your GitHub repository
4. Configure the service:
   - Name: `ecoroute-api`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node app.js`
5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string (generate one at https://randomkeygen.com/)
   - `FRONTEND_URL`: `https://ecoroute-app.vercel.app` (or your custom domain)
6. Click "Create Web Service"
7. Wait for the deployment to complete
8. Copy your service URL (e.g., `https://ecoroute-api.onrender.com`)

### Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
5. Add the following environment variables:
   - `NEXT_PUBLIC_API_URL`: `https://ecoroute-api.onrender.com/api` (use your Render URL)
   - `NEXT_PUBLIC_USE_PROXY`: `false`
6. Click "Deploy"
7. Wait for the deployment to complete
8. Your application is now live!

## Using Deployment Scripts

For more automated deployments, you can use the provided scripts:

1. For frontend: `bash deploy-frontend.sh`
2. For backend, follow the instructions in `deploy-backend.sh`

## Custom Domains

### Vercel (Frontend)

1. Go to your project settings
2. Click on "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

### Render (Backend)

1. Go to your web service
2. Click on "Settings"
3. Scroll to "Custom Domains"
4. Add your custom domain
5. Follow Render's instructions to configure DNS

## Continuous Deployment

Both Vercel and Render automatically deploy when you push changes to your repository's main branch.

## Troubleshooting

- If your frontend can't connect to the backend, check that your `NEXT_PUBLIC_API_URL` is correctly set
- If you get database connection errors, verify your MongoDB connection string and network settings
- For CORS issues, check that your `FRONTEND_URL` in the backend environment variables matches your actual frontend URL

## Maintenance

- Regularly update your dependencies
- Monitor your application with Vercel and Render's built-in analytics
- Set up alerts for errors and performance issues 