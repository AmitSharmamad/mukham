import { Box, Button, Container, Typography, CircularProgress, Paper, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

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
          const returnUrl = router.query.returnUrl as string || '/home';
          router.replace(returnUrl);
          return; // Exit early after redirect
        }
        
        // Otherwise verify with an auth check
        const isAuth = await checkUserAuth();
          
        if (isAuth) {
          // Redirect to home if user is already logged in
          const returnUrl = router.query.returnUrl as string || '/home';
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
    if (returnUrl) {
      localStorage.setItem('returnUrl', returnUrl);
    }
    
    window.location.href = '/api/auth/google/login';
  };

  // Redirect to username/password login
  const handleCredentialLogin = () => {
    const returnUrl = router.query.returnUrl as string;
    const redirectPath = returnUrl ? 
      `/user/login?returnUrl=${encodeURIComponent(returnUrl)}` : 
      '/user/login';
    router.push(redirectPath);
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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={4} 
          sx={{ 
            width: '100%',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to सूत्रम्
          </Typography>
          
          <Box sx={{ width: '100%', mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              fullWidth
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              Login with Google
            </Button>
            
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Button
              variant="outlined"
              size="large"
              onClick={handleCredentialLogin}
              fullWidth
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              Login with Username & Password
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}