import React from 'react';
import { Box, Grid, Typography, Chip, Paper, Divider, useTheme } from '@mui/material';
import { BacktestResult } from '../../types/strategy';
import { 
  TrendingUp, 
  TrendingDown, 
  ShowChart, 
  BarChart, 
  Timeline,
  Assessment
} from '@mui/icons-material';

interface MetricsSectionProps {
  backtestResults: BacktestResult;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ backtestResults }) => {
  const theme = useTheme();
  const metrics = backtestResults.aggregatedMetrics;
  
  // Helper function to determine chip color based on metric value
  const getMetricColor = (metricName: string, value: number): 'success' | 'error' | 'warning' | 'default' | 'primary' | 'secondary' | 'info' => {
    switch (metricName) {
      case 'totalPnL':
        return value >= 0 ? 'success' : 'error';
      case 'maxDrawdown':
        if (value <= 10) return 'success';
        if (value <= 20) return 'warning';
        return 'error';
      case 'winRate':
        if (value >= 0.6) return 'success';
        if (value >= 0.45) return 'warning';
        return 'error';
      case 'profitFactor':
        if (value >= 2) return 'success';
        if (value >= 1) return 'warning';
        return 'error';
      case 'sharpeRatio':
        if (value >= 2) return 'success';
        if (value >= 1) return 'warning';
        return 'error';
      default:
        return 'default';
    }
  };

  // Format metric values for display
  const formatMetricValue = (metricName: string, value: number): string => {
    switch (metricName) {
      case 'totalPnL':
        return `${value.toFixed(2)}%`;
      case 'maxDrawdown':
        return `${value.toFixed(2)}%`;
      case 'winRate':
        return `${(value * 100).toFixed(2)}%`;
      case 'profitFactor':
        return value.toFixed(2);
      case 'sharpeRatio':
        return value.toFixed(2);
      default:
        return value.toString();
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
      title: 'Risk-Adjusted Return Metrics',
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

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Assessment sx={{ mr: 1 }} />
        <Typography variant="h6">Performance Metrics</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} md={6} lg={3} key={category.title}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {React.cloneElement(category.icon, { 
                  sx: { mr: 1, color: theme.palette.primary.main } 
                })}
                <Typography variant="subtitle1" fontWeight="medium">
                  {category.title}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 2, flexGrow: 0 }}
              >
                {category.description}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                flexGrow: 1,
                alignContent: 'flex-start'
              }}>
                {category.metrics.map((metric) => (
                  <Chip
                    key={metric.metricKey}
                    label={`${metric.name}: ${formatMetricValue(metric.metricKey, metric.value)}`}
                    color={getMetricColor(metric.metricKey, metric.value)}
                    variant="outlined"
                    size="medium"
                    sx={{
                      fontWeight: 400,
                      borderRadius: '16px',
                      '& .MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricsSection;