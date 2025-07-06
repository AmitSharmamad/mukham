import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Container,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { useRouter } from 'next/router';
import { joinWaitlist } from '../services/waitlistService';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await joinWaitlist(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            ✅ Successfully Registered!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Thank you for joining our waitlist. We'll notify you when we're ready to launch!
          </Typography>
          <Button variant="contained" onClick={handleGoBack} size="large">
            Go Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Join Our Waitlist
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
            Be the first to know when we launch! Enter your email below and we'll notify you.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
                disabled={loading}
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Joining...
                </>
              ) : (
                'Join Waitlist'
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleGoBack}
              disabled={loading}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
