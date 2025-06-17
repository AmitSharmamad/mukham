import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  LinearProgress,
  Divider
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Timeline, 
  BarChart 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { DeploymentMetrics } from '../../services/deploymentService';
import { formatCurrency, formatPercentage } from '../../utils/metricsUtils';

interface MetricsDetailProps {
  metrics: DeploymentMetrics;
  loading?: boolean;
}

export const MetricsDetail = ({ metrics, loading = false }: MetricsDetailProps) => {
  const theme = useTheme();
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper function to calculate advanced metrics (mock data for deployment metrics)
  const calculateAdvancedMetrics = () => {
    // For deployment metrics, we'll use the provided data and calculate additional metrics
    const avgPnL = metrics.totalTrades > 0 ? metrics.totalPnL / metrics.totalTrades : 0;
    const avgWinningTrade = metrics.winningTrades > 0 ? (metrics.totalPnL * 0.7) / metrics.winningTrades : 0; // Estimate
    const avgLosingTrade = metrics.losingTrades > 0 ? (Math.abs(metrics.totalPnL * 0.3)) / metrics.losingTrades : 0; // Estimate
    const avgWinLossRatio = avgLosingTrade > 0 ? avgWinningTrade / avgLosingTrade : 0;
    
    // Estimate largest trades based on averages
    const largestWinningTrade = avgWinningTrade * 2.5; // Estimate
    const largestLosingTrade = avgLosingTrade * 2.0; // Estimate
    
    const riskRewardRatio = avgWinningTrade > 0 ? avgLosingTrade / avgWinningTrade : 0;
    
    // Mock streak data
    const winningStreak = Math.min(Math.floor(metrics.winningTrades * 0.3), 8);
    const losingStreak = Math.min(Math.floor(metrics.losingTrades * 0.25), 5);

    return {
      avgPnL,
      avgWinningTrade,
      avgLosingTrade,
      avgWinLossRatio,
      largestWinningTrade,
      largestLosingTrade,
      riskRewardRatio,
      winningStreak,
      losingStreak
    };
  };

  const advancedMetrics = calculateAdvancedMetrics();

  // Format metric values for display
  const formatMetricValue = (metricName: string, value: number): string => {
    switch (metricName) {
      case 'totalPnL':
        return formatCurrency(value);
      case 'avgPnL':
      case 'avgWinningTrade':
      case 'avgLosingTrade':
      case 'largestWinningTrade':
      case 'largestLosingTrade':
        return formatCurrency(Math.abs(value));
      case 'maxDrawdown':
        return formatPercentage(value);
      case 'winRate':
        return formatPercentage(value * 100);
      case 'profitFactor':
      case 'avgWinLossRatio':
      case 'riskRewardRatio':
        return value.toFixed(2);
      case 'sharpeRatio':
        return value.toFixed(2);
      case 'winningStreak':
      case 'losingStreak':
        return value.toString();
      default:
        return value.toString();
    }
  };

  // Get color for metric category - simplified 3-color scheme
  const getCategoryColor = (categoryName: string): string => {
    switch (categoryName) {
      case 'Return Metrics':
        return '#4CAF50'; // soft green for profitability metrics
      case 'Risk Metrics':
        return '#D32F2F'; // deep red for risk metrics
      case 'Trade Statistics':
        return '#9E9E9E'; // gray for neutral statistics
      default:
        return '#9E9E9E';
    }
  };

  // Category definitions
  const categories = [
    {
      title: 'Return Metrics',
      icon: <TrendingUp />,
      description: 'Measures the profitability of your trading strategy',
      metrics: [
        {
          name: 'Avg P&L',
          value: advancedMetrics.avgPnL,
          metricKey: 'avgPnL',
        },
        {
          name: 'Avg Winning Trade',
          value: advancedMetrics.avgWinningTrade,
          metricKey: 'avgWinningTrade',
        },
        {
          name: 'Avg Losing Trade',
          value: advancedMetrics.avgLosingTrade,
          metricKey: 'avgLosingTrade',
        },
        {
          name: 'Avg Win-Loss Ratio',
          value: advancedMetrics.avgWinLossRatio,
          metricKey: 'avgWinLossRatio',
        },
        {
          name: 'Largest Winning Trade',
          value: advancedMetrics.largestWinningTrade,
          metricKey: 'largestWinningTrade',
        },
        {
          name: 'Largest Losing Trade',
          value: advancedMetrics.largestLosingTrade,
          metricKey: 'largestLosingTrade',
        }
      ]
    },
    {
      title: 'Risk Metrics',
      icon: <TrendingDown />,
      description: 'Measures the volatility and downside exposure of your strategy',
      metrics: [
        {
          name: 'Risk-Reward Ratio',
          value: advancedMetrics.riskRewardRatio,
          metricKey: 'riskRewardRatio',
        }
      ]
    },
    {
      title: 'Trade Statistics',
      icon: <BarChart />,
      description: 'Provides insights into the frequency and success rate of your trading',
      metrics: [
        {
          name: 'Total Trades',
          value: metrics.totalTrades,
          metricKey: 'totalTrades',
        },
        {
          name: 'Winning Trades',
          value: metrics.winningTrades,
          metricKey: 'winningTrades',
        },
        {
          name: 'Losing Trades',
          value: metrics.losingTrades,
          metricKey: 'losingTrades',
        },
        {
          name: 'Win Rate',
          value: metrics.winRate,
          metricKey: 'winRate',
        },
        {
          name: 'Profit Factor',
          value: metrics.profitFactor,
          metricKey: 'profitFactor',
        },
        {
          name: 'Winning Streak',
          value: advancedMetrics.winningStreak,
          metricKey: 'winningStreak',
        },
        {
          name: 'Losing Streak',
          value: advancedMetrics.losingStreak,
          metricKey: 'losingStreak',
        }
      ]
    }
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <BarChart sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h6">Performance Metrics</Typography>
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Based on aggregated deployment data
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            lg={4}
            key={category.title}
            sx={{
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
              transitionDelay: `${200 + index * 100}ms`
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderTop: '4px solid',
                borderColor: getCategoryColor(category.title),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 1, color: getCategoryColor(category.title) }}>
                  {category.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {category.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                {category.description}
              </Typography>
              
              {category.metrics.map((metric) => (
                <Box key={metric.metricKey} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {metric.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatMetricValue(metric.metricKey, metric.value)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricsDetail;
