import Router from 'next/router';
import apiClient, { setAuthChecking } from './api';

export interface UserData {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

// Cache auth check result briefly to prevent repeated calls
let authCache: { userData: UserData | null; timestamp: number } | null = null;
const AUTH_CACHE_TTL = 3000; // 3 seconds

// Check if user is authenticated
export const checkAuth = async (): Promise<UserData | null> => {
  // Don't attempt to make API calls during server-side rendering
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Check cache first
  const now = Date.now();
  if (authCache && (now - authCache.timestamp) < AUTH_CACHE_TTL) {
    return authCache.userData;
  }

  // No valid token, quick fail
  if (!localStorage.getItem('token')) {
    authCache = { userData: null, timestamp: now };
    return null;
  }
  
  try {
    // Signal that we're checking auth to prevent redirect loops
    setAuthChecking(true);
    const response = await apiClient.get('/user/me');
    // Update cache
    authCache = { userData: response.data, timestamp: Date.now() };
    return response.data;
  } catch (error) {
    // Update cache for failed auth
    authCache = { userData: null, timestamp: Date.now() };
    return null;
  } finally {
    // Always ensure we clear the auth checking flag
    setAuthChecking(false);
  }
};

// Route protection wrapper - redirects to login if not authenticated
export const protectRoute = async (excludedRoutes: string[] = ['/home']): Promise<boolean> => {
  // Skip during server-side rendering
  if (typeof window === 'undefined') {
    return true;
  }
  
  // Skip protection for excluded routes
  const currentPath = Router.pathname;
  
  if (excludedRoutes.includes(currentPath)) {
    return true;
  }

  const userData = await checkAuth();
  
  if (!userData) {
    Router.push('/login');
    return false;
  }
  
  return true;
};
