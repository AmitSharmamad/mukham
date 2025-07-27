import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid,
  Chip,
  Paper,
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { TourButton } from '../components';

const TourDemo: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Tour Demo Page
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Experience the enhanced tour functionality with beautiful aesthetics
        </Typography>
        <TourButton 
          variant="fab" 
          tooltip="Start the guided tour"
          color="primary"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Dashboard Card */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={4}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                elevation: 8,
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DashboardIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Dashboard
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Monitor your trading performance and get real-time insights into your portfolio.
              </Typography>
              <Chip label="Real-time Data" color="primary" variant="outlined" />
            </CardContent>
          </Card>
        </Grid>

        {/* Trading Card */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={4}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                elevation: 8,
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Trading
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Execute trades, manage positions, and access advanced trading tools.
              </Typography>
              <Chip label="Live Trading" color="success" variant="outlined" />
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Card */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={4}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                elevation: 8,
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon color="info" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Analytics
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Deep dive into your trading patterns and performance metrics.
              </Typography>
              <Chip label="Advanced Analytics" color="info" variant="outlined" />
            </CardContent>
          </Card>
        </Grid>

        {/* Settings Card */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={4}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                elevation: 8,
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon color="secondary" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Settings
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Customize your experience and configure trading preferences.
              </Typography>
              <Chip label="Personalization" color="secondary" variant="outlined" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feature Highlights */}
      <Paper 
        elevation={2} 
        sx={{ 
          mt: 4, 
          p: 3, 
          background: (theme) => 
            `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
          Enhanced Tour Features
        </Typography>
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              Beautiful UI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Modern, aesthetic design that matches your app theme
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              Smooth Animations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Engaging transitions and highlight effects
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              Smart Positioning
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intelligent tooltip placement and target highlighting
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TourDemo;
