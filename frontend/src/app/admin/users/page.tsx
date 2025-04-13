'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// User interface
interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

export default function AdminUsers() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          // Fetch users data if admin
          fetchUsers();
        }
      }
    }
  }, [isAuthenticated, isLoading, router, user, token]);

  const fetchUsers = async () => {
    setIsUserLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      console.error('Error fetching users:', err);
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await api.delete(`/admin/users/${userId}`);
      // Refresh users list
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      console.error('Error deleting user:', err);
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
            <h1 className="text-3xl font-bold leading-tight text-gray-900">User Management</h1>
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
                <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">All Users</h2>
                </div>
                
                {isUserLoading ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {users.length === 0 ? (
                      <li className="px-6 py-4 text-center text-gray-500">No users found</li>
                    ) : (
                      users.map((user) => (
                        <li key={user.id} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {(user.firstName || user.lastName) && (
                                <div className="text-sm text-gray-500">
                                  {user.firstName} {user.lastName}
                                </div>
                              )}
                              {user.createdAt && (
                                <div className="text-xs text-gray-400">
                                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 