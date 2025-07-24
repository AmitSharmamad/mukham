import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useTheme } from '@mui/material/styles';
import { Deployment, getDeployments, getDeploymentsSearch, activateDeployment, deactivateDeployment, stopAllDeployments, startAllDeployments, getDeploymentPositions, getDeploymentMetrics as getDeploymentMetricsAPI, closePosition, exitDeployment, Position, DeploymentMetrics } from '../services/deploymentService';
import { useToastContext } from '../context/ToastContext';
import { PositionsMetricsDashboard } from '../components/Deployment';
import { useDeploymentContext } from '../context/DeploymentContext';

interface ConfirmDialogState {
  open: boolean;
  type: 'start_all' | 'stop_all' | 'exit_all' | null;
  title: string;
  message: string;
}

interface PositionsDialogState {
  open: boolean;
  deployment: Deployment | null;
  positions: Position[];
  metrics: DeploymentMetrics | null;
  loading: boolean;
}

const DeploymentPage = () => {
  const theme = useTheme();
  const toast = useToastContext();
  
  // Use centralized WebSocket connection for real-time updates
  const { 
    connect, 
    disconnect, 
    connectionStatus, 
    deploymentMetrics,
    hasRecentActivity,
    hasRecentErrors
  } = useDeploymentContext();
  
  // State management
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string>('');
  
  // Apply real-time updates to deployments - use data from WebSocket events
  const updatedDeployments = useMemo(() => {
    return deployments.map(deployment => {
      const realtimeMetrics = deploymentMetrics[deployment.id];
      if (realtimeMetrics) {
        // Create updated deployment with real-time data from events
        return {
          ...deployment,
          metrics: deployment.metrics ? {
            ...deployment.metrics,
            total_pnl: realtimeMetrics.pnl + realtimeMetrics.unrealizedPnl,
            total_trades: realtimeMetrics.totalTrades,
            win_trades: realtimeMetrics.winTrades,
            loss_trades: realtimeMetrics.lossTrades,
            updated_at: realtimeMetrics.lastUpdateTime,
          } : undefined,
          status: realtimeMetrics.openPositions > 0 ? 'entered' as const : 'waiting' as const,
          lastUpdatedAt: realtimeMetrics.lastUpdateTime
        };
      }
      return deployment;
    });
  }, [deployments, deploymentMetrics]);
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    type: null,
    title: '',
    message: ''
  });
  
  const [exitConfirmDialog, setExitConfirmDialog] = useState<{
    open: boolean;
    deployment: Deployment | null;
  }>({
    open: false,
    deployment: null
  });
  
  const [positionsDialog, setPositionsDialog] = useState<PositionsDialogState>({
    open: false,
    deployment: null,
    positions: [],
    metrics: null,
    loading: false
  });

  // Handle refreshing positions data
  const handleRefreshPositions = useCallback(async (showToast = false) => {
    if (!positionsDialog.deployment) return;
    
    try {
      const [positionsData, deploymentMetricsData] = await Promise.all([
        getDeploymentPositions(positionsDialog.deployment.id),
        getDeploymentMetricsAPI(positionsDialog.deployment.id)
      ]);

      setPositionsDialog(prev => ({
        ...prev,
        positions: positionsData,
        metrics: deploymentMetricsData
      }));
      
      if (showToast) {
        toast.showSuccess('Positions data refreshed');
      }
    } catch (error) {
      console.error('Error refreshing positions:', error);
      if (showToast) {
        toast.showError('Failed to refresh positions data');
      }
    }
  }, [positionsDialog.deployment, toast]);

  // Fetch deployments on mount and when filter changes
  useEffect(() => {
    fetchDeployments();
  }, [positionFilter]);

  // Periodic refresh for deployment list (every 5 minutes) to ensure data consistency
  useEffect(() => {
    if (connectionStatus === 'connected') {
      const interval = setInterval(() => {
        fetchDeployments();
      }, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [connectionStatus]);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      
      // Build filter object based on current filter values (only position filter now)
      const filters: { status?: 'waiting' | 'entered' } = {};
      
      // Set status filter if position filter is specified
      if (positionFilter !== 'all') {
        filters.status = positionFilter as 'waiting' | 'entered';
      }
      
      // Use search endpoint with only status filter (no is_active filter)
      const data = await getDeploymentsSearch(filters);
      
      setDeployments(data);
    } catch (err: any) {
      console.error('Error fetching deployments:', err);
      toast.showError('Failed to load deployments');
    } finally {
      setLoading(false);
    }
  };

  const handlePositionFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPositionFilter(event.target.value);
  };

  const handleToggleDeployment = async (deployment: Deployment) => {
    setActionLoading(`toggle_${deployment.id}`);
    try {
      if (deployment.isActive) {
        await deactivateDeployment(deployment.id);
        toast.showSuccess(`${deployment.name} paused successfully`);
      } else {
        await activateDeployment(deployment.id);
        toast.showSuccess(`${deployment.name} activated successfully`);
      }
      await fetchDeployments();
    } catch (err: any) {
      console.error('Error toggling deployment:', err);
      toast.showError(`Failed to ${deployment.isActive ? 'pause' : 'activate'} deployment`);
    } finally {
      setActionLoading('');
    }
  };

  const handleStopDeployment = async (deployment: Deployment) => {
    if (!deployment.isActive) {
      toast.showWarning('Deployment is already inactive');
      return;
    }

    setActionLoading(`stop_${deployment.id}`);
    try {
      await deactivateDeployment(deployment.id);
      toast.showSuccess(`${deployment.name} stopped successfully`);
      await fetchDeployments();
    } catch (err: any) {
      console.error('Error stopping deployment:', err);
      toast.showError(`Failed to stop deployment: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading('');
    }
  };

  const handleExitDeployment = async (deployment: Deployment) => {
    setExitConfirmDialog({
      open: true,
      deployment
    });
  };

  const confirmExitDeployment = async () => {
    if (!exitConfirmDialog.deployment) return;
    
    const deployment = exitConfirmDialog.deployment;
    setActionLoading(`exit_${deployment.id}`);
    setExitConfirmDialog({ open: false, deployment: null });
    
    try {
      const result = await exitDeployment(deployment.id);
      toast.showSuccess(result.message || `${deployment.name} exited successfully`);
      await fetchDeployments();
    } catch (err: any) {
      console.error('Error exiting deployment:', err);
      toast.showError(`Failed to exit deployment: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading('');
    }
  };

  const handleViewPositions = async (deployment: Deployment) => {
    setPositionsDialog({
      open: true,
      deployment,
      positions: [],
      metrics: null,
      loading: true
    });

    try {
      // Fetch positions and metrics for the deployment
      const [positionsData, deploymentMetricsData] = await Promise.all([
        getDeploymentPositions(deployment.id),
        getDeploymentMetricsAPI(deployment.id)
      ]);

      setPositionsDialog(prev => ({
        ...prev,
        positions: positionsData,
        metrics: deploymentMetricsData,
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast.showError('Failed to load positions data');
      setPositionsDialog(prev => ({
        ...prev,
        loading: false
      }));
    }
  };

  const handleClosePositionsDialog = () => {
    setPositionsDialog({
      open: false,
      deployment: null,
      positions: [],
      metrics: null,
      loading: false
    });
  };

  const handleClosePosition = async (position: Position) => {
    try {
      await closePosition(position.deployment_id, position.id);
      toast.showSuccess(`Position ${position.id} closed successfully`);
      
      // Refresh positions data
      if (positionsDialog.deployment) {
        const updatedPositions = await getDeploymentPositions(positionsDialog.deployment.id);
        setPositionsDialog(prev => ({
          ...prev,
          positions: updatedPositions
        }));
      }
    } catch (error) {
      console.error('Error closing position:', error);
      toast.showError('Failed to close position');
      throw error;
    }
  };

  const handleBulkAction = (type: 'start_all' | 'stop_all' | 'exit_all') => {
    const titles = {
      start_all: 'Start All Deployments',
      stop_all: 'Pause All Deployments', 
      exit_all: 'Exit All Deployments'
    };

    const messages = {
      start_all: 'Are you sure you want to start all inactive deployments? This will resume trading for all paused strategies.',
      stop_all: 'Are you sure you want to stop all active deployments? This will pause all currently running strategies.',
      exit_all: 'Are you sure you want to exit all deployments? This will stop all strategies and close any open positions.'
    };

    setConfirmDialog({
      open: true,
      type,
      title: titles[type],
      message: messages[type]
    });
  };

  const executeAction = async () => {
    if (!confirmDialog.type) return;
    
    setActionLoading(confirmDialog.type);
    try {
      switch (confirmDialog.type) {
        case 'start_all':
          await startAllDeployments();
          toast.showSuccess('All deployments started successfully');
          break;
        case 'stop_all':
          await stopAllDeployments();
          toast.showSuccess('All deployments stopped successfully');
          break;
        case 'exit_all':
          // Use stop all for now since we don't have exit all API
          await stopAllDeployments();
          toast.showSuccess('All deployments exited successfully');
          break;
      }
      await fetchDeployments();
    } catch (err: any) {
      console.error('Error executing action:', err);
      toast.showError(`Failed to ${confirmDialog.type.replace('_', ' ')}`);
    } finally {
      setActionLoading('');
      setConfirmDialog({ open: false, type: null, title: '', message: '' });
    }
  };

  const getStatusChip = (deployment: Deployment) => {
    // Check if we have real-time metrics for more accurate status
    const realtimeMetrics = deploymentMetrics[deployment.id];
    const hasRealtimeData = realtimeMetrics && (
      realtimeMetrics.totalTrades > 0 || 
      realtimeMetrics.pnl !== 0 || 
      realtimeMetrics.unrealizedPnl !== 0 ||
      realtimeMetrics.openPositions > 0
    );
    
    if (deployment.isActive) {
      return <Chip label="Active" color="success" size="small" />;
    }
    return <Chip label="Inactive" color="default" size="small" />;
  };

  return (
    <Box sx={{ pt: 2 }}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" component="h1">
              Deployments
            </Typography>
            <Chip 
              label={connectionStatus === 'connected' ? 'Connected' : connectionStatus}
              size="small"
              color={connectionStatus === 'connected' ? 'success' : 
                     connectionStatus === 'connecting' ? 'warning' : 'error'}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor your trading strategies
          </Typography>
        </Box>
        
        {/* Action Buttons */}
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<PlayArrowIcon />}
            onClick={() => handleBulkAction('start_all')}
            disabled={actionLoading !== ''}
          >
            {actionLoading === 'start_all' ? <CircularProgress size={20} /> : 'Start All'}
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<StopIcon />}
            onClick={() => handleBulkAction('stop_all')}
            disabled={actionLoading !== ''}
          >
            {actionLoading === 'stop_all' ? <CircularProgress size={20} /> : 'Pause All'}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<ExitToAppIcon />}
            onClick={() => handleBulkAction('exit_all')}
            disabled={actionLoading !== ''}
          >
            {actionLoading === 'exit_all' ? <CircularProgress size={20} /> : 'Exit All'}
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, textAlign: 'center', display: 'block' }}>Position Status</FormLabel>
              <RadioGroup
                row
                value={positionFilter}
                onChange={handlePositionFilterChange}
                sx={{ gap: 3 }}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="waiting" control={<Radio />} label="Waiting" />
                <FormControlLabel value="entered" control={<Radio />} label="Entered" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Deployments Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={60} />
        </Box>
      ) : updatedDeployments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No deployments found matching your filters.
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Live Update Status */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Active Deployments ({updatedDeployments.length})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  fetchDeployments();
                  toast.showInfo('Refreshing deployment data...');
                }}
                disabled={loading}
                size="small"
              >
                {loading ? <CircularProgress size={16} /> : 'Refresh'}
              </Button>
            </Box>
          </Box>
          
          <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>
                  Strategy Name
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 400 }}>
                    Click row to view positions
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                {/* <TableCell sx={{ fontWeight: 600 }}>Run Time</TableCell> */}
                {/* <TableCell sx={{ fontWeight: 600 }}>MTM</TableCell> */}
                <TableCell sx={{ fontWeight: 600 }}>Total P&L</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Win Trades</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Loss Trades</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedDeployments.map((deployment) => {
                // Compute real-time metrics once for this deployment
                const realtimeMetrics = deploymentMetrics[deployment.id];
                const hasRecentActivityForDeployment = hasRecentActivity(deployment.id, 1); // Check for activity in last minute
                
                // Pre-calculate values to avoid recalculation in render
                // Use realtime metrics if available, otherwise preserve existing metrics
                const hasRealtimeData = realtimeMetrics;
                
                const totalPnl = hasRealtimeData 
                  ? (realtimeMetrics.pnl + (realtimeMetrics.unrealizedPnl || 0))
                  : deployment.metrics?.total_pnl; // Don't default to 0, use undefined to show N/A
                
                // Calculate run time (time since creation)
                const runTime = (() => {
                  const createdTime = new Date(deployment.createdAt);
                  const currentTime = new Date();
                  const diffInMs = currentTime.getTime() - createdTime.getTime();
                  
                  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                  const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
                  
                  if (days > 0) {
                    return `${days}d ${hours}h`;
                  } else if (hours > 0) {
                    return `${hours}h ${minutes}m`;
                  } else {
                    return `${minutes}m`;
                  }
                })();
                
                // MTM (Mark to Market) - current unrealized P&L
                // Use real-time data if available, otherwise show N/A
                const mtm = hasRealtimeData 
                  ? (realtimeMetrics?.unrealizedPnl || 0) 
                  : undefined; // Use undefined to show N/A instead of 0
                
                return (
                <TableRow 
                  key={`${deployment.id}-${realtimeMetrics?.lastUpdateTime || deployment.lastUpdatedAt}`}
                  hover
                  onClick={() => handleViewPositions(deployment)}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    },
                    // Add subtle pulse animation for recent activity
                    ...(hasRecentActivityForDeployment && {
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { backgroundColor: 'transparent' },
                        '50%': { backgroundColor: theme.palette.success.main + '08' },
                        '100%': { backgroundColor: 'transparent' }
                      }
                    })
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {deployment.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {deployment.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                      {deployment.instrument_master?.symbol || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(deployment)}
                  </TableCell>
                  {/* <TableCell>
                    <Typography variant="body2">
                      {runTime}
                    </Typography>
                  </TableCell> */}
                  {/* <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: mtm !== undefined ? (mtm >= 0 ? 'success.main' : 'error.main') : 'text.secondary',
                        fontWeight: 500
                      }}
                    >
                      {mtm !== undefined
                        ? `₹${mtm.toFixed(2)}`
                        : 'N/A'}
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: totalPnl !== undefined ? (totalPnl >= 0 ? 'success.main' : 'error.main') : 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        {totalPnl !== undefined
                          ? `₹${totalPnl.toFixed(2)}`
                          : 'N/A'}
                      </Typography>
                      {/* Show real-time data indicator if available */}
                      {hasRealtimeData && (
                        <Chip 
                          label="•"
                          size="small"
                          color="success"
                          variant="filled"
                          sx={{ fontSize: '0.6rem', height: 16, minWidth: 16 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>
                      {hasRealtimeData && realtimeMetrics?.winTrades !== undefined
                        ? realtimeMetrics.winTrades
                        : deployment.metrics?.win_trades ?? 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 500 }}>
                      {hasRealtimeData && realtimeMetrics?.lossTrades !== undefined
                        ? realtimeMetrics.lossTrades
                        : deployment.metrics?.loss_trades ?? 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title={deployment.isActive ? 'Pause' : 'Resume'}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleDeployment(deployment);
                          }}
                          disabled={actionLoading === `toggle_${deployment.id}`}
                          color={deployment.isActive ? 'warning' : 'success'}
                        >
                          {actionLoading === `toggle_${deployment.id}` ? (
                            <CircularProgress size={16} />
                          ) : deployment.isActive ? (
                            <PauseIcon fontSize="small" />
                          ) : (
                            <PlayArrowIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Stop Deployment">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStopDeployment(deployment);
                          }}
                          disabled={actionLoading === `stop_${deployment.id}` || !deployment.isActive}
                          color="error"
                        >
                          {actionLoading === `stop_${deployment.id}` ? (
                            <CircularProgress size={16} />
                          ) : (
                            <StopIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Exit Deployment">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExitConfirmDialog({ open: true, deployment });
                          }}
                          disabled={actionLoading === `exit_${deployment.id}`}
                          color="error"
                        >
                          {actionLoading === `exit_${deployment.id}` ? (
                            <CircularProgress size={16} />
                          ) : (
                            <ExitToAppIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: null, title: '', message: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, type: null, title: '', message: '' })}
            disabled={actionLoading !== ''}
          >
            Cancel
          </Button>
          <Button 
            onClick={executeAction} 
            color={confirmDialog.type === 'exit_all' ? 'error' : 'primary'}
            variant="contained"
            disabled={actionLoading !== ''}
          >
            {actionLoading === confirmDialog.type ? <CircularProgress size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={exitConfirmDialog.open}
        onClose={() => setExitConfirmDialog({ open: false, deployment: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Exit Deployment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to exit the deployment "{exitConfirmDialog.deployment?.name}"? This will stop the strategy and close any open positions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setExitConfirmDialog({ open: false, deployment: null })}
            disabled={actionLoading !== ''}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmExitDeployment}
            color="error"
            variant="contained"
            disabled={actionLoading !== ''}
          >
            {actionLoading === `exit_${exitConfirmDialog.deployment?.id}` ? <CircularProgress size={20} /> : 'Confirm Exit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Positions Dialog */}
      <Dialog
        open={positionsDialog.open}
        onClose={handleClosePositionsDialog}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">
                {positionsDialog.deployment?.name} - Positions & Metrics
              </Typography>
              <Chip 
                label={connectionStatus === 'connected' ? 'Connected' : connectionStatus}
                size="small"
                color={connectionStatus === 'connected' ? 'success' : 
                       connectionStatus === 'connecting' ? 'warning' : 'error'}
                variant="outlined"
              />
            </Box>
            <Button onClick={handleClosePositionsDialog} color="inherit">
              ×
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          {positionsDialog.deployment && (
            <Box sx={{ height: '100%', p: 2 }}>
              <PositionsMetricsDashboard
                deploymentId={positionsDialog.deployment.id}
                positions={positionsDialog.positions}
                metrics={positionsDialog.metrics}
                loading={false}
                positionsLoading={positionsDialog.loading}
                onClosePosition={handleClosePosition}
                onRefresh={() => handleRefreshPositions(true)}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DeploymentPage;
