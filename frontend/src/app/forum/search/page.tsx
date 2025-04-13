'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ForumSearch from '../components/ForumSearch';

interface SearchResult {
  id: string;
  title: string;
  author: string;
  authorId: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  excerpt: string;
  type: 'topic' | 'post';
  topicId?: string;
  topicTitle?: string;
}

export default function SearchPage() {
  // Use state instead of searchParams for static rendering
  const [query, setQuery] = useState('');
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    // Parse query from window.location on client-side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setQuery(urlParams.get('q') || '');
    }
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // This would be an API call in a real application
    const fetchSearchResults = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock search results
        const mockResults: SearchResult[] = [];
        
        // Mock topic results
        const topicTitles = [
          'How to reduce plastic waste while traveling',
          'Best sustainable accommodations in Europe',
          'Carbon offsetting programs comparison',
          'Zero-waste travel essentials',
          'Train travel guide for Europe',
          'Supporting indigenous communities through tourism',
          'Eco-friendly transportation options',
          'Sustainable food choices while traveling',
        ];
        
        // Add topics that match the query
        topicTitles
          .filter(title => title.toLowerCase().includes(query.toLowerCase()))
          .forEach((title, index) => {
            const categoryId = ['sustainability', 'travel-experiences', 'local-cultures', 'route-planning'][index % 4];
            const categoryName = ['Sustainability', 'Travel Experiences', 'Local Cultures', 'Route Planning'][index % 4];
            
            mockResults.push({
              id: `topic-${index + 1}`,
              title,
              author: ['EcoTraveler', 'GreenExplorer', 'SustainableJourney'][index % 3],
              authorId: `user${index + 1}`,
              categoryId,
              categoryName,
              createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
              excerpt: `This topic discusses ${title.toLowerCase()} and provides useful tips for eco-conscious travelers...`,
              type: 'topic'
            });
          });
        
        // Add post results
        const postContents = [
          "I've been trying to reduce plastic waste during my travels. One tip is to always carry a reusable water bottle...",
          "Train travel across Europe is not only more sustainable but also offers beautiful scenery...",
          "When visiting indigenous communities, it's important to respect their customs and traditions...",
          "Carbon offsetting can be a useful tool but we should prioritize reducing emissions first...",
          "The zero-waste travel kit I use includes a bamboo utensil set, cloth napkins, and soap bars...",
          "Sustainable accommodations should focus on reducing water usage, energy consumption, and supporting local communities...",
        ];
        
        // Add posts that match the query
        postContents
          .filter(content => content.toLowerCase().includes(query.toLowerCase()))
          .forEach((content, index) => {
            const categoryId = ['sustainability', 'travel-experiences', 'local-cultures', 'route-planning'][index % 4];
            const categoryName = ['Sustainability', 'Travel Experiences', 'Local Cultures', 'Route Planning'][index % 4];
            const topicTitle = topicTitles[index % topicTitles.length];
            
            mockResults.push({
              id: `post-${index + 1}`,
              title: '',
              author: ['BikeCommuter', 'TrainEnthusiast', 'EthicalTourist'][index % 3],
              authorId: `user${index + 10}`,
              categoryId,
              categoryName,
              createdAt: new Date(Date.now() - (index * 12 * 60 * 60 * 1000)).toISOString().split('T')[0],
              excerpt: content,
              type: 'post',
              topicId: `${categoryId}-topic-${index + 1}`,
              topicTitle
            });
          });
        
        setResults(mockResults);
        setTotalResults(mockResults.length);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const filteredResults = currentFilter === 'all' 
    ? results 
    : results.filter(result => result.type === currentFilter);

  // Highlight matching text in search results
  const highlightMatch = (text: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-100 px-0.5 rounded">$1</mark>');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="md:w-2/3">
              <ForumSearch />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentFilter('all')}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  currentFilter === 'all' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({totalResults})
              </button>
              <button
                onClick={() => setCurrentFilter('topic')}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  currentFilter === 'topic' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Topics ({results.filter(r => r.type === 'topic').length})
              </button>
              <button
                onClick={() => setCurrentFilter('post')}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  currentFilter === 'post' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Posts ({results.filter(r => r.type === 'post').length})
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="text-sm breadcrumbs mb-6">
          <ul className="flex space-x-2 text-gray-500">
            <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
            <li className="before:content-['/'] before:mx-2">
              <Link href="/forum" className="hover:text-emerald-600">Forum</Link>
            </li>
            <li className="before:content-['/'] before:mx-2">Search</li>
          </ul>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {query && (
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600">
                  {filteredResults.length} results for <span className="font-medium">"{query}"</span>
                </p>
              </div>
            )}

            {filteredResults.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="text-xl font-medium text-gray-900 mb-2">No results found</h2>
                <p className="text-gray-600 mb-6">
                  {query 
                    ? `We couldn't find any results for "${query}". Please try a different search term.` 
                    : 'Enter a search term to find content in the forum.'}
                </p>
                <Link href="/forum" className="text-emerald-600 hover:text-emerald-700">
                  Return to forum
                </Link>
              </div>
            ) : (
              filteredResults.map((result) => (
                <div key={result.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    {result.type === 'topic' ? (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <Link 
                            href={`/forum/category/${result.categoryId}`}
                            className="text-sm px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full"
                          >
                            {result.categoryName}
                          </Link>
                          <span className="text-sm text-gray-500">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link 
                          href={`/forum/topic/${result.categoryId}-topic-1`} 
                          className="block"
                        >
                          <h3 className="text-xl font-medium text-emerald-600 hover:text-emerald-700 mb-2">
                            <span dangerouslySetInnerHTML={{ __html: highlightMatch(result.title) }} />
                          </h3>
                          <p className="text-gray-600 mb-4">
                            <span dangerouslySetInnerHTML={{ __html: highlightMatch(result.excerpt) }} />
                          </p>
                        </Link>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>Posted by </span>
                          <Link 
                            href={`/profile/${result.authorId}`} 
                            className="ml-1 text-gray-700 hover:text-emerald-600"
                          >
                            {result.author}
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <Link 
                            href={`/forum/category/${result.categoryId}`}
                            className="text-sm px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full"
                          >
                            {result.categoryName}
                          </Link>
                          <span className="text-sm text-gray-500">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link
                          href={`/forum/topic/${result.topicId}`}
                          className="block mb-3"
                        >
                          <h3 className="text-lg font-medium text-emerald-600 hover:text-emerald-700">
                            In topic: {result.topicTitle}
                          </h3>
                        </Link>
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-200 mb-3">
                          <p className="text-gray-600">
                            <span dangerouslySetInnerHTML={{ __html: highlightMatch(result.excerpt) }} />
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>Reply by </span>
                          <Link 
                            href={`/profile/${result.authorId}`} 
                            className="ml-1 text-gray-700 hover:text-emerald-600"
                          >
                            {result.author}
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
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
            Back to Forum
          </Link>
        </div>
      </div>
    </div>
  );
} 