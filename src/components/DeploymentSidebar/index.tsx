import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
  useTheme,
  alpha,
  Tooltip,
  Badge
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  ExpandLess,
  ExpandMore,
  TrendingUp,
  TrendingDown,
  ShowChart,
  Wifi,
  WifiOff,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { getDeployments, Deployment } from '../../services/deploymentService';
import { useDeploymentEvents } from '../../hooks/useDeploymentEvents';
import { useDeploymentUpdater } from '../../hooks/useDeploymentUpdater';

interface DeploymentSidebarProps {
  open: boolean;
  onClose: () => void;
  onToggle?: () => void;
  variant?: 'persistent' | 'temporary';
  anchor?: 'left' | 'right';
}

const DRAWER_WIDTH = 340;

/**
 * DeploymentSidebar component that shows active deployments with real-time WebSocket data.
 * The WebSocket connection to ws://localhost:9099/ws/api/deployment/events/ws is established
 * when the sidebar is opened and disconnected when closed to optimize resource usage.
 */
export const DeploymentSidebar: React.FC<DeploymentSidebarProps> = ({
  open,
  onClose,
  onToggle,
  variant = 'persistent',
  anchor = 'left'
}) => {
  const theme = useTheme();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Use WebSocket events for real-time updates - same as deployment page
  const { 
    events, 
    connectionStatus, 
    deploymentMetrics, 
    connect,
    disconnect,
    getDeploymentMetrics
  } = useDeploymentEvents();

  // Deployment updater for selective updates - same as deployment page
  const {
    updateDeploymentFromEvent,
    applyUpdatesToDeployments,
    clearAllUpdates: clearDeploymentUpdates,
    hasUpdates: hasDeploymentUpdates
  } = useDeploymentUpdater();

  // Apply real-time updates to deployments - same logic as deployment page
  const updatedDeployments = useMemo(() => {
    const result = applyUpdatesToDeployments(deployments, deploymentMetrics);
    console.log('Sidebar: Updating deployments with real-time metrics:', {
      deploymentsCount: deployments.length,
      metricsCount: Object.keys(deploymentMetrics).length,
      metricsKeys: Object.keys(deploymentMetrics),
      resultCount: result.length,
      sampleResult: result.length > 0 ? {
        id: result[0].id,
        name: result[0].name,
        metrics: result[0].metrics,
        lastUpdated: result[0].lastUpdatedAt
      } : null
    });
    return result;
  }, [deployments, deploymentMetrics, applyUpdatesToDeployments]);

  useEffect(() => {
    console.log('Sidebar: open state changed:', open);
    if (open) {
      fetchDeployments();
      // Establish WebSocket connection when sidebar is opened
      console.log('Sidebar: Connecting to WebSocket...');
      connect();
    } else {
      // Disconnect when sidebar is closed to save resources
      console.log('Sidebar: Disconnecting from WebSocket...');
      disconnect();
    }
  }, [open, connect, disconnect]);

  // Debug WebSocket connection status changes
  useEffect(() => {
    console.log('Sidebar: WebSocket connection status changed:', connectionStatus);
  }, [connectionStatus]);

  // Debug deployment metrics changes
  useEffect(() => {
    console.log('Sidebar: Deployment metrics updated:', {
      metricKeys: Object.keys(deploymentMetrics),
      metricsCount: Object.keys(deploymentMetrics).length,
      deploymentMetrics: deploymentMetrics
    });
  }, [deploymentMetrics]);

  // Periodically refresh deployments to catch status changes
  useEffect(() => {
    if (!open || connectionStatus !== 'connected') return;

    const interval = setInterval(() => {
      console.log('Sidebar: Periodic deployment refresh...');
      fetchDeployments();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [open, connectionStatus]);

  // Listen for WebSocket events and apply real-time updates
  useEffect(() => {
    if (events.length === 0) return;

    const latestEvent = events[0];
    console.log('Sidebar: Processing WebSocket event:', {
      event_type: latestEvent.event_type,
      deployment_id: latestEvent.deployment_id,
      timestamp: latestEvent.timestamp,
      connectionStatus,
      currentMetrics: Object.keys(deploymentMetrics),
      deploymentsCount: deployments.length
    });
    
    // Update deployments using the same logic as deployment page
    updateDeploymentFromEvent(latestEvent, deploymentMetrics);
    
    // Force a re-render to ensure UI updates with new metrics
    setDeployments(prev => [...prev]);
    
  }, [events, updateDeploymentFromEvent, deploymentMetrics, connectionStatus, deployments.length]);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDeployments();
      
      console.log('Sidebar: Fetched deployments:', {
        totalDeployments: Array.isArray(data) ? data.length : 0,
        data: data
      });
      
      // Filter only active deployments and ensure it's an array
      const activeDeployments = Array.isArray(data) 
        ? data.filter(deployment => deployment.isActive) 
        : [];
      
      console.log('Sidebar: Active deployments:', {
        activeCount: activeDeployments.length,
        deploymentIds: activeDeployments.map(d => d.id)
      });
      
      setDeployments(activeDeployments);
    } catch (err: any) {
      console.error('Sidebar: Error fetching deployments:', err);
      setError('Failed to load deployments');
      setDeployments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatPnL = (deployment: Deployment) => {
    // Use real-time metrics if available, same as deployment page
    const metrics = getDeploymentMetrics(deployment.id);
    
    console.log('Sidebar: Formatting P&L for deployment:', {
      deploymentId: deployment.id,
      deploymentName: deployment.name,
      realtimeMetrics: metrics,
      deploymentMetrics: deployment.metrics
    });
    
    if (metrics) {
      const totalPnL = metrics.pnl + (metrics.unrealizedPnl || 0);
      const formatted = totalPnL >= 0 
        ? `+₹${totalPnL.toFixed(2)}` 
        : `₹${totalPnL.toFixed(2)}`;
      console.log('Sidebar: Using real-time metrics, formatted P&L:', formatted);
      return formatted;
    }
    
    // Use deployment's metrics if available from real-time updates
    if (deployment.metrics?.total_pnl !== undefined) {
      const totalPnL = deployment.metrics.total_pnl;
      const formatted = totalPnL >= 0 
        ? `+₹${totalPnL.toFixed(2)}` 
        : `₹${totalPnL.toFixed(2)}`;
      console.log('Sidebar: Using deployment metrics, formatted P&L:', formatted);
      return formatted;
    }
    
    // Return 0 if no data available instead of mock data
    console.log('Sidebar: No metrics available, returning default');
    return '₹0.00';
  };

  const getPnLColor = (pnl: string, deployment: Deployment) => {
    // Get real-time metrics to determine color more accurately
    const metrics = getDeploymentMetrics(deployment.id);
    if (metrics) {
      const totalPnL = metrics.pnl + (metrics.unrealizedPnl || 0);
      return totalPnL >= 0 ? theme.palette.success.main : theme.palette.error.main;
    }
    
    // Fallback to string-based determination
    return pnl.startsWith('+') || pnl === '₹0.00' ? theme.palette.success.main : theme.palette.error.main;
  };

  const getDeploymentStatus = (deployment: Deployment) => {
    const metrics = getDeploymentMetrics(deployment.id);
    
    console.log('Sidebar: Getting status for deployment:', {
      deploymentId: deployment.id,
      deploymentActive: deployment.isActive,
      metrics: metrics,
      metricsStatus: metrics?.status
    });
    
    if (metrics?.status === 'error') {
      return 'error';
    }
    
    return deployment.isActive ? 'active' : 'inactive';
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi sx={{ fontSize: 16, color: theme.palette.success.main }} />;
      case 'connecting':
        return <CircularProgress size={16} />;
      case 'error':
        return <WifiOff sx={{ fontSize: 16, color: theme.palette.error.main }} />;
      default:
        return <WifiOff sx={{ fontSize: 16, color: theme.palette.text.secondary }} />;
    }
  };

  const getRecentEventCount = (deploymentId: string) => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    return events.filter(event => 
      event.deployment_id === deploymentId && 
      new Date(event.timestamp) > fiveMinutesAgo
    ).length;
  };

  // Check if deployment has recent activity for visual indicators
  const hasRecentActivity = (deploymentId: string) => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    
    return events.some(event => 
      event.deployment_id === deploymentId && 
      new Date(event.timestamp) > oneMinuteAgo
    );
  };

  const drawerContent = (
    <Box sx={{ 
      width: DRAWER_WIDTH, 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.primary.main, 0.05)
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Live Deployments
          </Typography>
          <Tooltip title={`WebSocket: ${connectionStatus}`}>
            {getConnectionStatusIcon()}
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={updatedDeployments.length} 
            size="small" 
            color="primary"
            variant="outlined"
          />
          <Tooltip title="Refresh Deployments">
            <IconButton 
              size="small" 
              onClick={() => {
                console.log('Sidebar: Manual refresh triggered');
                fetchDeployments();
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
            <IconButton 
              size="small" 
              onClick={handleToggleExpanded}
              sx={{ color: theme.palette.primary.main }}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Content */}
      <Collapse in={isExpanded} timeout="auto">
        <Box sx={{ 
          flex: 1, 
          overflow: 'hidden',
          height: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">
                {error}
              </Alert>
            </Box>
          ) : updatedDeployments.length === 0 ? (
            <Box sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              textAlign: 'center'
            }}>
              <ShowChart sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No active deployments
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Deploy a strategy to see it here
              </Typography>
            </Box>
          ) : (
            <List sx={{ 
              p: 1,
              overflow: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {updatedDeployments.map((deployment, index) => {
                const pnl = formatPnL(deployment);
                const pnlColor = getPnLColor(pnl, deployment);
                const deploymentStatus = getDeploymentStatus(deployment);
                const metrics = getDeploymentMetrics(deployment.id);
                const recentEventCount = getRecentEventCount(deployment.id);
                const isActive = hasRecentActivity(deployment.id);
                
                return (
                  <React.Fragment key={deployment.id}>
                    {index > 0 && <Divider sx={{ my: 0.5 }} />}
                    <ListItem
                      component={Link}
                      href={`/deployment`}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          transform: 'translateX(4px)'
                        },
                        textDecoration: 'none',
                        color: 'inherit',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 1.5,
                        border: deploymentStatus === 'error' 
                          ? `1px solid ${theme.palette.error.main}` 
                          : isActive 
                          ? `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                          : 'none',
                        // Add pulsing animation for recent activity
                        animation: isActive ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%': {
                            boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0.7)}`,
                          },
                          '70%': {
                            boxShadow: `0 0 0 10px ${alpha(theme.palette.success.main, 0)}`,
                          },
                          '100%': {
                            boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0)}`,
                          },
                        }
                      }}
                    >
                      <Box sx={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {deploymentStatus === 'error' ? (
                              <ErrorIcon 
                                sx={{ 
                                  color: theme.palette.error.main,
                                  fontSize: 20
                                }} 
                              />
                            ) : deployment.isActive ? (
                              <PlayArrowIcon 
                                sx={{ 
                                  color: theme.palette.success.main,
                                  fontSize: 20
                                }} 
                              />
                            ) : (
                              <PauseIcon 
                                sx={{ 
                                  color: theme.palette.warning.main,
                                  fontSize: 20
                                }} 
                              />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 500,
                                  fontSize: '0.875rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {deployment.name}
                              </Typography>
                            }
                            sx={{ margin: 0 }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {recentEventCount > 0 && (
                            <Badge 
                              badgeContent={recentEventCount} 
                              color="primary" 
                              sx={{ 
                                '& .MuiBadge-badge': { 
                                  fontSize: '0.6rem',
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
                                sx={{ fontSize: '0.6rem', height: 18 }}
                              />
                            </Badge>
                          )}
                          <Chip
                            label={
                              deploymentStatus === 'error' ? 'Error' : 
                              deployment.isActive ? 
                                (metrics?.openPositions > 0 ? `Active (${metrics.openPositions} pos)` : 'Active (Waiting)') : 
                                'Paused'
                            }
                            size="small"
                            color={deploymentStatus === 'error' ? 'error' : deployment.isActive ? 'success' : 'warning'}
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        </Box>
                      </Box>
                      
                      {/* PnL and Stats */}
                      <Box sx={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 0.5
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {pnl.startsWith('+') ? (
                            <TrendingUp sx={{ fontSize: 16, color: pnlColor, mr: 0.5 }} />
                          ) : (
                            <TrendingDown sx={{ fontSize: 16, color: pnlColor, mr: 0.5 }} />
                          )}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 600,
                              color: pnlColor
                            }}
                          >
                            {pnl}
                          </Typography>
                          {metrics && (
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              ({metrics?.openPositions || 0} open)
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(deployment.createdAt).toLocaleDateString()}
                          </Typography>
                          {(metrics || deployment.metrics) && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                              {metrics?.totalTrades || deployment.metrics?.total_trades || 0} trades
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      {/* Description if available */}
                      {deployment.description && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            mt: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%'
                          }}
                        >
                          {deployment.description}
                        </Typography>
                      )}
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>
      </Collapse>

      {/* Footer */}
      {isExpanded && (
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.default, 0.5)
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Connection Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Live Data: {connectionStatus}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {events.length} events
              </Typography>
            </Box>
            
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ 
                p: 1, 
                bgcolor: 'rgba(0,0,0,0.05)', 
                borderRadius: 1, 
                mb: 1,
                fontSize: '0.6rem'
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                  Debug: Metrics: {Object.keys(deploymentMetrics).length} | Events: {events.length} | Status: {connectionStatus}
                </Typography>
              </Box>
            )}
            
            {/* Recent Activity */}
            {events.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                Last: {events[0].event_type} • {new Date(events[0].timestamp).toLocaleTimeString()}
              </Typography>
            )}
            
            {/* View All Deployments Link */}
            {updatedDeployments.length > 0 && (
              <Box 
                component={Link}
                href="/deployment"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  py: 1,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  View All Deployments
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        anchor={anchor}
        open={open}
        onClose={onClose}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: 64, // Position below navbar
            height: 'calc(100vh - 64px)',
            zIndex: theme.zIndex.drawer
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor={anchor}
      open={open}
      variant="persistent"
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: 64, // Position below navbar
          height: 'calc(100vh - 64px)',
          border: 'none',
          zIndex: theme.zIndex.drawer
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default DeploymentSidebar;
