import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Alert,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { 
  AccountBalance, 
  TrendingUp, 
  TrendingDown,
  Assessment
} from '@mui/icons-material';
import { usePortfolioWebSocket } from '../hooks/usePortfolioWebSocket';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const Portfolio: React.FC = () => {
  const { 
    balance, 
    positionsSummary, 
    lastUpdated,
    getTotalPnL,
    getMarginUtilization,
    connectionStatus, 
    isConnected 
  } = usePortfolioWebSocket();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const totalPnL = getTotalPnL();
  const marginUtilization = getMarginUtilization();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Portfolio
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={isConnected ? 'Connected' : 'Disconnected'} 
            color={isConnected ? 'success' : 'error'}
            size="small"
          />
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {formatTime(lastUpdated)}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Connection Status Alert */}
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Real-time updates are currently unavailable. Connection status: {connectionStatus}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Balance Information */}
        {balance && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalance color="primary" />
                    <Box>
                      <Typography variant="h6">
                        {formatCurrency(balance.total_balance)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Balance
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalance color="info" />
                    <Box>
                      <Typography variant="h6">
                        {formatCurrency(balance.available_balance)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available Balance
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment color="warning" />
                    <Box>
                      <Typography variant="h6">
                        {formatCurrency(balance.used_margin)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Used Margin
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={marginUtilization} 
                          color={marginUtilization > 80 ? 'error' : marginUtilization > 60 ? 'warning' : 'primary'}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatPercentage(marginUtilization / 100)} utilized
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {totalPnL >= 0 ? (
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                    <Box>
                      <Typography 
                        variant="h6" 
                        color={totalPnL >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(totalPnL)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total P&L
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Positions Summary */}
        {positionsSummary && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Positions Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {positionsSummary.total_positions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {positionsSummary.long_positions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Long
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="error.main">
                          {positionsSummary.short_positions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Short
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    P&L Breakdown
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Realized P&L</Typography>
                      <Typography 
                        variant="body2" 
                        color={balance?.realized_pnl && balance.realized_pnl >= 0 ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 500 }}
                      >
                        {balance ? formatCurrency(balance.realized_pnl) : '-'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Unrealized P&L</Typography>
                      <Typography 
                        variant="body2" 
                        color={positionsSummary.total_unrealized_pnl >= 0 ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 500 }}
                      >
                        {formatCurrency(positionsSummary.total_unrealized_pnl)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>Total P&L</Typography>
                      <Typography 
                        variant="body1" 
                        color={totalPnL >= 0 ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 600 }}
                      >
                        {formatCurrency(totalPnL)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Loading State */}
        {(!balance || !positionsSummary) && isConnected && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading portfolio data...
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Portfolio;