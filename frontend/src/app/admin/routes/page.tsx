'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EcoRoute } from '../../services/api';

export default function AdminRoutes() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [routes, setRoutes] = useState<EcoRoute[]>([]);
  const [isRoutesLoading, setIsRoutesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    estimatedTime: 60
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        // Check if user has admin role
        setIsAdmin(user?.email === 'admin@ecoroute.com');
        
        if (user?.email !== 'admin@ecoroute.com') {
          router.push('/');
        } else {
          // Fetch routes data if admin
          fetchRoutes();
        }
      }
    }
  }, [isAuthenticated, isLoading, router, user, token]);

  const fetchRoutes = async () => {
    setIsRoutesLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/routes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }
      
      const data = await response.json();
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching routes:', err);
    } finally {
      setIsRoutesLoading(false);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (!confirm('Are you sure you want to delete this route?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/routes/${routeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete route');
      }
      
      // Refresh routes list
      fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting route:', err);
    }
  };

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
        transportMode: createFormData.transportMode as 'walking' | 'cycling' | 'public_transport' | 'electric_vehicle' | 'hybrid_vehicle',
        estimatedTime: Number(createFormData.estimatedTime),
        attractions: []
      };

      // Call API to create route
      const response = await fetch('http://localhost:5000/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(routeData)
      });

      if (!response.ok) {
        throw new Error('Failed to create route');
      }

      setCreateSuccess(true);
      fetchRoutes(); // Refresh the routes list
      
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
          estimatedTime: 60
        });
        setShowCreateModal(false);
        setCreateSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating route:', err);
      setCreateError(err instanceof Error ? err.message : 'Failed to create route');
    } finally {
      setCreateLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-green-600">EcoRoute Admin</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link 
                href="/admin"
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
              >
                Dashboard
              </Link>
              <Link 
                href="/"
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Routes Management</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="border-b border-gray-200 px-4 py-4 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">All Routes</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm">
                      Total Carbon Saved: {routes.reduce((total, route) => total + route.carbonSaved, 0).toFixed(2)} kg
                    </span>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Route
                    </button>
                  </div>
                </div>
                
                {isRoutesLoading ? (
                  <div className="text-center py-4">Loading routes...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Start Point
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Destination
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Carbon Saved (kg)
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created At
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {routes.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              No routes found
                            </td>
                          </tr>
                        ) : (
                          routes.map((route) => (
                            <tr key={route._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {route.start?.name || 'Unknown'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {route.destination?.name || 'Unknown'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {route.carbonSaved.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {route.createdAt ? new Date(route.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteRoute(route._id!)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Route Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Create New Route</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-2">
                  <h4 className="text-base font-medium text-gray-900 mb-2">Starting Point</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                      <input
                        type="text"
                        name="startName"
                        value={createFormData.startName}
                        onChange={handleCreateFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  <h4 className="text-base font-medium text-gray-900 mb-2">Destination</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                      <input
                        type="text"
                        name="destinationName"
                        value={createFormData.destinationName}
                        onChange={handleCreateFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  <h4 className="text-base font-medium text-gray-900 mb-2">Route Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Carbon Saved (kg)</label>
                      <input
                        type="number"
                        name="carbonSaved"
                        value={createFormData.carbonSaved}
                        onChange={handleCreateFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {createError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {createError}
                </div>
              )}
              
              {createSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                  Route created successfully!
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 