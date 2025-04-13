'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Current path for active navigation highlighting
  const path = '/profile';

  // Redirect if not authenticated
  useEffect(() => {
    let isMounted = true;
    
    if (!isLoading && !isAuthenticated && isMounted) {
      router.push('/login');
    }
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, router]);

  // Mock eco stats - would normally be fetched from API
  const ecoStats = {
    carbonSaved: 157,
    routesTaken: 18,
    trees: 5
  };

  // Mock routes data - would normally be fetched from API
  const routes = [
    {
      id: '1',
      name: 'Home to Office',
      date: '2023-09-15',
      distance: 8.5,
      carbonSaved: 2.3,
      transportMode: 'cycling',
      favorite: true
    },
    {
      id: '2',
      name: 'Downtown Shopping Trip',
      date: '2023-09-10',
      distance: 12.7,
      carbonSaved: 3.5,
      transportMode: 'public_transport',
      favorite: false
    },
    {
      id: '3',
      name: 'Weekend Park Visit',
      date: '2023-09-03',
      distance: 5.2,
      carbonSaved: 1.4,
      transportMode: 'walking',
      favorite: true
    }
  ];

  const handleLogout = () => {
    setShowLogoutConfirmation(false);
    logout();
  };

  // Handle any errors that might occur during loading
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-600 flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">Error loading profile</span>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
          <div className="text-xl text-gray-700">Loading your profile...</div>
          <p className="text-gray-500 mt-2">This will only take a moment</p>
        </div>
      </div>
    );
  }

  // Return null if user is not logged in, the useEffect will handle redirection
  if (!user) {
    return null;
  }

  // Safe user display values
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const username = user.username || 'user';
  const email = user.email || '';
  const initials = (firstName?.[0] || username?.[0] || 'U').toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim() || username;
  // New profile fields - with safe fallbacks
  const bio = user.bio || 'No bio provided yet.';
  const location = user.location || 'Not specified';
  const website = user.website || '';
  const socialLinks = user.socialLinks || [];

  // Profile Overview Tab
  const renderOverviewTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        {/* Bio Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
          <p className="text-gray-700">{bio}</p>
        </div>
        
        {/* Location & Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {location && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </h3>
              <p className="text-gray-700">{location}</p>
            </div>
          )}
          
          {website && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                </svg>
                Website
              </h3>
              <a 
                href={website.startsWith('http') ? website : `https://${website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                {website}
              </a>
            </div>
          )}
        </div>
        
        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Social Profiles</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                >
                  <span className="font-medium">{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Routes Tab
  const renderRoutesTab = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Recent Routes</h3>
          <Link 
            href="/routes" 
            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {routes.map(route => (
          <div key={route.id} className="p-4 hover:bg-gray-50 transition">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{route.name}</div>
                <div className="text-sm text-gray-500">{route.date}</div>
              </div>
              <div className="text-right">
                <div className="text-emerald-600 font-medium">{route.carbonSaved} kg CO₂ saved</div>
                <div className="text-sm text-gray-500">{route.distance} km</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Badges Tab
  const renderBadgesTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center py-8">
        <div className="inline-block p-3 rounded-full bg-emerald-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Badges Coming Soon</h3>
        <p className="text-gray-500 max-w-md mx-auto">Complete eco-friendly routes to earn badges and showcase your commitment to the environment.</p>
      </div>
    </div>
  );

  // Settings Tab
  const renderSettingsTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Account Settings</h3>
          <Link
            href="/profile/edit"
            className="block w-full sm:w-auto sm:inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-center"
          >
            Edit Profile
          </Link>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-medium text-red-600 mb-4">Danger Zone</h3>
          <button
            onClick={() => setShowLogoutConfirmation(true)}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
  
  // This function determines which tab content to show
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'routes':
        return renderRoutesTab();
      case 'badges':
        return renderBadgesTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logout confirmation modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Sign Out</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowLogoutConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-emerald-800 py-6 px-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="text-white text-2xl font-bold flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <Image 
                  src="/images/ecoroute-logo.svg" 
                  alt="EcoRoute Logo" 
                  width={140} 
                  height={40} 
                  priority
                  className="filter brightness-0 invert"
                />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-200/90 flex items-center justify-center text-xl font-bold text-emerald-800 mr-3">
                  {initials}
                </div>
                <div>
                  <div className="text-white font-semibold">{fullName}</div>
                  <div className="text-emerald-200 text-sm">{email}</div>
                </div>
              </div>
            </div>
            
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/planner" 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  path.includes('planner')
                    ? 'bg-emerald-700/50 text-white' 
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Planner
              </Link>
              <Link 
                href="/routes" 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  path.includes('routes')
                    ? 'bg-emerald-700/50 text-white' 
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Routes
              </Link>
              <Link 
                href="/calculator" 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  path.includes('calculator')
                    ? 'bg-emerald-700/50 text-white' 
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                </svg>
                Calculator
              </Link>
              <Link 
                href="/ar-tours" 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  path.includes('ar-tours')
                    ? 'bg-emerald-700/50 text-white' 
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                AR Tours
              </Link>
              <Link 
                href="/profile" 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  path.includes('profile')
                    ? 'bg-emerald-700/50 text-white' 
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Profile
              </Link>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutConfirmation(true);
                }}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  path.includes('profile')
                    ? 'bg-emerald-700/50 text-white' 
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10 8a1 1 0 00-1-1H8a1 1 0 100 2h4a1 1 0 001-1zm-8-5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm9 5a1 1 0 011 1v3a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h8z" clipRule="evenodd" />
                </svg>
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}
      
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,800 C300,800 400,0 800,0 L800,800 L0,800 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-6xl mx-auto p-4 sm:p-6 relative z-10">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between py-4 border-b border-emerald-500/30">
            <div className="flex items-center">
              <Link href="/" className="text-white mr-8">
                <Image 
                  src="/images/ecoroute-logo.svg" 
                  alt="EcoRoute Logo" 
                  width={140} 
                  height={40} 
                  priority
                  className="filter brightness-0 invert"
                />
              </Link>
              <nav className="hidden md:flex items-center space-x-1">
                <Link 
                  href="/planner" 
                  className={`px-4 py-2 text-emerald-100 hover:text-white hover:bg-emerald-700/30 rounded-lg transition-colors`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    Planner
                  </div>
                </Link>
                <Link 
                  href="/routes" 
                  className={`px-4 py-2 text-emerald-100 hover:text-white hover:bg-emerald-700/30 rounded-lg transition-colors`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Routes
                  </div>
                </Link>
                <Link 
                  href="/calculator" 
                  className={`px-4 py-2 text-emerald-100 hover:text-white hover:bg-emerald-700/30 rounded-lg transition-colors`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                    </svg>
                    Calculator
                  </div>
                </Link>
                <Link 
                  href="/ar-tours" 
                  className={`px-4 py-2 text-emerald-100 hover:text-white hover:bg-emerald-700/30 rounded-lg transition-colors`}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    AR Tours
                  </div>
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/profile" 
                className="hidden md:flex items-center px-3 py-2 text-sm bg-white/20 text-white rounded-lg transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-200/90 flex items-center justify-center text-xs font-bold text-emerald-800 mr-2">
                  {initials}
                </div>
                <span>Profile</span>
              </Link>
              <button 
                onClick={() => setShowLogoutConfirmation(true)}
                className="flex items-center px-3 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10 8a1 1 0 00-1-1H8a1 1 0 100 2h4a1 1 0 001-1zm-8-5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm9 5a1 1 0 011 1v3a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h8z" clipRule="evenodd" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Profile section - only basic info with minimal vertical space */}
          <div className="flex flex-col md:flex-row items-center md:items-start pt-4 pb-12">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white/10 border-4 border-white/20 overflow-hidden flex items-center justify-center shadow-xl">
              <div className="bg-emerald-200/90 w-full h-full flex items-center justify-center text-2xl font-bold text-emerald-800">
                {initials}
              </div>
            </div>
            <div className="md:ml-5 mt-3 md:mt-0 text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold text-white">{fullName}</h1>
              <p className="text-emerald-100 text-sm">@{username}</p>
              <p className="text-emerald-100/80 text-xs">{email}</p>
              
              <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                <Link 
                  href="/profile/edit" 
                  className="flex items-center px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Profile
                </Link>
                <Link 
                  href="/planner" 
                  className="flex items-center px-2.5 py-1 bg-white text-emerald-700 hover:bg-emerald-50 text-xs rounded-lg transition-all shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Plan New Route
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">CO₂ Saved</h3>
              <div className="text-2xl font-bold text-gray-800">{ecoStats.carbonSaved} kg</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Eco Routes</h3>
              <div className="text-2xl font-bold text-gray-800">{ecoStats.routesTaken}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Trees Equivalent</h3>
              <div className="text-2xl font-bold text-gray-800">{ecoStats.trees}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area with tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'overview' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  Overview
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('routes')}
                className={`px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'routes' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  My Routes
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('impact')}
                className={`px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'impact' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Environmental Impact
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('achievements')}
                className={`px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'achievements' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-emerald-500 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Achievements
                </div>
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Welcome, {firstName || username}!</h2>
                <p className="text-gray-600">
                  Your eco-friendly journey is making a difference. Continue exploring sustainable travel options and track your positive impact on the environment.
                </p>
                
                {/* Personal Information Card */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">About Me</h4>
                        <p className="text-gray-700">
                          {(user as any).bio || "Passionate about sustainability and finding eco-friendly transportation solutions. Working on reducing my carbon footprint one trip at a time."}
                        </p>
                        
                        {(user as any).location && (
                          <div className="mt-4 flex items-center text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{(user as any).location}</span>
                          </div>
                        )}
                        
                        {(user as any).website && (
                          <div className="mt-2 flex items-center text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <a 
                              href={(user as any).website.startsWith('http') ? (user as any).website : `https://${(user as any).website}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 hover:underline"
                            >
                              {(user as any).website.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Social Links</h4>
                        {(user as any).socialLinks && (user as any).socialLinks.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {(user as any).socialLinks.map((link: any, index: number) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                              >
                                {link.platform === 'Twitter' && (
                                  <svg className="h-4 w-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                  </svg>
                                )}
                                {link.platform === 'LinkedIn' && (
                                  <svg className="h-4 w-4 mr-1 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                  </svg>
                                )}
                                {link.platform === 'GitHub' && (
                                  <svg className="h-4 w-4 mr-1 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                  </svg>
                                )}
                                <span>{link.platform}</span>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No social links added yet.</p>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Link 
                            href="/profile/edit" 
                            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit Profile Information
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
                  <h3 className="font-medium text-emerald-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Eco Tips For You
                  </h3>
                  <ul className="space-y-2 text-emerald-700">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Try cycling for trips under 5 miles to reduce emissions.
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Use public transportation for longer commutes when possible.
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Consider carpooling with friends or colleagues to share fuel costs.
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'routes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">My Routes</h2>
                  <Link 
                    href="/planner" 
                    className="inline-flex items-center px-3 py-2 border border-emerald-500 text-emerald-600 text-sm rounded-lg hover:bg-emerald-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    New Route
                  </Link>
                </div>
                
                {routes.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {routes.map(route => (
                        <div key={route.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="border-b border-gray-100 px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              {route.transportMode === 'cycling' && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                              )}
                              {route.transportMode === 'public_transport' && (
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                  </svg>
                                </div>
                              )}
                              {route.transportMode === 'walking' && (
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                </div>
                              )}
                              <h3 className="font-medium text-gray-800">{route.name}</h3>
                            </div>
                            
                            {route.favorite && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </div>
                          
                          <div className="px-4 py-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-500">{route.date}</span>
                              <span className="text-sm text-gray-500">{route.distance} km</span>
                            </div>
                            
                            <div className="flex items-center space-x-1 text-sm text-emerald-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{route.carbonSaved} kg CO₂ saved</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex justify-between">
                            <Link 
                              href={`/routes/${route.id}`} 
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              View Details
                            </Link>
                            <Link 
                              href={`/planner?reuse=${route.id}`} 
                              className="text-xs text-emerald-600 hover:text-emerald-800"
                            >
                              Use Again
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-center">
                      <button className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        View More Routes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-gray-700 font-medium mb-2">No routes yet</h3>
                    <p className="text-gray-500 mb-4">Start planning your eco-friendly routes now</p>
                    <Link 
                      href="/planner" 
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Create Your First Route
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'impact' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Environmental Impact</h2>
                <p className="text-gray-600 mb-6">
                  Your sustainable travel choices have made a real difference to the environment. Here's a breakdown of your positive impact:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
                    <h3 className="font-medium text-emerald-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.748 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Carbon Reduction
                    </h3>
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-emerald-700">157kg saved of 200kg goal</span>
                        <span className="text-sm text-emerald-700">78%</span>
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-emerald-700 mb-2">
                      You've prevented 157kg of CO₂ from entering the atmosphere by choosing eco-friendly transport options.
                    </p>
                    <p className="text-sm text-emerald-700">
                      <span className="font-semibold">Equivalent to:</span> Planting 5 trees or driving 783 fewer miles in an average car.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                      Community Impact
                    </h3>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        You're in the top 15% of eco-conscious travelers in your area.
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Your sustainable choices have inspired 3 friends to join EcoRoute.
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Together, our community has saved over 25,000kg of CO₂.
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3">Your Monthly Progress</h3>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="w-full h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex flex-col items-center justify-center text-white">
                      <span className="text-sm">This Month</span>
                      <span className="text-2xl font-bold">32kg</span>
                      <span className="text-xs">CO₂ Saved</span>
                    </div>
                    <div className="w-full h-24 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex flex-col items-center justify-center text-white">
                      <span className="text-sm">Last Month</span>
                      <span className="text-2xl font-bold">27kg</span>
                      <span className="text-xs">CO₂ Saved</span>
                    </div>
                    <div className="w-full h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex flex-col items-center justify-center text-white">
                      <span className="text-sm">Improvement</span>
                      <span className="text-2xl font-bold">+18%</span>
                      <span className="text-xs">Month over Month</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Achievements</h2>
                <p className="text-gray-600 mb-6">
                  Earn badges and rewards by making eco-friendly travel choices. Continue your green journey to unlock more achievements!
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Unlocked Achievements */}
                  <div className="bg-white border border-emerald-200 rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">First Route</h3>
                    <p className="text-sm text-gray-600 mb-2">Completed your first eco-friendly route</p>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Unlocked</span>
                  </div>
                  
                  <div className="bg-white border border-emerald-200 rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">Carbon Saver</h3>
                    <p className="text-sm text-gray-600 mb-2">Saved 50kg of carbon emissions</p>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Unlocked</span>
                  </div>
                  
                  <div className="bg-white border border-emerald-200 rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">Consistent Traveler</h3>
                    <p className="text-sm text-gray-600 mb-2">Used eco-routes for 5 consecutive days</p>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Unlocked</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
