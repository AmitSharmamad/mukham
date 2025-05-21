import { Box, Container, Typography, Grid, Button, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Home = () => {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 8
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          Algo Trading Platform
        </Typography>
        
        <Typography 
          variant="h5" 
          component="p" 
          gutterBottom 
          sx={{ mb: 6, maxWidth: 'md', mx: 'auto' }}
        >
          A robust platform for full-fledged professional traders
        </Typography>
        
        <Grid container spacing={4} justifyContent="center" maxWidth="md">
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Strategies
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Create and manage your trading strategies
              </Typography>
              <Button
                component={Link}
                href="/strategy"
                variant="contained"
                color="primary"
                sx={{ mt: 'auto' }}
              >
                Go to Strategies
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Reports
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                View detailed analytics of your trading performance
              </Typography>
              <Button
                component={Link}
                href="/reports"
                variant="contained"
                color="primary"
                sx={{ mt: 'auto' }}
              >
                View Reports
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Documentation
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Learn how to use all features of the platform
              </Typography>
              <Button
                component={Link}
                href="/docs"
                variant="contained"
                color="primary"
                sx={{ mt: 'auto' }}
              >
                View Docs
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
