// filepath: /Users/amit/workspace/mukham/src/components/Navbar.tsx
import Link from 'next/link';
import Router from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Button, 
  useTheme as useMuiTheme, 
  Tooltip, 
  Divider,
  Popper,
  Grow,
  Paper,
  MenuList,
  ClickAwayListener,
  Avatar
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logout as logoutService, checkAPIServer } from '../services/authService';

interface NavbarProps {
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

export default function Navbar({ onToggleTheme, isDarkMode }: NavbarProps = {}) {
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const muiTheme = useMuiTheme();
  const { mode, toggleMode } = useTheme();
  const { user, logout, checkUserAuth } = useAuth();
  const [authStatus, setAuthStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  // Use either provided toggleMode or context toggleMode
  const handleToggleTheme = onToggleTheme || toggleMode;
  const currentMode = isDarkMode !== undefined ? isDarkMode : mode === 'dark';

  // State for dropdown menus
  const [openStrategy, setOpenStrategy] = useState(false);
  const strategyAnchorRef = useRef<HTMLButtonElement>(null);
  
  // Check authentication status on component mount and when route changes
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        // First check if API server is available
        const isAPIUp = await checkAPIServer();
        
        if (isMounted) {
          setApiAvailable(isAPIUp);
          
          // Only attempt authentication if API is up
          if (isAPIUp) {
            const isAuth = await checkUserAuth();
            setAuthStatus(isAuth);
          } else {
            // If API is down, assume not authenticated
            if (isMounted) {
              setAuthStatus(false);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setApiAvailable(false);
          setAuthStatus(false);
          setLoading(false);
        }
      }
    };
    
    // Initial check
    checkAuth();
    
    // Set up router event listeners to check auth status on route change
    const handleRouteChange = () => {
      // Only check auth if the component is still mounted
      if (isMounted) {
        checkAuth();
      }
    };
    
    Router.events.on('routeChangeComplete', handleRouteChange);
    
    // Check auth status regularly (every 5 minutes instead of every minute)
    const intervalId = setInterval(() => {
      if (isMounted) {
        checkAuth();
      }
    }, 5 * 60 * 1000); // Changed from 60 * 1000 to 5 * 60 * 1000
    
    return () => {
      isMounted = false;
      Router.events.off('routeChangeComplete', handleRouteChange);
      clearInterval(intervalId);
    };
  }, []);
  
