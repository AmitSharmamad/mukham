import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AccountBalance, 
  Assessment,
  Warning,
  Info,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useDashboardWebSocket } from '../hooks/useDashboardWebSocket';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { 
    summary, 
    activities, 
    alerts, 
    lastUpdated,
    connectionStatus, 
    isConnected 
  } = useDashboardWebSocket();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={isConnected ? 'Connected' : 'Disconnected'} 
            color={isConnected ? 'success' : 'error'}
            size="small"
          />
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {formatTime(lastUpdated)}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Connection Status Alert */}
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Real-time updates are currently unavailable. Connection status: {connectionStatus}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Summary Cards */}
        {summary && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment color="primary" />
                    <Box>
                      <Typography variant="h6">
                        {formatCurrency(summary.total_pnl)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total P&L
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {summary.today_pnl >= 0 ? (
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                    <Box>
                      <Typography 
                        variant="h6" 
                        color={summary.today_pnl >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(summary.today_pnl)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Today's P&L
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalance color="info" />
                    <Box>
                      <Typography variant="h6">
                        {summary.active_deployments}/{summary.total_deployments}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Deployments
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment color="secondary" />
                    <Box>
                      <Typography variant="h6">
                        {formatPercentage(summary.win_rate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Win Rate
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Alerts Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Alerts
              </Typography>
              {alerts ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip 
                    icon={<ErrorIcon />}
                    label={`Critical: ${alerts.critical_count}`}
                    color="error"
                    variant={alerts.critical_count > 0 ? "filled" : "outlined"}
                  />
                  <Chip 
                    icon={<Warning />}
                    label={`Warning: ${alerts.warning_count}`}
                    color="warning"
                    variant={alerts.warning_count > 0 ? "filled" : "outlined"}
                  />
                  <Chip 
                    icon={<Info />}
                    label={`Info: ${alerts.info_count}`}
                    color="info"
                    variant={alerts.info_count > 0 ? "filled" : "outlined"}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    Loading alerts...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              {activities.length > 0 ? (
                <List dense>
                  {activities.slice(0, 5).map((activity, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {activity.type === 'position_opened' && <TrendingUp color="success" />}
                        {activity.type === 'position_closed' && <TrendingDown color="error" />}
                        {activity.type === 'signal_detected' && <Assessment color="info" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.activity}
                        secondary={`${activity.deployment_name} • ${formatTime(activity.timestamp)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Loading State */}
        {!summary && isConnected && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading dashboard data...
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
