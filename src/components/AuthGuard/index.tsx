import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import { checkPageAuth } from '../../utils/pageAuthUtils';

interface AuthGuardProps {
  children: ReactNode;
}

const protectedRoutes = ['/home', '/strategy', '/deployment']; // Routes that require authentication

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoggedIn, loading, checkUserAuth } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side only mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track if an auth check is in progress
  const [isAuthChecking, setIsAuthChecking] = useState(false);

  useEffect(() => {
    // Skip auth check during SSR
    if (!mounted) return;
    
    // Prevent concurrent auth checks
    if (isAuthChecking) return;
    
    const checkAuthentication = async () => {
      // Check if we're on a protected route that requires authentication
      const isProtectedRoute = protectedRoutes.some(route => 
        router.pathname === route || router.pathname.startsWith(route + '/')
      );
      
      // If we're not on a protected route, don't check auth - allow access
      if (!isProtectedRoute) {
        setChecking(false);
        return;
      }

      // Always perform a fresh auth check for protected routes
      setIsAuthChecking(true);
      try {
        // Use the centralized auth check function
        const isAuthenticated = await checkPageAuth(router);
        setIsAuthChecking(false);
        setChecking(false);
      } catch (error) {
        setIsAuthChecking(false);
        setChecking(false);
      }
    };

    checkAuthentication();
  }, [router.pathname, mounted, isAuthChecking]); // Removed router from dependencies

  // Don't render anything until we're mounted on the client
  if (!mounted) {
    return <>{children}</>; // Return children during SSR to avoid hydration issues
  }

  // Show loading indicator while checking auth
  if (loading || checking) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If we're on a protected route and not logged in, the useEffect will handle redirection
  // If we're on a public route or we're logged in, render the children
  return <>{children}</>;
};

export default AuthGuard;
