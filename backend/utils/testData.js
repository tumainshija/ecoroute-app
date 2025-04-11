const EcoRoute = require('../models/EcoRoute');

/**
 * Creates sample eco routes in the database
 */
async function createSampleRoutes() {
    try {
        // Check if we already have routes
        const count = await EcoRoute.countDocuments();
        if (count > 0) {
            console.log('Sample routes already exist, skipping creation');
            return;
        }

        // Sample route data with updated schema
        const routes = [{
                start: {
                    name: 'New York City',
                    coordinates: {
                        latitude: 40.7128,
                        longitude: -74.0060
                    },
                    country: 'United States',
                    region: 'NA', // North America
                    city: 'New York'
                },
                destination: {
                    name: 'Boston',
                    coordinates: {
                        latitude: 42.3601,
                        longitude: -71.0589
                    },
                    country: 'United States',
                    region: 'NA',
                    city: 'Boston'
                },
                carbonSaved: 45.2,
                distance: 346,
                transportMode: 'public_transport',
                estimatedTime: 240,
                attractions: [{
                    name: 'Freedom Trail',
                    description: 'Historic 2.5-mile trail through Boston',
                    coordinates: {
                        latitude: 42.3601,
                        longitude: -71.0589
                    },
                    culturalSignificance: 'Historic landmark showcasing American Revolution sites'
                }]
            },
            {
                start: {
                    name: 'London',
                    coordinates: {
                        latitude: 51.5074,
                        longitude: -0.1278
                    },
                    country: 'United Kingdom',
                    region: 'EU', // Europe
                    city: 'London'
                },
                destination: {
                    name: 'Edinburgh',
                    coordinates: {
                        latitude: 55.9533,
                        longitude: -3.1883
                    },
                    country: 'United Kingdom',
                    region: 'EU',
                    city: 'Edinburgh'
                },
                carbonSaved: 68.5,
                distance: 534,
                transportMode: 'electric_vehicle',
                estimatedTime: 450,
                attractions: [{
                    name: 'Edinburgh Castle',
                    description: 'Historic fortress dominating the skyline of Edinburgh',
                    coordinates: {
                        latitude: 55.9486,
                        longitude: -3.1999
                    },
                    culturalSignificance: 'Symbol of Scottish heritage and resilience'
                }]
            },
            {
                start: {
                    name: 'Tokyo',
                    coordinates: {
                        latitude: 35.6762,
                        longitude: 139.6503
                    },
                    country: 'Japan',
                    region: 'AS', // Asia
                    city: 'Tokyo'
                },
                destination: {
                    name: 'Kyoto',
                    coordinates: {
                        latitude: 35.0116,
                        longitude: 135.7681
                    },
                    country: 'Japan',
                    region: 'AS',
                    city: 'Kyoto'
                },
                carbonSaved: 52.8,
                distance: 461,
                transportMode: 'public_transport',
                estimatedTime: 165,
                attractions: [{
                    name: 'Fushimi Inari Taisha',
                    description: 'Famous shrine with thousands of torii gates',
                    coordinates: {
                        latitude: 34.9671,
                        longitude: 135.7727
                    },
                    culturalSignificance: 'Important Shinto shrine dedicated to Inari, the god of rice'
                }]
            },
            {
                start: {
                    name: 'Sydney',
                    coordinates: {
                        latitude: -33.8688,
                        longitude: 151.2093
                    },
                    country: 'Australia',
                    region: 'OC', // Oceania
                    city: 'Sydney'
                },
                destination: {
                    name: 'Melbourne',
                    coordinates: {
                        latitude: -37.8136,
                        longitude: 144.9631
                    },
                    country: 'Australia',
                    region: 'OC',
                    city: 'Melbourne'
                },
                carbonSaved: 76.2,
                distance: 878,
                transportMode: 'hybrid_vehicle',
                estimatedTime: 630,
                attractions: [{
                    name: 'Great Ocean Road',
                    description: 'Scenic coastal drive with stunning views',
                    coordinates: {
                        latitude: -38.7414,
                        longitude: 143.5699
                    },
                    culturalSignificance: 'Built by returned soldiers as a war memorial'
                }]
            }
        ];

        // Insert routes
        await EcoRoute.insertMany(routes);
        console.log('Sample eco routes created successfully');
    } catch (error) {
        console.error('Error creating sample routes:', error);
    }
}

module.exports = {
    createSampleRoutes
};