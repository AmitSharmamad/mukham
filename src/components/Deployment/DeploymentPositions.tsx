import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  Divider,
  Stack
} from '@mui/material';
import { Position, DeploymentMetrics } from '../../services/deploymentService';
import { useToastContext } from '../../context/ToastContext';
import PositionsMetricsDashboard from './PositionsMetricsDashboard';
import { formatDate } from '../../utils/deploymentUtils';

interface DeploymentPositionsProps {
  positions: Position[];
  loading: boolean;
  onClosePosition?: (position: Position) => Promise<void>;
  deploymentId?: string;
  metrics?: DeploymentMetrics | null;
  onRefresh?: () => void;
  useNewDashboard?: boolean;
}

const DeploymentPositions: React.FC<DeploymentPositionsProps> = ({ 
  positions, 
  loading,
  onClosePosition,
  deploymentId,
  metrics,
  onRefresh,
  useNewDashboard = false
}) => {
  const theme = useTheme();
  const toast = useToastContext();
  const [positionToClose, setPositionToClose] = useState<Position | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [closingPosition, setClosingPosition] = useState(false);

  // Use new dashboard if enabled and deploymentId is provided
  if (useNewDashboard && deploymentId) {
    return (
      <PositionsMetricsDashboard
        deploymentId={deploymentId}
        positions={positions}
        metrics={metrics || null}
        loading={false}
        positionsLoading={loading}
        onClosePosition={onClosePosition}
        onRefresh={onRefresh}
      />
    );
  }

  // Only show open positions as that's what can be closed
  const openPositions = positions.filter(position => position.status === 'OPEN');

  const handleClosePosition = async () => {
    if (!positionToClose) return;
    
    try {
      setClosingPosition(true);
      
      // If there's a handler provided, use it
      if (onClosePosition) {
        await onClosePosition(positionToClose);
        toast.showSuccess(`Position ${positionToClose.id} closed successfully`);
      } else {
        // Otherwise make the API call directly
        const response = await fetch(
          `http://localhost:8080/api/deployment/${positionToClose.deployment_id}/positions/${positionToClose.id}/close`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        const data = await response.json();
        
        if (data.success) {
          toast.showSuccess(data.message || 'Position closed successfully');
        } else {
          throw new Error(data.message || 'Failed to close position');
        }
      }
    } catch (error) {
      console.error('Error closing position:', error);
      toast.showError(error instanceof Error ? error.message : 'Failed to close position');
    } finally {
      setClosingPosition(false);
      setConfirmDialogOpen(false);
      setPositionToClose(null);
    }
  };

  const handleOpenConfirmDialog = (position: Position) => {
    setPositionToClose(position);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setPositionToClose(null);
  };

  return (
    <Box p={2} bgcolor={theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}>
      {loading ? (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      ) : openPositions.length > 0 ? (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Open Positions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ maxHeight: '600px', overflow: 'auto' }}>
              {openPositions.map((position, index) => (
                <React.Fragment key={position.id}>
                  {index > 0 && <Divider sx={{ my: 3 }} />}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Stack spacing={1} sx={{ width: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Position ID: {position.id}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          Instrument ID: {position.instrument_id}
                        </Typography>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Quantity</Typography>
                            <Typography variant="body1">{position.quantity}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Entry Price</Typography>
                            <Typography variant="body1">${position.entry_price.toFixed(2)}</Typography>
                          </Grid>
                        </Grid>
                        
                        <Typography variant="body2" color="text.secondary">
                          Entry Time: {formatDate(position.entry_time)}
                        </Typography>
                        
                        {position.pnl !== undefined && (
                          <Typography 
                            variant="body1" 
                            fontWeight="bold"
                            color={position.pnl > 0 ? 'success.main' : position.pnl < 0 ? 'error.main' : 'text.primary'}
                          >
                            Unrealized P&L: ${position.pnl.toFixed(2)}
                          </Typography>
                        )}
                      </Stack>
                      
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenConfirmDialog(position)}
                        size="small"
                      >
                        Close
                      </Button>
                    </Grid>
                  </Grid>
                </React.Fragment>
              ))}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
          No open positions for this deployment yet.
          <br/>
          Hang on tight, they will be here soon!
        </Typography>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="close-position-dialog-title"
        aria-describedby="close-position-dialog-description"
      >
        <DialogTitle id="close-position-dialog-title">
          Close Position
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="close-position-dialog-description">
            Are you sure you want to close position #{positionToClose?.id}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} disabled={closingPosition}>
            Cancel
          </Button>
          <Button 
            onClick={handleClosePosition} 
            color="primary" 
            variant="contained"
            disabled={closingPosition}
            autoFocus
          >
            {closingPosition ? 'Closing...' : 'Confirm Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeploymentPositions;
