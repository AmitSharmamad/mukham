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
  Avatar
} from '@mui/material';
import { useState, useEffect } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logout as logoutService, checkAPIServer } from '../services/authService';
import { PnLDisplay, LiveClock } from './';

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

  // Removed strategy dropdown state
  
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
            paddingRight: '20px',
            fontSize: '1.5rem',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          सूत्रम्
        </Typography>
        
        {/* Live Clock */}
        <LiveClock color="green" fontSize="1.1rem" />
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexGrow: 1,
          justifyContent: 'center',
          paddingLeft: '70px'
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

          {/* Strategy */}
          <Button 
            color="inherit" 
            component={Link} 
            href="/strategy"
            sx={{ fontSize: '1.1rem' }}
          >
            Strategy
          </Button>

          {/* Deployment */}
          <Button 
            color="inherit" 
            component={Link} 
            href="/deployment"
            sx={{ fontSize: '1.1rem' }}
          >
            Deployment
          </Button>

          {/* Scanners as a direct link */}
          {/* <Button 
            color="inherit" 
            component={Link} 
            href="/scanners"
            sx={{ fontSize: '1.1rem' }}
          >
            Scanners
          </Button> */}

          {/* Community */}
          {/* <Button 
            color="inherit" 
            component={Link} 
            href="/community"
            sx={{ fontSize: '1.1rem' }}
          >
            Community
          </Button> */}

          {/* Marketplace */}
          {/* <Button 
            color="inherit" 
            component={Link} 
            href="/marketplace"
            sx={{ fontSize: '1.1rem' }}
          >
            Marketplace
          </Button> */}

          {/* Maruti (Chat) */}
          {/* <Button 
            color="inherit" 
            component={Link} 
            href="/chat"
            sx={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Avatar sx={{ width: 24, height: 24 }}>
              <Image 
                src="/hanuman.jpg" 
                alt="Maruti" 
                width={24} 
                height={24} 
              />
            </Avatar>
            Maruti
          </Button> */}

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
              {/* Options - Coming Soon Banner */}
              {/* <Typography
                variant="body2"
                sx={{
                  opacity: 0.8,
                  fontWeight: 'bold',
                  fontStyle: 'normal',
                  mr: 4,
                  ml: -3,
                  fontSize: '0.95rem',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  color: 'green'
                }}
              >
                Coming Soon - Options
              </Typography> */}
              
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
