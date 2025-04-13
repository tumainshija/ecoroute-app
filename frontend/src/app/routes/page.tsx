'use client';

import Footer from '@/app/components/Footer';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { ecoRouteApi } from '../services/api';

// Client-only dynamic import of the map component to avoid SSR issues
const Map = dynamic(() => import('../components/RouteMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-emerald-50 flex items-center justify-center">
      <div className="text-emerald-700">Loading map...</div>
    </div>
  ) 
});

// Define interface for route marker type
interface RouteMarker {
  position: [number, number];
  title: string;
  desc: string;
  distance: string;
  duration: string;
  difficulty: string;
  ecoRating: number;
  carbonSaved: string;
  image: string;
  tags: string[];
  id?: string;
}

// These are sample route markers we'll replace with data from the API
const sampleRouteMarkers: RouteMarker[] = [
  {
    position: [37.7749, -122.4194], // San Francisco
    title: 'Coastal Redwood Trail',
    desc: 'A scenic route through ancient redwood forests with minimal elevation gain. Features sustainable rest stops and electric charging stations.',
    distance: '12.4 miles',
    duration: '4-5 hours',
    difficulty: 'Moderate',
    ecoRating: 92,
    carbonSaved: '18kg',
    image: '/images/route-icon.svg', // Using existing icon as fallback
    tags: ['Hiking', 'Nature', 'Family-Friendly'],
  },
  {
    position: [34.0522, -118.2437], // Los Angeles
    title: 'Urban Green Corridor',
    desc: 'An urban route connecting parks, gardens, and eco-friendly businesses throughout the city center. Accessible via public transit.',
    distance: '8.3 miles',
    duration: '3-4 hours',
    difficulty: 'Easy',
    ecoRating: 88,
    carbonSaved: '12kg',
    image: '/images/route-icon.svg', // Using existing icon as fallback
    tags: ['Urban', 'Cultural', 'Accessible'],
  },
  {
    position: [40.7128, -74.0060], // New York
    title: 'Harbor Greenway Loop',
    desc: 'Experience both natural landscapes and urban features on this coastal route featuring bird sanctuaries and local sustainable businesses.',
    distance: '15.1 miles',
    duration: '5-6 hours',
    difficulty: 'Moderate',
    ecoRating: 85,
    carbonSaved: '20kg',
    image: '/images/route-icon.svg', // Using existing icon as fallback
    tags: ['Cycling', 'Coastal', 'Wildlife'],
  },
];

