import { Box, Button, Container, Typography, CircularProgress, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { isLoggedIn, checkUserAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // State to track client-side rendering
  const [mounted, setMounted] = useState(false);
  
  // Mark component as mounted (client-side only)
  useEffect(() => {
    setMounted(true);
    setLoading(false); // Don't show loading during SSR
  }, []);
  
  // Track if an auth check is in progress
  const [isAuthChecking, setIsAuthChecking] = useState(false);
  
  // Check if user is already logged in - only run on client side
  useEffect(() => {
    // Skip auth check during SSR or when auth check is already in progress
    if (!mounted || isAuthChecking) return;
    
    // Get stored token - if no token, no need to check auth
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    const checkAuth = async () => {
      setIsAuthChecking(true);
      setLoading(true);
      
      try {
        // If we're already logged in according to our state, just redirect
        if (isLoggedIn) {
          const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
          const returnUrl = router.query.returnUrl as string || redirectAfterLogin || '/home';
          sessionStorage.removeItem('redirectAfterLogin'); // Clean up
          router.replace(returnUrl);
          return; // Exit early after redirect
        }
        
        // Otherwise verify with an auth check
        const isAuth = await checkUserAuth();
          
        if (isAuth) {
          // Redirect to home if user is already logged in
          const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
          const returnUrl = router.query.returnUrl as string || redirectAfterLogin || '/home';
          sessionStorage.removeItem('redirectAfterLogin'); // Clean up
          router.replace(returnUrl);
        }
      } finally {
        setLoading(false);
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [mounted, isAuthChecking, isLoggedIn, router.query.returnUrl]);

  const handleGoogleLogin = () => {
    // Store the return URL if available
    const returnUrl = router.query.returnUrl as string;
    const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
    const finalRedirectUrl = returnUrl || redirectAfterLogin || '/home';
    
    if (finalRedirectUrl) {
      localStorage.setItem('returnUrl', finalRedirectUrl);
    }
    
    window.location.href = '/api/auth/google/login';
  };

  if (loading) {
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

  return (
    <Box 
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <Paper 
        elevation={4} 
        sx={{ 
          width: '100%',
          maxWidth: '360px',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          mx: 2
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Welcome to सूत्रम्
        </Typography>
        
        <Box sx={{ 
          width: '100%', 
          mt: 4, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center' 
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: '28px',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}