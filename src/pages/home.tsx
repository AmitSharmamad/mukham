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
  Button,
  Alert
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
  Build,
  AccountBalance,
  PlayArrow,
  Psychology
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DashboardWidget } from '../components/DashboardWidget';
import { dashboardService } from '../services/dashboardService';
import { DashboardStatistics } from '../types/dashboard';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStatistics();
      if (response.success) {
        setDashboardData(response.data);
        setError(null);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Fetch dashboard data on component mount
    // AuthGuard handles authentication for this protected route
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ pt: 2 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchDashboardData}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography>No data available</Typography>
      </Box>
    );
  }

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Trading Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Track and analyze your trading performance across all strategies
      </Typography>

      {/* Main Widget Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardWidget
            title="Total P&L"
            value={formatCurrency(dashboardData.trading_performance.total_pnl)}
            subtitle={`Portfolio: ${formatCurrency(dashboardData.trading_performance.current_portfolio_value)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardWidget
            title="Total Trades"
            value={dashboardData.trading_performance.total_trades_executed.toString()}
            subtitle={`Win Rate: ${formatPercentage(dashboardData.trading_performance.overall_win_rate)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardWidget
            title="Win Rate"
            value={formatPercentage(dashboardData.trading_performance.overall_win_rate)}
            subtitle={`Max Drawdown: ${formatPercentage(dashboardData.trading_performance.max_drawdown)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardWidget
            title="Active Deployments"
            value={dashboardData.trading_performance.active_deployments_count.toString()}
            subtitle={`Today's P&L: ${formatCurrency(dashboardData.trading_performance.todays_pnl)}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <DashboardWidget
            title="Total Strategies"
            value={dashboardData.strategy_development.total_strategies_created.toString()}
            subtitle={`Backtests: ${dashboardData.strategy_development.backtests_completed}`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Recent Trading Activity */}
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
                    <TableCell>Instrument</TableCell>
                    <TableCell>Strategy</TableCell>
                    <TableCell align="right">P&L</TableCell>
                    <TableCell>Direction</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.live_trading_status.recent_trades.slice(0, 5).map((trade) => (
                    <TableRow key={trade.trade_id} hover>
                      <TableCell>{trade.instrument_name}</TableCell>
                      <TableCell>{trade.strategy_name}</TableCell>
                      <TableCell align="right">{formatCurrency(trade.pnl)}</TableCell>
                      <TableCell>
                        <Box sx={{ 
                          color: trade.direction === 'LONG' ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}>
                          {trade.direction}
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(trade.executed_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          {/* Current Positions */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Current Positions
              </Typography>
              <AccountBalance color="primary" />
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Strategy</TableCell>
                    <TableCell>Instrument</TableCell>
                    <TableCell align="right">P&L</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.live_trading_status.strategy_statuses.map((strategy) => (
                    <TableRow key={strategy.deployment_id} hover>
                      <TableCell>{strategy.strategy_name}</TableCell>
                      <TableCell>{strategy.instrument_name}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: strategy.current_pnl >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {formatCurrency(strategy.current_pnl)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          color: strategy.is_active ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}>
                          {strategy.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Performance Metrics */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performance Metrics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="body2">Total P&L</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(dashboardData.trading_performance.total_pnl)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDown sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">Today's P&L</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(dashboardData.trading_performance.todays_pnl)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShowChart sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">Active Positions</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {dashboardData.live_trading_status.active_positions}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Timeline sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="body2">Volatility</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {formatPercentage(dashboardData.quick_analytics.risk_metrics.volatility)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DonutSmall sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body2">Max Drawdown</Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium">
                  {formatPercentage(dashboardData.trading_performance.max_drawdown)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
