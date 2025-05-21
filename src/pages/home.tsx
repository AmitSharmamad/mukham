import { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Box,
  Button,
  Card as MuiCard,
  CardContent,
  CircularProgress,
  useTheme,
  Paper
} from '@mui/material';
import { AddCircle, TrendingUp, MenuBook, BarChart, Assessment } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Card } from '../components/Card';
import { DashboardWidget } from '../components/DashboardWidget';

// Navigation card data with icons
const navigationCards = [
  {
    title: 'Strategy',
    description: 'Create and manage your trading strategies',
    path: '/strategy',
    icon: TrendingUp
  },
  {
    title: 'Reports',
    description: 'View your trading performance and analytics',
    path: '/reports',
    icon: Assessment
  },
  {
    title: 'Documentation',
    description: 'Learn how to use the platform effectively',
    path: '/docs',
    icon: MenuBook
  },
];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to AlgoTrader
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Build, test, and deploy algorithmic trading strategies with ease
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6} lg={3}>
          <DashboardWidget
            title="Strategies"
            value="5"
            subtitle="Active trading strategies"
            href="/strategy"
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <DashboardWidget
            title="P&L"
            value="+₹12,450"
            subtitle="Overall profit/loss"
            href="/reports"
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <DashboardWidget
            title="Win Rate"
            value="68%"
            subtitle="Average win rate"
            href="/reports"
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <DashboardWidget
            title="Active Deployments"
            value="3"
            subtitle="Currently running strategies"
            href="/reports"
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={4} sx={{ mt: 6 }}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Quick Navigation
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Access key features of the platform
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <MuiCard 
            sx={{
              height: 220,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[10],
                cursor: 'pointer'
              },
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`
            }}
            onClick={() => router.push('/strategy/new')}
          >
            <AddCircle sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create Strategy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build a new trading strategy from scratch
              </Typography>
            </CardContent>
          </MuiCard>
        </Grid>
        
        {navigationCards.map((card) => (
          <Grid item xs={12} md={6} lg={3} key={card.path}>
            <MuiCard 
              sx={{
                height: 220,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[10],
                  cursor: 'pointer'
                },
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
              }}
              onClick={() => router.push(card.path)}
            >
              {card.icon && <card.icon sx={{ fontSize: 60, color: theme.palette.info.main, mb: 2 }} />}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </MuiCard>
          </Grid>
        ))}
      </Grid>
      
      <Paper sx={{ mt: 6, p: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.7)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Ready to create your first strategy?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start by building a trading strategy based on technical indicators and market conditions
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => router.push('/strategy/new')}
              startIcon={<AddCircle />}
            >
              Create Strategy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
