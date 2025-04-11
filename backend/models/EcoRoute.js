const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    country: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true }
}, { _id: false });

const EcoRouteSchema = new mongoose.Schema({
    start: { type: LocationSchema, required: true },
    destination: { type: LocationSchema, required: true },
    carbonSaved: { type: Number, required: true },
    distance: { type: Number, required: true },
    transportMode: { type: String, enum: ['walking', 'cycling', 'public_transport', 'electric_vehicle', 'hybrid_vehicle'], required: true },
    estimatedTime: { type: Number, required: true }, // in minutes
    attractions: [{
        name: String,
        description: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        culturalSignificance: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EcoRoute', EcoRouteSchema);