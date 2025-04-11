const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createSampleRoutes } = require('./utils/testData');
require('dotenv').config();

const app = express();

// CORS configuration - Allow requests from our frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/routes', require('./routes/ecoRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// MongoDB Connection
const connectDB = async() => {
    try {
        if (process.env.NODE_ENV === 'production') {
            // Use production MongoDB connection
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Production MongoDB connected successfully');
        } else {
            // Use MongoDB Memory Server for development
            console.log('Starting MongoDB Memory Server for development...');
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            console.log(`MongoDB Memory Server running at ${uri}`);

            await mongoose.connect(uri);
            console.log('MongoDB connected successfully');

            // Create sample data
            await createSampleRoutes();
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

connectDB();

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});