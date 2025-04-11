const express = require('express');
const { getStats, getUserStats, getSystemStatus, getRouteStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Create router using Express Router
const router = express.Router();

// Routes
router.get('/stats', protect, getStats);
router.get('/users', protect, getUserStats);
router.get('/system', protect, getSystemStatus);
router.get('/routes', protect, getRouteStats);

module.exports = router;