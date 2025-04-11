const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async(req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with that email or username already exists'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            firstName,
            lastName
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture
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

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
                bio: user.bio,
                location: user.location,
                website: user.website,
                socialLinks: user.socialLinks,
                createdAt: user.createdAt
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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async(req, res) => {
    try {
        const { firstName, lastName, username, email, bio, location, website, socialLinks, profilePicture } = req.body;

        // Check if username or email is being changed and already exists
        if (username || email) {
            const existingUser = await User.findOne({
                $and: [
                    { _id: { $ne: req.user.id } },
                    {
                        $or: [
                            { username: username },
                            { email: email }
                        ]
                    }
                ]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username or email already in use by another account'
                });
            }
        }

        // Build update object with only provided fields
        const updateFields = {};
        if (firstName !== undefined) updateFields.firstName = firstName;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (username !== undefined) updateFields.username = username;
        if (email !== undefined) updateFields.email = email;
        if (profilePicture !== undefined) updateFields.profilePicture = profilePicture;

        // Add new profile fields
        if (bio !== undefined) updateFields.bio = bio;
        if (location !== undefined) updateFields.location = location;
        if (website !== undefined) updateFields.website = website;
        if (socialLinks !== undefined) updateFields.socialLinks = socialLinks;

        // Handle metadata object if provided
        if (req.body.metadata) {
            const { metadata } = req.body;
            if (metadata.bio !== undefined) updateFields.bio = metadata.bio;
            if (metadata.location !== undefined) updateFields.location = metadata.location;
            if (metadata.website !== undefined) updateFields.website = metadata.website;
            if (metadata.socialLinks !== undefined) updateFields.socialLinks = metadata.socialLinks;
        }

        // Find user and update
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateFields, { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
                bio: user.bio,
                location: user.location,
                website: user.website,
                socialLinks: user.socialLinks
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

// Export all the controller functions
module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};