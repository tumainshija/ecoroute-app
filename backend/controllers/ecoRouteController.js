const EcoRoute = require('../models/EcoRoute');

// Get all eco routes
exports.getAllRoutes = async(req, res) => {
    try {
        const routes = await EcoRoute.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get one eco route by ID
exports.getRouteById = async(req, res) => {
    try {
        const route = await EcoRoute.findById(req.params.id);
        if (!route) return res.status(404).json({ message: 'Route not found' });
        res.json(route);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get routes by region
exports.getRoutesByRegion = async(req, res) => {
    try {
        const { regionCode } = req.params;

        // Find routes that have start or destination in this region
        const routes = await EcoRoute.find({
            $or: [
                { 'start.region': regionCode },
                { 'destination.region': regionCode }
            ]
        });

        if (routes.length === 0) {
            return res.status(404).json({ message: 'No routes found for this region' });
        }

        res.json(routes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new eco route
exports.createRoute = async(req, res) => {
    try {
        const {
            start,
            destination,
            carbonSaved,
            distance,
            transportMode,
            estimatedTime,
            attractions
        } = req.body;

        // Validate required fields
        if (!start || !destination || !carbonSaved || !distance || !transportMode || !estimatedTime) {
            return res.status(400).json({
                message: 'Missing required fields. Please provide all required route information.'
            });
        }

        const newRoute = new EcoRoute({
            start,
            destination,
            carbonSaved,
            distance,
            transportMode,
            estimatedTime,
            attractions
        });

        await newRoute.save();
        res.status(201).json(newRoute);
    } catch (err) {
        console.error('Error creating route:', err);
        res.status(400).json({ message: err.message });
    }
};

// Update an eco route
exports.updateRoute = async(req, res) => {
    try {
        const {
            start,
            destination,
            carbonSaved,
            distance,
            transportMode,
            estimatedTime,
            attractions
        } = req.body;

        const updateData = {
            ...(start && { start }),
            ...(destination && { destination }),
            ...(carbonSaved !== undefined && { carbonSaved }),
            ...(distance !== undefined && { distance }),
            ...(transportMode && { transportMode }),
            ...(estimatedTime !== undefined && { estimatedTime }),
            ...(attractions && { attractions })
        };

        const updatedRoute = await EcoRoute.findByIdAndUpdate(
            req.params.id,
            updateData, { new: true, runValidators: true }
        );

        if (!updatedRoute) return res.status(404).json({ message: 'Route not found' });
        res.json(updatedRoute);
    } catch (err) {
        console.error('Error updating route:', err);
        res.status(400).json({ message: err.message });
    }
};

// Delete an eco route
exports.deleteRoute = async(req, res) => {
    try {
        const deletedRoute = await EcoRoute.findByIdAndDelete(req.params.id);
        if (!deletedRoute) return res.status(404).json({ message: 'Route not found' });
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};