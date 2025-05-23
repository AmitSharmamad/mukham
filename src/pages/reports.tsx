import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import { useRouter } from 'next/router';
import { checkPageAuth } from '../utils/pageAuthUtils';
import { DashboardWidget } from '../components';

export default function Reports() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profitLoss, setProfitLoss] = useState<number | null>(null);
  const [activeStrategies, setActiveStrategies] = useState<number | null>(null);
  
  useEffect(() => {
    const initPage = async () => {
      // Check authentication
      const isAuthed = await checkPageAuth(router);
      
      // If authenticated, fetch data
      if (isAuthed) {
        try {
          // In a real application, we would fetch data from API
          // For demo purposes, using mock data
          setTimeout(() => {
            setProfitLoss(12458.75);
            setActiveStrategies(7);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching reports data:', error);
          setLoading(false);
        }
      }
    };
    
    initPage();
  }, [router]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports
      </Typography>
      
      <Grid container spacing={3}>
        {/* Overall Profit & Loss Widget */}
        <Grid item xs={12} md={6}>
          <DashboardWidget 
            title="Overall Profit & Loss"
            value={profitLoss !== null ? `$${profitLoss.toLocaleString()}` : 'N/A'}
            subtitle="Total profit/loss across all strategies"
            href="/reports"
          />
        </Grid>
        
        {/* Active Strategies Widget */}
        <Grid item xs={12} md={6}>
          <DashboardWidget 
            title="Active Strategies"
            value={activeStrategies !== null ? activeStrategies.toString() : 'N/A'}
            subtitle="Number of strategies currently deployed"
            href="/deployment"
          />
        </Grid>
        
        {/* Additional widgets can be added as needed */}
      </Grid>
    </Container>
  );
}
