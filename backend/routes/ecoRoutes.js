const express = require('express');
const { getAllRoutes, getRouteById, createRoute, updateRoute, deleteRoute, getRoutesByRegion } = require('../controllers/ecoRouteController');

// Create router using Express Router
const router = express.Router();

// Routes
router.get('/', getAllRoutes);
router.get('/region/:regionCode', getRoutesByRegion);
router.get('/:id', getRouteById);
router.post('/', createRoute);
router.put('/:id', updateRoute);
router.delete('/:id', deleteRoute);

module.exports = router;