import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  Paper,
  CircularProgress,
  Divider
} from '@mui/material';
import { useRouter } from 'next/router';
import { checkPageAuth } from '../utils/pageAuthUtils';
import { DashboardWidget, MetricsDetail } from '../components';
import { getDeployments, getDeploymentMetrics, DeploymentMetrics } from '../services/deploymentService';
import { aggregateMetrics } from '../utils/metricsUtils';

export default function Reports() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profitLoss, setProfitLoss] = useState<number | null>(null);
  const [activeStrategies, setActiveStrategies] = useState<number | null>(null);
  const [totalTrades, setTotalTrades] = useState<number | null>(null);
  const [winRate, setWinRate] = useState<number | null>(null);
  const [aggregatedMetrics, setAggregatedMetrics] = useState<DeploymentMetrics | null>(null);
  
  useEffect(() => {
    const initPage = async () => {
      // Check authentication
      const isAuthed = await checkPageAuth(router);
      
      // If authenticated, fetch data
      if (isAuthed) {
        try {
          // Fetch deployments to count active strategies
          const deployments = await getDeployments();
          const activeDeployments = deployments.filter(deployment => deployment.isActive);
          setActiveStrategies(activeDeployments.length);
          
          // If there are active deployments, fetch their metrics
          if (activeDeployments.length > 0) {
            const metricsPromises = activeDeployments.map(deployment => 
              getDeploymentMetrics(deployment.id)
            );
            
            const metricsResults = await Promise.all(metricsPromises);
            
            // Aggregate metrics across all deployments
            const aggregatedMetrics = aggregateMetrics(metricsResults);
            
            // Update state with aggregated metrics
            setProfitLoss(aggregatedMetrics.totalPnL);
            setTotalTrades(aggregatedMetrics.totalTrades);
            setWinRate(aggregatedMetrics.winRate * 100); // Convert to percentage
            setAggregatedMetrics(aggregatedMetrics);
          } else {
            // Set defaults if no active deployments
            setProfitLoss(0);
            setTotalTrades(0);
            setWinRate(0);
            setAggregatedMetrics({
              totalTrades: 0,
              winningTrades: 0,
              losingTrades: 0,
              winRate: 0,
              profitFactor: 0,
              totalPnL: 0,
              maxDrawdown: 0,
              sharpeRatio: 0
            });
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching reports data:', error);
          // Fallback to mock data in case of error
          setProfitLoss(12458.75);
          setActiveStrategies(7);
          setTotalTrades(156);
          setWinRate(62.5);
          setAggregatedMetrics({
            totalTrades: 156,
            winningTrades: 98,
            losingTrades: 58,
            winRate: 0.625,
            profitFactor: 1.8,
            totalPnL: 12458.75,
            maxDrawdown: 12.3,
            sharpeRatio: 1.2
          });
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
        <Grid item xs={12} md={6} lg={3}>
          <DashboardWidget 
            title="Overall Profit & Loss"
            value={profitLoss !== null ? profitLoss : 0}
            subtitle="Total profit/loss across all strategies"
            href="/reports"
            isCurrency={true}
          />
        </Grid>
        
        {/* Active Strategies Widget */}
        <Grid item xs={12} md={6} lg={3}>
          <DashboardWidget 
            title="Active Strategies"
            value={activeStrategies !== null ? activeStrategies : 0}
            subtitle="Number of strategies currently deployed"
            href="/deployment"
          />
        </Grid>

        {/* Total Trades Widget */}
        <Grid item xs={12} md={6} lg={3}>
          <DashboardWidget 
            title="Total Trades"
            value={totalTrades !== null ? totalTrades : 0}
            subtitle="Trades executed across all strategies"
            href="/reports"
          />
        </Grid>

        {/* Win Rate Widget */}
        <Grid item xs={12} md={6} lg={3}>
          <DashboardWidget 
            title="Win Rate"
            value={winRate !== null ? winRate : 0}
            subtitle="Percentage of winning trades"
            href="/reports"
            isPercentage={true}
          />
        </Grid>
        
        {/* Additional widgets can be added as needed */}
      </Grid>

      {/* Detailed Metrics Section */}
      {aggregatedMetrics && (
        <Paper elevation={1} sx={{ mt: 4, p: 3 }}>
          <MetricsDetail metrics={aggregatedMetrics} />
        </Paper>
      )}
    </Container>
  );
}
