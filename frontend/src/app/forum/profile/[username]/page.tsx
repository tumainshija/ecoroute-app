'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Award,
    Clock,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    MessageSquare,
    Twitter,
    User
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface UserProfile {
  username: string;
  displayName: string;
  joinDate: string;
  lastActive: string;
  reputation: number;
  postCount: number;
  topicCount: number;
  badges: { name: string; color: string }[];
  avatarUrl: string;
  bio: string;
  location: string;
  website: string;
  socialLinks: { platform: string; url: string }[];
}

interface UserPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: number;
  category: string;
}

// Generate static paths for all possible username values
export async function generateStaticParams() {
  // Return all the possible username values that this page should be pre-rendered for
  return [
    { username: 'GreenExplorer' },
    { username: 'EcoTraveler' },
    { username: 'SustainableJourney' },
    { username: 'BikeCommuter' },
    { username: 'TrainEnthusiast' }
  ];
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, fetch this data from the API
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProfile: UserProfile = {
          username,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          joinDate: '2023-01-15',
          lastActive: '2023-09-20',
          reputation: 1250,
          postCount: 47,
          topicCount: 12,
          badges: [
            { name: 'Top Contributor', color: 'green' },
            { name: 'Eco Champion', color: 'emerald' },
            { name: 'Solution Finder', color: 'blue' }
          ],
          avatarUrl: '',
          bio: 'Passionate about sustainability and finding eco-friendly transportation solutions. Working on reducing my carbon footprint one trip at a time.',
          location: 'San Francisco, CA',
          website: 'https://example.com',
          socialLinks: [
            { platform: 'Twitter', url: 'https://twitter.com/' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/' },
            { platform: 'GitHub', url: 'https://github.com/' }
          ]
        };
        
        const mockPosts: UserPost[] = Array(10).fill(0).map((_, index) => ({
          id: `post-${index}`,
          title: `How to reduce emissions while commuting ${index + 1}`,
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          createdAt: new Date(Date.now() - index * 86400000).toISOString(),
          likes: Math.floor(Math.random() * 50),
          replies: Math.floor(Math.random() * 20),
          category: ['General', 'Tips', 'Discussion', 'Success Stories'][Math.floor(Math.random() * 4)]
        }));
        
        setProfile(mockProfile);
        setPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-700">User not found</h1>
        <p className="mt-2 text-gray-500">The user {username} does not exist or has been removed.</p>
        <Link href="/forum" className="mt-4 inline-block text-emerald-600 hover:underline">
          Return to Forum
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter size={18} />;
      case 'linkedin':
        return <Linkedin size={18} />;
      case 'github':
        return <Github size={18} />;
      default:
        return <Globe size={18} />;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cover Image */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-48 relative">
          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25C0 25 100 -25 200 25C300 75 400 25 500 50C600 75 700 50 800 100V200H0V25Z" fill="white" />
            </svg>
          </div>
          
          {/* User Avatar */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:left-8 md:translate-x-0">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-4xl font-medium">
                {profile.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Actions */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-1 text-sm font-medium transition">
              <Mail size={16} />
              <span>Message</span>
            </button>
            <Link 
              href={`/forum/profile/edit`}
              className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-1 text-sm font-medium transition"
            >
              <User size={16} />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="pt-20 md:pt-6 px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="text-center md:text-left md:pl-40">
              <h1 className="text-3xl font-bold text-gray-800">{profile.displayName}</h1>
              <p className="text-gray-500">@{profile.username}</p>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {profile.badges.map((badge, index) => (
                  <Badge key={index} className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                    <Award size={14} className="mr-1" />
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end space-y-1">
              <div className="text-emerald-600 font-semibold flex items-center">
                <Award size={18} className="mr-2" />
                {profile.reputation} reputation points
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <User size={16} className="mr-2" />
                Joined {formatDate(profile.joinDate)}
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <Clock size={16} className="mr-2" />
                Last active {formatDate(profile.lastActive)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1">
          {/* Bio Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <User size={20} className="mr-2 text-emerald-500" />
              About
            </h2>
            <p className="text-gray-600 whitespace-pre-line">{profile.bio}</p>
            
            {/* Location */}
            {profile.location && (
              <div className="mt-4 flex items-center text-gray-700">
                <MapPin size={18} className="mr-2 text-gray-400" />
                <span>{profile.location}</span>
              </div>
            )}
            
            {/* Website */}
            {profile.website && (
              <div className="mt-3 flex items-center text-gray-700">
                <Globe size={18} className="mr-2 text-gray-400" />
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {profile.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
            
            {/* Social Links */}
            {profile.socialLinks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Connect</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.socialLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg transition"
                    >
                      {getSocialIcon(link.platform)}
                      <span className="ml-2 text-sm">{link.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <Award size={20} className="mr-2 text-emerald-500" />
              Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <MessageSquare size={16} className="mr-2 text-gray-400" />
                  Topics created
                </span>
                <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.topicCount}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <MessageSquare size={16} className="mr-2 text-gray-400" />
                  Posts
                </span>
                <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.postCount}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Award size={16} className="mr-2 text-gray-400" />
                  Reputation
                </span>
                <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.reputation}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Award size={16} className="mr-2 text-gray-400" />
                  Badges
                </span>
                <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.badges.length}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Content Tabs */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full bg-gray-50 p-1 border-b border-gray-200">
                <TabsTrigger 
                  value="posts" 
                  className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm rounded-lg py-2.5 px-4 text-sm font-medium"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger 
                  value="topics" 
                  className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm rounded-lg py-2.5 px-4 text-sm font-medium"
                >
                  Topics
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm rounded-lg py-2.5 px-4 text-sm font-medium"
                >
                  Activity
                </TabsTrigger>
              </TabsList>
              
              {/* Posts Tab */}
              <TabsContent value="posts" className="p-6">
                <div className="space-y-6">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <div key={post.id} className="bg-white border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/forum/post/${post.id}`} className="text-lg font-medium text-gray-800 hover:text-emerald-600 transition">
                              {post.title}
                            </Link>
                            <div className="mt-1 flex items-center space-x-3 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 rounded-full">{post.category}</span>
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="mt-3 text-gray-600 text-sm line-clamp-2">{post.content}</p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {post.likes}
                            </span>
                            <span className="flex items-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {post.replies}
                            </span>
                          </div>
                          <Link href={`/forum/post/${post.id}`} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            Read more →
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-700">No posts yet</h3>
                      <p className="mt-2 text-gray-500">This user hasn&apos;t created any posts yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Topics Tab */}
              <TabsContent value="topics" className="p-6">
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-700">Topics will appear here</h3>
                  <p className="mt-2 text-gray-500">This section will display topics started by the user.</p>
                </div>
              </TabsContent>
              
              {/* Activity Tab */}
              <TabsContent value="activity" className="p-6">
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-700">Activity will appear here</h3>
                  <p className="mt-2 text-gray-500">This section will track the user's latest activity.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 
