import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  Alert
} from '@mui/material';
import { useWebSocketContext } from '../context/WebSocketContext';

const Settings: React.FC = () => {
  const { 
    updatePageContext, 
    connectionStatus, 
    isConnected,
    events 
  } = useWebSocketContext();

  // Set page context to settings when component mounts
  useEffect(() => {
    updatePageContext({
      page_type: 'settings',
      page_params: {}
    });
  }, [updatePageContext]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        <Chip 
          label={isConnected ? 'Connected' : 'Disconnected'} 
          color={isConnected ? 'success' : 'error'}
          size="small"
        />
      </Box>

      {/* Connection Status Alert */}
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Real-time updates are currently unavailable. Connection status: {connectionStatus}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            WebSocket Status
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Connection Status: <strong>{connectionStatus}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Events Received: <strong>{events.length}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page demonstrates the new WebSocket connection system. 
            When connected, you'll receive real-time updates for settings-related events.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
