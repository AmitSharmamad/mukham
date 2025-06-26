import React from 'react';
import { Box, Typography, Button, Paper, Alert, Chip } from '@mui/material';
import { useDeploymentContext, DeploymentMetrics } from '../../context/DeploymentContext';

export const WebSocketDebugPanel: React.FC = () => {
  const { connectionStatus, events, deploymentMetrics, connect, disconnect } = useDeploymentContext();

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        WebSocket Debug Panel
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="body2">
          Status:
        </Typography>
        <Chip 
          label={connectionStatus} 
          color={getStatusColor()}
          size="small"
        />
        <Button
          variant="outlined"
          size="small"
          onClick={handleConnect}
          disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'}
        >
          Connect
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleDisconnect}
          disabled={connectionStatus === 'disconnected'}
        >
          Disconnect
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Events received: {events.length}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Deployments with metrics: {Object.keys(deploymentMetrics).length}
        </Typography>
      </Box>

      {connectionStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          WebSocket connection failed. Make sure the backend server is running on port 9099.
        </Alert>
      )}

      {connectionStatus === 'disconnected' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          WebSocket is disconnected. Real-time updates are not available.
        </Alert>
      )}

      {events.length > 0 && (
        <Box>
          <Typography variant="body2" gutterBottom>
            Latest Events:
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {events.slice(0, 5).map((event, index) => (
              <Typography key={index} variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                {new Date(event.timestamp).toLocaleTimeString()} - {event.event_type} - {event.deployment_id}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {Object.keys(deploymentMetrics).length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Real-time Metrics:
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {Object.entries(deploymentMetrics).map(([deploymentId, metrics]) => (
              <Typography key={deploymentId} variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                {deploymentId}: PnL: {(metrics as DeploymentMetrics).pnl + (metrics as DeploymentMetrics).unrealizedPnl}, Trades: {(metrics as DeploymentMetrics).totalTrades}, Positions: {(metrics as DeploymentMetrics).openPositions}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};
