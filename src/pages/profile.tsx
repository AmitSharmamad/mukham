import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { TextField, Button, Paper } from '../components';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render content on client-side to ensure we have user data
  if (!mounted) return null;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          maxWidth: 600,
          mx: 'auto',
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {user ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={user.name || 'Not provided'}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={user.email || 'Not provided'}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined">Change Password</Button>
                <Button variant="contained">Edit Profile</Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" align="center">
            Please login to view your profile
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
