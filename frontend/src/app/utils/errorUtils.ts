/**
 * Utility functions for error handling
 */

/**
 * Extract a readable error message from different error types
 */
export const getErrorMessage = (error: unknown, fallback: string = 'An error occurred'): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle axios error objects
  if (typeof error === 'object' && error !== null) {
    // @ts-ignore - axios error structure
    if (error.response?.data?.message) {
      // @ts-ignore
      return error.response.data.message;
    }
    
    // @ts-ignore
    if (error.message) {
      // @ts-ignore
      return error.message;
    }
  }
  
  return fallback;
};

/**
 * Check if an error is a network-related error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null) {
    // @ts-ignore - axios error structure
    if (error.code === 'ERR_NETWORK') {
      return true;
    }
    
    // @ts-ignore
    if (error.message && (
      // @ts-ignore
      error.message.includes('Network Error') || 
      // @ts-ignore
      error.message.includes('network') ||
      // @ts-ignore
      error.message.includes('connection')
    )) {
      return true;
    }
  }
  
  return false;
};

/**
 * Log an error to the console with context information
 */
export const logError = (source: string, error: unknown, context: Record<string, any> = {}): void => {
  console.error(`Error in ${source}:`, error);
  
  if (Object.keys(context).length > 0) {
    console.error('Error context:', context);
  }
  
  // Here you could also log to an external error tracking service like Sentry
}; 