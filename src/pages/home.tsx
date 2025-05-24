import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  CircularProgress, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  useTheme,
  Container,
  Button
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  ShowChart, 
  DonutSmall, 
  Timeline,
  MenuBook,
  Assessment,
  BarChart,
  Build
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DashboardWidget } from '../components/DashboardWidget';
import { checkPageAuth } from '../utils/pageAuthUtils';

// This would come from an API in a real application
const mockData = {
  totalPnl: '+₹25,430',
  pnlChange: '+2.8%',
  activeStrategies: 3,
  winRate: '68%',
  totalTrades: 124,
  profitFactor: 1.86,
  maxDrawdown: '14.2%',
  sharpeRatio: 1.32,
  recentTrades: [
    { id: 1, strategy: 'MACD Crossover', instrument: 'RELIANCE', entry: '2458.50', exit: '2487.25', pnl: '+₹2,875', date: '2025-05-19' },
    { id: 2, strategy: 'RSI Divergence', instrument: 'INFY', entry: '1845.00', exit: '1832.50', pnl: '-₹1,250', date: '2025-05-19' },
    { id: 3, strategy: 'Bollinger Breakout', instrument: 'HDFC', entry: '3240.75', exit: '3276.50', pnl: '+₹3,575', date: '2025-05-18' },
    { id: 4, strategy: 'Moving Average', instrument: 'TCS', entry: '4125.25', exit: '4158.75', pnl: '+₹3,350', date: '2025-05-18' },
    { id: 5, strategy: 'MACD Crossover', instrument: 'ITC', entry: '458.50', exit: '445.25', pnl: '-₹1,325', date: '2025-05-17' },
  ],
  strategiesPerformance: [
    { name: 'MACD Crossover', winRate: 72, pnl: '+₹15,430', trades: 48 },
    { name: 'RSI Divergence', winRate: 65, pnl: '+₹8,275', trades: 32 },
    { name: 'Bollinger Breakout', winRate: 58, pnl: '+₹4,825', trades: 24 },
    { name: 'Moving Average', winRate: 70, pnl: '-₹3,100', trades: 20 }
  ]
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const isAuthed = await checkPageAuth(router);
        // If checkPageAuth returns false, it will automatically redirect to login
        if (!isAuthed) return;
        setAuthChecked(true);
        
        // Simulate data loading only after auth check
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkAuth();
  }, [router]);
  
  if (!authChecked || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trading Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Track and analyze your trading performance across all strategies
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Overall P&L"
            value={mockData.totalPnl}
            subtitle={`Change: ${mockData.pnlChange}`}
            href="/home/pnl"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Active Strategies"
            value={mockData.activeStrategies}
            subtitle="Currently deployed"
            href="/strategy"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Win Rate"
            value={mockData.winRate}
            subtitle={`Total trades: ${mockData.totalTrades}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Profit Factor"
            value={mockData.profitFactor.toFixed(2)}
            subtitle={`Max drawdown: ${mockData.maxDrawdown}`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Trading Activity
              </Typography>
              <ShowChart color="primary" />
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Strategy</TableCell>
                    <TableCell>Instrument</TableCell>
                    <TableCell align="right">Entry Price</TableCell>
                    <TableCell align="right">Exit Price</TableCell>
                    <TableCell align="right">P&L</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockData.recentTrades.map((trade) => (
                    <TableRow key={trade.id} hover>
                      <TableCell>{trade.strategy}</TableCell>
                      <TableCell>{trade.instrument}</TableCell>
                      <TableCell align="right">{trade.entry}</TableCell>
                      <TableCell align="right">{trade.exit}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: trade.pnl.startsWith('+') ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {trade.pnl}
                      </TableCell>
                      <TableCell>{trade.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Strategy Performance
              </Typography>
              <Timeline color="primary" />
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Strategy</TableCell>
                    <TableCell>Win Rate</TableCell>
                    <TableCell align="right">P&L</TableCell>
                    <TableCell align="right">Trades</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockData.strategiesPerformance.map((strat) => (
                    <TableRow key={strat.name} hover>
                      <TableCell>{strat.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={strat.winRate}
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                backgroundColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: strat.winRate > 65 ? 'success.main' : strat.winRate > 50 ? 'warning.main' : 'error.main',
                                  borderRadius: 3
                                }
                              }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">{`${strat.winRate}%`}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: strat.pnl.startsWith('+') ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {strat.pnl}
                      </TableCell>
                      <TableCell align="right">{strat.trades}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performance Metrics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DonutSmall sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">Win Rate</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">{mockData.winRate}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShowChart sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="body2">Total Trades</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">{mockData.totalTrades}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="body2">Profit Factor</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">{mockData.profitFactor.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDown sx={{ mr: 1, color: 'error.main' }} />
                  <Typography variant="body2">Max Drawdown</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">{mockData.maxDrawdown}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Timeline sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body2">Sharpe Ratio</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">{mockData.sharpeRatio.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly P&L Breakdown
            </Typography>
            {/* Placeholder for a chart - in a real app this would be a component rendering a chart */}
            <Box
              sx={{
                height: 220,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Monthly P&L Chart
              </Typography>
            </Box>
          </Paper>
          
          {/* Navigation Cards to link to other pages */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Navigation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => router.push('/strategy')}
                >
                  <Build 
                    sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} 
                  />
                  <Box>
                    <Typography variant="h6">Strategy</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Build and manage your trading strategies
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => router.push('/reports')}
                >
                  <Assessment 
                    sx={{ fontSize: 32, color: 'secondary.main', mr: 2 }} 
                  />
                  <Box>
                    <Typography variant="h6">Reports</Typography>
                    <Typography variant="body2" color="text.secondary">
                      View detailed performance analytics
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => router.push('/docs')}
                >
                  <MenuBook 
                    sx={{ fontSize: 32, color: 'info.main', mr: 2 }} 
                  />
                  <Box>
                    <Typography variant="h6">Documentation</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Learn how to use the platform effectively
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
