import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Chip, Paper, Divider, useTheme, alpha, Fade } from '@mui/material';
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
import TradesTable from './TradesTable';

interface Instrument {
  exchange_security_id: number;
  exchange: string;
  segment: string;
  symbol: string;
  instrument: string;
  instrument_id: number;
  start_date: string;
  expiry: string;
}

interface BacktestData {
  message: string;
  results: any[];
  strategy_id?: string;
}

interface MetricsSectionProps {
  backtestResults: BacktestResult;
  rawBacktestData?: BacktestData | null;
  instruments?: Instrument[];
  timeframe?: string;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ backtestResults, rawBacktestData, instruments = [], timeframe }) => {
  const theme = useTheme();
  const metrics = backtestResults.aggregatedMetrics;
  const [animate, setAnimate] = useState(false);
  
  // Debug logging
  console.log('MetricsSection Props:', { 
    backtestResults, 
    rawBacktestData,
    capitalProgression: rawBacktestData?.results?.[0]?.metrics?.capital_progression?.length,
    resultsLength: rawBacktestData?.results?.length
  });
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Helper function to calculate advanced metrics from raw data
  const calculateAdvancedMetrics = () => {
    if (!rawBacktestData?.results) {
      return {
        avgPnL: 0,
        avgWinningTrade: 0,
        avgLosingTrade: 0,
        avgWinLossRatio: 0,
        largestWinningTrade: 0,
        largestLosingTrade: 0,
        sharpeRatio: 0,
        riskRewardRatio: 0,
        totalOpenTrades: 0,
        winningStreak: 0,
        losingStreak: 0
      };
    }

    // Get all positions from all instruments
    const allPositions = rawBacktestData.results
      .filter(run => run.positions && run.positions.length > 0)
      .flatMap(run => run.positions!);

    if (allPositions.length === 0) {
      return {
        avgPnL: 0,
        avgWinningTrade: 0,
        avgLosingTrade: 0,
        avgWinLossRatio: 0,
        largestWinningTrade: 0,
        largestLosingTrade: 0,
        sharpeRatio: metrics.sharpeRatio || 0,
        riskRewardRatio: 0,
        totalOpenTrades: 0,
        winningStreak: 0,
        losingStreak: 0
      };
    }

    // Separate winning and losing trades
    const winningTrades = allPositions.filter(pos => pos.profit_loss_absolute > 0);
    const losingTrades = allPositions.filter(pos => pos.profit_loss_absolute < 0);

    // Calculate basic metrics
    const totalPnL = allPositions.reduce((sum, pos) => sum + pos.profit_loss_absolute, 0);
    const avgPnL = totalPnL / allPositions.length;

    const avgWinningTrade = winningTrades.length > 0 
      ? winningTrades.reduce((sum, pos) => sum + pos.profit_loss_absolute, 0) / winningTrades.length 
      : 0;

    const avgLosingTrade = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, pos) => sum + pos.profit_loss_absolute, 0) / losingTrades.length)
      : 0;

    const avgWinLossRatio = avgLosingTrade > 0 ? avgWinningTrade / avgLosingTrade : 0;

    // Find largest trades
    const largestWinningTrade = winningTrades.length > 0 
      ? Math.max(...winningTrades.map(pos => pos.profit_loss_absolute)) 
      : 0;

    const largestLosingTrade = losingTrades.length > 0 
      ? Math.abs(Math.min(...losingTrades.map(pos => pos.profit_loss_absolute)))
      : 0;

    // Calculate risk-reward ratio (inverse of win-loss ratio)
    const riskRewardRatio = avgWinningTrade > 0 ? avgLosingTrade / avgWinningTrade : 0;

    // Calculate Sharpe Ratio using proper formula
    // Sharpe Ratio = (Average Return - Risk-Free Rate) ÷ Standard Deviation of Returns
    let sharpeRatio = 0;
    if (allPositions.length >= 2) { // Need at least 2 data points for std deviation
      const returns = allPositions.map(pos => pos.profit_loss_absolute);
      const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
      const riskFreeRate = 5.5; // Assuming 0% for simplicity (should be actual T-bill rate)

      // Calculate standard deviation
      const squaredDeviations = returns.map(ret => Math.pow(ret - avgReturn, 2));
      const variance = squaredDeviations.reduce((sum, sq) => sum + sq, 0) / returns.length;
      const standardDeviation = Math.sqrt(variance);

      // Calculate Sharpe Ratio
      if (standardDeviation > 0) {
        sharpeRatio = (avgReturn - riskFreeRate) / standardDeviation;
      }
    }

    // Calculate consecutive wins/losses (streaks)
    const sortedPositions = [...allPositions].sort((a, b) => 
      new Date(a.exit_time_order || a.entry_time_order).getTime() - 
      new Date(b.exit_time_order || b.entry_time_order).getTime()
    );

    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;

    sortedPositions.forEach(pos => {
      if (pos.profit_loss_absolute > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      } else {
        currentLossStreak++;
        currentWinStreak = 0;
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      }
    });

    return {
      avgPnL,
      avgWinningTrade,
      avgLosingTrade,
      avgWinLossRatio,
      largestWinningTrade,
      largestLosingTrade,
      sharpeRatio,
      riskRewardRatio,
      totalOpenTrades: 0, // This would need live data
      winningStreak: maxWinStreak,
      losingStreak: maxLossStreak
    };
  };

  const advancedMetrics = calculateAdvancedMetrics();
  
  // Get custom colors for specific metrics using simplified 3-color scheme
  const getCustomMetricColor = (metricName: string, value?: number): string | null => {
    switch (metricName) {
      // Return Metrics
      case 'avgPnL': return '#4CAF50'; // soft green (positive)
      case 'avgWinningTrade': return '#4CAF50'; // soft green (positive)
      case 'avgLosingTrade': return '#D32F2F'; // deep red (negative)
      case 'avgWinLossRatio': return '#4CAF50'; // soft green (positive)
      case 'largestWinningTrade': return '#4CAF50'; // soft green (positive)
      case 'largestLosingTrade': return '#D32F2F'; // deep red (negative)
      
      // Risk Metrics
      case 'sharpeRatio': 
        // Dynamic color based on value: >= 1 is good (green), < 1 is bad (red)
        return value !== undefined && value >= 1 ? '#4CAF50' : '#D32F2F';
      case 'riskRewardRatio': 
        // Dynamic color based on value: >= 1 is good (green), < 1 is bad (red)
        return value !== undefined && value >= 1 ? '#4CAF50' : '#D32F2F';
      
      // Trade Statistics
      case 'totalTrades': return '#9E9E9E'; // gray (neutral)
      case 'winningTrades': return '#4CAF50'; // soft green (positive)
      case 'losingTrades': return '#D32F2F'; // deep red (negative)
      case 'winningStreak': return '#4CAF50'; // soft green (positive)
      case 'losingStreak': return '#D32F2F'; // deep red (negative)
      
      default: return null; // Use theme colors
    }
  };
  
  const getMetricColor = (metricName: string, value: number): 'success' | 'error' | 'warning' | 'default' | 'primary' | 'secondary' | 'info' => {
    // Use fixed colors for specific metrics regardless of value
    switch (metricName) {
      case 'avgPnL':
        return 'success'; // #4CAF50 (soft green)
      case 'avgWinningTrade':
        return 'success'; // #8BC34A (light green) - will need custom styling
      case 'avgLosingTrade':
        return 'warning'; // #FF9800 (warm orange)
      case 'avgWinLossRatio':
        return 'warning'; // #FF5722 (vibrant orange) - will need custom styling
      case 'largestWinningTrade':
        return 'success'; // #388E3C (deep green) - will need custom styling
      case 'largestLosingTrade':
        return 'error'; // #D32F2F (deep red)
      case 'sharpeRatio':
        return 'info'; // #2196F3 (bright blue)
      case 'riskRewardRatio':
        return 'warning'; // #FFCA28 (soft yellow) - will need custom styling
      case 'totalTrades':
        return 'default'; // #9E9E9E (gray)
      case 'winningTrades':
        return 'success'; // #4CAF50 (soft green)
      case 'losingTrades':
        return 'error'; // #F44336 (bright red)
      case 'winningStreak':
        return 'success'; // #8BC34A (light green) - will need custom styling
      case 'losingStreak':
        return 'error'; // #D32F2F (deep red)
      
      // Fallback for other metrics with dynamic logic
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
      default:
        return 'default';
    }
  };

  // Format metric values for display
  const formatMetricValue = (metricName: string, value: number): string => {
    switch (metricName) {
      case 'totalPnL':
        return `${value.toFixed(2)}%`;
      case 'avgPnL':
      case 'avgWinningTrade':
      case 'avgLosingTrade':
      case 'largestWinningTrade':
      case 'largestLosingTrade':
        return `₹${Math.abs(value).toFixed(2)}`;
      case 'maxDrawdown':
        return `${value.toFixed(2)}`;
      case 'winRate':
        return `${(value * 100).toFixed(2)}%`;
      case 'profitFactor':
      case 'avgWinLossRatio':
      case 'riskRewardRatio':
      case 'sharpeRatio':
        return value.toFixed(2);
      case 'winningStreak':
      case 'losingStreak':
      case 'totalOpenTrades':
        return value.toString();
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
          name: 'Sharpe Ratio',
          value: advancedMetrics.sharpeRatio,
          metricKey: 'sharpeRatio',
        },
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
          name: 'Winning Streak',
          value: advancedMetrics.winningStreak,
          metricKey: 'winningStreak',
        },
        {
          name: 'Losing Trades',
          value: metrics.losingTrades,
          metricKey: 'losingTrades',
        },
        {
          name: 'Losing Streak',
          value: advancedMetrics.losingStreak,
          metricKey: 'losingStreak',
        }
      ]
    }
  ];

  return (
    <Fade in={animate} timeout={800}>
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
        <Box sx={{ 
          opacity: animate ? 1 : 0, 
          transition: 'opacity 0.8s ease-in', 
          transitionDelay: '200ms' 
        }}>
          <TradeChart 
            backtestResults={backtestResults} 
            rawBacktestData={rawBacktestData}
            instruments={instruments}
          />
        </Box>
        
        {/* Trades Table */}
        {rawBacktestData && (
          <Box sx={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 0.8s ease-in',
            transitionDelay: '400ms'
          }}>
            <TradesTable
              backtestData={rawBacktestData}
              instruments={instruments}
              isVisible={true}
              timeframe={timeframe}
            />
          </Box>
        )}

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
                  flexDirection: 'column',
                  gap: 1.5,
                  flexGrow: 1
                }}>
                  {category.metrics.map((metric) => {
                    const customColor = getCustomMetricColor(metric.metricKey, metric.value);
                    return (
                      <Box
                        key={metric.metricKey}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: customColor ? alpha(customColor, 0.1) : alpha(theme.palette.grey[500], 0.05),
                          border: `1px solid ${customColor ? alpha(customColor, 0.2) : alpha(theme.palette.grey[500], 0.1)}`,
                          '&:hover': {
                            backgroundColor: customColor ? alpha(customColor, 0.15) : alpha(theme.palette.grey[500], 0.08),
                          }
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
                          {metric.name}
                        </Typography>
                        <Chip
                          label={formatMetricValue(metric.metricKey, metric.value)}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            minWidth: 'auto',
                            '& .MuiChip-label': {
                              px: 1
                            },
                            ...(customColor && {
                              backgroundColor: alpha(customColor, 0.2),
                              color: customColor,
                              border: `1px solid ${alpha(customColor, 0.3)}`,
                              '&:hover': {
                                backgroundColor: alpha(customColor, 0.3),
                                borderColor: alpha(customColor, 0.5)
                              }
                            })
                          }}
                          color={customColor ? 'default' : getMetricColor(metric.metricKey, metric.value)}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );
};

export default MetricsSection;