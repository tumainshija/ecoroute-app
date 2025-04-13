import api from './api';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: { platform: string; url: string }[];
  createdAt?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Register user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('Attempting to register user:', userData.email);
    const response = await api.post('/auth/register', userData);
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    const errorMessage = error.response?.data?.message || 'Registration failed';
    console.error('Registration error message:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Login user
export const login = async (userData: LoginData): Promise<AuthResponse> => {
  let retries = 2; // Allow 2 retries for network issues
  let delay = 1000; // Start with 1 second delay
  
  while (retries >= 0) {
    try {
      console.log('Attempting login for:', userData.email);
      const response = await api.post('/auth/login', userData);
      console.log('Login response received');
      
      // Store token in local storage upon successful login
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored in localStorage');
      } else {
        console.warn('No token received in login response');
        throw new Error('Authentication failed: No token received from server');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle network errors with retries
      if ((error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) && retries > 0) {
        console.log(`Network error detected, retrying... (${retries} attempts left)`);
        retries--;
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Double the delay for next retry
        continue;
      }
      
      // Improved error handling with more specific messages
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.error('Network error detected during login after retries');
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      } else if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        
        // More detailed error messages based on status code
        if (error.response.status === 401) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.response.status === 429) {
          throw new Error('Too many login attempts. Please try again later.');
        } else if (error.response.status === 400) {
          throw new Error(error.response.data?.message || 'Missing required fields. Please provide both email and password.');
        } else if (error.response.status >= 500) {
          throw new Error('Server error. Our team has been notified and is working on a fix.');
        } else {
          throw new Error(error.response.data?.message || 'Login failed. Please check your credentials.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        throw new Error(error.message || 'Login failed. Please try again later.');
      }
    }
  }
  
  // This should never be reached due to the error handling above, but TypeScript needs it
  throw new Error('Unable to connect to the server after multiple attempts.');
};

// Get user profile - no need to manually pass token, interceptor will handle it
export const getProfile = async (): Promise<{ success: boolean; user: User }> => {
  try {
    console.log('Fetching user profile');
    const response = await api.get('/auth/profile');
    console.log('Profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    const errorMessage = error.response?.data?.message || 'Failed to get user profile';
    console.error('Profile error message:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update user profile - no need to manually pass token, interceptor will handle it
export const updateProfile = async (
  userData: Partial<User>
): Promise<{ success: boolean; user: User }> => {
  try {
    console.log('Updating user profile:', userData);
    const response = await api.put('/auth/profile', userData);
    console.log('Profile update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Profile update error:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update profile';
    console.error('Profile update error message:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Logout user
export const logout = (): void => {
  console.log('Logging out user');
  localStorage.removeItem('token');
  console.log('Token removed from localStorage');
  // Additional cleanup if needed
}; 