export default function RoutesPage() {
  const [isClient, setIsClient] = useState(false);
  const [routes, setRoutes] = useState<RouteMarker[]>(sampleRouteMarkers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    startName: '',
    startCity: '',
    startCountry: '',
    startRegion: '',
    destinationName: '',
    destinationCity: '',
    destinationCountry: '',
    destinationRegion: '',
    carbonSaved: 10,
    distance: 15,
    transportMode: 'walking',
    estimatedTime: 60,
    difficulty: 'Easy'
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  // Use useEffect to detect client-side rendering and fetch routes
  useEffect(() => {
    setIsClient(true);
    
    // Fetch eco routes from API
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const ecoRoutes = await ecoRouteApi.getAllRoutes();
        
        // Transform eco routes to match our route marker format
        const transformedRoutes: RouteMarker[] = ecoRoutes.map((route) => {
          // Generate random coordinates for demo purposes
          // In a real app, you would store coordinates in your backend
          const lat = 35 + Math.random() * 10;
          const lng = -120 + Math.random() * 10;
          
          return {
            position: [lat, lng] as [number, number], // Cast to tuple type
            title: `${route.start?.name || 'Unknown'} to ${route.destination?.name || 'Unknown'}`,
            desc: `Eco-friendly route from ${route.start?.name || 'Unknown'} to ${route.destination?.name || 'Unknown'}.`,
            distance: '10-15 miles', // Placeholder
            duration: '3-4 hours', // Placeholder
            difficulty: 'Moderate', // Placeholder
            ecoRating: 85 + Math.floor(Math.random() * 10), // Random high eco rating
            carbonSaved: `${route.carbonSaved}kg`,
            image: '/images/route-icon.svg',
            tags: ['Eco-Friendly', 'Saved Route'],
            id: route._id
          };
        });
        
        // Combine sample routes with API routes for now
        // In production, you might want to use only API routes
        setRoutes([...transformedRoutes, ...sampleRouteMarkers]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError('Failed to load routes. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchRoutes();
  }, []);

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateFormData({
      ...createFormData,
      [name]: value
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    setCreateSuccess(false);

    try {
      // Format the data to match API expectations
      const routeData = {
        start: {
          name: createFormData.startName,
          coordinates: {
            latitude: 35 + Math.random() * 10,
            longitude: -120 + Math.random() * 10
          },
          country: createFormData.startCountry,
          region: createFormData.startRegion,
          city: createFormData.startCity
        },
        destination: {
          name: createFormData.destinationName,
          coordinates: {
            latitude: 35 + Math.random() * 10,
            longitude: -120 + Math.random() * 10
          },
          country: createFormData.destinationCountry,
          region: createFormData.destinationRegion,
          city: createFormData.destinationCity
        },
        carbonSaved: Number(createFormData.carbonSaved),
        distance: Number(createFormData.distance),
        transportMode: createFormData.transportMode as any,
        estimatedTime: Number(createFormData.estimatedTime),
        attractions: []
      };

      // Call API to create route
      const newRoute = await ecoRouteApi.createRoute(routeData);
      
      // Add to routes with proper format for display
      const newRouteMarker: RouteMarker = {
        position: [routeData.start.coordinates.latitude, routeData.start.coordinates.longitude],
        title: `${routeData.start.name} to ${routeData.destination.name}`,
        desc: `Eco-friendly route from ${routeData.start.name} to ${routeData.destination.name}.`,
        distance: `${routeData.distance} miles`,
        duration: `${Math.floor(routeData.estimatedTime / 60)}h ${routeData.estimatedTime % 60}m`,
        difficulty: createFormData.difficulty,
        ecoRating: 85 + Math.floor(Math.random() * 10),
        carbonSaved: `${routeData.carbonSaved}kg`,
        image: '/images/route-icon.svg',
        tags: ['Eco-Friendly', 'User Created'],
        id: newRoute._id
      };
      
      setRoutes([newRouteMarker, ...routes]);
      setCreateSuccess(true);
      
      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setCreateFormData({
          startName: '',
          startCity: '',
          startCountry: '',
          startRegion: '',
          destinationName: '',
          destinationCity: '',
          destinationCountry: '',
          destinationRegion: '',
          carbonSaved: 10,
          distance: 15,
          transportMode: 'walking',
          estimatedTime: 60,
          difficulty: 'Easy'
        });
        setShowCreateModal(false);
        setCreateSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating route:', err);
      setCreateError('Failed to create route. Please check the form and try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-emerald-50">
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative h-80 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/hero.jpg)' }} // Using existing hero image
            />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-800/30 to-emerald-900/80"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
              <span className="text-sm uppercase tracking-wider mb-2 bg-emerald-700/70 px-4 py-1 rounded-full">Sustainable Journeys</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Eco-Friendly Routes</h1>
              <p className="text-lg md:text-xl max-w-2xl">
                Discover paths less traveled with minimal environmental impact
              </p>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-12">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-emerald-700">Interactive Route Explorer</h2>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                    >
                      <FaPlus size={14} />
                      <span>Create Route</span>
                    </button>
                  </div>
                  <p className="text-lg text-emerald-900 mb-8">
                    Explore our curated collection of eco-friendly routes, each designed to minimize environmental impact
                    while maximizing your connection with nature and local cultures. Hover over markers to see route details.
                  </p>

                  {/* Map Section */}
                  <div className="h-96 w-full mb-10 rounded-xl overflow-hidden shadow-md border border-emerald-100">
                    {isClient && <Map markers={routes} />}
                  </div>
                  
                  {/* Filter & Search Section - Static for now */}
                  <div className="mb-10 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                        All Routes
                      </button>
                      <button className="bg-white hover:bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-emerald-200">
                        Hiking
                      </button>
                      <button className="bg-white hover:bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-emerald-200">
                        Cycling
                      </button>
                      <button className="bg-white hover:bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-emerald-200">
                        Urban
                      </button>
                      <button className="bg-white hover:bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-emerald-200">
                        Family-Friendly
                      </button>
                      <button className="bg-white hover:bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-emerald-200">
                        Accessible
                      </button>
                    </div>
                  </div>

                  {/* Route Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                      // Loading state
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white border border-emerald-100 rounded-xl shadow-md overflow-hidden animate-pulse">
                          <div className="p-1 bg-emerald-50">
                            <div className="aspect-video bg-emerald-200 rounded-lg"></div>
                          </div>
                          <div className="p-4">
                            <div className="h-6 bg-emerald-200 rounded mb-3"></div>
                            <div className="flex gap-2 mb-3">
                              <div className="h-4 bg-emerald-100 rounded w-20"></div>
                              <div className="h-4 bg-emerald-100 rounded w-20"></div>
                              <div className="h-4 bg-emerald-100 rounded w-20"></div>
                            </div>
                            <div className="h-12 bg-emerald-100 rounded mb-3"></div>
                            <div className="flex justify-between">
                              <div className="h-6 bg-emerald-100 rounded w-24"></div>
                              <div className="h-6 bg-emerald-200 rounded w-24"></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : error ? (
                      // Error state
                      <div className="col-span-3 p-4 bg-red-50 text-red-700 rounded-lg text-center">
                        {error}
                      </div>
                    ) : (
                      routes.map((route, i) => (
                        <div key={i} className="bg-white border border-emerald-100 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                          <div className="p-1 bg-emerald-50">
                            <div className="aspect-video relative bg-emerald-100 rounded-lg overflow-hidden flex items-center justify-center">
                              <Image 
                                src={route.image} 
                                alt={route.title} 
                                width={64} 
                                height={64} 
                                className="w-16 h-16 text-emerald-700" 
                              />
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold text-emerald-800">{route.title}</h3>
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                                Eco Rating: {route.ecoRating}
                              </span>
                            </div>
                            
                            <div className="flex gap-3 mb-3 flex-wrap">
                              <div className="flex items-center text-sm text-emerald-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {route.distance}
                              </div>
                              <div className="flex items-center text-sm text-emerald-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {route.duration}
                              </div>
                              <div className="flex items-center text-sm text-emerald-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                CO₂ Saved: {route.carbonSaved}
                              </div>
                            </div>
                            
                            <p className="text-gray-700 text-sm mb-4">{route.desc}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {route.tags.map((tag: string, index: number) => (
                                <span key={index} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <button className="text-emerald-700 text-sm font-medium hover:text-emerald-900">
                                View Details
                              </button>
                              <button className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm hover:bg-emerald-700 transition-colors">
                                Start Route
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create New Route
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="p-8">
                    <span className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Impact Measurement</span>
                    <h2 className="text-3xl font-bold text-emerald-900 mt-2 mb-4">Your Green Journey Stats</h2>
                    <p className="text-emerald-700 mb-6">
                      EcoRoute measures and tracks your environmental impact each time you choose one of our routes.
                      Together, our community has prevented substantial carbon emissions through responsible travel choices.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-800 mb-1">2,458 kg</div>
                        <div className="text-sm text-emerald-600">Carbon Saved</div>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-800 mb-1">356</div>
                        <div className="text-sm text-emerald-600">Community Routes</div>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-800 mb-1">48,120</div>
                        <div className="text-sm text-emerald-600">Green Miles</div>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-800 mb-1">12,400+</div>
                        <div className="text-sm text-emerald-600">EcoTravelers</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-emerald-700 text-white p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Suggest a New Route</h3>
                    <p className="mb-6">
                      Help grow our community&apos;s sustainable travel network by suggesting new routes in your area. 
                      Share local paths that support eco-friendly transportation and showcase natural or cultural points of interest.
                    </p>
                    <Link
                      href="/create-route"
                      className="bg-white text-emerald-700 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors inline-block text-center font-medium"
                    >
                      Submit Your Route
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Create Route Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-emerald-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-emerald-800">Create New Eco-Route</h3>
                    <button 
                      onClick={() => setShowCreateModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleCreateSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="col-span-2">
                      <h4 className="text-lg font-medium text-emerald-700 mb-2">Starting Point</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                          <input
                            type="text"
                            name="startName"
                            value={createFormData.startName}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. City Park"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="startCity"
                            value={createFormData.startCity}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. San Francisco"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            name="startCountry"
                            value={createFormData.startCountry}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. USA"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Region Code</label>
                          <select
                            name="startRegion"
                            value={createFormData.startRegion}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          >
                            <option value="">Select Region</option>
                            <option value="AF">Africa (AF)</option>
                            <option value="AS">Asia (AS)</option>
                            <option value="EU">Europe (EU)</option>
                            <option value="NA">North America (NA)</option>
                            <option value="SA">South America (SA)</option>
                            <option value="OC">Oceania (OC)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <h4 className="text-lg font-medium text-emerald-700 mb-2">Destination</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                          <input
                            type="text"
                            name="destinationName"
                            value={createFormData.destinationName}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. Mountain View"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="destinationCity"
                            value={createFormData.destinationCity}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. San Jose"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            name="destinationCountry"
                            value={createFormData.destinationCountry}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. USA"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Region Code</label>
                          <select
                            name="destinationRegion"
                            value={createFormData.destinationRegion}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          >
                            <option value="">Select Region</option>
                            <option value="AF">Africa (AF)</option>
                            <option value="AS">Asia (AS)</option>
                            <option value="EU">Europe (EU)</option>
                            <option value="NA">North America (NA)</option>
                            <option value="SA">South America (SA)</option>
                            <option value="OC">Oceania (OC)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <h4 className="text-lg font-medium text-emerald-700 mb-2">Route Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Carbon Saved (kg)</label>
                          <input
                            type="number"
                            name="carbonSaved"
                            value={createFormData.carbonSaved}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Distance (miles)</label>
                          <input
                            type="number"
                            name="distance"
                            value={createFormData.distance}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Transport Mode</label>
                          <select
                            name="transportMode"
                            value={createFormData.transportMode}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          >
                            <option value="walking">Walking</option>
                            <option value="cycling">Cycling</option>
                            <option value="public_transport">Public Transport</option>
                            <option value="electric_vehicle">Electric Vehicle</option>
                            <option value="hybrid_vehicle">Hybrid Vehicle</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time (minutes)</label>
                          <input
                            type="number"
                            name="estimatedTime"
                            value={createFormData.estimatedTime}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                          <select
                            name="difficulty"
                            value={createFormData.difficulty}
                            onChange={handleCreateFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          >
                            <option value="Easy">Easy</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Challenging">Challenging</option>
                            <option value="Difficult">Difficult</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {createError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                      {createError}
                    </div>
                  )}
                  
                  {createSuccess && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
                      Route created successfully!
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createLoading}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
                    >
                      {createLoading ? 'Creating...' : 'Create Route'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
