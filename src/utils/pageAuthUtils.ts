import { NextRouter } from "next/router";
import { throttle } from "./debounce";

// Track last authentication check time and result
let lastAuthCheck = 0;
let lastAuthResult = false;
const AUTH_CHECK_INTERVAL = 10000; // 10 seconds between auth checks

/**
 * Checks if the user is authenticated by making a call to /api/user/me
 * This function should be called once during page initialization
 * 
 * @param router - Next.js router for redirecting to login page if needed
 * @returns Promise<boolean> - True if authenticated, false otherwise
 */
export const checkPageAuth = async (router: NextRouter): Promise<boolean> => {
  try {
    // Skip on server-side
    if (typeof window === 'undefined') return false;
    
    // Check if we've made an auth check recently
    const now = Date.now();
    if (now - lastAuthCheck < AUTH_CHECK_INTERVAL) {
      return lastAuthResult; // Return cached result if we checked recently
    }
    
    // Update the last check time
    lastAuthCheck = now;
    
    // Verify authentication by calling the /api/user/me endpoint
    // The cookie with the token is automatically included in the request
    const authCheck = await fetch('/api/user/me');
    
    if (!authCheck.ok) {
      if (authCheck.status === 401) {
        router.push('/login');
      }
      lastAuthResult = false;
      return false;
    }
    
    lastAuthResult = true;
    return true;
  } catch (err) {
    console.error('Authentication check failed:', err);
    router.push('/login');
    lastAuthResult = false;
    return false;
  }
};
