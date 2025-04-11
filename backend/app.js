const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createSampleRoutes } = require('./utils/testData');
require('dotenv').config();

const app = express();

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://ecoroute-app.vercel.app',
    'https://yourusername.github.io' // Update this with your GitHub username
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is allowed
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    },
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