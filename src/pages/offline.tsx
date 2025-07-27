import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { CloudOff, Refresh } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Offline() {
  const theme = useTheme();
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Offline - Mukham</title>
      </Head>
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
        <Box 
          sx={{ 
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            p: 4,
            boxShadow: theme.shadows[4],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <CloudOff sx={{ fontSize: 80, color: theme.palette.error.main, mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom>
            You're Offline
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            It seems you're not connected to the internet. Please check your connection and try again.
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Refresh />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={handleGoHome}
            >
              Go to Home
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}