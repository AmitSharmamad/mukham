import React, { useState, useEffect } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  ExpandLess,
  ExpandMore,
  TrendingUp,
  TrendingDown,
  ShowChart
} from '@mui/icons-material';
import Link from 'next/link';
import { getDeployments, Deployment } from '../../services/deploymentService';

interface DeploymentSidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'persistent' | 'temporary';
  anchor?: 'left' | 'right';
}

const DRAWER_WIDTH = 320;

export const DeploymentSidebar: React.FC<DeploymentSidebarProps> = ({
  open,
  onClose,
  variant = 'persistent',
  anchor = 'left'
}) => {
  const theme = useTheme();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (open) {
      fetchDeployments();
    }
  }, [open]);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDeployments();
      
      // Filter only active deployments and ensure it's an array
      const activeDeployments = Array.isArray(data) 
        ? data.filter(deployment => deployment.isActive) 
        : [];
      
      setDeployments(activeDeployments);
    } catch (err: any) {
      console.error('Error fetching deployments:', err);
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
    // Mock PnL calculation - in real app this would come from metrics
    const mockPnL = Math.random() > 0.5 ? 
      `+₹${(Math.random() * 1000).toFixed(2)}` : 
      `-₹${(Math.random() * 500).toFixed(2)}`;
    return mockPnL;
  };

  const getPnLColor = (pnl: string) => {
    return pnl.startsWith('+') ? theme.palette.success.main : theme.palette.error.main;
  };

  const drawerContent = (
    <Box sx={{ 
      width: DRAWER_WIDTH, 
      height: '100vh', // Changed from '100%' to '100vh' for static height
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`,
      overflow: 'hidden' // Prevent any overflow scrolling
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
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Active Deployments
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={deployments.length} 
            size="small" 
            color="primary"
            variant="outlined"
          />
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
          overflow: 'hidden', // Changed from 'auto' to 'hidden'
          height: 'calc(100vh - 200px)', // Fixed height to prevent scrolling
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
          ) : deployments.length === 0 ? (
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
              overflow: 'hidden', // Prevent scrolling
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {deployments.map((deployment, index) => {
                const pnl = formatPnL(deployment);
                const pnlColor = getPnLColor(pnl);
                
                return (
                  <React.Fragment key={deployment.id}>
                    {index > 0 && <Divider sx={{ my: 0.5 }} />}
                    <ListItem
                      component={Link}
                      href={`/deployment/${deployment.id}`}
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
                        py: 1.5
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
                            <PlayArrowIcon 
                              sx={{ 
                                color: theme.palette.success.main,
                                fontSize: 20
                              }} 
                            />
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
                        <Chip
                          label="Active"
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
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
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary">
                          {new Date(deployment.createdAt).toLocaleDateString()}
                        </Typography>
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
      {isExpanded && deployments.length > 0 && (
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.default, 0.5)
        }}>
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
