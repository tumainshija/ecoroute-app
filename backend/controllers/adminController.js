const User = require('../models/User');
const EcoRoute = require('../models/EcoRoute');
const os = require('os');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
exports.getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin
exports.updateUser = async(req, res) => {
    try {
        const { username, email, firstName, lastName } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id, { username, email, firstName, lastName }, { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/analytics
// @access  Admin
exports.getAnalytics = async(req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: firstDayOfMonth }
        });

        const routes = await EcoRoute.find();
        const totalRoutes = routes.length;

        const routesThisMonth = routes.filter(route =>
            route.createdAt && new Date(route.createdAt) >= firstDayOfMonth
        ).length;

        const totalCarbonSaved = routes.reduce((total, route) =>
            total + (route.carbonSaved || 0), 0
        );

        const carbonSavedThisMonth = routes
            .filter(route => route.createdAt && new Date(route.createdAt) >= firstDayOfMonth)
            .reduce((total, route) => total + (route.carbonSaved || 0), 0);

        const startPoints = routes.map(route => route.start ? route.start.name : 'Unknown');
        const destinations = routes.map(route => route.destination ? route.destination.name : 'Unknown');

        const analytics = {
            totalUsers,
            newUsersThisMonth,
            totalRoutes,
            routesThisMonth,
            totalCarbonSaved,
            carbonSavedThisMonth,
            mostPopularStartPoint: getMostFrequent(startPoints),
            mostPopularDestination: getMostFrequent(destinations)
        };

        res.status(200).json({ success: true, analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get general stats for dashboard
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async(req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: firstDayOfMonth }
        });

        const routes = await EcoRoute.find();
        const totalRoutes = routes.length;

        const routesThisMonth = routes.filter(route =>
            route.createdAt && new Date(route.createdAt) >= firstDayOfMonth
        ).length;

        const totalCarbonSaved = routes.reduce((total, route) =>
            total + (route.carbonSaved || 0), 0
        );

        const carbonSavedThisMonth = routes
            .filter(route => route.createdAt && new Date(route.createdAt) >= firstDayOfMonth)
            .reduce((total, route) => total + (route.carbonSaved || 0), 0);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                newUsersThisMonth,
                totalRoutes,
                routesThisMonth,
                totalCarbonSaved,
                carbonSavedThisMonth
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user statistics
// @route   GET /api/admin/users
// @access  Admin
exports.getUserStats = async(req, res) => {
    try {
        const users = await User.find().select('-password');
        const totalUsers = users.length;

        // Get basic user statistics
        const userStats = {
            totalUsers,
            activeUsers: totalUsers, // In a real app, you would calculate active users
            newUsers: users.filter(user => {
                const createdDate = new Date(user.createdAt);
                const now = new Date();
                const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
                return createdDate >= oneWeekAgo;
            }).length
        };

        res.status(200).json({
            success: true,
            userStats,
            users: users.map(user => ({
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get system status
// @route   GET /api/admin/system
// @access  Admin
exports.getSystemStatus = async(req, res) => {
    try {
        const systemInfo = {
            platform: os.platform(),
            architecture: os.arch(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            uptime: os.uptime(),
            cpus: os.cpus().length,
            serverTime: new Date().toISOString()
        };

        res.status(200).json({
            success: true,
            systemInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get route statistics
// @route   GET /api/admin/routes
// @access  Admin
exports.getRouteStats = async(req, res) => {
    try {
        const routes = await EcoRoute.find();

        // Calculate transport mode distribution
        const transportModes = {};
        routes.forEach(route => {
            const mode = route.transportMode || 'unknown';
            transportModes[mode] = (transportModes[mode] || 0) + 1;
        });

        // Calculate average carbon saved per route
        const totalCarbonSaved = routes.reduce((total, route) =>
            total + (route.carbonSaved || 0), 0);
        const avgCarbonSaved = routes.length > 0 ? totalCarbonSaved / routes.length : 0;

        // Get most popular start points and destinations
        const startPoints = routes.map(route => route.start ? route.start.name : 'Unknown');
        const destinations = routes.map(route => route.destination ? route.destination.name : 'Unknown');

        res.status(200).json({
            success: true,
            routeStats: {
                totalRoutes: routes.length,
                transportModes,
                totalCarbonSaved,
                avgCarbonSaved,
                mostPopularStartPoint: getMostFrequent(startPoints),
                mostPopularDestination: getMostFrequent(destinations)
            },
            recentRoutes: routes.slice(0, 10) // Get 10 most recent routes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Helper function to find most frequent item in an array
const getMostFrequent = (arr) => {
    if (arr.length === 0) return undefined;

    const frequency = {};
    let maxFreq = 0;
    let mostFrequent;

    for (const item of arr) {
        frequency[item] = (frequency[item] || 0) + 1;
        if (frequency[item] > maxFreq) {
            maxFreq = frequency[item];
            mostFrequent = item;
        }
    }

    return mostFrequent;
};