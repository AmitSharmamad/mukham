import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, CircularProgress, Paper, Divider, Stack, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { LoginError } from '../../services/authService';
import Link from 'next/link';

export default function UserLoginPage() {
  const router = useRouter();
  const { loginWithUsernamePassword, isLoggedIn, checkUserAuth } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  // State to track client-side rendering
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted (client-side only)
  useEffect(() => {
    setMounted(true);
    setInitialLoading(false); // Don't show loading during SSR
  }, []);
  
  // Track if an auth check is in progress
  const [isAuthChecking, setIsAuthChecking] = useState(false);

  // Check if user is already logged in - only run on client side
  useEffect(() => {
    if (!mounted || isAuthChecking) return;
    
    const checkAuth = async () => {
      setIsAuthChecking(true);
      setInitialLoading(true);
      
      try {
        // Only check auth if we're not already logged in
        if (!isLoggedIn) {
          const isAuth = await checkUserAuth();
          
          if (isAuth) {
            // Redirect to home if user is already logged in
            const returnUrl = router.query.returnUrl as string || '/home';
            router.replace(returnUrl);
            return; // Exit early after redirect
          }
        } else if (isLoggedIn) {
          // If we're already logged in, redirect
          const returnUrl = router.query.returnUrl as string || '/home';
          router.replace(returnUrl);
          return; // Exit early after redirect
        }
      } finally {
        setInitialLoading(false);
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [router, checkUserAuth, mounted, isAuthChecking, isLoggedIn]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    let valid = true;
    const errors = {
      username: '',
      email: '',
      password: ''
    };
    
    // Either username or email is required, not both
    if (!formData.username.trim() && !formData.email.trim()) {
      errors.username = 'Either username or email is required';
      errors.email = 'Either username or email is required';
      valid = false;
    } else if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    setFormErrors(errors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginWithUsernamePassword(formData);
      
      if (result.success) {
        // If the API returned a redirect, follow it
        if (result.redirect) {
          router.replace(result.redirect);
          return;
        }
        
        // Otherwise use the default redirect path
        const returnUrl = router.query.returnUrl as string || '/home';
        router.replace(returnUrl);
      } else {
        // Handle field-specific errors
        if (result.error?.field) {
          setFormErrors(prev => ({
            ...prev,
            [result.error?.field as string]: result.error?.message
          }));
        } else {
          // Set general error message
          setError(result.error?.message || 'Login failed. Please check your credentials and try again.');
        }
      }
    } catch (error) {
      setError('An error occurred during login. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Google login
  const handleGoogleLogin = () => {
    // Store the return URL if available
    const returnUrl = router.query.returnUrl as string;
    if (returnUrl) {
      localStorage.setItem('returnUrl', returnUrl);
    }
    
    window.location.href = '/api/auth/google/login';
  };
  
  if (initialLoading) {
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
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            width: '100%',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <Box 
            sx={{ 
              mb: 2, 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center' 
            }}
          >
            <Box
              sx={{
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                p: 1.5,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LockOutlinedIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h5" component="h1" gutterBottom>
              Sign In
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack spacing={3}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                fullWidth
                error={!!formErrors.username}
                helperText={formErrors.username || "Enter either username or email"}
              />
              
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                fullWidth
                error={!!formErrors.email}
                helperText={formErrors.email || "Enter either username or email"}
              />
              
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                fullWidth
                required
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Stack>
          </form>
          
          <Box sx={{ mt: 3, width: '100%' }}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Button
              variant="outlined"
              size="large"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              fullWidth
              sx={{
                py: 1.5,
                textTransform: 'none'
              }}
            >
              Sign in with Google
            </Button>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link href="/signup" passHref>
                <Typography component="a" variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
