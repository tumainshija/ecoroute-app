# EcoRoute Online Deployment Guide

This guide provides detailed, step-by-step instructions for deploying the EcoRoute application to Vercel and Render without requiring local Git operations.

## Step 1: Deploy Backend to Render

1. **Create a MongoDB Database**:
   - Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (the free tier is sufficient for starting)
   - Create a database named `ecoroute`
   - Create a database user with read/write access
   - Configure network access to allow connections from anywhere (IP: 0.0.0.0/0)
   - Copy your MongoDB connection string, it will look like:
     `mongodb+srv://username:password@cluster.mongodb.net/ecoroute?retryWrites=true&w=majority`

2. **Deploy to Render**:
   - Sign up or log in to [Render](https://render.com)
   - Click "New" and select "Web Service"
   - Select "Build and deploy from GitHub" or "Upload Files"
   - For GitHub: Connect your GitHub account and select your repository
   - For Upload: Zip your backend folder and upload it
   - Configure the service:
     * Name: `ecoroute-api`
     * Root Directory: Leave empty if you uploaded just the backend folder, otherwise enter `backend`
     * Environment: `Node`
     * Region: Choose the closest to your users
     * Branch: `main` or `master` (if using GitHub)
     * Build Command: `npm install`
     * Start Command: `node app.js`
   - Add the following environment variables:
     * `NODE_ENV`: `production`
     * `PORT`: `5000`
     * `MONGO_URI`: Your MongoDB connection string
     * `JWT_SECRET`: A secure random string
     * `FRONTEND_URL`: `https://ecoroute-app.vercel.app` (placeholder, you'll update this later)
   - Click "Create Web Service"
   - Wait for the deployment to complete (this may take a few minutes)
   - Copy your service URL (e.g., `https://ecoroute-api.onrender.com`)

## Step 2: Deploy Frontend to Vercel

1. **Prepare for Deployment**:
   - Update the backend URL in `.env.production` with your Render URL:
     ```
     NEXT_PUBLIC_API_URL=https://ecoroute-api.onrender.com/api
     NEXT_PUBLIC_USE_PROXY=false
     ```

2. **Deploy to Vercel**:
   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "Add New" and select "Project"
   - Select "Upload Files" option if it's available, or "Import Git Repository"
   - For Upload: Zip your frontend folder and upload it
   - For GitHub: Connect your GitHub account and select your repository
   - Configure the project:
     * Framework Preset: `Next.js`
     * Root Directory: Leave empty if you uploaded just the frontend folder, otherwise enter `frontend`
     * Build Command: `npm run build`
     * Output Directory: `.next`
   - Add the following environment variables:
     * `NEXT_PUBLIC_API_URL`: `https://ecoroute-api.onrender.com/api` (use your Render URL)
     * `NEXT_PUBLIC_USE_PROXY`: `false`
   - Click "Deploy"
   - Wait for the deployment to complete (this may take a few minutes)
   - Copy your deployment URL (e.g., `https://ecoroute-app.vercel.app`)

3. **Update Backend Configuration**:
   - Go back to your Render dashboard
   - Open your ecoroute-api service
   - Go to "Environment" tab
   - Update the `FRONTEND_URL` with your Vercel URL
   - Click "Save Changes"
   - Wait for the service to redeploy

## Step 3: Test Your Deployment

1. Visit your Vercel deployment URL (e.g., `https://ecoroute-app.vercel.app`)
2. Test the following features:
   - User registration and login
   - Route planning
   - Forum functionality
   - Profile management

## Troubleshooting Common Issues

### Backend Issues:
- **MongoDB Connection Error**: Verify your MongoDB Atlas connection string, check network access
- **Application Error**: Check Render logs for details
- **CORS Errors**: Ensure FRONTEND_URL is set correctly in the backend

### Frontend Issues:
- **API Connection Error**: Verify NEXT_PUBLIC_API_URL is set correctly
- **Blank Pages**: Check Vercel build logs and deployment
- **Missing Styles/Assets**: Ensure static files are being served correctly

## Monitoring and Maintenance

### Render Dashboard
- Monitor CPU and memory usage
- Check application logs
- Set up alerts for outages

### Vercel Dashboard
- Monitor deployment status
- Check analytics for traffic and errors
- Set up custom domains if needed

## Setting Up Custom Domains (Optional)

### Vercel Custom Domain
1. Go to your project settings
2. Click on "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

### Render Custom Domain
1. Go to your web service
2. Click on "Settings"
3. Scroll to "Custom Domains"
4. Add your custom domain
5. Follow Render's instructions to configure DNS 