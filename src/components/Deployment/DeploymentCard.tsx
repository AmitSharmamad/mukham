import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Grid,
  Paper,
  Badge,
  alpha
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ErrorIcon from '@mui/icons-material/Error';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useRouter } from 'next/router';
import { Deployment } from '../../services/deploymentService';
import { useDeploymentEvents } from '../../hooks/useDeploymentEvents';

export interface DeploymentCardProps {
  deployment: Deployment;
  onDelete: (deployment: Deployment) => void;
  onToggleStatus: (deployment: Deployment) => void;
}

const DeploymentCard: React.FC<DeploymentCardProps> = ({
  deployment,
  onDelete,
  onToggleStatus
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { getDeploymentMetrics, getEventsByDeployment } = useDeploymentEvents();

  // Get real-time metrics for this deployment
  const metrics = getDeploymentMetrics(deployment.id);
  const recentEvents = getEventsByDeployment(deployment.id);
  
  // Get recent events count (last 5 minutes)
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const recentEventCount = recentEvents.filter(event => 
    new Date(event.timestamp) > fiveMinutesAgo
  ).length;

  // Check if there are any error events recently
  const hasRecentErrors = recentEvents.some(event => 
    event.event_type === 'deployment_error' && 
    new Date(event.timestamp) > fiveMinutesAgo
  );

  // Get the most recent significant event for display
  const getLastSignificantEvent = () => {
    const significantEvents = ['position_opened', 'position_closed', 'stop_loss_triggered', 'target_profit_triggered', 'entry_signal_detected', 'deployment_error'];
    const lastEvent = recentEvents.find(event => 
      significantEvents.includes(event.event_type)
    );
    return lastEvent;
  };

  const lastSignificantEvent = getLastSignificantEvent();

  // Calculate total P&L
  const totalPnL = metrics ? metrics.pnl + metrics.unrealizedPnl : 0;
  const pnlColor = totalPnL >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const pnlText = totalPnL >= 0 ? `+₹${totalPnL.toFixed(2)}` : `₹${totalPnL.toFixed(2)}`;

  // Get deployment status
  const getDeploymentStatus = () => {
    if (hasRecentErrors) return 'error';
    if (!deployment.isActive) return 'inactive';
    if (metrics && metrics.status === 'error') return 'error';
    return 'active';
  };

  const deploymentStatus = getDeploymentStatus();

  const handleCardClick = () => {
    router.push(`/deployment/${deployment.id}`);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/strategy/${deployment.strategy_id}`);
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[6]
        },
        cursor: 'pointer',
        position: 'relative',
        border: deploymentStatus === 'error' 
          ? `2px solid ${theme.palette.error.main}` 
          : deploymentStatus === 'active' 
            ? `1px solid ${alpha(theme.palette.success.main, 0.3)}`
            : `1px solid ${theme.palette.divider}`,
        backgroundColor: deploymentStatus === 'error' 
          ? alpha(theme.palette.error.main, 0.05)
          : 'background.paper'
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Header with live indicator */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" component="h2">{deployment.name}</Typography>
                {recentEventCount > 0 && (
                  <Badge 
                    badgeContent={recentEventCount} 
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.7rem',
                        minWidth: 16,
                        height: 16
                      }
                    }}
                  >
                    <Chip
                      label="Live"
                      size="small"
                      color="success"
                      variant="outlined"
                      icon={<FiberManualRecordIcon sx={{ fontSize: 12, animation: 'pulse 2s infinite' }} />}
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 20,
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                          '100%': { opacity: 1 }
                        }
                      }}
                    />
                  </Badge>
                )}
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                {deploymentStatus === 'error' && (
                  <Chip
                    icon={<ErrorIcon />}
                    label="Error"
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
                <Chip
                  label={deployment.isActive ? 'Active' : 'Inactive'}
                  color={deployment.isActive ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Box>

            {/* Real-time P&L and metrics */}
            {metrics && (
              <Box 
                sx={{ 
                  backgroundColor: alpha(pnlColor, 0.1),
                  borderRadius: 1,
                  p: 1.5,
                  mb: 2
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    {totalPnL >= 0 ? (
                      <TrendingUpIcon sx={{ color: pnlColor, fontSize: 20 }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: pnlColor, fontSize: 20 }} />
                    )}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: pnlColor,
                        fontWeight: 600
                      }}
                    >
                      {pnlText}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary">
                      {metrics.openPositions} open positions
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {metrics.totalTrades} total trades
                    </Typography>
                  </Box>
                </Box>
                
                {/* Individual P&L breakdown */}
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    Realized: ₹{metrics.pnl.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Unrealized: ₹{metrics.unrealizedPnl.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {deployment.description || 'No description provided.'}
            </Typography>

            <Divider sx={{ my: 1 }} />

            {/* Bottom info with last event time */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {deployment.lastUpdatedAt ? new Date(deployment.lastUpdatedAt).toLocaleString() : 'Never'}
              </Typography>
              {lastSignificantEvent ? (
                <Typography variant="caption" color="text.secondary">
                  {lastSignificantEvent.event_type.replace(/_/g, ' ')}: {new Date(lastSignificantEvent.timestamp).toLocaleTimeString()}
                </Typography>
              ) : metrics && (
                <Typography variant="caption" color="text.secondary">
                  Last event: {new Date(metrics.lastUpdateTime).toLocaleTimeString()}
                </Typography>
              )}
            </Box>
            
            {/* Action Icons in bottom right (Pause/Resume, Edit, Delete) */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 8, 
              right: 8, 
              display: 'flex',
              gap: 1
            }}>
              <Tooltip title={deployment.isActive ? 'Pause' : 'Resume'}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(deployment);
                  }}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  {deployment.isActive ?
                    <PauseIcon fontSize="small" /> :
                    <PlayArrowIcon fontSize="small" />
                  }
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Strategy">
                <IconButton
                  size="small"
                  onClick={handleEditClick}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Deployment">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(deployment);
                  }}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeploymentCard;
