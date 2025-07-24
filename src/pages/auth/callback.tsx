import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  
  // Mark component as mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    // Skip during server-side rendering
    if (!mounted || !router.isReady) return;
    
    const handleCallback = async () => {
      try {
        const { token } = router.query;
        
        if (!token || Array.isArray(token)) {
          throw new Error('Invalid token received');
        }
        
        // Store the token and update auth state
        login(token);
        
        // Redirect to the stored redirect URL or default to home
        const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
        const returnUrl = localStorage.getItem('returnUrl') || redirectAfterLogin || '/home';
        localStorage.removeItem('returnUrl'); // Clean up
        sessionStorage.removeItem('redirectAfterLogin'); // Clean up
        router.replace(returnUrl);
      } catch (err) {
        console.error('Authentication failed:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [router.isReady, router.query, mounted, login]);

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Typography variant="body1">
          <a href="/login">Return to login</a>
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body1">
        Completing authentication...
      </Typography>
    </Box>
  );
}
