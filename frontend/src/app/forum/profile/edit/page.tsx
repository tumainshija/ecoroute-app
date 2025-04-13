'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronLeft,
  Link as LinkIcon,
  MapPin,
  Save,
  User,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

interface SocialLink {
  platform: string;
  url: string;
}

interface UserProfileData {
  username: string;
  displayName: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  socialLinks: SocialLink[];
  avatarUrl: string;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Profile form state
  const [profile, setProfile] = useState<UserProfileData>({
    username: '',
    displayName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    socialLinks: [
      { platform: 'Twitter', url: '' },
      { platform: 'LinkedIn', url: '' },
      { platform: 'GitHub', url: '' }
    ],
    avatarUrl: ''
  });

  useEffect(() => {
    // In a real application, fetch the user data from the API
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock user data - in a real app this would come from an API
        const userData: UserProfileData = {
          username: 'eco_user',
          displayName: 'Eco User',
          email: 'eco_user@example.com',
          bio: 'Passionate about sustainability and finding eco-friendly transportation solutions. Working on reducing my carbon footprint one trip at a time.',
          location: 'San Francisco, CA',
          website: 'https://example.com',
          socialLinks: [
            { platform: 'Twitter', url: 'https://twitter.com/ecouser' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/ecouser' },
            { platform: 'GitHub', url: 'https://github.com/ecouser' }
          ],
          avatarUrl: ''
        };
        
        setProfile(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load your profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      // Validate form
      if (!profile.displayName.trim()) {
        throw new Error('Display name is required');
      }
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success message
      setSuccess('Profile updated successfully!');
      
      // In a real app, would save to backend here
      // await updateUserProfile(profile);
      
      // Redirect after short delay
      setTimeout(() => {
        router.push(`/forum/profile/${profile.username}`);
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = [...profile.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setProfile({ ...profile, socialLinks: updatedLinks });
  };

  const addSocialLink = () => {
    setProfile({
      ...profile,
      socialLinks: [...profile.socialLinks, { platform: 'Other', url: '' }]
    });
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = profile.socialLinks.filter((_, i) => i !== index);
    setProfile({ ...profile, socialLinks: updatedLinks });
  };

  // Platform options for social links
  const platformOptions = ['Twitter', 'LinkedIn', 'GitHub', 'Instagram', 'Facebook', 'YouTube', 'Other'];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
      
      // In a real application, you would upload the file to a server or cloud storage
      // and then set the resulting URL
      // For demo purposes, we'll just use the preview URL
      // setProfile({ ...profile, avatarUrl: previewUrl });
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!passwordData.currentPassword) {
      setError('Current password is required');
      return;
    }
    
    if (!passwordData.newPassword) {
      setError('New password is required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, would call API to change password here
      // await changePassword(passwordData);
      
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      setError('Failed to update password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Avatar fallback text
  const initials = profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Link 
          href={`/forum/profile/${profile.username}`}
          className="text-emerald-600 hover:text-emerald-700 flex items-center"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back to profile</span>
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Edit Profile</h1>
        <p className="text-gray-600 mt-1">Update your personal information and social media links</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
          <div className="mr-3 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start">
          <div className="mr-3 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>{success}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <User size={20} className="mr-2 text-emerald-500" />
              Profile Picture
            </h2>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-6">
            <div>
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage src={filePreview || profile.avatarUrl} alt={profile.displayName} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-4xl font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileImage">Upload Profile Image</Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                <p className="text-xs text-gray-500">
                  Upload a new profile image (JPEG, PNG, GIF, max 2MB)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Or use Image URL</Label>
                <Input
                  id="avatarUrl"
                  placeholder="https://example.com/your-image.jpg"
                  value={profile.avatarUrl}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, avatarUrl: e.target.value })}
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-sm"
                  onClick={() => {
                    setProfile({ ...profile, avatarUrl: '' });
                    setFilePreview(null);
                  }}
                >
                  Reset to Default
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <User size={20} className="mr-2 text-emerald-500" />
              Basic Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Your username"
                  value={profile.username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, username: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  This will be your public identifier on the forum
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your name"
                  value={profile.displayName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, displayName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={profile.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, email: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Your email will not be shared publicly
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <p className="text-xs text-gray-500">Briefly describe yourself and your interest in eco-friendly routes</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Location and Website */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <MapPin size={20} className="mr-2 text-emerald-500" />
              Location & Website
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://example.com"
                type="url"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Social Links */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <LinkIcon size={20} className="mr-2 text-emerald-500" />
              Social Links
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32">
                  <select
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    {platformOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <Input
                    value={link.url}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleSocialLinkChange(index, 'url', e.target.value)}
                    placeholder={`Your ${link.platform} URL`}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeSocialLink(index)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            
            {profile.socialLinks.length < 5 && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addSocialLink}
              >
                Add Another Link
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/forum/profile/${profile.username}`)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
      
      {/* Password Change Form */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-emerald-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Change Password
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSaving}
              >
                {isSaving ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 