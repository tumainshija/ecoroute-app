const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Create router using Express Router
const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;