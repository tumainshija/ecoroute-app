'use client';

import { useState } from 'react';
import Image from 'next/image';

interface UserBadgeProps {
  username: string;
  reputation?: number;
  badges?: {
    id: string;
    name: string;
    icon: string;
    description: string;
  }[];
  postCount?: number;
  joinDate?: string;
  showDetails?: boolean;
}

export default function UserBadge({ 
  username, 
  reputation = 0, 
  badges = [], 
  postCount = 0, 
  joinDate = '', 
  showDetails = false
}: UserBadgeProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  // Determine user level based on reputation
  const getUserLevel = (rep: number) => {
    if (rep >= 1000) return { name: 'Eco Expert', color: 'bg-emerald-600' };
    if (rep >= 500) return { name: 'Sustainability Guide', color: 'bg-emerald-500' };
    if (rep >= 250) return { name: 'Green Explorer', color: 'bg-emerald-400' };
    if (rep >= 100) return { name: 'Eco Enthusiast', color: 'bg-emerald-300' };
    return { name: 'New Member', color: 'bg-gray-300' };
  };
  
  const userLevel = getUserLevel(reputation);
  
  return (
    <div className={`flex items-center ${showDetails ? 'flex-col' : ''}`}>
      {/* User level badge */}
      <div className="flex items-center">
        <span className={`${userLevel.color} h-2 w-2 rounded-full mr-1`}></span>
        <span className="text-xs text-gray-600 mr-3">{userLevel.name}</span>
      </div>
      
      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex items-center space-x-1">
          {badges.map(badge => (
            <div
              key={badge.id}
              className="relative"
              onMouseEnter={() => setShowTooltip(badge.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div className="h-5 w-5 relative">
                <Image
                  src={badge.icon}
                  alt={badge.name}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Tooltip */}
              {showTooltip === badge.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  <div className="font-bold mb-1">{badge.name}</div>
                  <div>{badge.description}</div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Detailed info */}
      {showDetails && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          <div>{postCount} posts</div>
          {joinDate && <div>Member since {new Date(joinDate).toLocaleDateString()}</div>}
          <div>{reputation} reputation</div>
        </div>
      )}
    </div>
  );
} 