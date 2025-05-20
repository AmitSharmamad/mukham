import React from 'react';
import { Box, Grid, Typography, Chip, Paper, Divider, useTheme, alpha } from '@mui/material';
import { BacktestResult } from '../../types/strategy';
import { 
  TrendingUp, 
  TrendingDown, 
  ShowChart, 
  BarChart, 
  Timeline,
  Assessment,
  Info
} from '@mui/icons-material';
import TradeChart from './TradeChart';

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

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Assessment sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h6">Performance Metrics</Typography>
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <Info sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            Based on aggregated backtest data
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      {/* Trade Chart */}
      <TradeChart backtestResults={backtestResults} />
      
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} lg={3} key={category.title}>
            <Paper
              elevation={1}
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                {React.cloneElement(category.icon, { 
                  sx: { mr: 1, color: theme.palette.primary.main, fontSize: 22 } 
                })}
                <Typography variant="subtitle1" fontWeight={500}>
                  {category.title}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 2.5, flexGrow: 0, fontSize: '0.8rem' }}
              >
                {category.description}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1.5,
                flexGrow: 1,
                alignContent: 'flex-start'
              }}>
                {category.metrics.map((metric) => (
                  <Chip
                    key={metric.metricKey}
                    label={`${metric.name}: ${formatMetricValue(metric.metricKey, metric.value)}`}
                    color={getMetricColor(metric.metricKey, metric.value)}
                    size="small"
                    sx={{
                      fontWeight: 400,
                      borderRadius: '16px',
                      py: 1.5,
                      '& .MuiChip-label': {
                        px: 1.5
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