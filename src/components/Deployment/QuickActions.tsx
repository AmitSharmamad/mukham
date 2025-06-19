import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Stack,
  Tooltip,
  Badge,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  GetApp as ExportIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Position } from '../../services/deploymentService';
import { useToastContext } from '../../context/ToastContext';

interface QuickActionsProps {
  selectedPositions: number[];
  onBulkClose: () => Promise<void>;
  onRefresh?: () => void;
  positions: Position[];
  connectionStatus: string;
  compact?: boolean;
}

interface BulkActionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  positions: Position[];
  actionType: 'close' | 'export';
}

const BulkActionDialog: React.FC<BulkActionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  positions,
  actionType
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToastContext();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
      toast.showSuccess(`Successfully ${actionType === 'close' ? 'closed' : 'exported'} ${positions.length} position(s)`);
    } catch (error) {
      toast.showError(`Failed to ${actionType} positions`);
    } finally {
      setLoading(false);
    }
  };

  const getDialogContent = () => {
    switch (actionType) {
      case 'close':
        return {
          title: 'Close Selected Positions',
          content: `Are you sure you want to close ${positions.length} selected position(s)? This action cannot be undone.`,
          confirmText: 'Close Positions',
          color: 'error' as const
        };
      case 'export':
        return {
          title: 'Export Selected Positions',
          content: `Export ${positions.length} selected position(s) to CSV file?`,
          confirmText: 'Export',
          color: 'primary' as const
        };
      default:
        return {
          title: 'Confirm Action',
          content: 'Are you sure you want to proceed?',
          confirmText: 'Confirm',
          color: 'primary' as const
        };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogContent.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {dialogContent.content}
        </DialogContentText>
        {positions.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Positions:
            </Typography>
            <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
              {positions.map((position) => (
                <Box
                  key={position.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 0.5,
                    px: 1,
                    backgroundColor: alpha('#000', 0.02),
                    borderRadius: 1,
                    mb: 0.5
                  }}
                >
                  <Typography variant="body2">
                    Position #{position.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {position.pnl !== undefined ? `₹${position.pnl.toFixed(2)}` : 'N/A'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color={dialogContent.color}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Processing...' : dialogContent.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const QuickActions: React.FC<QuickActionsProps> = ({
  selectedPositions,
  onBulkClose,
  onRefresh,
  positions,
  connectionStatus,
  compact = false
}) => {
  const theme = useTheme();
  const toast = useToastContext();
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    open: boolean;
    type: 'close' | 'export' | null;
  }>({ open: false, type: null });

  // Calculate quick stats
  const selectedPositionData = positions.filter(p => selectedPositions.includes(p.id));
  const openPositions = selectedPositionData.filter(p => p.status === 'OPEN');
  const totalSelectedPnL = selectedPositionData.reduce((sum, p) => sum + (p.pnl || 0), 0);
  const canClosePositions = openPositions.length > 0;

  const handleBulkAction = (actionType: 'close' | 'export') => {
    if (actionType === 'close' && !canClosePositions) {
      toast.showWarning('No open positions selected to close');
      return;
    }
    
    if (selectedPositions.length === 0) {
      toast.showWarning('Please select positions first');
      return;
    }

    setBulkActionDialog({ open: true, type: actionType });
  };

  const handleCloseBulkDialog = () => {
    setBulkActionDialog({ open: false, type: null });
  };

  const handleExportPositions = async () => {
    // Export selected positions to CSV
    const csvContent = [
      ['Position ID', 'Instrument ID', 'Quantity', 'Entry Price', 'P&L', 'Status', 'Entry Time'].join(','),
      ...selectedPositionData.map(p => [
        p.id,
        p.instrument_id,
        p.quantity,
        p.entry_price,
        p.pnl || 0,
        p.status,
        p.entry_time
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `positions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getConnectionStatusInfo = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <CheckCircleIcon fontSize="small" color="success" />,
          text: 'Real-time data active',
          color: 'success'
        };
      case 'connecting':
        return {
          icon: <InfoIcon fontSize="small" color="info" />,
          text: 'Connecting to live data...',
          color: 'info'
        };
      case 'disconnected':
        return {
          icon: <ErrorIcon fontSize="small" color="error" />,
          text: 'Real-time data disconnected',
          color: 'error'
        };
      default:
        return {
          icon: <WarningIcon fontSize="small" color="warning" />,
          text: 'Connection status unknown',
          color: 'warning'
        };
    }
  };

  const connectionInfo = getConnectionStatusInfo();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      {/* Connection Status */}
      <Card>
        <CardContent sx={{ py: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            {connectionInfo.icon}
            <Typography variant="subtitle2">
              Live Data Status
            </Typography>
          </Box>
          <Chip
            label={connectionInfo.text}
            color={connectionInfo.color as any}
            size="small"
            variant="outlined"
          />
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedPositions.length > 0 && (
        <Card>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selection Summary
            </Typography>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Selected Positions:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {selectedPositions.length}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Open Positions:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {openPositions.length}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Total P&L:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color={totalSelectedPnL >= 0 ? 'success.main' : 'error.main'}
                >
                  ₹{totalSelectedPnL.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Quick Actions
          </Typography>
          
          <Stack spacing={1}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => handleBulkAction('close')}
              disabled={!canClosePositions}
              fullWidth
              size={compact ? 'small' : 'medium'}
            >
              Close Selected ({openPositions.length})
            </Button>

            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={() => handleBulkAction('export')}
              disabled={selectedPositions.length === 0}
              fullWidth
              size={compact ? 'small' : 'medium'}
            >
              Export Selected
            </Button>

            <Divider />

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              fullWidth
              size={compact ? 'small' : 'medium'}
            >
              Refresh Data
            </Button>
          </Stack>

          {!compact && (
            <>
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Keyboard Shortcuts
              </Typography>
              
              <List dense>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary="Ctrl+A"
                    secondary="Select all positions"
                    primaryTypographyProps={{ variant: 'caption' }}
                    secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary="Delete"
                    secondary="Close selected positions"
                    primaryTypographyProps={{ variant: 'caption' }}
                    secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary="Ctrl+E"
                    secondary="Export selected positions"
                    primaryTypographyProps={{ variant: 'caption' }}
                    secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  />
                </ListItem>
              </List>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity (if space allows) */}
      {!compact && connectionStatus === 'connected' && (
        <Card>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time position updates will appear here
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Bulk Action Dialogs */}
      <BulkActionDialog
        open={bulkActionDialog.open && bulkActionDialog.type === 'close'}
        onClose={handleCloseBulkDialog}
        onConfirm={onBulkClose}
        positions={openPositions}
        actionType="close"
      />

      <BulkActionDialog
        open={bulkActionDialog.open && bulkActionDialog.type === 'export'}
        onClose={handleCloseBulkDialog}
        onConfirm={handleExportPositions}
        positions={selectedPositionData}
        actionType="export"
      />
    </Box>
  );
};

export default QuickActions;
