'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForumSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // In a real application, you would navigate to a search results page
      router.push(`/forum/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics, posts, and users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-3 flex items-center bg-emerald-500 text-white rounded-r-lg hover:bg-emerald-600 transition duration-150"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center focus:outline-none"
          >
            <span>{isAdvancedOpen ? 'Hide' : 'Show'} advanced options</span>
            <svg
              className={`ml-1 h-4 w-4 transition-transform duration-200 ${isAdvancedOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="text-xs text-gray-500">
            Press Enter to search
          </div>
        </div>
        
        {isAdvancedOpen && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search-in" className="block text-sm font-medium text-gray-700 mb-1">
                  Search in
                </label>
                <select
                  id="search-in"
                  className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
                >
                  <option value="all">All content</option>
                  <option value="topics">Topics only</option>
                  <option value="posts">Posts only</option>
                  <option value="users">Users only</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  id="sort-by"
                  className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most_replies">Most replies</option>
                  <option value="most_views">Most views</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
                  Date range
                </label>
                <select
                  id="date-range"
                  className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
                >
                  <option value="all_time">All time</option>
                  <option value="today">Today</option>
                  <option value="this_week">This week</option>
                  <option value="this_month">This month</option>
                  <option value="this_year">This year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <div className="flex items-center">
                <input
                  id="search-titles-only"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="search-titles-only" className="ml-2 block text-sm text-gray-700">
                  Search titles only
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="search-exact-phrases"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="search-exact-phrases" className="ml-2 block text-sm text-gray-700">
                  Search exact phrases
                </label>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 