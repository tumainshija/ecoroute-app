import axios from 'axios';

// Define the base URL for our API - use direct URL or fallback to proxy
const useProxy = process.env.NEXT_PUBLIC_USE_PROXY === 'true';
const API_BASE_URL = useProxy 
  ? '/api' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api');

console.log('API Base URL:', API_BASE_URL, 'Using Proxy:', useProxy);

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 15000, // Increased timeout to 15 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    try {
      // Get token from local storage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // If token exists, add it to the request headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added Authorization header with token');
      }
      
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? 'Bearer [REDACTED]' : undefined
        },
      });
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('API Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
    });
    return response;
  },
  async (error) => {
    // If axios error has a response, log important details
    if (error.response) {
      console.error('API Response error:', {
        url: error.config?.url,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else {
      console.error('API Request failed:', error.message);
    }
    
    // Add better network error handling with retry mechanism
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.error('Network error detected - server may be down or unreachable');
      
      // If not already retried and not using proxy, try the proxy approach
      const retryConfig = error.config;
      if (retryConfig && !retryConfig._retry && !useProxy) {
        retryConfig._retry = true;
        console.log('Retrying request with proxy endpoint');
        // Switch to proxy endpoint for this request
        retryConfig.baseURL = '/api';
        
        try {
          return await axios(retryConfig);
        } catch (retryError) {
          console.error('Retry with proxy also failed:', retryError.message);
          return Promise.reject(retryError);
        }
      }
    }
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access, clearing token');
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        
        // Don't redirect if we're already on the login page to avoid redirect loops
        const isLoginPage = window.location.pathname.includes('/login');
        const isRegisterPage = window.location.pathname.includes('/register');
        if (!isLoginPage && !isRegisterPage) {
          // Optional: redirect to login page
          console.log('Redirecting to login page due to 401 error');
          window.location.href = '/login';
        }
      }
    }
    
    // Handle server errors (500+)
    if (error.response && error.response.status >= 500) {
      console.error('Server error detected:', error.response.status);
      error.message = 'The server encountered an error. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

// Location type definition
export interface Location {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  country: string;
  region: string;
  city: string;
}

// Attraction type definition
export interface Attraction {
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  culturalSignificance: string;
}

// EcoRoute type definition matching our backend model
export interface EcoRoute {
  _id?: string;
  start: Location;
  destination: Location;
  carbonSaved: number;
  distance: number;
  transportMode: 'walking' | 'cycling' | 'public_transport' | 'electric_vehicle' | 'hybrid_vehicle';
  estimatedTime: number;
  attractions?: Attraction[];
  createdAt?: string;
}

// EcoRoute API functions
export const ecoRouteApi = {
  // Get all eco routes
  getAllRoutes: async (): Promise<EcoRoute[]> => {
    const response = await api.get('/routes');
    return response.data;
  },

  // Get a specific route by ID
  getRouteById: async (id: string): Promise<EcoRoute> => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },

  // Create a new eco route
  createRoute: async (routeData: Omit<EcoRoute, '_id' | 'createdAt'>): Promise<EcoRoute> => {
    const response = await api.post('/routes', routeData);
    return response.data;
  },

  // Update an existing route
  updateRoute: async (id: string, routeData: Partial<EcoRoute>): Promise<EcoRoute> => {
    const response = await api.put(`/routes/${id}`, routeData);
    return response.data;
  },

  // Delete a route
  deleteRoute: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/routes/${id}`);
    return response.data;
  }
};

export default api; 