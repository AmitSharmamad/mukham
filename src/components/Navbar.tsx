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
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  Collapse
} from '@mui/material';
import { useState, useEffect } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import SupportIcon from '@mui/icons-material/Support';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { logout as logoutService, checkAPIServer } from '../services/authService';
import { PnLDisplay, LiveClock, TourButton } from './';

interface NavbarProps {
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

export default function Navbar({ onToggleTheme, isDarkMode }: NavbarProps = {}) {
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { mode, toggleMode, useSystemTheme, isUsingSystemTheme } = useTheme();
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

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setThemeMenuOpen(!themeMenuOpen);
    } else {
      setThemeAnchorEl(event.currentTarget);
    }
  };

  const handleThemeMenuClose = () => {
    setThemeAnchorEl(null);
    setThemeMenuOpen(false);
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const handleUseSystemTheme = () => {
    useSystemTheme();
    handleThemeMenuClose();
  };

  const handleToggleThemeManual = () => {
    toggleMode();
    handleThemeMenuClose();
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    handleMobileDrawerClose();
    await logoutService();
    setAuthStatus(false);
  };

  const handleLoginClick = () => {
    handleMobileDrawerClose();
    // Store the current URL to redirect back after login, default to /home
    if (typeof window !== 'undefined') {
      const currentPath = Router.pathname;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      } else {
        // If already on login page, set home as redirect
        sessionStorage.setItem('redirectAfterLogin', '/home');
      }
    }
    Router.push('/login');
  };

  const handleWaitlistClick = () => {
    handleMobileDrawerClose();
    Router.push('/waitlist');
  };

  const handleNavigate = (href: string) => {
    handleMobileDrawerClose();
    Router.push(href);
  };

  // Mobile Drawer Content
  const mobileDrawerContent = (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: `1px solid ${muiTheme.palette.divider}`
      }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '1.5rem',
            color: muiTheme.palette.text.primary
          }}
        >
          सूत्रम्
        </Typography>
        <IconButton onClick={handleMobileDrawerClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ pt: 1 }}>
        {/* Live Clock at top */}
        <ListItem sx={{ justifyContent: 'center', pb: 2 }}>
          <LiveClock color="#90EE90" fontSize="1.1rem" />
        </ListItem>

        {authStatus ? (
          <>
            {/* Authenticated Navigation */}
            <ListItemButton onClick={() => handleNavigate('/home')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigate('/strategy')}>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="Strategy" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigate('/deployment')}>
              <ListItemIcon>
                <RocketLaunchIcon />
              </ListItemIcon>
              <ListItemText primary="Deployment" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigate('/docs')}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Docs" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            {/* Profile Section */}
            <ListItemButton onClick={() => handleNavigate('/profile')}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigate('/support')}>
              <ListItemIcon>
                <SupportIcon />
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            {/* Theme Controls */}
            <ListItemButton onClick={handleThemeMenuOpen}>
              <ListItemIcon>
                {isUsingSystemTheme ? 
                  <SettingsSuggestIcon /> : 
                  (currentMode ? <Brightness7Icon /> : <Brightness4Icon />)
                }
              </ListItemIcon>
              <ListItemText primary="Theme" />
              {themeMenuOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={themeMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  onClick={() => {
                    useSystemTheme();
                    setThemeMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <SettingsSuggestIcon sx={{ color: isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use System Theme" 
                    sx={{ 
                      color: isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit',
                      fontWeight: isUsingSystemTheme ? 'bold' : 'normal'
                    }}
                  />
                </ListItemButton>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  onClick={() => {
                    toggleMode();
                    setThemeMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    {currentMode ? 
                      <Brightness7Icon sx={{ color: !isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit' }} /> : 
                      <Brightness4Icon sx={{ color: !isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit' }} />
                    }
                  </ListItemIcon>
                  <ListItemText 
                    primary={currentMode ? 'Switch to Light' : 'Switch to Dark'}
                    sx={{ 
                      color: !isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit',
                      fontWeight: !isUsingSystemTheme ? 'bold' : 'normal'
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>

            <Divider sx={{ my: 1 }} />

            {/* Logout */}
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </>
        ) : (
          <>
            {/* Non-authenticated Navigation */}
            {/* <ListItemButton onClick={() => handleNavigate('/strategy')}>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="Strategy" />
            </ListItemButton> */}

            <ListItemButton onClick={() => handleNavigate('/docs')}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Docs" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            {/* Theme Controls */}
            <ListItemButton onClick={handleThemeMenuOpen}>
              <ListItemIcon>
                {isUsingSystemTheme ? 
                  <SettingsSuggestIcon /> : 
                  (currentMode ? <Brightness7Icon /> : <Brightness4Icon />)
                }
              </ListItemIcon>
              <ListItemText primary="Theme" />
              {themeMenuOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={themeMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  onClick={() => {
                    useSystemTheme();
                    setThemeMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <SettingsSuggestIcon sx={{ color: isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use System Theme" 
                    sx={{ 
                      color: isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit',
                      fontWeight: isUsingSystemTheme ? 'bold' : 'normal'
                    }}
                  />
                </ListItemButton>
                <ListItemButton 
                  sx={{ pl: 4 }} 
                  onClick={() => {
                    toggleMode();
                    setThemeMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    {currentMode ? 
                      <Brightness7Icon sx={{ color: !isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit' }} /> : 
                      <Brightness4Icon sx={{ color: !isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit' }} />
                    }
                  </ListItemIcon>
                  <ListItemText 
                    primary={currentMode ? 'Switch to Light' : 'Switch to Dark'}
                    sx={{ 
                      color: !isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit',
                      fontWeight: !isUsingSystemTheme ? 'bold' : 'normal'
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>

            <Divider sx={{ my: 1 }} />

            {/* Waitlist Button */}
            <ListItem>
              <Button 
                variant="contained"
                fullWidth
                onClick={handleWaitlistClick}
                sx={{ 
                  py: 1,
                  borderRadius: '20px',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.9rem'
                }}
              >
                🚀 Join Waitlist 🚀
              </Button>
            </ListItem>

            {/* Login */}
            {/* <ListItemButton onClick={handleLoginClick}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton> */}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        role="navigation"
        sx={{ 
          backgroundColor: muiTheme.palette.mode === 'dark' 
            ? muiTheme.palette.background.paper
            : muiTheme.palette.primary.dark,
          boxShadow: 1,
          zIndex: muiTheme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ position: 'relative' }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              fontFamily: 'Arial, sans-serif',
              paddingLeft: isMobile ? 0 : '32px',
              paddingRight: '16px',
              fontSize: '1.5rem',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            सूत्रम्
          </Typography>
          
          {/* Spacer to push right content to the right */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Desktop Navigation - Centered */}
          {!isMobile && (
            <Box sx={{ 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center'
            }}>
              {/* Center - Navigation items for authenticated users */}
              {authStatus && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4,
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
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
              )}

              {/* Center - Strategy and Docs for non-authenticated users */}
              {!authStatus && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 4,
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {/* Strategy - Show for non-authenticated users */}
                  {/* <Button 
                    color="inherit" 
                    component={Link} 
                    href="/strategy"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    Strategy
                  </Button> */}

                  {/* Docs - Show for non-authenticated users */}
                  <Button 
                    color="inherit" 
                    component={Link} 
                    href="/docs"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    Docs
                  </Button>
                </Box>
              )}
            </Box>
          )}
          
          {/* Desktop Right Side */}
          <Box sx={{ 
            paddingLeft: '8px',
            paddingRight: '24px', 
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            {!loading && !isMobile && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Join Waitlist - only for non-authenticated users (leftmost) */}
                {!authStatus && (
                  <Button 
                    variant="contained"
                    size="medium"
                    component={Link}
                    href="/waitlist"
                    sx={{ 
                      py: 0.8,
                      px: 2.5,
                      borderRadius: '20px',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    🚀 Join Waitlist 🚀
                  </Button>
                )}
                
                {/* Live Clock - show for both authenticated and non-authenticated users */}
                <LiveClock color="#90EE90" fontSize="1.1rem" />
                
                {/* Tour button - show for both authenticated and non-authenticated users */}
                {/* <TourButton 
                  variant="icon" 
                  tooltip="Take a guided tour" 
                  size="large"
                  color="inherit"
                /> */}
                
                {/* Theme button - show for both authenticated and non-authenticated users */}
                <Tooltip title={isUsingSystemTheme ? `System theme (${mode})` : `${mode} mode`}>
                  <IconButton 
                    size="large"
                    color="inherit" 
                    onClick={handleThemeMenuOpen} 
                    sx={{ 
                      fontSize: '1.75rem',
                      width: 48,
                      height: 48
                    }}
                    data-testid="theme-toggle"
                  >
                    {isUsingSystemTheme ? 
                      <SettingsSuggestIcon sx={{ fontSize: '1.75rem' }} /> : 
                      (currentMode ? 
                        <Brightness7Icon sx={{ fontSize: '1.75rem' }} /> : 
                        <Brightness4Icon sx={{ fontSize: '1.75rem' }} />
                      )
                    }
                  </IconButton>
                </Tooltip>

                {authStatus ? (
                  <>
                    {/* Profile icon for authenticated users (rightmost) */}
                    <IconButton 
                      size="large" 
                      onClick={handleProfileMenu} 
                      color="inherit"
                      sx={{ 
                        fontSize: '1.75rem',
                        width: 48,
                        height: 48
                      }}
                      data-testid="user-menu"
                    >
                      <AccountCircle sx={{ fontSize: '1.75rem' }} />
                    </IconButton>
                    
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
                  <>
                    {/* Login button for non-authenticated users (rightmost) */}
                    {/* <Button 
                      color="inherit"
                      onClick={handleLoginClick}
                      sx={{ fontSize: '1.1rem' }}
                      startIcon={<LoginIcon />}
                    >
                      Login
                    </Button> */}
                  </>
                )}
              </Box>
            )}
            
            {/* Theme menu for desktop non-authenticated users */}
            {!isMobile && (
              <Menu
                anchorEl={themeAnchorEl}
                open={Boolean(themeAnchorEl)}
                onClose={handleThemeMenuClose}
              >
                <MenuItem 
                  onClick={handleUseSystemTheme}
                  sx={{ 
                    fontWeight: isUsingSystemTheme ? 'bold' : 'normal',
                    color: isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit'
                  }}
                >
                  <SettingsSuggestIcon sx={{ mr: 1 }} />
                  Use System Theme
                </MenuItem>
                <MenuItem 
                  onClick={handleToggleThemeManual}
                  sx={{ 
                    fontWeight: !isUsingSystemTheme ? 'bold' : 'normal',
                    color: !isUsingSystemTheme ? muiTheme.palette.primary.main : 'inherit'
                  }}
                >
                  {currentMode ? <Brightness7Icon sx={{ mr: 1 }} /> : <Brightness4Icon sx={{ mr: 1 }} />}
                  {currentMode ? 'Switch to Light' : 'Switch to Dark'}
                </MenuItem>
              </Menu>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={handleMobileDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              backgroundColor: muiTheme.palette.background.paper,
            },
          }}
        >
          {mobileDrawerContent}
        </Drawer>
      )}
    </>
  );
}
