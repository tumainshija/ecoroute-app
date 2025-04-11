# EcoRoute Application

EcoRoute is a web application that helps users plan eco-friendly travel routes, calculate carbon savings, and make more sustainable transportation choices.

## Features

- Interactive route planning with eco-friendly options
- Carbon savings calculator 
- User profiles and route history
- Environmental impact tracking
- Admin dashboard for route management

## Project Structure

- `frontend/`: Next.js application
- `backend/`: Express.js API server

## Prerequisites

- Node.js (v18 or newer)
- npm (included with Node.js)
- MongoDB (optional - in-memory database available for development)

## Local Development

1. Clone this repository
2. Install dependencies:
   ```
   npm run install:all
   ```
3. Set up environment variables:
   - Create `.env.local` in the frontend directory
   - Create `.env` in the backend directory
   
4. Start development servers:
   ```
   npm run dev
   ```
   This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000)

## Deployment

### Option 1: Traditional Hosting

#### Backend Deployment

1. Deploy the backend to a Node.js hosting service (Heroku, DigitalOcean, etc.)
2. Set up environment variables:
   - `PORT`: The port to run the server (typically provided by the hosting platform)
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret for JWT token generation
   - `FRONTEND_URL`: URL of your deployed frontend (for CORS)

#### Frontend Deployment

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```
2. Deploy the generated `.next` folder to a static site host (Vercel, Netlify, etc.)
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL
   - `NEXT_PUBLIC_USE_PROXY`: Set to 'false' for production deployment

### Option 2: Vercel Deployment (Frontend)

1. Connect your GitHub repository to Vercel
2. Configure the following in Vercel's deployment settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Framework Preset: Next.js
   - Environment Variables: same as above

### Option 3: Docker Deployment

1. Build and run the Docker containers:
   ```
   docker-compose up -d
   ```
   This will start both frontend and backend services.

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://your-backend-url/api
NEXT_PUBLIC_USE_PROXY=false
```

### Backend (.env)

```
PORT=5000
MONGO_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-secret-key
FRONTEND_URL=http://your-frontend-url
```

## License

MIT 