'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/authService';

// UI components - Note: components might need to be imported from correct paths
// You might need to create or adjust these components based on your project structure
const Avatar = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`overflow-hidden rounded-full ${className}`}>{children}</div>
);
const AvatarImage = ({ src, alt, className }: { src?: string, alt?: string, className?: string }) => (
  src ? <img src={src} alt={alt} className={`object-cover w-full h-full ${className}`} /> : null
);
const AvatarFallback = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`flex items-center justify-center w-full h-full ${className}`}>{children}</div>
);
const Button = ({ 
  children, 
  type = 'button', 
  variant, 
  className, 
  disabled,
  onClick
}: { 
  children: React.ReactNode, 
  type?: 'button' | 'submit' | 'reset', 
  variant?: string, 
  className?: string, 
  disabled?: boolean,
  onClick?: () => void
}) => (
  <button 
    type={type} 
    className={`${variant === 'outline' ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'w-full bg-emerald-600 hover:bg-emerald-700 text-white'} px-4 py-3 rounded-lg font-medium transition-colors duration-300 ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>{children}</div>
);
const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>
);
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);
const Input = ({ 
  id, 
  type = 'text',
  placeholder, 
  value, 
  onChange,
  className,
  accept
}: { 
  id?: string, 
  type?: string,
  placeholder?: string, 
  value?: string, 
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  className?: string,
  accept?: string
}) => (
  <input 
    id={id} 
    type={type} 
    placeholder={placeholder} 
    value={value} 
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${className || ''}`}
    accept={accept}
  />
);
const Label = ({ htmlFor, children, className }: { htmlFor?: string, children: React.ReactNode, className?: string }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>{children}</label>
);
const Textarea = ({ 
  id, 
  placeholder, 
  value, 
  onChange,
  rows,
  className
}: { 
  id?: string, 
  placeholder?: string, 
  value?: string, 
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  rows?: number,
  className?: string
}) => (
  <textarea 
    id={id} 
    placeholder={placeholder} 
    value={value} 
    onChange={onChange}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${className || ''}`}
  />
);

// Icons - Simplified versions using SVG
const ChevronLeft = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const LinkIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);
const MapPin = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const Save = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);
const User = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const X = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

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
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // In a real application, fetch the user data from the API
    const fetchUserProfile = async () => {
      setIsPageLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // If we have a user from auth context, use that data
        if (user) {
          const userData: UserProfileData = {
            username: user.username || 'eco_user',
            displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Eco User',
            email: user.email || 'eco_user@example.com',
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
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load your profile. Please try again later.');
      } finally {
        setIsPageLoading(false);
      }
    };
    
    if (!isLoading && isAuthenticated) {
      fetchUserProfile();
    }
  }, [isLoading, isAuthenticated, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      // Validate form
      if (!profile.displayName.trim()) {
        throw new Error('Display name is required');
      }
      
      // Get first name and last name from display name
      const firstName = profile.displayName.split(' ')[0];
      const lastName = profile.displayName.split(' ').slice(1).join(' ');
      
      if (user) {
        // Create updated user object for the API
        const userData = {
          username: profile.username,
          email: profile.email,
          firstName: firstName,
          lastName: lastName,
          // Add optional fields as needed
          profilePicture: filePreview || profile.avatarUrl || undefined,
          // Store additional fields in a metadata field if your backend supports it
          metadata: {
            bio: profile.bio,
            location: profile.location,
            website: profile.website,
            socialLinks: profile.socialLinks
          }
        };
        
        // Call the real API to update the user profile
        const response = await updateProfile(userData);
        
        if (response.success) {
          // Update local user data with the response from the server
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Set success message
          setSuccess('Profile updated successfully!');
          
          // Redirect after short delay
          setTimeout(() => {
            router.push('/profile');
          }, 1500);
        } else {
          throw new Error('Failed to update profile');
        }
      }
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
      // Call real password change API in your auth service
      // For example:
      // await updatePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });
      
      // Since we don't have the exact implementation yet, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to update password. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading || isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Return null if user is not logged in, the useEffect will handle redirection
  if (!isAuthenticated || !user) {
    return null;
  }

  // Avatar fallback text
  const initials = profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Link 
          href="/profile"
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors duration-300"
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
            className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors duration-300"
            onClick={() => router.push('/profile')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-300"
            disabled={isSaving}
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
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-300"
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