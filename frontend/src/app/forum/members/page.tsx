'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import UserBadge from '../components/UserBadge';

interface ForumMember {
  id: string;
  username: string;
  joinDate: string;
  reputation: number;
  postCount: number;
  topicCount: number;
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
  }[];
  lastActive: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<ForumMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'username' | 'reputation' | 'posts' | 'joined' | 'active'>('reputation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock members data
        const mockMembers: ForumMember[] = [
          {
            id: '1',
            username: 'EcoTraveler',
            joinDate: '2022-03-15',
            reputation: 1250,
            postCount: 87,
            topicCount: 12,
            badges: [
              { id: 'sustainability-expert', name: 'Sustainability Expert', icon: '/images/badges/sustainability.svg', description: 'Contributed valuable insights on sustainability topics' },
              { id: 'top-contributor', name: 'Top Contributor', icon: '/images/badges/contributor.svg', description: 'One of the most active contributors in the forum' },
            ],
            lastActive: '2023-10-15',
          },
          {
            id: '2',
            username: 'GreenExplorer',
            joinDate: '2022-05-22',
            reputation: 870,
            postCount: 64,
            topicCount: 8,
            badges: [
              { id: 'route-planner', name: 'Route Planner', icon: '/images/badges/route.svg', description: 'Helped many users plan eco-friendly routes' },
            ],
            lastActive: '2023-10-14',
          },
          {
            id: '3',
            username: 'SustainableJourney',
            joinDate: '2022-01-10',
            reputation: 742,
            postCount: 52,
            topicCount: 6,
            badges: [
              { id: 'community-builder', name: 'Community Builder', icon: '/images/badges/community.svg', description: 'Actively welcomes and engages with new members' },
            ],
            lastActive: '2023-10-12',
          },
          {
            id: '4',
            username: 'BikeCommuter',
            joinDate: '2022-07-08',
            reputation: 515,
            postCount: 38,
            topicCount: 5,
            badges: [],
            lastActive: '2023-10-13',
          },
          {
            id: '5',
            username: 'TrainEnthusiast',
            joinDate: '2022-09-19',
            reputation: 325,
            postCount: 27,
            topicCount: 3,
            badges: [],
            lastActive: '2023-10-11',
          },
          {
            id: '6',
            username: 'SolarWanderer',
            joinDate: '2022-11-05',
            reputation: 210,
            postCount: 19,
            topicCount: 2,
            badges: [],
            lastActive: '2023-10-10',
          },
          {
            id: '7',
            username: 'EthicalTourist',
            joinDate: '2023-01-23',
            reputation: 180,
            postCount: 15,
            topicCount: 1,
            badges: [],
            lastActive: '2023-10-09',
          },
          {
            id: '8',
            username: 'CarbonNeutral',
            joinDate: '2023-03-12',
            reputation: 120,
            postCount: 12,
            topicCount: 1,
            badges: [],
            lastActive: '2023-10-08',
          },
          {
            id: '9',
            username: 'LocalExperience',
            joinDate: '2023-05-01',
            reputation: 85,
            postCount: 8,
            topicCount: 0,
            badges: [],
            lastActive: '2023-10-07',
          },
          {
            id: '10',
            username: 'GreenFootprint',
            joinDate: '2023-07-20',
            reputation: 45,
            postCount: 5,
            topicCount: 0,
            badges: [],
            lastActive: '2023-10-06',
          },
        ];
        
        setMembers(mockMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembers();
  }, []);
  
  // Filter and sort members
  const filteredMembers = members
    .filter(member => 
      searchQuery === '' || 
      member.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'username') {
        comparison = a.username.localeCompare(b.username);
      } else if (sortBy === 'reputation') {
        comparison = a.reputation - b.reputation;
      } else if (sortBy === 'posts') {
        comparison = a.postCount - b.postCount;
      } else if (sortBy === 'joined') {
        comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
      } else if (sortBy === 'active') {
        comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  // Handle sort toggle
  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Forum Members</h1>
          <div className="text-sm breadcrumbs mb-6">
            <ul className="flex space-x-2 text-gray-500">
              <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
              <li className="before:content-['/'] before:mx-2">
                <Link href="/forum" className="hover:text-emerald-600">Forum</Link>
              </li>
              <li className="before:content-['/'] before:mx-2">Members</li>
            </ul>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
                />
                <div className="absolute inset-y-0 right-0 px-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">
                Sort by:
                <button 
                  onClick={() => toggleSort('username')} 
                  className={`ml-4 px-3 py-1 rounded-full ${sortBy === 'username' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                >
                  Username {sortBy === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  onClick={() => toggleSort('reputation')} 
                  className={`ml-2 px-3 py-1 rounded-full ${sortBy === 'reputation' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                >
                  Reputation {sortBy === 'reputation' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  onClick={() => toggleSort('posts')} 
                  className={`ml-2 px-3 py-1 rounded-full ${sortBy === 'posts' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                >
                  Posts {sortBy === 'posts' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  onClick={() => toggleSort('joined')} 
                  className={`ml-2 px-3 py-1 rounded-full ${sortBy === 'joined' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                >
                  Joined {sortBy === 'joined' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  onClick={() => toggleSort('active')} 
                  className={`ml-2 px-3 py-1 rounded-full ${sortBy === 'active' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                >
                  Last Active {sortBy === 'active' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Members List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">No members found</h2>
            <p className="text-gray-600 mb-4">
              No members match your search criteria. Try a different search term.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-600 hover:text-emerald-700"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reputation & Badges
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                          {member.username[0].toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <Link
                            href={`/profile/${member.id}`}
                            className="text-base font-medium text-gray-900 hover:text-emerald-600"
                          >
                            {member.username}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <UserBadge 
                        username={member.username}
                        reputation={member.reputation}
                        badges={member.badges}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {member.postCount} posts
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.topicCount} topics
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.lastActive).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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