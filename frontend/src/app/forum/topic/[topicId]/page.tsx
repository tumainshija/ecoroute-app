'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

// Define types for our forum data
interface ForumPost {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  isEdited?: boolean;
  lastEditedAt?: string;
  reactions?: {
    like: number;
    helpful: number;
    insightful: number;
  };
  userReaction?: string | null;
}

interface ForumTopic {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  isPinned?: boolean;
  isLocked?: boolean;
  posts: ForumPost[];
  views: number;
}

// Generate static paths for all possible topic IDs
export async function generateStaticParams() {
  // Return all the possible topic IDs that this page should be pre-rendered for
  return [
    { topicId: 'sustainability-topic-1' },
    { topicId: 'travel-experiences-topic-1' },
    { topicId: 'local-cultures-topic-1' },
    { topicId: 'route-planning-topic-1' },
    { topicId: 'ecoroute-feedback-topic-1' },
    { topicId: 'sustainability-zero-waste' },
    { topicId: 'travel-experiences-europe-by-train' },
    { topicId: 'local-cultures-indigenous-support' },
    { topicId: 'route-planning-sea-lowcarbon' },
    { topicId: 'ecoroute-feedback-carpooling' }
  ];
}

export default function TopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const { isAuthenticated, user } = useAuth();
  
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const postsPerPage = 10;
  const replyFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This would be replaced with an actual API call in production
    // For now we'll use mock data
    const fetchTopic = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Parse the topicId to get the category
        const parts = topicId.split('-');
        const categoryId = parts[0];
        
        // Get category name from categoryId
        const categoryNames: {[key: string]: string} = {
          'sustainability': 'Sustainability',
          'travel-experiences': 'Travel Experiences',
          'local-cultures': 'Local Cultures',
          'route-planning': 'Route Planning',
          'ecoroute-feedback': 'EcoRoute Feedback',
        };
        
        // Generate mock posts for topic
        const mockPosts: ForumPost[] = [
          {
            id: `${topicId}-post-1`,
            content: generateMockContent(topicId),
            author: topicId.includes('admin') ? 'EcoAdmin' : getRandomUser(),
            authorId: topicId.includes('admin') ? 'admin1' : `user${Math.floor(Math.random() * 100)}`,
            createdAt: '2023-10-01',
            reactions: {
              like: Math.floor(Math.random() * 20),
              helpful: Math.floor(Math.random() * 15),
              insightful: Math.floor(Math.random() * 10),
            },
          },
        ];
        
        // Add random replies (between 5-15)
        const replyCount = 5 + Math.floor(Math.random() * 10);
        for (let i = 0; i < replyCount; i++) {
          const daysLater = Math.floor(Math.random() * 14) + 1;
          const replyDate = new Date('2023-10-01');
          replyDate.setDate(replyDate.getDate() + daysLater);
          
          mockPosts.push({
            id: `${topicId}-post-${i + 2}`,
            content: generateMockReply(i),
            author: getRandomUser(),
            authorId: `user${Math.floor(Math.random() * 100)}`,
            createdAt: replyDate.toISOString().split('T')[0],
            isEdited: Math.random() > 0.8,
            lastEditedAt: Math.random() > 0.8 ? replyDate.toISOString().split('T')[0] : undefined,
            reactions: {
              like: Math.floor(Math.random() * 10),
              helpful: Math.floor(Math.random() * 8),
              insightful: Math.floor(Math.random() * 5),
            },
          });
        }
        
        const mockTopic: ForumTopic = {
          id: topicId,
          title: generateTopicTitle(topicId),
          categoryId,
          categoryName: categoryNames[categoryId] || 'General Discussion',
          isPinned: topicId.includes('admin'),
          isLocked: false,
          posts: mockPosts,
          views: 100 + Math.floor(Math.random() * 500),
        };
        
        setTopic(mockTopic);
      } catch (error) {
        console.error('Error fetching topic:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopic();
  }, [topicId]);

  // Helper functions to generate mock data
  function generateTopicTitle(topicId: string): string {
    if (topicId.includes('zero-waste')) {
      return 'Best practices for zero-waste travel';
    } else if (topicId.includes('europe-by-train')) {
      return 'My train journey across Europe';
    } else if (topicId.includes('indigenous-support')) {
      return 'Supporting indigenous communities while traveling';
    } else if (topicId.includes('sea-lowcarbon')) {
      return 'Planning a low-carbon trip around Southeast Asia';
    } else if (topicId.includes('carpooling')) {
      return 'Feature request: Carpooling integration';
    } else {
      return 'Discussion on eco-friendly travel methods';
    }
  }

  function getRandomUser(): string {
    const users = ['EcoTraveler', 'GreenExplorer', 'SustainableJourney', 'BikeCommuter', 'TrainEnthusiast', 'SolarWanderer', 'EthicalTourist'];
    return users[Math.floor(Math.random() * users.length)];
  }

  function generateMockContent(topicId: string): string {
    if (topicId.includes('zero-waste')) {
      return `
# Zero-Waste Travel: Best Practices

As travelers concerned about our environmental impact, adopting zero-waste principles can significantly reduce our footprint. Here are some practices I've implemented over the past year:

## Preparation
- Bring a reusable water bottle (preferably insulated)
- Pack a set of bamboo/metal utensils
- Carry a cloth shopping bag that folds into a tiny pouch
- Use solid toiletries (shampoo bars, solid toothpaste)

## While Traveling
- Decline single-use items on flights and in hotels
- Shop at local markets with your own containers
- Use digital tickets instead of printed ones
- Communicate your preferences clearly but respectfully

## Challenges
I've found language barriers can sometimes make zero-waste requests difficult. I've started keeping cards in local languages explaining my preferences.

Has anyone else implemented zero-waste travel practices? What challenges have you faced?
      `;
    } else if (topicId.includes('europe-by-train')) {
      return `
# My 3-Week Train Journey Across Europe

I recently completed a 3-week journey through 6 European countries using only trains. It was not only more sustainable but incredibly enjoyable!

## Route
- London → Paris (Eurostar)
- Paris → Barcelona (TGV)
- Barcelona → Milan (Frecciarossa)
- Milan → Vienna (Nightjet)
- Vienna → Prague (RailJet)
- Prague → Berlin (EuroCity)
- Berlin → Amsterdam (ICE)
- Amsterdam → London (Eurostar)

## Carbon Savings
According to my calculations using the EcoRoute calculator, I saved approximately 73% in carbon emissions compared to flying between these destinations.

## Tips for Others
- Book night trains when possible to save on accommodation
- Rail passes can be worth it if you're making many journeys
- The Trainline app was invaluable for booking and managing tickets
- Pack light! You'll be carrying your luggage on and off trains

Would love to hear if others have done similar routes or have questions about my experience!
      `;
    } else if (topicId.includes('indigenous-support')) {
      return `
# Supporting Indigenous Communities Through Ethical Tourism

After several trips where I specifically sought to engage with indigenous tourism initiatives, I wanted to share some thoughts on how we can best support these communities while traveling.

## Research Before You Go
- Look for indigenous-owned or led tourism operations
- Check if they have partnerships with conservation organizations
- Read reviews focusing on cultural sensitivity

## During Your Visit
- Ask permission before taking photos
- Pay fair prices and don't aggressively bargain
- Listen more than you speak
- Purchase crafts directly from artisans when possible

## After Your Trip
- Leave honest, positive reviews for ethical operators
- Share your experiences while highlighting the community's voice, not just your experience
- Stay connected with initiatives you visited

I'd love to hear others' experiences with indigenous tourism and any recommendations for community-led initiatives around the world.
      `;
    } else {
      return `
# Eco-Friendly Travel Discussion

I've been thinking a lot about how we can make our travels more sustainable while still enjoying the experience. I think there's a balance to be struck between seeing the world and preserving it for future generations.

Some things I've been implementing in my recent trips:

- Using public transportation whenever possible
- Staying in eco-certified accommodations
- Bringing reusable items (water bottle, utensils, etc.)
- Supporting local businesses that practice sustainability
- Offsetting carbon for flights when I absolutely must fly

What are some practices you've incorporated into your travel routines? Are there any innovative solutions you've discovered?

Looking forward to hearing from this community!
      `;
    }
  }
  
  function generateMockReply(index: number): string {
    const replies = [
      "I've been practicing zero-waste travel for about two years now, and it's made such a difference! One tip I'd add is to bring a small cloth napkin - it comes in handy more often than you'd expect. The biggest challenge for me has been finding bulk food options in some countries, especially in smaller towns.",
      
      "Your train journey sounds amazing! I did something similar last year but included stops in Switzerland as well. The mountain views from the train were incredible. Did you book all your tickets in advance or did you have flexibility in your schedule?",
      
      "Thank you for sharing these thoughtful guidelines on indigenous tourism. I'd add that it's also worth researching the political context of the region you're visiting. Sometimes tourism money can flow to governments or organizations that don't respect indigenous rights, even if the tour itself seems respectful.",
      
      "I've found that carbon offset programs vary widely in quality. Has anyone here researched which ones are most effective? I've been using Gold Standard certified projects, but I'm curious if there are better options.",
      
      "One practice I've started is to do a digital detox while traveling sustainably. I find it helps me connect more with local communities and be more present with the natural environment. Anyone else tried this?",
      
      "For reducing plastic waste, I carry a collapsible silicone container that's been incredibly useful for takeaway food or bringing back leftovers from restaurants. It takes up very little space when collapsed!",
      
      "The most eco-friendly accommodations I've found have been small, locally-owned places rather than chain hotels, even ones with 'green' certifications. They often have more authentic practices and the money goes directly into local economies.",
      
      "Has anyone used the new feature on EcoRoute that suggests multi-modal transportation? I tried it for a trip in Scandinavia and it worked brilliantly - combining trains, ferries, and even a shared electric car for one remote section.",
      
      "I think we also need to address the elephant in the room - flying. While trains are great in Europe, intercontinental travel is challenging without flights. How is everyone balancing this reality with sustainability goals?",
      
      "I've started choosing destinations based on their sustainability initiatives. Slovenia, Costa Rica, and New Zealand have impressed me with their national commitments to eco-tourism. Any other countries people would recommend?"
    ];
    
    return replies[index % replies.length];
  }

  // Pagination logic for posts
  const totalPages = topic ? Math.ceil(topic.posts.length / postsPerPage) : 0;
  const currentPosts = topic ? topic.posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  ) : [];

  // Handle reply submission
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setSubmitError('You must be logged in to reply');
      return;
    }
    
    if (!replyContent.trim()) {
      setSubmitError('Reply cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new post object
      const newPost: ForumPost = {
        id: `${topicId}-post-${topic?.posts.length ? topic.posts.length + 1 : 1}`,
        content: replyContent,
        author: user?.firstName || user?.username || 'Anonymous',
        authorId: user?.id || 'unknown',
        createdAt: new Date().toISOString().split('T')[0],
        reactions: {
          like: 0,
          helpful: 0,
          insightful: 0,
        },
      };
      
      // Update topic with new post
      if (topic) {
        const updatedTopic = {
          ...topic,
          posts: [...topic.posts, newPost],
        };
        setTopic(updatedTopic);
        setReplyContent('');
        
        // Go to the last page to see the new post
        setCurrentPage(Math.ceil(updatedTopic.posts.length / postsPerPage));
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      setSubmitError('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reaction to posts
  const handleReaction = (postId: string, reactionType: string) => {
    if (!isAuthenticated) return;
    
    setTopic(currentTopic => {
      if (!currentTopic) return null;
      
      const updatedPosts = currentTopic.posts.map(post => {
        if (post.id === postId) {
          const isRemoving = post.userReaction === reactionType;
          const updatedReactions = { ...post.reactions };
          
          // Remove previous reaction if any
          if (post.userReaction && post.userReaction !== reactionType) {
            updatedReactions[post.userReaction as keyof typeof updatedReactions]--;
          }
          
          // Toggle current reaction
          if (isRemoving) {
            updatedReactions[reactionType as keyof typeof updatedReactions]--;
            return { ...post, reactions: updatedReactions, userReaction: null };
          } else {
            updatedReactions[reactionType as keyof typeof updatedReactions]++;
            return { ...post, reactions: updatedReactions, userReaction: reactionType };
          }
        }
        return post;
      });
      
      return { ...currentTopic, posts: updatedPosts };
    });
  };

  // Scroll to reply form
  const scrollToReplyForm = () => {
    if (replyFormRef.current) {
      replyFormRef.current.scrollIntoView({ behavior: 'smooth' });
      // Focus on the textarea after scrolling
      const textarea = replyFormRef.current.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }
  };

  if (!topic && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Topic Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              The topic you are looking for does not exist or has been removed.
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
        <div className="mb-8">
          {isLoading ? (
            <>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-6 w-1/2"></div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{topic?.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
                <span>
                  Category: <Link href={`/forum/category/${topic?.categoryId}`} className="text-emerald-600 hover:text-emerald-700">{topic?.categoryName}</Link>
                </span>
                <span>Views: {topic?.views}</span>
                <span>Replies: {topic?.posts.length ? topic.posts.length - 1 : 0}</span>
                {topic?.isPinned && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Pinned
                  </span>
                )}
                {topic?.isLocked && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Locked
                  </span>
                )}
              </div>
            </>
          )}
          
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm breadcrumbs">
              <ul className="flex space-x-2 text-gray-500">
                <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
                <li className="before:content-['/'] before:mx-2">
                  <Link href="/forum" className="hover:text-emerald-600">Forum</Link>
                </li>
                <li className="before:content-['/'] before:mx-2">
                  <Link href={`/forum/category/${topic?.categoryId}`} className="hover:text-emerald-600">{topic?.categoryName || 'Category'}</Link>
                </li>
                <li className="before:content-['/'] before:mx-2 truncate max-w-[200px]">{topic?.title || 'Loading...'}</li>
              </ul>
            </div>
            
            {isAuthenticated && !topic?.isLocked && (
              <button
                onClick={scrollToReplyForm}
                className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Reply
              </button>
            )}
          </div>
        </div>
        
        {/* Posts List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {currentPosts.map((post, index) => (
              <div 
                key={post.id} 
                id={`post-${post.id}`}
                className={`bg-white rounded-lg shadow overflow-hidden ${index === 0 ? 'border-l-4 border-emerald-500' : ''}`}
              >
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 mr-3">
                        {post.author[0].toUpperCase()}
                      </div>
                      <div>
                        <Link href={`/profile/${post.authorId}`} className="font-medium text-gray-900 hover:text-emerald-600">
                          {post.author}
                        </Link>
                        <div className="text-sm text-gray-500">
                          <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
                          {post.isEdited && (
                            <span className="ml-2 text-xs">(edited {post.lastEditedAt && new Date(post.lastEditedAt).toLocaleDateString()})</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      #{index + 1 + (currentPage - 1) * postsPerPage}
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="prose max-w-none text-gray-700 mb-4">
                    {post.content.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={i} className="text-2xl font-bold mt-0">{line.substring(2)}</h1>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-xl font-semibold">{line.substring(3)}</h2>;
                      } else if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4">{line.substring(2)}</li>;
                      } else if (line.trim() === '') {
                        return <br key={i} />;
                      } else {
                        return <p key={i} className="my-2">{line}</p>;
                      }
                    })}
                  </div>
                  
                  {/* Post Footer */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    {/* Reactions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReaction(post.id, 'like')}
                        className={`flex items-center px-2 py-1 rounded-full text-xs ${
                          post.userReaction === 'like' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={!isAuthenticated}
                      >
                        👍 Like ({post.reactions?.like || 0})
                      </button>
                      <button
                        onClick={() => handleReaction(post.id, 'helpful')}
                        className={`flex items-center px-2 py-1 rounded-full text-xs ${
                          post.userReaction === 'helpful' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={!isAuthenticated}
                      >
                        🌟 Helpful ({post.reactions?.helpful || 0})
                      </button>
                      <button
                        onClick={() => handleReaction(post.id, 'insightful')}
                        className={`flex items-center px-2 py-1 rounded-full text-xs ${
                          post.userReaction === 'insightful' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={!isAuthenticated}
                      >
                        💡 Insightful ({post.reactions?.insightful || 0})
                      </button>
                    </div>
                    
                    {/* Quote Reply */}
                    {isAuthenticated && !topic?.isLocked && (
                      <button
                        onClick={() => {
                          scrollToReplyForm();
                          setReplyContent(prev => `> ${post.author} wrote:\n> ${post.content.split('\n').join('\n> ')}\n\n`);
                        }}
                        className="text-xs text-gray-500 hover:text-emerald-600"
                      >
                        Quote
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) < 2
                    )
                    .map((page, i, filteredPages) => (
                      <React.Fragment key={page}>
                        {i > 0 && filteredPages[i - 1] !== page - 1 && (
                          <span className="px-3 py-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded ${
                            currentPage === page 
                              ? 'bg-emerald-100 text-emerald-700 font-medium' 
                              : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Reply Form */}
            <div ref={replyFormRef} className="mt-8">
              {topic?.isLocked ? (
                <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600">
                  <p>This topic is locked and no longer accepts new replies.</p>
                </div>
              ) : isAuthenticated ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Post a Reply</h3>
                    <form onSubmit={handleReplySubmit}>
                      <div className="mb-4">
                        <textarea
                          id="reply-content"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={6}
                          className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
                          placeholder="Share your thoughts..."
                        ></textarea>
                      </div>
                      {submitError && (
                        <div className="mb-4 text-red-600 text-sm">{submitError}</div>
                      )}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition flex items-center ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            <>Post Reply</>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <p className="text-gray-700 mb-4">You need to be logged in to reply to this topic.</p>
                  <Link 
                    href={`/login?redirect=/forum/topic/${topicId}`} 
                    className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition inline-block"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Back to Category */}
        <div className="mt-8 text-center">
          <Link 
            href={`/forum/category/${topic?.categoryId}`} 
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to {topic?.categoryName || 'Category'}
          </Link>
        </div>
      </div>
    </div>
  );
} 
