import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDeploymentEvents } from '../../hooks/useDeploymentEvents';
import { formatTimeOnly } from '../../utils/deploymentUtils';

interface DeploymentDebugProps {
  show?: boolean;
}

export const DeploymentDebug: React.FC<DeploymentDebugProps> = ({ show = false }) => {
  const { 
    events, 
    connectionStatus, 
    deploymentMetrics, 
    connect, 
    disconnect,
    getDeploymentMetrics 
  } = useDeploymentEvents();
  
  const [forceRefresh, setForceRefresh] = useState(0);

  if (!show && process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleReconnect = () => {
    disconnect();
    setTimeout(() => {
      connect();
      setForceRefresh(prev => prev + 1);
    }, 1000);
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2, border: '2px dashed orange' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" color="orange">
          🔧 Debug Panel
        </Typography>
        <Chip 
          label={`Connection: ${connectionStatus}`}
          color={getConnectionStatusColor(connectionStatus)}
          size="small"
        />
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<RefreshIcon />}
          onClick={handleReconnect}
        >
          Reconnect
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        This debug panel shows real-time WebSocket data. Connection status: <strong>{connectionStatus}</strong>
      </Alert>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            Deployment Metrics ({Object.keys(deploymentMetrics).length} deployments)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(deploymentMetrics).length === 0 ? (
            <Typography color="text.secondary">No metrics available</Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Deployment ID</TableCell>
                    <TableCell>P&L</TableCell>
                    <TableCell>Unrealized P&L</TableCell>
                    <TableCell>Open Positions</TableCell>
                    <TableCell>Total Trades</TableCell>
                    <TableCell>Win/Loss</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(deploymentMetrics).map(([deploymentId, metrics]) => (
                    <TableRow key={deploymentId}>
                      <TableCell>{deploymentId}</TableCell>
                      <TableCell>₹{metrics.pnl.toFixed(2)}</TableCell>
                      <TableCell>₹{metrics.unrealizedPnl.toFixed(2)}</TableCell>
                      <TableCell>{metrics.openPositions}</TableCell>
                      <TableCell>{metrics.totalTrades}</TableCell>
                      <TableCell>{metrics.winTrades}/{metrics.lossTrades}</TableCell>
                      <TableCell>
                        <Chip 
                          label={metrics.status} 
                          size="small"
                          color={metrics.status === 'active' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>{formatTimeOnly(metrics.lastUpdateTime)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            Recent Events ({events.length} total)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {events.length === 0 ? (
            <Typography color="text.secondary">No events received</Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Event Type</TableCell>
                    <TableCell>Deployment ID</TableCell>
                    <TableCell>Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.slice(0, 10).map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatTimeOnly(event.timestamp)}</TableCell>
                      <TableCell>
                        <Chip label={event.event_type} size="small" />
                      </TableCell>
                      <TableCell>{event.deployment_id}</TableCell>
                      <TableCell>
                        <Typography variant="caption" component="pre">
                          {JSON.stringify(event.data, null, 2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default DeploymentDebug;
