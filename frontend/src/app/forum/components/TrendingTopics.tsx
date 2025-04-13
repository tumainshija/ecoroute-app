'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TrendingTopic {
  id: string;
  title: string;
  categoryId: string;
  views: number;
  replies: number;
  lastActivityDate: string;
}

export default function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock trending topics
        const mockTopics: TrendingTopic[] = [
          {
            id: 'sustainability-topic-1',
            title: 'How to reduce plastic waste while traveling',
            categoryId: 'sustainability',
            views: 342,
            replies: 24,
            lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'travel-experiences-topic-3',
            title: 'Train journeys: Europe vs. Asia comparison',
            categoryId: 'travel-experiences',
            views: 289,
            replies: 18,
            lastActivityDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'local-cultures-topic-2',
            title: 'Cultural etiquette guide for Asia',
            categoryId: 'local-cultures',
            views: 256,
            replies: 15,
            lastActivityDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'route-planning-topic-5',
            title: 'Most bike-friendly cities worldwide',
            categoryId: 'route-planning',
            views: 213,
            replies: 12,
            lastActivityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'ecoroute-feedback-topic-1',
            title: 'Feature request: Carpooling integration',
            categoryId: 'ecoroute-feedback',
            views: 198,
            replies: 10,
            lastActivityDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        // Filter topics based on time range
        const now = new Date();
        const filteredTopics = mockTopics.filter(topic => {
          const topicDate = new Date(topic.lastActivityDate);
          const diffDays = Math.floor((now.getTime() - topicDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (timeRange === 'day') return diffDays < 1;
          if (timeRange === 'week') return diffDays < 7;
          if (timeRange === 'month') return diffDays < 30;
          return true;
        });
        
        setTopics(filteredTopics);
      } catch (error) {
        console.error('Error fetching trending topics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrendingTopics();
  }, [timeRange]);

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Trending Topics</h3>
        <div className="flex rounded-lg bg-gray-100 p-0.5 text-xs">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 rounded ${
              timeRange === 'day'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded ${
              timeRange === 'week'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded ${
              timeRange === 'month'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-1"></div>
              <div className="h-3 bg-gray-100 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No trending topics found in this time period.
        </div>
      ) : (
        <ul className="space-y-3">
          {topics.map((topic, index) => (
            <li key={topic.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <Link 
                href={`/forum/topic/${topic.id}`}
                className="block"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 text-gray-400 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 hover:text-emerald-600 line-clamp-2">
                      {topic.title}
                    </h4>
                    <div className="flex mt-1 text-xs text-gray-500 space-x-2">
                      <span>{topic.views} views</span>
                      <span>•</span>
                      <span>{topic.replies} replies</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-4 text-center">
        <Link href="/forum" className="text-xs text-emerald-600 hover:text-emerald-700">
          View all topics
        </Link>
      </div>
    </div>
  );
} 