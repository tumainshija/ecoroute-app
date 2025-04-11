const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./backend/models/User');
require('dotenv').config();

// MongoDB connection URI - adjust as needed
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecoroute';

// Test user details
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
};

async function createTestUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: testUser.email });
        if (existingUser) {
            console.log('Test user already exists!');
            console.log('Email:', testUser.email);
            console.log('Password:', testUser.password);
        } else {
            // Create new user
            const user = await User.create(testUser);
            console.log('Test user created successfully!');
            console.log('Email:', testUser.email);
            console.log('Password:', testUser.password);
        }

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error creating test user:', error);
    }
}

createTestUser();