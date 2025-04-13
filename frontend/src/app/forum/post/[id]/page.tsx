"use client";

import { ArrowLeft, Flag, MessageSquare, Send, Share2, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  likes: number;
  replies: number;
}

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  isReply?: boolean;
  parentId?: string;
  replies?: Comment[];
}

// Mock data
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Best eco-friendly transportation options",
    content: "I've been trying to reduce my carbon footprint by changing how I commute. What are the most eco-friendly transportation options that are also practical for daily use?",
    author: {
      name: "GreenCommuter",
      avatar: "/avatars/user1.png"
    },
    category: {
      id: "1",
      name: "Transportation",
      slug: "transportation"
    },
    createdAt: "2023-05-15T10:30:00Z",
    likes: 24,
    replies: 8
  },
  {
    id: "2",
    title: "Solar panel installation experiences",
    content: "Has anyone installed solar panels recently? I'm considering it for my home and would like to hear about your experiences, costs, and benefits.",
    author: {
      name: "SolarEnthusiast",
      avatar: "/avatars/user2.png"
    },
    category: {
      id: "2",
      name: "Renewable Energy",
      slug: "renewable-energy"
    },
    createdAt: "2023-05-10T14:45:00Z",
    likes: 31,
    replies: 12
  }
];

const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "101",
      content: "Electric bikes are great! I've been using one for my daily commute for about a year now. They're fast enough for city travel but don't require as much energy as a car.",
      author: {
        name: "BikeRider",
        avatar: "/avatars/user3.png"
      },
      createdAt: "2023-05-15T11:05:00Z",
      likes: 8
    },
    {
      id: "102",
      content: "Public transportation is still one of the most eco-friendly options if it's available in your area. Many cities are transitioning to electric buses too!",
      author: {
        name: "EcoTransitFan",
        avatar: "/avatars/user4.png"
      },
      createdAt: "2023-05-15T13:20:00Z",
      likes: 6,
      replies: [
        {
          id: "102-1",
          content: "True, but public transportation isn't always reliable in some areas. I think a combination of options works best.",
          author: {
            name: "PracticalGreen",
            avatar: "/avatars/user5.png"
          },
          createdAt: "2023-05-15T14:10:00Z",
          likes: 3,
          isReply: true,
          parentId: "102"
        }
      ]
    }
  ],
  "2": [
    {
      id: "201",
      content: "We installed 16 panels last summer. Initial cost was about $15,000 after federal tax credits. Our electricity bill has been reduced by 70% on average!",
      author: {
        name: "SolarPowered",
        avatar: "/avatars/user6.png"
      },
      createdAt: "2023-05-10T16:30:00Z",
      likes: 12
    }
  ]
};

// Generate static paths for all possible post IDs
export async function generateStaticParams() {
  // Return all the possible post IDs that this page should be pre-rendered for
  return [
    { id: "1" },
    { id: "2" },
    { id: "101" },
    { id: "102" },
    { id: "201" }
  ];
}

export default function PostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Simulate fetching post data
    setIsLoading(true);
    
    // Timeout to simulate API call
    setTimeout(() => {
      const foundPost = mockPosts.find(p => p.id === id);
      setPost(foundPost || null);
      
      const postComments = mockComments[id as string] || [];
      setComments(postComments);
      
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      author: {
        name: "CurrentUser",
        avatar: "/avatars/current-user.png"
      },
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <p className="mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-green-600 hover:text-green-800 transition"
        >
          <ArrowLeft className="mr-2" size={16} />
          <span>Back to {post.category.name}</span>
        </button>
      </div>
      
      {/* Post */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
        
        <div className="flex items-center mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
              {post.author.avatar && (
                <Image 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  width={32} 
                  height={32}
                  className="object-cover"
                />
              )}
            </div>
            <span className="font-medium">{post.author.name}</span>
          </div>
          
          <span className="mx-2">•</span>
          <span>{formatDate(post.createdAt)}</span>
          
          <span className="mx-2">•</span>
          <Link 
            href={`/forum/category/${post.category.slug}`}
            className="text-green-600 hover:underline"
          >
            {post.category.name}
          </Link>
        </div>
        
        <div className="prose max-w-none mb-6">
          <p>{post.content}</p>
        </div>
        
        <div className="flex items-center space-x-6 border-t pt-4">
          <button className="flex items-center text-gray-600 hover:text-green-600 transition">
            <ThumbsUp size={18} className="mr-1" />
            <span>{post.likes}</span>
          </button>
          
          <button className="flex items-center text-gray-600 hover:text-green-600 transition">
            <MessageSquare size={18} className="mr-1" />
            <span>{post.replies}</span>
          </button>
          
          <button className="flex items-center text-gray-600 hover:text-green-600 transition">
            <Share2 size={18} className="mr-1" />
            <span>Share</span>
          </button>
          
          <button className="flex items-center text-gray-600 hover:text-red-600 transition ml-auto">
            <Flag size={18} className="mr-1" />
            <span>Report</span>
          </button>
        </div>
      </div>
      
      {/* Comments */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Responses ({comments.length})</h2>
        
        {comments.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
            <p>Be the first to respond to this post!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className={`bg-white rounded-lg shadow-sm p-5 ${comment.isReply ? 'ml-12 border-l-4 border-green-100' : ''}`}>
                <div className="flex items-center mb-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
                    {comment.author.avatar && (
                      <Image 
                        src={comment.author.avatar} 
                        alt={comment.author.name} 
                        width={32} 
                        height={32}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="font-medium">{comment.author.name}</span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-600">{formatDate(comment.createdAt)}</span>
                </div>
                
                <div className="prose max-w-none mb-3">
                  <p>{comment.content}</p>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <button className="flex items-center hover:text-green-600 transition">
                    <ThumbsUp size={16} className="mr-1" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="ml-6 hover:text-green-600 transition">Reply</button>
                </div>
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="border-l-4 border-green-100 pl-4 ml-6">
                        <div className="flex items-center mb-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 overflow-hidden">
                            {reply.author.avatar && (
                              <Image 
                                src={reply.author.avatar} 
                                alt={reply.author.name} 
                                width={24} 
                                height={24}
                                className="object-cover"
                              />
                            )}
                          </div>
                          <span className="font-medium">{reply.author.name}</span>
                          <span className="mx-2">•</span>
                          <span className="text-gray-600">{formatDate(reply.createdAt)}</span>
                        </div>
                        
                        <div className="prose max-w-none mb-2">
                          <p>{reply.content}</p>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <button className="flex items-center hover:text-green-600 transition">
                            <ThumbsUp size={14} className="mr-1" />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Comment */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Add your response</h3>
        
        <div className="mb-4">
          <textarea
            className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
            rows={4}
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
          >
            <Send size={16} className="mr-2" />
            Post Response
          </button>
        </div>
      </div>
    </div>
  );
} 
