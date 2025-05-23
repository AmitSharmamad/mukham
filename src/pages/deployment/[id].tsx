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
  deactivateDeployment
} from '../../services/deploymentService';
import { useToastContext } from '../../context/ToastContext';
import DeploymentPositions from '../../components/Deployment/DeploymentPositions';
import TradeChart from '../../components/Deployment/TradeChart';

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

  // Fetch deployment data
  useEffect(() => {
    if (id) {
      fetchDeploymentData();
    }
  }, [id]);

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
    
    setStatusUpdating(true);
    try {
      if (deployment.isActive) {
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
      toast.showError(err.response?.data?.message || `Failed to ${deployment.isActive ? 'pause' : 'activate'} deployment`);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRefresh = () => {
    fetchDeploymentData();
  };

  // Helper function to format metric values
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
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !deployment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
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
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
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
          <Typography variant="h4" component="h1">
            {deployment.name}
          </Typography>
          <Chip 
            label={deployment.isActive ? 'Active' : 'Inactive'} 
            color={deployment.isActive ? 'success' : 'default'} 
            size="medium"
          />
        </Box>
        
        {deployment.description && (
          <Typography variant="body1" color="text.secondary" paragraph>
            {deployment.description}
          </Typography>
        )}
        
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Typography variant="body2" color="text.secondary">
            <strong>Created:</strong> {new Date(deployment.createdAt).toLocaleString()}
          </Typography>
          {deployment.lastUpdatedAt && (
            <Typography variant="body2" color="text.secondary">
              <strong>Last Updated:</strong> {new Date(deployment.lastUpdatedAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Open Positions */}
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Open Positions
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <DeploymentPositions 
          positions={positions.filter(p => p.status === 'OPEN')} 
          loading={positionsLoading} 
        />
      </Paper>

      {/* Key Metrics */}
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Deployment Metrics
      </Typography>

      {metricsLoading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress size={30} />
        </Box>
      ) : metrics ? (
        <>
          {/* Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Return
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ 
                    color: metrics.totalPnL >= 0 ? 'success.main' : 'error.main' 
                  }}>
                    {formatMetricValue('totalPnL', metrics.totalPnL)}
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
                  <Typography variant="h4" component="div">
                    {formatMetricValue('winRate', metrics.winRate)}
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
                    {metrics.totalTrades}
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
        </>
      ) : (
        <Alert severity="info" sx={{ mb: 4 }}>
          No metrics available for this deployment yet.
        </Alert>
      )}
    </Container>
  );
};

export default DeploymentDetail;
