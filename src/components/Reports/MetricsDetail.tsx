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

  // Format metric values for display
  const formatMetricValue = (metricName: string, value: number): string => {
    switch (metricName) {
      case 'totalPnL':
        return formatCurrency(value);
      case 'maxDrawdown':
        return formatPercentage(value);
      case 'winRate':
        return formatPercentage(value * 100);
      case 'profitFactor':
        return value.toFixed(2);
      case 'sharpeRatio':
        return value.toFixed(2);
      default:
        return value.toString();
    }
  };

  // Get color for metric category
  const getCategoryColor = (categoryName: string): string => {
    switch (categoryName) {
      case 'Return Metrics':
        return theme.palette.success.main;
      case 'Risk Metrics':
        return theme.palette.warning.main;
      case 'Risk-Adjusted Return':
        return theme.palette.info.main;
      case 'Trade Statistics':
        return theme.palette.primary.main;
      default:
        return 'default';
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
          name: 'Total Return',
          value: metrics.totalPnL,
          metricKey: 'totalPnL',
        }
      ]
    },
    {
      title: 'Risk Metrics',
      icon: <TrendingDown />,
      description: 'Measures the volatility and downside exposure of your strategy',
      metrics: [
        {
          name: 'Max Drawdown',
          value: metrics.maxDrawdown,
          metricKey: 'maxDrawdown',
        }
      ]
    },
    {
      title: 'Risk-Adjusted Return',
      icon: <Timeline />,
      description: 'Provides a view of performance considering both returns and risk',
      metrics: [
        {
          name: 'Sharpe Ratio',
          value: metrics.sharpeRatio,
          metricKey: 'sharpeRatio',
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
            lg={3} 
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
