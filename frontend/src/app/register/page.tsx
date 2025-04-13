'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, logError, isNetworkError } from '../utils/errorUtils';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowRetry(false);
    
    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate username
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      await register(username, email, password, firstName, lastName);
      // No need to redirect here as it's handled in the AuthContext
    } catch (error: unknown) {
      logError('RegisterPage.handleRegister', error, { email, username });
      const errorMessage = getErrorMessage(error, 'An error occurred during registration');
      setError(errorMessage);
      
      // Show retry button for network errors
      setShowRetry(isNetworkError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-12">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Join EcoRoute
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            <div>{error}</div>
            {showRetry && (
              <button
                type="button"
                onClick={handleRegister}
                className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="block mb-4">
            <span className="text-gray-700">First Name</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
              disabled={isLoading}
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700">Last Name</span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
              disabled={isLoading}
            />
          </label>
        </div>

        <label className="block mb-4">
          <span className="text-gray-700">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
            required
            disabled={isLoading}
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
            required
            disabled={isLoading}
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
            required
            minLength={6}
            disabled={isLoading}
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700">Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
            required
            minLength={6}
            disabled={isLoading}
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors disabled:bg-green-400 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
} 