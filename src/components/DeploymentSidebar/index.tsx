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
import { useDeploymentContext } from '../../context/DeploymentContext';

interface DeploymentSidebarProps {
  open: boolean;
  onClose: () => void;
  onToggle?: () => void;
  variant?: 'persistent' | 'temporary';
  anchor?: 'left' | 'right';
}

const DRAWER_WIDTH = 340;

// Memoized deployment card component to prevent unnecessary re-renders
const DeploymentCard = React.memo(({ 
  deployment, 
  index, 
  pnl, 
  pnlColor, 
  deploymentStatus, 
  metrics, 
  recentEventCount, 
  isActive 
}: {
  deployment: Deployment;
  index: number;
  pnl: string;
  pnlColor: string;
  deploymentStatus: string;
  metrics: any;
  recentEventCount: number;
  isActive: boolean;
}) => {
  const theme = useTheme();
  
  return (
    <React.Fragment key={deployment.id}>
      {index > 0 && <Divider sx={{ my: 0.5 }} />}
      <ListItem
        component={Link}
        href={`/deployment`}
        sx={{
          borderRadius: 1,
          mb: 0.5,
          cursor: 'pointer',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
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
            <Chip
              label={
                deploymentStatus === 'error' ? 'Error' : 
                deployment.isActive ? 'Active' : 'Paused'
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
});

DeploymentCard.displayName = 'DeploymentCard';

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
  
  // Use centralized WebSocket context for real-time updates
  const { 
    connectionStatus, 
    deploymentMetrics, 
    events,
    connect,
    disconnect,
    getDeploymentMetrics,
    getRecentEventCount,
    hasRecentActivity,
    hasRecentErrors
  } = useDeploymentContext();

  // Apply real-time updates to deployments - use centralized context data
  const updatedDeployments = useMemo(() => {
    return deployments.map(deployment => {
      const realtimeMetrics = deploymentMetrics[deployment.id];
      if (realtimeMetrics) {
        // Create updated deployment with real-time data from events
        return {
          ...deployment,
          metrics: deployment.metrics ? {
            ...deployment.metrics,
            total_pnl: realtimeMetrics.pnl + realtimeMetrics.unrealizedPnl,
            total_trades: realtimeMetrics.totalTrades,
            win_trades: realtimeMetrics.winTrades,
            loss_trades: realtimeMetrics.lossTrades,
            updated_at: realtimeMetrics.lastUpdateTime,
          } : undefined,
          status: realtimeMetrics.openPositions > 0 ? 'entered' as const : 'waiting' as const,
          lastUpdatedAt: realtimeMetrics.lastUpdateTime
        };
      }
      return deployment;
    });
  }, [deployments, deploymentMetrics]);

  useEffect(() => {
    if (open) {
      fetchDeployments();
      // Establish WebSocket connection when sidebar is opened
      connect();
    } else {
      // Disconnect when sidebar is closed to save resources
      disconnect();
    }
  }, [open, connect, disconnect]);

  // Debug WebSocket connection status changes
  useEffect(() => {
    // Connection status change handler removed for cleaner logs
  }, [connectionStatus]);

  // Debug deployment metrics changes
  useEffect(() => {
    // Metrics change handler removed for cleaner logs
  }, [deploymentMetrics]);

  // Reduced frequency periodic refresh when WebSocket is active - only when needed
  useEffect(() => {
    if (!open || connectionStatus !== 'connected') return;

    const interval = setInterval(() => {
      // Only refresh if we haven't received events recently (stale data check)
      const lastEventTime = events.length > 0 ? new Date(events[0].timestamp) : null;
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      // Only do full refresh if no recent events or if we have no metrics
      const hasRecentEvents = lastEventTime && lastEventTime > fiveMinutesAgo;
      const hasActiveMetrics = Object.keys(deploymentMetrics).length > 0;
      
      if (!hasRecentEvents || !hasActiveMetrics) {
        fetchDeployments();
      } else {
        // Skipping periodic refresh - have recent WebSocket data
      }
    }, 60000); // Increased to 60 seconds since we have real-time updates

    return () => clearInterval(interval);
  }, [open, connectionStatus, events, deploymentMetrics]);

  const fetchDeployments = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // If we have active WebSocket connection and real-time data, don't overwrite unless forced
      const hasActiveRealTimeData = connectionStatus === 'connected' && Object.keys(deploymentMetrics).length > 0;
      
      if (hasActiveRealTimeData && !forceRefresh) {
        setLoading(false);
        return;
      }
      
      const data = await getDeployments();
      
      // Filter only active deployments and ensure it's an array
      const activeDeployments = Array.isArray(data) 
        ? data.filter(deployment => deployment.isActive) 
        : [];
      
      // Only update deployments if we don't have conflicting real-time data
      if (forceRefresh || !hasActiveRealTimeData) {
        setDeployments(activeDeployments);
      } else {
        // Merge new deployments with existing real-time updated ones
        setDeployments(prev => {
          const existingIds = prev.map(d => d.id);
          const newDeployments = activeDeployments.filter(d => !existingIds.includes(d.id));
          const updatedExisting = prev.filter(d => activeDeployments.some(ad => ad.id === d.id));
          return [...updatedExisting, ...newDeployments];
        });
      }
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
    // Use real-time metrics if available and contain actual data
    const metrics = getDeploymentMetrics(deployment.id);
    const hasRealtimeData = metrics && (
      metrics.totalTrades > 0 || 
      metrics.pnl !== 0 || 
      metrics.unrealizedPnl !== 0 ||
      metrics.openPositions > 0
    );
    
    if (hasRealtimeData) {
      const totalPnL = metrics.pnl + (metrics.unrealizedPnl || 0);
      const formatted = totalPnL >= 0 
        ? `+₹${totalPnL.toFixed(2)}` 
        : `₹${totalPnL.toFixed(2)}`;
      return formatted;
    }
    
    // Use deployment's metrics from API
    if (deployment.metrics?.total_pnl !== undefined) {
      const totalPnL = deployment.metrics.total_pnl;
      const formatted = totalPnL >= 0 
        ? `+₹${totalPnL.toFixed(2)}` 
        : `₹${totalPnL.toFixed(2)}`;
      return formatted;
    }
    
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
    const hasRealtimeData = metrics && (
      metrics.totalTrades > 0 || 
      metrics.pnl !== 0 || 
      metrics.unrealizedPnl !== 0 ||
      metrics.openPositions > 0
    );
    
    if (hasRealtimeData && metrics.status === 'error') {
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
            Deployments
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
                fetchDeployments(true); // Force refresh to get latest data
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
                  <DeploymentCard
                    key={deployment.id}
                    deployment={deployment}
                    index={index}
                    pnl={pnl}
                    pnlColor={pnlColor}
                    deploymentStatus={deploymentStatus}
                    metrics={metrics}
                    recentEventCount={recentEventCount}
                    isActive={isActive}
                  />
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
                Connection: {connectionStatus}
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
