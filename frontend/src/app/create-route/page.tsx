'use client';

import Footer from '@/app/components/Footer';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ecoRouteApi } from '../services/api';

export default function CreateRoutePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Format the data to match API expectations
      const routeData = {
        start: {
          name: formData.startName,
          coordinates: {
            latitude: 35 + Math.random() * 10,
            longitude: -120 + Math.random() * 10
          },
          country: formData.startCountry,
          region: formData.startRegion,
          city: formData.startCity
        },
        destination: {
          name: formData.destinationName,
          coordinates: {
            latitude: 35 + Math.random() * 10,
            longitude: -120 + Math.random() * 10
          },
          country: formData.destinationCountry,
          region: formData.destinationRegion,
          city: formData.destinationCity
        },
        carbonSaved: Number(formData.carbonSaved),
        distance: Number(formData.distance),
        transportMode: formData.transportMode as 'walking' | 'cycling' | 'public_transport' | 'electric_vehicle' | 'hybrid_vehicle',
        estimatedTime: Number(formData.estimatedTime),
        attractions: []
      };

      // Call API to create route
      await ecoRouteApi.createRoute(routeData);
      
      setSuccess(true);
      
      // Redirect after successful creation
      setTimeout(() => {
        router.push('/routes');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating route:', err);
      setError('Failed to create route. Please check the form and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-emerald-50">
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative h-60 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/hero.jpg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-800/30 to-emerald-900/80"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
              <span className="text-sm uppercase tracking-wider mb-2 bg-emerald-700/70 px-4 py-1 rounded-full">Design Your Journey</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Create New Eco-Route</h1>
              <p className="text-lg md:text-xl max-w-2xl">
                Share sustainable paths and minimize environmental impact
              </p>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-12">
                <div className="p-8">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="col-span-2">
                        <h4 className="text-lg font-medium text-emerald-700 mb-4 pb-2 border-b border-emerald-100">Starting Point</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                            <input
                              type="text"
                              name="startName"
                              value={formData.startName}
                              onChange={handleFormChange}
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
                              value={formData.startCity}
                              onChange={handleFormChange}
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
                              value={formData.startCountry}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="e.g. USA"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Region Code</label>
                            <select
                              name="startRegion"
                              value={formData.startRegion}
                              onChange={handleFormChange}
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
                        <h4 className="text-lg font-medium text-emerald-700 mb-4 pb-2 border-b border-emerald-100">Destination</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                            <input
                              type="text"
                              name="destinationName"
                              value={formData.destinationName}
                              onChange={handleFormChange}
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
                              value={formData.destinationCity}
                              onChange={handleFormChange}
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
                              value={formData.destinationCountry}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="e.g. USA"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Region Code</label>
                            <select
                              name="destinationRegion"
                              value={formData.destinationRegion}
                              onChange={handleFormChange}
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
                        <h4 className="text-lg font-medium text-emerald-700 mb-4 pb-2 border-b border-emerald-100">Route Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Carbon Saved (kg)</label>
                            <input
                              type="number"
                              name="carbonSaved"
                              value={formData.carbonSaved}
                              onChange={handleFormChange}
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
                              value={formData.distance}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transport Mode</label>
                            <select
                              name="transportMode"
                              value={formData.transportMode}
                              onChange={handleFormChange}
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
                              value={formData.estimatedTime}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                              name="difficulty"
                              value={formData.difficulty}
                              onChange={handleFormChange}
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
                    
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                        {error}
                      </div>
                    )}
                    
                    {success && (
                      <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
                        Route created successfully! Redirecting to routes page...
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-8">
                      <button
                        type="button"
                        onClick={() => router.push('/routes')}
                        className="px-4 py-2 border border-emerald-300 rounded-lg text-emerald-700 hover:bg-emerald-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 flex items-center"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          'Create Route'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="bg-white shadow-lg rounded-xl overflow-hidden p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex flex-col items-center text-center">
                    <div className="bg-emerald-100 p-4 rounded-full mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">Sustainable Paths</h3>
                    <p className="text-gray-600">Contribute routes that minimize environmental impact while showcasing natural beauty.</p>
                  </div>
                  
                  <div className="md:w-1/3 flex flex-col items-center text-center">
                    <div className="bg-emerald-100 p-4 rounded-full mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">Local Knowledge</h3>
                    <p className="text-gray-600">Share insider knowledge about local eco-friendly routes and hidden gems.</p>
                  </div>
                  
                  <div className="md:w-1/3 flex flex-col items-center text-center">
                    <div className="bg-emerald-100 p-4 rounded-full mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">Carbon Calculation</h3>
                    <p className="text-gray-600">Our system helps estimate the carbon savings for your contributed routes.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
} 