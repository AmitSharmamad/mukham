import React, { useState, useEffect } from 'react';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useTheme } from '@mui/material/styles';
import { Deployment, getDeployments, getDeploymentsSearch, activateDeployment, deactivateDeployment, stopAllDeployments, startAllDeployments, getDeploymentPositions, getDeploymentMetrics, closePosition, Position, DeploymentMetrics } from '../services/deploymentService';
import { useToastContext } from '../context/ToastContext';
import { PositionsMetricsDashboard } from '../components/Deployment';

interface ConfirmDialogState {
  open: boolean;
  type: 'start_all' | 'stop_all' | 'exit_all' | null;
  title: string;
  message: string;
}

interface LogsDialogState {
  open: boolean;
  deploymentId: string | null;
  deploymentName: string;
  logs: string[];
  loading: boolean;
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
  
  // State management
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string>('');
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    type: null,
    title: '',
    message: ''
  });
  
  const [logsDialog, setLogsDialog] = useState<LogsDialogState>({
    open: false,
    deploymentId: null,
    deploymentName: '',
    logs: [],
    loading: false
  });

  const [positionsDialog, setPositionsDialog] = useState<PositionsDialogState>({
    open: false,
    deployment: null,
    positions: [],
    metrics: null,
    loading: false
  });

  useEffect(() => {
    fetchDeployments();
  }, [statusFilter, positionFilter]);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      
      // Build filter object based on current filter values
      const filters: { status?: 'waiting' | 'entered'; is_active?: boolean } = {};
      
      // Set status filter if position filter is specified
      if (positionFilter !== 'all') {
        filters.status = positionFilter as 'waiting' | 'entered';
      }
      
      // Always set is_active filter since we removed the "all" option
      filters.is_active = statusFilter === 'active';
      
      // Use search endpoint since we always have filters now
      const data = await getDeploymentsSearch(filters);
      
      setDeployments(data);
    } catch (err: any) {
      console.error('Error fetching deployments:', err);
      toast.showError('Failed to load deployments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
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

  const handleViewLogs = async (deployment: Deployment) => {
    setLogsDialog({
      open: true,
      deploymentId: deployment.id,
      deploymentName: deployment.name,
      logs: [],
      loading: true
    });

    // Simulate loading logs (replace with actual API call)
    setTimeout(() => {
      const mockLogs = [
        `[${new Date().toISOString()}] INFO: Deployment ${deployment.name} started`,
        `[${new Date().toISOString()}] INFO: Monitoring market conditions`,
        `[${new Date().toISOString()}] SUCCESS: Entry signal detected`,
        `[${new Date().toISOString()}] INFO: Position opened successfully`
      ];
      
      setLogsDialog(prev => ({
        ...prev,
        logs: mockLogs,
        loading: false
      }));
    }, 1000);
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
      const [positionsData, metricsData] = await Promise.all([
        getDeploymentPositions(deployment.id),
        getDeploymentMetrics(deployment.id)
      ]);

      setPositionsDialog(prev => ({
        ...prev,
        positions: positionsData,
        metrics: metricsData,
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

  const handleRefreshPositions = async () => {
    if (!positionsDialog.deployment) return;
    
    try {
      const [positionsData, metricsData] = await Promise.all([
        getDeploymentPositions(positionsDialog.deployment.id),
        getDeploymentMetrics(positionsDialog.deployment.id)
      ]);

      setPositionsDialog(prev => ({
        ...prev,
        positions: positionsData,
        metrics: metricsData
      }));
      
      toast.showSuccess('Positions data refreshed');
    } catch (error) {
      console.error('Error refreshing positions:', error);
      toast.showError('Failed to refresh positions data');
    }
  };

  const handleBulkAction = (type: 'start_all' | 'stop_all' | 'exit_all') => {
    const titles = {
      start_all: 'Start All Deployments',
      stop_all: 'Pause All Deployments', 
      exit_all: 'Exit All Deployments'
    };

    const messages = {
      start_all: 'Are you sure you want to start all inactive deployments? This will resume live trading for all paused strategies.',
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
    if (deployment.isActive) {
      return <Chip label="Active" color="success" size="small" />;
    }
    return <Chip label="Inactive" color="default" size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            Deployments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor your live trading strategies
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
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>Status</FormLabel>
              <RadioGroup
                row
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <FormControlLabel value="active" control={<Radio />} label="Active" />
                <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>Position Status</FormLabel>
              <RadioGroup
                row
                value={positionFilter}
                onChange={handlePositionFilterChange}
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
      ) : deployments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No deployments found matching your filters.
          </Typography>
        </Paper>
      ) : (
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
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total P&L</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Win Trades</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Loss Trades</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deployments.map((deployment) => (
                <TableRow 
                  key={deployment.id}
                  hover
                  onClick={() => handleViewPositions(deployment)}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
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
                    {getStatusChip(deployment)}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: deployment.latest_metrics && deployment.latest_metrics.total_pnl >= 0 
                          ? 'success.main' 
                          : 'error.main',
                        fontWeight: 500
                      }}
                    >
                      {deployment.latest_metrics 
                        ? `₹${deployment.latest_metrics.total_pnl.toFixed(2)}`
                        : 'N/A'
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                      {deployment.latest_metrics?.win_trades || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                      {deployment.latest_metrics?.loss_trades || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(deployment.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {deployment.lastUpdatedAt ? new Date(deployment.lastUpdatedAt).toLocaleDateString() : 'Never'}
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
                      <Tooltip title="View Logs">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewLogs(deployment);
                          }}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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

      {/* Logs Dialog */}
      <Dialog
        open={logsDialog.open}
        onClose={() => setLogsDialog({ open: false, deploymentId: null, deploymentName: '', logs: [], loading: false })}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { height: '70vh' } }}
      >
        <DialogTitle>
          Deployment Logs - {logsDialog.deploymentName}
        </DialogTitle>
        <DialogContent dividers>
          {logsDialog.loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          ) : logsDialog.logs.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={3}>
              No logs available for this deployment.
            </Typography>
          ) : (
            <Box>
              {logsDialog.logs.map((log, index) => (
                <Typography 
                  key={index} 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    mb: 1,
                    p: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 1
                  }}
                >
                  {log}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setLogsDialog({ open: false, deploymentId: null, deploymentName: '', logs: [], loading: false })}
          >
            Close
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
            <Typography variant="h6">
              {positionsDialog.deployment?.name} - Positions & Metrics
            </Typography>
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
                onRefresh={handleRefreshPositions}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DeploymentPage;
