'use client';

import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'read' | 'unread';
  sentAt: string;
}

export default function AdminMessages() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        // Check if user has admin role (matching other admin pages)
        setIsAdmin(user?.email === 'admin@ecoroute.com');
        
        if (user?.email !== 'admin@ecoroute.com') {
          router.push('/');
        } else {
          // Fetch messages if admin
          fetchMessages();
        }
      }
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Set up auto-refresh
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoRefresh && isAdmin) {
      // Check for new messages every 10 seconds
      intervalId = setInterval(() => {
        console.log('Auto-refreshing messages...');
        fetchMessages();
      }, 10000);
    }
    
    // Clean up interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, isAdmin]);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setIsMessagesLoading(true);
      
      // In a production environment, this would come from your API
      // const response = await api.get('/messages');
      // setMessages(response.data);
      
      // Get messages from localStorage
      let storedMessages: Message[] = [];
      
      if (typeof window !== 'undefined') {
        const messagesFromStorage = localStorage.getItem('contactMessages');
        if (messagesFromStorage) {
          storedMessages = JSON.parse(messagesFromStorage);
        }
      }
      
      // Combine with mock data if no real messages exist
      if (storedMessages.length === 0) {
        // Mock data for demonstration
        storedMessages = [
          {
            id: 'msg_1',
            name: 'John Doe',
            email: 'john@example.com',
            message: 'I would like to learn more about your eco-friendly routes in Tanzania.',
            status: 'unread',
            sentAt: '2023-09-28T10:30:00Z'
          },
          {
            id: 'msg_2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            message: 'Can you provide more information about your carbon offset program?',
            status: 'read',
            sentAt: '2023-09-27T14:15:00Z'
          },
          {
            id: 'msg_3',
            name: 'Mohamed Ali',
            email: 'mohamed@example.com',
            message: 'I am interested in becoming a local partner for EcoRoute in Zanzibar. How can we collaborate?',
            status: 'unread',
            sentAt: '2023-09-26T09:45:00Z'
          }
        ];
      }
      
      setMessages(storedMessages);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages. Please try again later.');
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // In real implementation:
      // await api.patch(`/messages/${id}`, { status: 'read' });
      
      // Update local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === id ? { ...msg, status: 'read' } : msg
        )
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status: 'read' } : null);
      }
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const messagesFromStorage = localStorage.getItem('contactMessages');
        if (messagesFromStorage) {
          const storedMessages = JSON.parse(messagesFromStorage);
          const updatedMessages = storedMessages.map((msg: Message) => 
            msg.id === id ? { ...msg, status: 'read' } : msg
          );
          localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
        }
      }
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      // In real implementation:
      // await api.delete(`/messages/${id}`);
      
      // Update local state
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const messagesFromStorage = localStorage.getItem('contactMessages');
        if (messagesFromStorage) {
          const storedMessages = JSON.parse(messagesFromStorage);
          const updatedMessages = storedMessages.filter((msg: Message) => msg.id !== id);
          localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
        }
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Already redirecting in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-green-600">EcoRoute Admin</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link 
                href="/admin"
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
              >
                Dashboard
              </Link>
              <Link 
                href="/"
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Contact Messages
            </h1>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Manage and respond to messages from users
              </p>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={() => setAutoRefresh(prev => !prev)}
                    className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="ml-2">Auto refresh</span>
                </label>
                <button 
                  onClick={fetchMessages}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Messages
                </button>
              </div>
            </div>
          </div>

          {isMessagesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800">
              {error}
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Messages List */}
                <div className="col-span-1 border-r border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {messages.length === 0 ? (
                      <li className="p-4 text-gray-500">No messages found</li>
                    ) : (
                      messages.map((msg) => (
                        <li 
                          key={msg.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedMessage?.id === msg.id ? 'bg-green-50' : ''}`}
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (msg.status === 'unread') {
                              markAsRead(msg.id);
                            }
                          }}
                        >
                          <div className="flex justify-between">
                            <h3 className={`font-medium ${msg.status === 'unread' ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                              {msg.name}
                              {msg.status === 'unread' && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  New
                                </span>
                              )}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {formatDate(msg.sentAt).split(',')[0]}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {msg.message}
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                
                {/* Message Detail */}
                <div className="col-span-2 p-6">
                  {selectedMessage ? (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {selectedMessage.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {selectedMessage.email}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(selectedMessage.sentAt)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => markAsRead(selectedMessage.id)}
                            className={`px-3 py-1 rounded-md text-sm ${
                              selectedMessage.status === 'read' 
                                ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                            disabled={selectedMessage.status === 'read'}
                          >
                            Mark as Read
                          </button>
                          <button 
                            onClick={() => deleteMessage(selectedMessage.id)}
                            className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="whitespace-pre-wrap text-gray-800">
                          {selectedMessage.message}
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-900">Reply to this message</h3>
                        <div className="mt-2">
                          <textarea 
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Type your reply here..."
                          ></textarea>
                        </div>
                        <div className="mt-3">
                          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Send Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p>Select a message to view its details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 