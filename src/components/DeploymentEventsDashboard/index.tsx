import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Chip, 
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Badge,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Circle, 
  TrendingUp, 
  TrendingDown, 
  PlayArrow, 
  Stop,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useDeploymentEvents, DeploymentEvent } from '../../hooks/useDeploymentEvents';
import { formatTimeOnly } from '../../utils/deploymentUtils';

const DeploymentEventsDashboard = () => {
  const theme = useTheme();
  const { events, connectionStatus, deploymentMetrics } = useDeploymentEvents();

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return theme.palette.success.main;
      case 'connecting': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getEventTypeColor = (eventType: string) => {
    if (eventType.includes('position_opened')) return theme.palette.success.main;
    if (eventType.includes('position_closed')) return theme.palette.info.main;
    if (eventType.includes('signal')) return theme.palette.primary.main;
    if (eventType.includes('error')) return theme.palette.error.main;
    if (eventType.includes('stop_loss') || eventType.includes('target_profit')) return theme.palette.warning.main;
    return theme.palette.text.secondary;
  };

  const getPositionEvents = () => events.filter(e => e.event_type.includes('position'));
  const getSignalEvents = () => events.filter(e => e.event_type.includes('signal'));
  const getErrorEvents = () => events.filter(e => e.event_type.includes('error'));

  const formatEventTime = (timestamp: string) => {
    return formatTimeOnly(timestamp);
  };

  const formatEventData = (event: DeploymentEvent) => {
    const { event_type, data } = event;
    
    switch (event_type) {
      case 'position_opened':
        return `${data.direction} ${data.quantity} @ ₹${data.entry_price}`;
      case 'position_closed':
        const pnl = data.pnl >= 0 ? `+₹${data.pnl}` : `-₹${Math.abs(data.pnl)}`;
        return `${pnl} (${data.exit_reason})`;
      case 'entry_signal_detected':
      case 'exit_signal_detected':
        return `Signal at ₹${data.market_price}`;
      case 'stop_loss_triggered':
      case 'target_profit_triggered':
        return `Triggered at ₹${data.trigger_price}`;
      default:
        return JSON.stringify(data).substring(0, 50) + '...';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Deployment Events
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Circle 
            sx={{ 
              fontSize: 12, 
              color: getConnectionStatusColor() 
            }} 
          />
          <Typography variant="body2" color="text.secondary">
            {connectionStatus} • {events.length} events
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Connection Status Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Connection Status
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Chip 
                  label={connectionStatus}
                  color={connectionStatus === 'connected' ? 'success' : 
                         connectionStatus === 'connecting' ? 'warning' : 'error'}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                WebSocket endpoint: ws://localhost:9099/ws/api/deployment/ws
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Metrics Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Deployment Metrics
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(deploymentMetrics).map(([deploymentId, metrics]) => (
                  <Grid item xs={12} sm={6} key={deploymentId}>
                    <Paper sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {deploymentId.substring(0, 8)}...
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            PnL: {metrics.pnl >= 0 ? '+' : ''}₹{metrics.pnl.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Open: {metrics.openPositions} | Total: {metrics.totalTrades}
                          </Typography>
                        </Box>
                        <Chip 
                          label={metrics.status}
                          color={metrics.status === 'active' ? 'success' : 
                                 metrics.status === 'error' ? 'error' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Position Events */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Position Events
                </Typography>
                <Badge badgeContent={getPositionEvents().length} color="primary">
                  <TrendingUp />
                </Badge>
              </Box>
              <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                {getPositionEvents().slice(0, 10).map((event, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={event.event_type.replace('position_', '')}
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(getEventTypeColor(event.event_type), 0.1),
                              color: getEventTypeColor(event.event_type),
                              fontSize: '0.7rem'
                            }}
                          />
                          <Typography variant="body2">
                            {formatEventTime(event.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {formatEventData(event)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Signal Events */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Signal Events
                </Typography>
                <Badge badgeContent={getSignalEvents().length} color="primary">
                  <PlayArrow />
                </Badge>
              </Box>
              <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                {getSignalEvents().slice(0, 10).map((event, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={event.event_type.replace('_signal_detected', '')}
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(getEventTypeColor(event.event_type), 0.1),
                              color: getEventTypeColor(event.event_type),
                              fontSize: '0.7rem'
                            }}
                          />
                          <Typography variant="body2">
                            {formatEventTime(event.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {event.metadata.strategy_name} • {formatEventData(event)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Error Events */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Error Events
                </Typography>
                <Badge badgeContent={getErrorEvents().length} color="error">
                  <ErrorIcon />
                </Badge>
              </Box>
              <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                {getErrorEvents().slice(0, 10).map((event, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label="error"
                            size="small"
                            color="error"
                            sx={{ fontSize: '0.7rem' }}
                          />
                          <Typography variant="body2">
                            {formatEventTime(event.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="error">
                          {event.data.error_message}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Events Timeline */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Events Timeline
              </Typography>
              <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
                {events.slice(0, 20).map((event, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="body2" sx={{ minWidth: 80 }}>
                            {formatEventTime(event.timestamp)}
                          </Typography>
                          <Chip 
                            label={event.event_type}
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(getEventTypeColor(event.event_type), 0.1),
                              color: getEventTypeColor(event.event_type),
                              fontSize: '0.7rem'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {event.metadata.strategy_name}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 11 }}>
                          {formatEventData(event)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeploymentEventsDashboard;
