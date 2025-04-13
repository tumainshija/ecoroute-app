'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  topicCount: number;
  icon: string;
  isPopular: boolean;
  lastActivity: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for categories
        const mockCategories: Category[] = [
          {
            id: '1',
            name: 'General Discussion',
            slug: 'general-discussion',
            description: 'Discuss anything related to eco-friendly transportation and sustainable travel.',
            postCount: 1243,
            topicCount: 87,
            icon: '🌿',
            isPopular: true,
            lastActivity: '2023-09-12T15:30:45Z'
          },
          {
            id: '2',
            name: 'Route Planning',
            slug: 'route-planning',
            description: 'Share tips and tricks for planning the most eco-friendly routes for your journeys.',
            postCount: 856,
            topicCount: 152,
            icon: '🗺️',
            isPopular: true,
            lastActivity: '2023-09-14T09:15:22Z'
          },
          {
            id: '3',
            name: 'Carbon Footprint Reduction',
            slug: 'carbon-footprint-reduction',
            description: 'Strategies and discussions about reducing your carbon footprint through smart transportation choices.',
            postCount: 642,
            topicCount: 98,
            icon: '👣',
            isPopular: false,
            lastActivity: '2023-09-13T12:45:33Z'
          },
          {
            id: '4',
            name: 'App Feature Requests',
            slug: 'app-feature-requests',
            description: 'Suggest new features or improvements for the EcoRoute app.',
            postCount: 324,
            topicCount: 76,
            icon: '💡',
            isPopular: false,
            lastActivity: '2023-09-10T18:20:15Z'
          },
          {
            id: '5',
            name: 'Bug Reports',
            slug: 'bug-reports',
            description: 'Report any issues or bugs you encounter while using the app.',
            postCount: 189,
            topicCount: 42,
            icon: '🐞',
            isPopular: false,
            lastActivity: '2023-09-11T14:50:10Z'
          },
          {
            id: '6',
            name: 'EV Charging Stations',
            slug: 'ev-charging-stations',
            description: 'Discuss electric vehicle charging stations, availability, and experiences.',
            postCount: 412,
            topicCount: 65,
            icon: '🔌',
            isPopular: true,
            lastActivity: '2023-09-14T11:25:40Z'
          },
          {
            id: '7',
            name: 'Public Transportation',
            slug: 'public-transportation',
            description: 'Share information about public transportation options and how to integrate them into your eco-friendly travel.',
            postCount: 365,
            topicCount: 57,
            icon: '🚌',
            isPopular: false,
            lastActivity: '2023-09-13T08:10:30Z'
          },
          {
            id: '8',
            name: 'Cycling Routes',
            slug: 'cycling-routes',
            description: 'Discuss bicycle routes, safety tips, and biking as an eco-friendly transportation option.',
            postCount: 523,
            topicCount: 89,
            icon: '🚲',
            isPopular: true,
            lastActivity: '2023-09-14T10:05:18Z'
          },
          {
            id: '9',
            name: 'Success Stories',
            slug: 'success-stories',
            description: 'Share your success stories about how EcoRoute has helped you reduce your carbon footprint.',
            postCount: 278,
            topicCount: 48,
            icon: '🏆',
            isPopular: false,
            lastActivity: '2023-09-12T16:40:55Z'
          },
        ];

        setCategories(mockCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularCategories = filteredCategories.filter(category => category.isPopular);
  const otherCategories = filteredCategories.filter(category => !category.isPopular);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Forum Categories</h1>
          <p className="mt-2 text-gray-600">Browse all categories in our eco-friendly transportation forum</p>
        </div>
        <div className="w-full md:w-auto">
          <input
            type="search"
            placeholder="Search categories..."
            className="max-w-sm w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {popularCategories.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📈</span> Popular Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularCategories.map((category) => (
              <CategoryCard key={category.id} category={category} formatDate={formatDate} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📋</span> All Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherCategories.length > 0 ? (
            otherCategories.map((category) => (
              <CategoryCard key={category.id} category={category} formatDate={formatDate} />
            ))
          ) : (
            searchQuery && <p className="text-gray-500 col-span-3 text-center py-8">No categories found matching "{searchQuery}"</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category, formatDate }: { category: Category, formatDate: (date: string) => string }) {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{category.icon}</span>
          <h3 className="text-xl font-semibold">{category.name}</h3>
        </div>
        {category.isPopular && (
          <span className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-2 py-1 rounded-full text-sm">
            Popular
          </span>
        )}
      </div>
      <p className="mt-2 text-gray-600">{category.description}</p>
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <div>
          <div className="mb-1"><strong>{category.topicCount}</strong> topics</div>
          <div><strong>{category.postCount}</strong> posts</div>
        </div>
        <div className="text-right">
          <div className="mb-1">Last activity</div>
          <div className="text-emerald-600">{formatDate(category.lastActivity)}</div>
        </div>
      </div>
      <div className="mt-4">
        <Link href={`/forum/category/${category.slug}`} className="text-emerald-600 hover:text-emerald-800">
          Browse Category
        </Link>
      </div>
    </div>
  );
} 