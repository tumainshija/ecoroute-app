'use client';
import { Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Change based on your auth logic
  const [showDropdown, setShowDropdown] = useState(false);

  // Determine if a nav link is active
  const isActive = (path: string) => {
    return pathname === path ? 'text-emerald-500 font-medium' : 'text-gray-600 hover:text-emerald-500';
  };

  // Return first initial for the avatar
  const getInitial = () => {
    if (!user) return 'U';
    return (user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase();
  };
  
  // Check if user is admin
  const isAdmin = () => {
    return user?.email === 'admin@ecoroute.com';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo and brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/ecoroute-logo.svg" 
                  alt="EcoRoute Logo" 
                  width={140} 
                  height={40} 
                  priority
                />
              </Link>
            </div>
            
            {/* Main navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6 items-center">
              <Link href="/" className={`px-3 py-2 ${isActive('/')}`}>
                Home
              </Link>
              <Link href="/routes" className={`px-3 py-2 ${isActive('/routes')}`}>
                Routes
              </Link>
              <Link href="/global" className={`px-3 py-2 flex items-center ${isActive('/global')}`}>
                <Globe className="h-4 w-4 mr-1" /> Global
              </Link>
              <Link href="/planner" className={`px-3 py-2 ${isActive('/planner')}`}>
                Planner
              </Link>
              <Link href="/ar-tours" className={`px-3 py-2 ${isActive('/ar-tours')}`}>
                AR Tours
              </Link>
              <Link href="/calculator" className={`px-3 py-2 ${isActive('/calculator')}`}>
                Calculator
              </Link>
              <Link href="/forum" className={`px-3 py-2 ${isActive('/forum')}`}>
                Forum
              </Link>
            </div>
          </div>
          
          {/* Auth and profile section */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Admin link */}
                {isAdmin() && (
                  <Link
                    href="/admin"
                    className="text-sm px-3 py-1.5 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                {/* Profile dropdown */}
                <div className="relative">
                  <Link 
                    href="/profile"
                    className="flex items-center space-x-2 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 group-hover:border-emerald-300 transition">
                      {getInitial()}
                    </div>
                    <span className="hidden sm:inline-block text-gray-700 group-hover:text-emerald-600 transition">
                      {user?.firstName || user?.username || 'Profile'}
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  className="text-sm px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu (hidden on desktop) */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="px-2 py-3 space-y-1">
          <Link href="/" className={`block px-3 py-2 rounded-md ${isActive('/') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Home
          </Link>
          <Link href="/routes" className={`block px-3 py-2 rounded-md ${isActive('/routes') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Routes
          </Link>
          <Link href="/global" className={`block px-3 py-2 rounded-md flex items-center ${isActive('/global') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Globe className="h-4 w-4 mr-1" /> Global
          </Link>
          <Link href="/planner" className={`block px-3 py-2 rounded-md ${isActive('/planner') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Planner
          </Link>
          <Link href="/ar-tours" className={`block px-3 py-2 rounded-md ${isActive('/ar-tours') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            AR Tours
          </Link>
          <Link href="/calculator" className={`block px-3 py-2 rounded-md ${isActive('/calculator') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Calculator
          </Link>
          <Link href="/forum" className={`block px-3 py-2 rounded-md ${isActive('/forum') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            Forum
          </Link>
          {isAuthenticated && isAdmin() && (
            <Link href="/admin" className={`block px-3 py-2 rounded-md ${isActive('/admin') ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
