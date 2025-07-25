import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Divider,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import { 
  Deployment, 
  Position, 
  DeploymentMetrics, 
  getDeployment, 
  getDeploymentPositions, 
  getDeploymentMetrics,
  activateDeployment,
  deactivateDeployment,
  closePosition
} from '../../services/deploymentService';
import { useToastContext } from '../../context/ToastContext';
import { useDeploymentEvents } from '../../hooks/useDeploymentEvents';
import DeploymentPositions from '../../components/Deployment/DeploymentPositions';
import TradeChart from '../../components/Deployment/TradeChart';
import CandlestickChart from '../../components/Deployment/CandlestickChart';
import InstrumentCandlestickChart from '../../components/Deployment/InstrumentCandlestickChart';
import { formatDate, formatTimeOnly } from '../../utils/deploymentUtils';

const DeploymentDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const toast = useToastContext();
  
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [metrics, setMetrics] = useState<DeploymentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'activate' | 'pause' | null;
    title: string;
    message: string;
  }>({
    open: false,
    action: null,
    title: '',
    message: ''
  });

  // Use WebSocket events for real-time updates
  const { 
    connect, 
    disconnect, 
    connectionStatus, 
    getDeploymentMetrics: getRealtimeMetrics,
    getEventsByDeployment 
  } = useDeploymentEvents();

  // Fetch deployment data
  useEffect(() => {
    if (id) {
      fetchDeploymentData();
      // Connect to WebSocket for real-time updates
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [id, connect, disconnect]);

  const fetchDeploymentData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const deploymentData = await getDeployment(id as string);
      
      if (deploymentData) {
        setDeployment(deploymentData);
        await Promise.all([
          fetchPositions(id as string),
          fetchMetrics(id as string)
        ]);
      } else {
        setError('Deployment not found');
      }
    } catch (err: any) {
      console.error('Error fetching deployment details:', err);
      setError(err.response?.data?.message || 'Failed to load deployment details');
      toast.showError('Failed to load deployment details');
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async (deploymentId: string) => {
    setPositionsLoading(true);
    try {
      const positionsData = await getDeploymentPositions(deploymentId);
      setPositions(positionsData);
    } catch (err: any) {
      console.error('Error fetching positions:', err);
      toast.showError('Failed to load positions');
    } finally {
      setPositionsLoading(false);
    }
  };

  const fetchMetrics = async (deploymentId: string) => {
    setMetricsLoading(true);
    try {
      const metricsData = await getDeploymentMetrics(deploymentId);
      setMetrics(metricsData);
    } catch (err: any) {
      console.error('Error fetching metrics:', err);
      toast.showError('Failed to load metrics');
    } finally {
      setMetricsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!deployment) return;
    
    const action = deployment.isActive ? 'pause' : 'activate';
    const titles = {
      pause: 'Pause Deployment',
      activate: 'Activate Deployment'
    };
    
    const messages = {
      pause: `Are you sure you want to pause "${deployment.name}"? This will stop the strategy from taking new trades.`,
      activate: `Are you sure you want to activate "${deployment.name}"? This will allow the strategy to start taking trades.`
    };

    setConfirmDialog({
      open: true,
      action,
      title: titles[action],
      message: messages[action]
    });
  };

  const executeToggleAction = async () => {
    if (!deployment || !confirmDialog.action) return;
    
    setStatusUpdating(true);
    setConfirmDialog({ open: false, action: null, title: '', message: '' });
    
    try {
      if (confirmDialog.action === 'pause') {
        await deactivateDeployment(deployment.id);
        toast.showSuccess('Deployment paused successfully');
      } else {
        await activateDeployment(deployment.id);
        toast.showSuccess('Deployment activated successfully');
      }
      
      // Update the local state
      setDeployment({
        ...deployment,
        isActive: !deployment.isActive
      });
    } catch (err: any) {
      console.error('Error toggling deployment status:', err);
      toast.showError(err.response?.data?.message || `Failed to ${confirmDialog.action} deployment`);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRefresh = () => {
    fetchDeploymentData();
  };

  const handleClosePosition = async (position: Position) => {
    try {
      await closePosition(position.deployment_id, position.id);
      // Update the positions list by refetching all positions
      await fetchPositions(position.deployment_id);
      return Promise.resolve();
    } catch (error) {
      console.error('Error closing position:', error);
      toast.showError('Failed to close position');
      return Promise.reject(error);
    }
  };

  // Helper function to format metric values
  const formatMetricValue = (metricName: string, value: number): string => {
    switch (metricName) {
      case 'totalPnL':
        return `${value.toFixed(2)}%`;
      case 'maxDrawdown':
        return `${value.toFixed(2)}`;
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

  // Helper function to determine chip color based on metric value
  const getMetricColor = (metricName: string, value: number): 'success' | 'error' | 'warning' | 'default' => {
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

  if (loading) {
    return (
      <Box sx={{ pt: 2 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error || !deployment) {
    return (
      <Box sx={{ pt: 2 }}>
        <Box>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.back()}
            sx={{ mb: 2 }}
          >
            Back to Deployments
          </Button>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || 'Deployment not found'}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2 }}>
      {/* Header with back button and actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.back()}
        >
          Back to Deployments
        </Button>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color={deployment.isActive ? "error" : "success"}
            startIcon={deployment.isActive ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={handleToggleStatus}
            disabled={statusUpdating}
          >
            {statusUpdating 
              ? (deployment.isActive ? 'Pausing...' : 'Activating...') 
              : (deployment.isActive ? 'Pause Deployment' : 'Activate Deployment')}
          </Button>
        </Box>
      </Box>

      {/* Deployment Info Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" component="h1">
              {deployment.name}
            </Typography>
            {deployment.instrument_master?.symbol && (
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 500, mt: 0.5 }}>
                {deployment.instrument_master.symbol}
              </Typography>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              label={deployment.isActive ? 'Active' : 'Inactive'} 
              color={deployment.isActive ? 'success' : 'default'} 
              size="medium"
            />
            <Chip 
              label={connectionStatus === 'connected' ? 'Connected' : connectionStatus} 
              size="small" 
              color={connectionStatus === 'connected' ? 'success' : connectionStatus === 'error' ? 'error' : 'default'}
              sx={{ 
                animation: connectionStatus === 'connected' ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                  '100%': { opacity: 1 }
                }
              }}
            />
          </Box>
        </Box>
        
        {deployment.description && (
          <Typography variant="body1" color="text.secondary" paragraph>
            {deployment.description}
          </Typography>
        )}
        
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Typography variant="body2" color="text.secondary">
            <strong>Created:</strong> {formatDate(deployment.createdAt)}
          </Typography>
          {deployment.lastUpdatedAt && (
            <Typography variant="body2" color="text.secondary">
              <strong>Last Updated:</strong> {formatDate(deployment.lastUpdatedAt)}
            </Typography>
          )}
          {deployment.instrument_master && (
            <>
              <Typography variant="body2" color="text.secondary">
                <strong>Exchange:</strong> {deployment.instrument_master.exchange}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Segment:</strong> {deployment.instrument_master.segment}
              </Typography>
            </>
          )}
        </Box>
      </Paper>
      
      {/* Unified Positions & Metrics Dashboard */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Positions & Performance Dashboard
          <Chip 
            label={connectionStatus === 'connected' ? 'Connected' : connectionStatus} 
            size="small" 
            color={connectionStatus === 'connected' ? 'success' : 'default'}
            sx={{ ml: 2 }}
          />
        </Typography>
        <DeploymentPositions 
          positions={positions}
          loading={positionsLoading} 
          onClosePosition={handleClosePosition}
          deploymentId={deployment.id}
          metrics={metrics}
          onRefresh={handleRefresh}
          useNewDashboard={true}
        />
      </Paper>

      {/* Charts and Additional Information */}
      {metrics && (
        <>
          {(() => {
            // Get real-time metrics if available
            const realtimeMetrics = id ? getRealtimeMetrics(id as string) : null;
            
            return (
              <>
                {/* Metrics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Total P&L
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ 
                          color: realtimeMetrics 
                            ? (realtimeMetrics.pnl + realtimeMetrics.unrealizedPnl) >= 0 ? 'success.main' : 'error.main'
                            : metrics.totalPnL >= 0 ? 'success.main' : 'error.main' 
                        }}>
                          {realtimeMetrics 
                            ? `₹${(realtimeMetrics.pnl + realtimeMetrics.unrealizedPnl).toFixed(2)}`
                            : formatMetricValue('totalPnL', metrics.totalPnL)
                          }
                        </Typography>
                        {realtimeMetrics && (
                          <Typography variant="caption" color="text.secondary">
                            Realized: ₹{realtimeMetrics.pnl.toFixed(2)} | Unrealized: ₹{realtimeMetrics.unrealizedPnl.toFixed(2)}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Open Positions
                        </Typography>
                        <Typography variant="h4" component="div">
                          {realtimeMetrics ? realtimeMetrics.openPositions : positions.filter(p => p.status === 'OPEN').length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Total Trades
                        </Typography>
                        <Typography variant="h4" component="div">
                          {realtimeMetrics ? realtimeMetrics.totalTrades : metrics.totalTrades}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Win Rate
                        </Typography>
                        <Typography variant="h4" component="div" sx={{
                          color: getMetricColor('winRate', metrics.winRate) === 'success' 
                            ? 'success.main' 
                            : getMetricColor('winRate', metrics.winRate) === 'warning'
                              ? 'warning.main'
                              : 'error.main'
                        }}>
                          {formatMetricValue('winRate', metrics.winRate)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Max Drawdown
                        </Typography>
                        <Typography variant="h4" component="div" sx={{
                          color: getMetricColor('maxDrawdown', metrics.maxDrawdown) === 'success' 
                            ? 'success.main' 
                            : getMetricColor('maxDrawdown', metrics.maxDrawdown) === 'warning'
                              ? 'warning.main'
                              : 'error.main'
                        }}>
                          {formatMetricValue('maxDrawdown', metrics.maxDrawdown)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            );
          })()}

          {/* Performance Chart */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ height: 400, mt: 2 }}>
              <TradeChart trades={positions.map(p => ({
                entryTime: new Date(p.entry_time).getTime(),
                exitTime: p.exit_time ? new Date(p.exit_time).getTime() : null,
                entryPrice: p.entry_price,
                exitPrice: p.exit_price || null,
                quantity: p.quantity,
                type: 'LONG', // Simplified for demo
                pnl: p.pnl || 0
              }))} />
            </Box>
          </Paper>

          {/* Recent Events */}
          {(() => {
            const recentEvents = id ? getEventsByDeployment(id as string).slice(0, 10) : [];
            if (recentEvents.length > 0) {
              return (
                <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                    Recent Events
                    <Chip 
                      label={`${recentEvents.length} events`}
                      size="small" 
                      color="primary"
                      sx={{ ml: 2 }}
                    />
                  </Typography>
                  <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {recentEvents.map((event, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          p: 2, 
                          mb: 1, 
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.03)',
                          borderRadius: 1,
                          borderLeft: `4px solid ${
                            event.event_type === 'position_opened' ? theme.palette.success.main :
                            event.event_type === 'position_closed' ? theme.palette.info.main :
                            event.event_type === 'deployment_error' ? theme.palette.error.main :
                            event.event_type === 'stop_loss_triggered' ? theme.palette.warning.main :
                            event.event_type === 'target_profit_triggered' ? theme.palette.success.main :
                            theme.palette.grey[400]
                          }`
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {event.event_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Typography>
                            {event.metadata.instrument_symbol && (
                              <Typography variant="body2" color="text.secondary">
                                {event.metadata.instrument_symbol}
                                {event.metadata.market_price && ` at ₹${event.metadata.market_price}`}
                                {event.data.quantity && ` (${event.data.quantity} qty)`}
                              </Typography>
                            )}
                            {event.data.pnl && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: event.data.pnl >= 0 ? 'success.main' : 'error.main',
                                  fontWeight: 500 
                                }}
                              >
                                P&L: ₹{event.data.pnl.toFixed(2)}
                              </Typography>
                            )}
                            {event.data.message && event.event_type === 'deployment_error' && (
                              <Typography variant="body2" color="error.main">
                                {event.data.message}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeOnly(event.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              );
            }
            return null;
          })()}
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, title: '', message: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, action: null, title: '', message: '' })}
            disabled={statusUpdating}
          >
            Cancel
          </Button>
          <Button 
            onClick={executeToggleAction}
            color={confirmDialog.action === 'pause' ? 'error' : 'success'}
            variant="contained"
            disabled={statusUpdating}
          >
            {statusUpdating ? <CircularProgress size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeploymentDetail;