  // Handle profile menu
  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logoutService();
    setAuthStatus(false);
  };

  const handleLoginClick = () => {
    // Store the current URL to redirect back after login
    if (typeof window !== 'undefined') {
      const currentPath = Router.pathname;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
    }
    Router.push('/login');
  };

  // Handle dropdown toggle for Strategy menu
  const handleStrategyToggle = () => {
    setOpenStrategy((prevOpen) => !prevOpen);
  };

  // Handle closing all dropdowns when clicking away
  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (
      strategyAnchorRef.current &&
      !strategyAnchorRef.current.contains(event.target as Node)
    ) {
      setOpenStrategy(false);
    }
  };

  // Close menu when using keyboard navigation
  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      setOpenStrategy(false);
    }
  };

  // Effect to close dropdowns on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setOpenStrategy(false);
    };
    
    Router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      Router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);
  
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: muiTheme.palette.mode === 'dark' 
          ? muiTheme.palette.background.paper
          : muiTheme.palette.primary.dark,
        boxShadow: 1,
        zIndex: muiTheme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/home"
          sx={{
            fontFamily: 'Arial, sans-serif',
            paddingLeft: '90px',
            paddingRight: '90px',
            fontSize: '1.5rem',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          सूत्रम्
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexGrow: 1,
          justifyContent: 'center'
        }}>
          {/* Home */}
          <Button 
            color="inherit" 
            component={Link} 
            href="/home"
            sx={{ fontSize: '1.1rem' }}
          >
            Home
          </Button>

          {/* Strategy with submenu */}
          <Button
            ref={strategyAnchorRef}
            color="inherit"
            aria-controls={openStrategy ? 'strategy-menu' : undefined}
            aria-expanded={openStrategy ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleStrategyToggle}
            sx={{ 
              fontSize: '1.1rem',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&::after': openStrategy ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '2px',
                backgroundColor: 'currentColor',
                transition: 'width 0.3s ease-in-out'
              } : {}
            }}
            endIcon={<KeyboardArrowDownIcon 
              sx={{ 
                transform: openStrategy ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s ease-in-out'
              }} 
            />}
          >
            Strategy
          </Button>
          <Popper
            open={openStrategy}
            anchorEl={strategyAnchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
            sx={{ zIndex: 10 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                }}
                timeout={{ enter: 350, exit: 250 }}
              >
                <Paper 
                  elevation={6}
                  sx={{
                    mt: 1,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    minWidth: '220px',
                    backgroundColor: muiTheme.palette.mode === 'dark' 
                      ? muiTheme.palette.background.paper
                      : muiTheme.palette.primary.dark,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    '& .MuiMenuItem-root': {
                      transition: 'background-color 0.2s ease-in-out',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: muiTheme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.08)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '4px',
                          height: '60%',
                          backgroundColor: muiTheme.palette.primary.main,
                          borderRadius: '0 4px 4px 0'
                        }
                      }
                    }
                  }}
                >
                  <ClickAwayListener onClickAway={handleClickAway}>
                    <MenuList
                      autoFocusItem={openStrategy}
                      id="strategy-menu"
                      aria-labelledby="strategy-button"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem 
                        component={Link} 
                        href="/strategy"
                        sx={{ 
                          fontSize: '1rem',
                          py: 1.2
                        }}
                      >
                        My Strategies
                      </MenuItem>
                      <MenuItem 
                        component={Link} 
                        href="/deployment"
                        sx={{ 
                          fontSize: '1rem',
                          py: 1.2
                        }}
                      >
                        Deployment
                      </MenuItem>
                      <MenuItem 
                        component={Link} 
                        href="/reports"
                        sx={{ 
                          fontSize: '1rem',
                          py: 1.2
                        }}
                      >
                        Reports
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>

          {/* Scanners as a direct link */}
          <Button 
            color="inherit" 
            component={Link} 
            href="/scanners"
            sx={{ fontSize: '1.1rem' }}
          >
            Scanners
          </Button>

          {/* Community */}
          <Button 
            color="inherit" 
            component={Link} 
            href="/community"
            sx={{ fontSize: '1.1rem' }}
          >
            Community
          </Button>

          {/* Marketplace */}
          <Button 
            color="inherit" 
            component={Link} 
            href="/marketplace"
            sx={{ fontSize: '1.1rem' }}
          >
            Marketplace
          </Button>

          {/* Maruti (Chat) */}
          <Button 
            color="inherit" 
            component={Link} 
            href="/chat"
            sx={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Avatar sx={{ width: 24, height: 24 }}>
              <Image 
                src="/assets/hanuman.jpg" 
                alt="Maruti" 
                width={24} 
                height={24} 
              />
            </Avatar>
            Maruti
          </Button>

          {/* Docs */}
          <Button 
            color="inherit" 
            component={Link} 
            href="/docs"
            sx={{ fontSize: '1.1rem' }}
          >
            Docs
          </Button>
        </Box>
        
        <Box sx={{ 
          paddingLeft: '72px',
          paddingRight: '72px', 
          display: 'flex',
          alignItems: 'center'
        }}>
          {!loading && (authStatus ? (
            <>
              <IconButton 
                size="large" 
                onClick={handleProfileMenu} 
                color="inherit"
                sx={{ fontSize: '1.75rem' }}
              >
                <AccountCircle />
              </IconButton>
              
              <Tooltip title={`Switch to ${currentMode ? 'light' : 'dark'} mode`}>
                <IconButton 
                  color="inherit" 
                  onClick={handleToggleTheme} 
                  sx={{ ml: 1 }}
                >
                  {currentMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem component={Link} href="/profile" onClick={handleProfileMenuClose}>Profile</MenuItem>
                <MenuItem component={Link} href="/support" onClick={handleProfileMenuClose}>Support</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </Box>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit"
              onClick={handleLoginClick}
              sx={{ fontSize: '1.1rem' }}
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
