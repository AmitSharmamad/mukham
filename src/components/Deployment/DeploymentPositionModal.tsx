import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Deployment, Position, getDeploymentPositions } from '../../services/deploymentService';
import { useDeploymentContext, DeploymentMetrics as RealtimeMetrics } from '../../context/DeploymentContext';
import PositionsMetricsDashboard from './PositionsMetricsDashboard';

interface DeploymentPositionModalProps {
  open: boolean;
  onClose: () => void;
  deployment: Deployment | null;
}

const DeploymentPositionModal: React.FC<DeploymentPositionModalProps> = ({
  open,
  onClose,
  deployment
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getDeploymentMetrics, connectionStatus } = useDeploymentContext();

  // Fetch positions when modal opens and deployment changes
  useEffect(() => {
    if (open && deployment?.id) {
      fetchPositions();
    }
  }, [open, deployment?.id]);

  const fetchPositions = async () => {
    if (!deployment?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getDeploymentPositions(deployment.id);
      setPositions(data || []);
    } catch (err: any) {
      console.error('Error fetching positions:', err);
      setError(err.message || 'Failed to load positions');
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePosition = async (position: Position) => {
    // Implementation for closing position would go here
    console.log('Close position:', position.id);
    // After successful close, refresh positions
    await fetchPositions();
  };

  if (!deployment) {
    return null;
  }

  const realtimeMetrics = getDeploymentMetrics(deployment.id);
  
  // Convert realtime metrics to dashboard metrics format
  const dashboardMetrics = realtimeMetrics ? {
    totalTrades: realtimeMetrics.totalTrades,
    winningTrades: realtimeMetrics.winTrades,
    losingTrades: realtimeMetrics.lossTrades,
    winRate: realtimeMetrics.totalTrades > 0 ? realtimeMetrics.winTrades / realtimeMetrics.totalTrades : 0,
    profitFactor: 0, // Would need additional calculation
    totalPnL: realtimeMetrics.pnl + realtimeMetrics.unrealizedPnl,
    maxDrawdown: 0, // Would need historical data
    sharpeRatio: 0 // Would need additional calculation
  } : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
              {deployment.name} - Positions & Metrics
            </Typography>
            <Chip 
              label={connectionStatus === 'connected' ? 'Connected' : connectionStatus}
              size="small"
              color={connectionStatus === 'connected' ? 'success' : 
                     connectionStatus === 'connecting' ? 'warning' : 'error'}
              variant="outlined"
            />
          </Box>
          <Button onClick={onClose} color="inherit">
            ×
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, height: '100%' }}>
        {deployment && (
          <Box sx={{ height: '100%', p: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <PositionsMetricsDashboard
              deploymentId={deployment.id}
              positions={positions}
              metrics={dashboardMetrics}
              loading={false}
              positionsLoading={loading}
              onClosePosition={handleClosePosition}
              onRefresh={fetchPositions}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeploymentPositionModal;
