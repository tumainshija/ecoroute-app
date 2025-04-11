# EcoRoute Deployment Guide

This guide provides a step-by-step approach to deploy your EcoRoute application online.

## Hosting Overview

We'll use two free services to host the application:
1. **MongoDB Atlas** - for the database
2. **Render** - for the backend API
3. **Vercel** - for the frontend

## Step 1: Prepare the Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new project and cluster (choose the free tier)
3. Set up a database user with a username and password
4. Configure network access to allow connections from anywhere (IP: 0.0.0.0/0)
5. Get your connection string by clicking "Connect" → "Connect your application"
6. It will look like: `mongodb+srv://username:password@cluster.mongodb.net/ecoroute?retryWrites=true&w=majority`

## Step 2: Deploy the Backend to Render

1. Go to [Render](https://render.com) and create a free account
2. From your dashboard, click "New" → "Web Service"
3. Choose "Build and deploy from a Git repository" or manually upload your backend code
4. Configure your web service:
   - Name: `ecoroute-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node app.js`
   - Auto Deploy: Enable
5. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: Your MongoDB connection string from Step 1
   - `JWT_SECRET`: Any random string (e.g., generate at [randomkeygen.com](https://randomkeygen.com))
   - `FRONTEND_URL`: Leave blank for now (we'll update it later)
6. Click "Create Web Service"
7. Wait for the deployment to complete and note your service URL (e.g., `https://ecoroute-api.onrender.com`)

## Step 3: Configure Frontend for Production

1. In your local project, create or edit `frontend/.env.production` with:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-service-url.onrender.com/api
   NEXT_PUBLIC_USE_PROXY=false
   ```
   Replace "your-render-service-url" with your actual Render service URL.

2. In the `frontend/next.config.ts` file, ensure the rewrites function handles both development and production environments.

## Step 4: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and create a free account
2. From your dashboard, click "Add New" → "Project"
3. Import your GitHub repository or manually upload your frontend code
4. Configure the project:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend` (if uploading the whole repository)
   - Environment Variables:
     * `NEXT_PUBLIC_API_URL`: Your Render backend URL + `/api`
     * `NEXT_PUBLIC_USE_PROXY`: `false`
5. Click "Deploy"
6. Wait for the deployment to complete and note your Vercel URL (e.g., `https://ecoroute-app.vercel.app`)

## Step 5: Update Backend Configuration

1. Go back to your Render dashboard
2. Select your backend service
3. Go to the "Environment" tab
4. Update the `FRONTEND_URL` variable with your Vercel URL
5. Click "Save Changes" and wait for the redeployment

## Step 6: Test Your Application

Visit your Vercel deployment URL and test all the features:
- User registration and login
- Route planning
- Carbon calculation
- Forum interactions
- Profile management

## Troubleshooting

### Backend Issues
- Check Render logs for error messages
- Verify your MongoDB connection string
- Ensure environment variables are set correctly

### Frontend Issues
- Check Vercel deployment logs
- Verify the API URL is correct in environment variables
- Test the backend API directly to confirm it's working

## Optional: Custom Domain

### Vercel Custom Domain
1. Go to your project settings → Domains
2. Add your domain and follow the DNS configuration instructions

### Render Custom Domain
1. Upgrade to a paid plan
2. Go to your service settings → Custom Domain
3. Add your domain and follow the DNS configuration instructions

---

Congratulations! Your EcoRoute application is now deployed and accessible from anywhere in the world. 