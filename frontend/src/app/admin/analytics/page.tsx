'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EcoRoute } from '../../services/api';

// Analytics data interface
interface AnalyticsData {
  totalUsers: number;
  newUsersThisMonth: number;
  totalRoutes: number;
  routesThisMonth: number;
  totalCarbonSaved: number;
  carbonSavedThisMonth: number;
  mostPopularStartPoint?: string;
  mostPopularDestination?: string;
}

export default function AdminAnalytics() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<EcoRoute[]>([]);

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
          // Fetch analytics data if admin
          fetchAnalyticsData();
        }
      }
    }
  }, [isAuthenticated, isLoading, router, user, token]);

  const fetchAnalyticsData = async () => {
    setIsAnalyticsLoading(true);
    setError(null);
    
    try {
      // In a real application, you would fetch this from a dedicated analytics endpoint
      // Here we're simulating this with the available data
      
      // Fetch users
      const usersResponse = await fetch('http://localhost:5001/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const usersData = await usersResponse.json();
      
      // Fetch routes
      const routesResponse = await fetch('http://localhost:5001/api/routes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!routesResponse.ok) {
        throw new Error('Failed to fetch routes');
      }
      
      const routesData = await routesResponse.json();
      setRoutes(routesData);
      
      // Calculate analytics
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Filter data for this month
      const usersThisMonth = usersData.users.filter((u: any) => 
        new Date(u.createdAt) >= firstDayOfMonth
      );
      
      const routesThisMonth = routesData.filter((r: EcoRoute) => 
        r.createdAt && new Date(r.createdAt) >= firstDayOfMonth
      );
      
      // Calculate total carbon saved
      const totalCarbonSaved = routesData.reduce((total: number, route: EcoRoute) => 
        total + route.carbonSaved, 0
      );
      
      const carbonSavedThisMonth = routesThisMonth.reduce((total: number, route: EcoRoute) => 
        total + route.carbonSaved, 0
      );
      
      // Find most popular locations
      const startPoints = routesData.map((r: EcoRoute) => r.start?.name || 'Unknown');
      const destinations = routesData.map((r: EcoRoute) => r.destination?.name || 'Unknown');
      
      const mostPopularStartPoint = getMostFrequent(startPoints);
      const mostPopularDestination = getMostFrequent(destinations);
      
      // Set analytics data
      setAnalytics({
        totalUsers: usersData.users.length,
        newUsersThisMonth: usersThisMonth.length,
        totalRoutes: routesData.length,
        routesThisMonth: routesThisMonth.length,
        totalCarbonSaved,
        carbonSavedThisMonth,
        mostPopularStartPoint,
        mostPopularDestination,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching analytics:', err);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };
  
  // Helper function to find most frequent item in an array
  const getMostFrequent = (arr: string[]): string | undefined => {
    if (arr.length === 0) return undefined;
    
    const frequency: Record<string, number> = {};
    let maxFreq = 0;
    let mostFrequent: string | undefined;
    
    for (const item of arr) {
      frequency[item] = (frequency[item] || 0) + 1;
      
      if (frequency[item] > maxFreq) {
        maxFreq = frequency[item];
        mostFrequent = item;
      }
    }
    
    return mostFrequent;
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
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Analytics Dashboard</h1>
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
              
              {isAnalyticsLoading ? (
                <div className="text-center py-4">Loading analytics...</div>
              ) : (
                <>
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {/* Users Stats */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Total Users
                              </dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {analytics?.totalUsers}
                                </div>
                                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                  <span>{analytics?.newUsersThisMonth} new this month</span>
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Routes Stats */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Total Routes
                              </dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {analytics?.totalRoutes}
                                </div>
                                <div className="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
                                  <span>{analytics?.routesThisMonth} new this month</span>
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Carbon Stats */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Total Carbon Saved
                              </dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {analytics?.totalCarbonSaved.toFixed(2)} kg
                                </div>
                                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                  <span>{analytics?.carbonSavedThisMonth.toFixed(2)} kg this month</span>
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Popular Locations */}
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Popular Locations
                      </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Most Popular Starting Point
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {analytics?.mostPopularStartPoint || 'Not enough data'}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Most Popular Destination
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {analytics?.mostPopularDestination || 'Not enough data'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Recent Routes */}
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Routes
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        The 5 most recent eco-routes created on the platform
                      </p>
                    </div>
                    <div className="border-t border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Start
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Destination
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Carbon Saved
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {routes.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                  No routes found
                                </td>
                              </tr>
                            ) : (
                              // Sort routes by creation date (descending) and take the first 5
                              [...routes]
                                .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                                .slice(0, 5)
                                .map((route) => (
                                  <tr key={route._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {route.start?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {route.destination?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {route.carbonSaved.toFixed(2)} kg
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {route.createdAt ? new Date(route.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 