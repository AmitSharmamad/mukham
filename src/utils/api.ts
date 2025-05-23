// API client utilities for the application
import axios from 'axios';
import Router from 'next/router';

const API_BASE_URL = "/api"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get token safely (avoiding SSR issues)
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Request interceptor for adding auth token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track if we're in an auth check to prevent redirect loops
let isCheckingAuth = false;

// Keep track of auth-related paths
const AUTH_PATHS = ['/login', '/auth/callback', '/user/login'];

// Function to set/clear auth checking status
export const setAuthChecking = (checking: boolean) => {
  isCheckingAuth = checking;
};

// Helper to check if on an auth path
const isAuthPath = (path: string) => {
  return AUTH_PATHS.some(authPath => path.startsWith(authPath));
};

// Handle common response errors
apiClient.interceptors.response.use(
  (response) => {
    // Make sure the response is valid before proceeding
    if (response.headers['content-type']?.includes('text/html')) {
      // HTML responses usually indicate a navigation/redirect - handle this by returning an appropriate error
      return Promise.reject(new Error('Received HTML response instead of JSON data'));
    }
    return response;
  },
  (error) => {
    // Don't do anything for aborted requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    
    // Only run this in the browser
    if (typeof window !== 'undefined') {
      try {
        // Handle authentication errors, but with careful checks to prevent loops
        // Check for both 401 (Unauthorized) and 403 (Forbidden) status codes
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Don't redirect during auth checks
          if (isCheckingAuth) {
            return Promise.reject(error);
          }
          
          // Don't redirect if we're already on an auth page
          const currentPath = Router.pathname;
          if (isAuthPath(currentPath)) {
            return Promise.reject(error);
          }
          
          // Make sure we have localStorage available
          if (typeof localStorage !== 'undefined') {
            // Clear token on authentication failure
            localStorage.removeItem('token');
            
            // Okay to redirect - but just once
            // Save the current URL to redirect back after login
            Router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
          }
        }
      } catch (redirectError) {
        console.error('Error during auth redirect:', redirectError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;