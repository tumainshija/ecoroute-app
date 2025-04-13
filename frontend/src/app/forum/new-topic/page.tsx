'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface CategoryOption {
  id: string;
  name: string;
}

export default function NewTopicPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    category?: string;
    auth?: string;
  }>({});

  // Fetch categories when the component mounts
  useEffect(() => {
    // In production, this would be an API call
    const mockCategories: CategoryOption[] = [
      { id: 'sustainability', name: 'Sustainability' },
      { id: 'travel-experiences', name: 'Travel Experiences' },
      { id: 'local-cultures', name: 'Local Cultures' },
      { id: 'route-planning', name: 'Route Planning' },
      { id: 'ecoroute-feedback', name: 'EcoRoute Feedback' },
    ];
    
    setCategories(mockCategories);
    
    // URL parameter handling moved to server-side or separate effect
  }, []);

  // Check if the user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setErrors(prev => ({
        ...prev,
        auth: 'You must be logged in to create a topic'
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.auth;
        return newErrors;
      });
    }
  }, [isAuthenticated]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }
    
    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would create the topic on the server
      // For now, we'll redirect to the category page
      const topicId = `${selectedCategory}-topic-new-${Date.now()}`;
      router.push(`/forum/topic/${topicId}`);
    } catch (error) {
      console.error('Error creating topic:', error);
      setErrors(prev => ({
        ...prev,
        form: 'Failed to create topic. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Create New Topic</h1>
          
          <div className="text-sm breadcrumbs">
            <ul className="flex space-x-2 text-gray-500">
              <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
              <li className="before:content-['/'] before:mx-2">
                <Link href="/forum" className="hover:text-emerald-600">Forum</Link>
              </li>
              {selectedCategory && (
                <li className="before:content-['/'] before:mx-2">
                  <Link href={`/forum/category/${selectedCategory}`} className="hover:text-emerald-600">
                    {categories.find(c => c.id === selectedCategory)?.name || 'Category'}
                  </Link>
                </li>
              )}
              <li className="before:content-['/'] before:mx-2">New Topic</li>
            </ul>
          </div>
        </div>
        
        {errors.auth ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="h-12 w-12 text-yellow-500 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to create a new topic in the forum.
            </p>
            <Link 
              href={`/login?redirect=/forum/new-topic${selectedCategory ? `?category=${selectedCategory}` : ''}`} 
              className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition inline-block"
            >
              Log In
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Category Select */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium ${
                    errors.category ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
              
              {/* Title Input */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your topic"
                  className={`w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium ${
                    errors.title ? 'border-red-300' : ''
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              
              {/* Content Textarea */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className="mb-2 text-sm text-gray-500">
                  You can use Markdown formatting: <code># Heading</code>, <code>**bold**</code>, <code>*italic*</code>, <code>- bullet points</code>, etc.
                </div>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  placeholder="Share your thoughts, questions, or experiences..."
                  className={`w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium ${
                    errors.content ? 'border-red-300' : ''
                  }`}
                ></textarea>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>
              
              {/* Community Guidelines */}
              <div className="mb-6 text-sm bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Forum Guidelines</h3>
                <ul className="text-gray-600 space-y-1 list-disc pl-5">
                  <li>Be respectful and constructive</li>
                  <li>Stay on topic and relevant to sustainable travel</li>
                  <li>Avoid promotional content</li>
                  <li>Check if a similar topic already exists before posting</li>
                </ul>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Link
                  href={selectedCategory ? `/forum/category/${selectedCategory}` : '/forum'}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Topic'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 