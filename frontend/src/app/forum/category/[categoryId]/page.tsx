'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

// Define the types for our data
interface ForumTopic {
  id: string;
  title: string;
  author: string;
  authorId: string;
  createdAt: string;
  lastActivity: string;
  replies: number;
  views: number;
  isPinned?: boolean;
  isLocked?: boolean;
  lastReplyBy?: string;
}

interface CategoryData {
  id: string;
  title: string;
  description: string;
  totalTopics: number;
  totalPosts: number;
}

// Generate static paths for all possible category IDs
export async function generateStaticParams() {
  // Return all the possible category IDs that this page should be pre-rendered for
  return [
    { categoryId: 'sustainability' },
    { categoryId: 'travel-experiences' },
    { categoryId: 'local-cultures' },
    { categoryId: 'route-planning' },
    { categoryId: 'ecoroute-feedback' }
  ];
}

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const { isAuthenticated } = useAuth();
  
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const topicsPerPage = 10;

  useEffect(() => {
    // This would be replaced with an actual API call in production
    // For now we'll use mock data
    const mockCategories: { [key: string]: CategoryData } = {
      'sustainability': {
        id: 'sustainability',
        title: 'Sustainability',
        description: 'Discuss eco-friendly travel tips and strategies for reducing your carbon footprint',
        totalTopics: 24,
        totalPosts: 142,
      },
      'travel-experiences': {
        id: 'travel-experiences',
        title: 'Travel Experiences',
        description: 'Share your sustainable travel experiences and inspire others',
        totalTopics: 37,
        totalPosts: 216,
      },
      'local-cultures': {
        id: 'local-cultures',
        title: 'Local Cultures',
        description: 'Explore and discuss cultural preservation and respectful tourism',
        totalTopics: 18,
        totalPosts: 97,
      },
      'route-planning': {
        id: 'route-planning',
        title: 'Route Planning',
        description: 'Get help planning the most eco-friendly routes for your travels',
        totalTopics: 42,
        totalPosts: 189,
      },
      'ecoroute-feedback': {
        id: 'ecoroute-feedback',
        title: 'EcoRoute Feedback',
        description: 'Provide feedback on the EcoRoute platform and suggest new features',
        totalTopics: 15,
        totalPosts: 67,
      },
    };

    // Generate mock topics based on the category
    const generateMockTopics = (categoryId: string): ForumTopic[] => {
      const baseTopics: ForumTopic[] = [
        {
          id: `${categoryId}-topic-1`,
          title: 'Welcome to the ' + (mockCategories[categoryId]?.title || 'Unknown') + ' category',
          author: 'EcoAdmin',
          authorId: 'admin1',
          createdAt: '2023-09-30',
          lastActivity: '2023-10-15',
          replies: 24,
          views: 342,
          isPinned: true,
          lastReplyBy: 'GreenExplorer',
        },
      ];

      // Add more random topics
      const topics = [...baseTopics];
      const titles = {
        'sustainability': [
          'How to reduce plastic waste while traveling',
          'Carbon offset programs - which ones work?',
          'Sustainable accommodations around the world',
          'Zero-waste travel kit essentials',
          'Public transportation tips for major cities',
        ],
        'travel-experiences': [
          'My sustainable safari in Kenya',
          'Cycling tour across the Netherlands',
          'Eco-lodges in Costa Rica - my experience',
          'Train journeys: Europe vs. Asia comparison',
          'Hiking the sustainable way in national parks',
        ],
        'local-cultures': [
          'Supporting local artisans in your travels',
          'Cultural etiquette guide for Asia',
          'Indigenous tourism experiences in Australia',
          'Learning local languages - apps and resources',
          'Photographing locals - ethical considerations',
        ],
        'route-planning': [
          'Planning a car-free trip in the Mediterranean',
          'Rail passes - are they worth it?',
          'Most bike-friendly cities worldwide',
          'Ferry connections in Southeast Asia',
          'Optimizing routes for minimum carbon footprint',
        ],
        'ecoroute-feedback': [
          'Feature request: Offline maps',
          'UI improvement suggestions',
          'Adding more alternative transport options',
          'Bug report: Route calculation issues',
          'Success story using the carbon calculator',
        ],
      };

      const categoryTitles = titles[categoryId as keyof typeof titles] || titles['sustainability'];
      const users = ['EcoTraveler', 'GreenExplorer', 'SustainableJourney', 'BikeCommuter', 'TrainEnthusiast'];
      
      for (let i = 0; i < 15; i++) {
        const title = categoryTitles[i % categoryTitles.length] + (i > 4 ? ` (Part ${Math.floor(i/5) + 1})` : '');
        const daysAgo = Math.floor(Math.random() * 30);
        const repliesCount = Math.floor(Math.random() * 50);
        const viewsCount = 100 + Math.floor(Math.random() * 900);
        
        topics.push({
          id: `${categoryId}-topic-${i + 2}`,
          title,
          author: users[i % users.length],
          authorId: `user${i}`,
          createdAt: new Date(Date.now() - (daysAgo + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          lastActivity: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          replies: repliesCount,
          views: viewsCount,
          lastReplyBy: users[(i + 2) % users.length],
        });
      }

      return topics;
    };

    setCategory(mockCategories[categoryId] || null);
    setTopics(generateMockTopics(categoryId));
    setIsLoading(false);
  }, [categoryId]);

  // Pagination
  const totalPages = Math.ceil(topics.length / topicsPerPage);
  const currentTopics = topics.slice(
    (currentPage - 1) * topicsPerPage,
    currentPage * topicsPerPage
  );

  if (!category && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              The category you are looking for does not exist or has been removed.
            </p>
            <Link 
              href="/forum" 
              className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
            >
              Return to Forum
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          {isLoading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-1/3"></div>
          ) : (
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{category?.title}</h1>
          )}
          
          {isLoading ? (
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-6 w-2/3"></div>
          ) : (
            <p className="text-lg text-gray-600 mb-6">{category?.description}</p>
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-sm breadcrumbs text-gray-500">
              <ul className="flex space-x-2">
                <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
                <li className="before:content-['/'] before:mx-2">
                  <Link href="/forum" className="hover:text-emerald-600">Forum</Link>
                </li>
                <li className="before:content-['/'] before:mx-2">{category?.title || 'Loading...'}</li>
              </ul>
            </div>
            {isAuthenticated ? (
              <Link 
                href={`/forum/new-topic?category=${categoryId}`} 
                className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Topic
              </Link>
            ) : (
              <Link 
                href={`/login?redirect=/forum/new-topic?category=${categoryId}`} 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition flex items-center"
              >
                Login to Post
              </Link>
            )}
          </div>
        </div>

        {/* Topics List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 hidden md:grid md:grid-cols-12 text-sm font-medium text-gray-500">
              <div className="md:col-span-6">Topic</div>
              <div className="md:col-span-2 text-center">Author</div>
              <div className="md:col-span-1 text-center">Replies</div>
              <div className="md:col-span-1 text-center">Views</div>
              <div className="md:col-span-2 text-center">Last Post</div>
            </div>
            
            {/* Topics */}
            <div className="divide-y divide-gray-200">
              {currentTopics.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  <p className="text-lg">No topics found in this category.</p>
                  {isAuthenticated && (
                    <p className="mt-4">
                      <Link 
                        href={`/forum/new-topic?category=${categoryId}`} 
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        Be the first to start a discussion!
                      </Link>
                    </p>
                  )}
                </div>
              ) : (
                currentTopics.map((topic) => (
                  <div 
                    key={topic.id} 
                    className={`px-6 py-4 hover:bg-gray-50 transition ${topic.isPinned ? 'bg-green-50' : ''}`}
                  >
                    <div className="md:grid md:grid-cols-12 flex flex-col space-y-3 md:space-y-0">
                      {/* Topic Title */}
                      <div className="md:col-span-6">
                        <div className="flex items-start">
                          {topic.isPinned && (
                            <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              Pinned
                            </span>
                          )}
                          {topic.isLocked && (
                            <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Locked
                            </span>
                          )}
                          <Link 
                            href={`/forum/topic/${topic.id}`} 
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            {topic.title}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 md:hidden">
                          Posted by {topic.author} on {new Date(topic.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {/* Author */}
                      <div className="md:col-span-2 md:text-center flex items-center md:justify-center">
                        <Link href={`/profile/${topic.authorId}`} className="text-gray-900 hover:text-emerald-600">
                          {topic.author}
                        </Link>
                      </div>
                      
                      {/* Replies */}
                      <div className="md:col-span-1 md:text-center flex items-center md:justify-center">
                        <span className="md:hidden text-gray-500 mr-1">Replies:</span>
                        <span className="text-gray-900">{topic.replies}</span>
                      </div>
                      
                      {/* Views */}
                      <div className="md:col-span-1 md:text-center flex items-center md:justify-center">
                        <span className="md:hidden text-gray-500 mr-1">Views:</span>
                        <span className="text-gray-900">{topic.views}</span>
                      </div>
                      
                      {/* Last Activity */}
                      <div className="md:col-span-2 md:text-center flex flex-col items-start md:items-center">
                        <span className="text-gray-900 text-sm">{new Date(topic.lastActivity).toLocaleDateString()}</span>
                        {topic.lastReplyBy && (
                          <span className="text-gray-500 text-xs">by {topic.lastReplyBy}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Previous
                </button>
                
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Back to Forum */}
        <div className="mt-8 text-center">
          <Link 
            href="/forum" 
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Forum Categories
          </Link>
        </div>
      </div>
    </div>
  );
} 
