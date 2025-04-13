'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ForumSearch from './components/ForumSearch';
import TrendingTopics from './components/TrendingTopics';

// Define the types for our data
interface ForumCategory {
  id: string;
  title: string;
  description: string;
  totalTopics: number;
  totalPosts: number;
  latestPost?: {
    title: string;
    author: string;
    date: string;
    topicId: string;
  };
}

export default function ForumPage() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState<{username: string, reputation: number}[]>([]);

  useEffect(() => {
    // This would be replaced with an actual API call in production
    // For now we'll use mock data
    const mockCategories: ForumCategory[] = [
      {
        id: 'sustainability',
        title: 'Sustainability',
        description: 'Discuss eco-friendly travel tips and strategies for reducing your carbon footprint',
        totalTopics: 24,
        totalPosts: 142,
        latestPost: {
          title: 'Best practices for zero-waste travel',
          author: 'EcoTraveler',
          date: '2023-10-15',
          topicId: 'zero-waste',
        },
      },
      {
        id: 'travel-experiences',
        title: 'Travel Experiences',
        description: 'Share your sustainable travel experiences and inspire others',
        totalTopics: 37,
        totalPosts: 216,
        latestPost: {
          title: 'My train journey across Europe',
          author: 'RailExplorer',
          date: '2023-10-12',
          topicId: 'europe-by-train',
        },
      },
      {
        id: 'local-cultures',
        title: 'Local Cultures',
        description: 'Explore and discuss cultural preservation and respectful tourism',
        totalTopics: 18,
        totalPosts: 97,
        latestPost: {
          title: 'Supporting indigenous communities while traveling',
          author: 'CulturalGuide',
          date: '2023-10-10',
          topicId: 'indigenous-support',
        },
      },
      {
        id: 'route-planning',
        title: 'Route Planning',
        description: 'Get help planning the most eco-friendly routes for your travels',
        totalTopics: 42,
        totalPosts: 189,
        latestPost: {
          title: 'Planning a low-carbon trip around Southeast Asia',
          author: 'AsiaExplorer',
          date: '2023-10-09',
          topicId: 'sea-lowcarbon',
        },
      },
      {
        id: 'ecoroute-feedback',
        title: 'EcoRoute Feedback',
        description: 'Provide feedback on the EcoRoute platform and suggest new features',
        totalTopics: 15,
        totalPosts: 67,
        latestPost: {
          title: 'Feature request: Carpooling integration',
          author: 'GreenCommuter',
          date: '2023-10-07',
          topicId: 'carpooling',
        },
      },
    ];

    // Mock active users with reputation
    const mockActiveUsers = [
      { username: 'EcoTraveler', reputation: 1250 },
      { username: 'GreenExplorer', reputation: 870 },
      { username: 'SustainableJourney', reputation: 742 },
      { username: 'BikeCommuter', reputation: 515 },
      { username: 'TrainEnthusiast', reputation: 325 },
    ];

    setCategories(mockCategories);
    setActiveUsers(mockActiveUsers);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">EcoRoute Community Forum</h1>
          <p className="text-lg text-gray-600 mb-6">
            Connect with fellow eco-conscious travelers, share experiences, and learn from our community.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm breadcrumbs text-gray-500">
              <ul className="flex space-x-2">
                <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
                <li className="before:content-['/'] before:mx-2">Forum</li>
              </ul>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-64">
                <ForumSearch />
              </div>
              {isAuthenticated ? (
                <Link 
                  href="/forum/new-topic" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition flex items-center whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New Topic
                </Link>
              ) : (
                <Link 
                  href="/login?redirect=/forum/new-topic" 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition flex items-center"
                >
                  Login to Post
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main content with sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3">
            {/* Categories */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <div key={category.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <Link 
                            href={`/forum/category/${category.id}`} 
                            className="text-xl font-medium text-emerald-600 hover:text-emerald-700"
                          >
                            {category.title}
                          </Link>
                          <p className="mt-1 text-gray-600">{category.description}</p>
                          <div className="mt-2 flex text-sm text-gray-500 space-x-4">
                            <span>{category.totalTopics} topics</span>
                            <span>{category.totalPosts} posts</span>
                          </div>
                        </div>
                        {category.latestPost && (
                          <div className="lg:w-1/3 border-l-0 lg:border-l pl-0 lg:pl-6 border-gray-200">
                            <div className="text-sm">
                              <span className="font-medium">Latest:</span>{' '}
                              <Link 
                                href={`/forum/topic/${category.latestPost.topicId}`} 
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                {category.latestPost.title}
                              </Link>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              by {category.latestPost.author} on {new Date(category.latestPost.date).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forum Statistics */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Forum Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-700">136</div>
                  <div className="text-gray-600">Active Members</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-700">711</div>
                  <div className="text-gray-600">Total Topics</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-700">2,487</div>
                  <div className="text-gray-600">Total Posts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Trending Topics */}
            <TrendingTopics />
            
            {/* Top Contributors */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Contributors</h3>
              <ul className="space-y-3">
                {activeUsers.map((user, index) => (
                  <li key={user.username} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold mr-3">
                        {user.username[0].toUpperCase()}
                      </div>
                      <Link href={`/profile/${user.username}`} className="text-gray-900 hover:text-emerald-600">
                        {user.username}
                      </Link>
                    </div>
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                        {user.reputation} pts
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <Link href="/forum/members" className="text-sm text-emerald-600 hover:text-emerald-700">
                  View all members
                </Link>
              </div>
            </div>
            
            {/* Community Guidelines */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Community Guidelines</h3>
              <div className="prose max-w-none text-gray-600">
                <p>
                  Welcome to the EcoRoute community! To ensure a positive experience for everyone, please follow these guidelines:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Be respectful and inclusive of all community members</li>
                  <li>Keep discussions relevant to sustainable travel and cultural preservation</li>
                  <li>Share actual experiences and verifiable information</li>
                  <li>Avoid promotional content unless explicitly relevant</li>
                  <li>Report inappropriate content to moderators</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 