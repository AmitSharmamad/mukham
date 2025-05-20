import { NextRouter } from "next/router";

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
    
    // Verify authentication by calling the /api/user/me endpoint
    // The cookie with the token is automatically included in the request
    const authCheck = await fetch('/api/user/me');
    
    if (!authCheck.ok) {
      if (authCheck.status === 401) {
        router.push('/login');
      }
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Authentication check failed:', err);
    router.push('/login');
    return false;
  }
};
