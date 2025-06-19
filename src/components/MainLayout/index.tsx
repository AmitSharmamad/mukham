// filepath: /Users/amit/workspace/mukham/src/components/MainLayout/index.tsx
import { useState } from 'react';
import { Box, Container, IconButton, Menu, MenuItem, useMediaQuery, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Palette, Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Footer } from '../Footer';
import Navbar from '../Navbar';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { DeploymentSidebar } from '../DeploymentSidebar';
import { DeploymentEventHandler } from '../DeploymentEventHandler';
import { ThemeColor, themes } from '../../theme';

interface MainLayoutProps {
  children: React.ReactNode;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onChangeThemeColor: (color: ThemeColor) => void;
  currentTheme: ThemeColor;
}

export const MainLayout = ({ 
  children, 
  onToggleTheme, 
  isDarkMode,
  onChangeThemeColor,
  currentTheme 
}: MainLayoutProps) => {
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeAnchorEl(null);
  };

  const handleThemeSelect = (theme: ThemeColor) => {
    onChangeThemeColor(theme);
    handleThemeMenuClose();
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Determine if we should show the sidebar based on route
  const shouldShowSidebar = !router.pathname.startsWith('/docs') && 
                           !router.pathname.startsWith('/chat') &&
                           !router.pathname.startsWith('/login') &&
                           !router.pathname.startsWith('/user/login');

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      overflow: 'hidden',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      {/* Use the updated Navbar component */}
      <Navbar 
        onToggleTheme={onToggleTheme}
        isDarkMode={isDarkMode}
      />
      
      <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Deployment Sidebar */}
        {shouldShowSidebar && (
          <DeploymentSidebar
            open={sidebarOpen}
            onClose={handleSidebarClose}
            variant={isMobile ? 'temporary' : 'persistent'}
            anchor="left"
          />
        )}

        {/* Burger Menu Button */}
        {shouldShowSidebar && (
          <Box
            sx={{
              position: 'fixed',
              top: 76,
              left: sidebarOpen && !isMobile ? 332 : 16, // Adjust position based on sidebar state
              zIndex: theme.zIndex.drawer + 2,
              transition: theme.transitions.create('left', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
            <Tooltip title={sidebarOpen ? "Hide Deployments" : "Show Active Deployments"}>
              <IconButton
                onClick={handleSidebarToggle}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[3],
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Main Content */}
        <Container 
          component="main" 
          maxWidth="lg"
          sx={{ 
            flex: 1, 
            py: 4, 
            mt: 8, 
            ml: shouldShowSidebar && sidebarOpen && !isMobile ? '320px' : 'auto',
            mr: shouldShowSidebar && sidebarOpen && !isMobile ? 0 : 'auto',
            transition: theme.transitions.create(['margin-left', 'margin-right'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Container>
      </Box>
      
      {/* Theme menu */}
      <Box 
        sx={{ 
          position: 'fixed', 
          top: '64px', 
          right: '20px', 
          zIndex: theme.zIndex.drawer + 1 
        }}
      >
        <Tooltip title="Change theme color">
          <IconButton
            onClick={handleThemeMenuOpen}
            color="inherit"
            sx={{ 
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[3],
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <Palette />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={themeAnchorEl}
          open={Boolean(themeAnchorEl)}
          onClose={handleThemeMenuClose}
        >
          {themes.map((theme) => (
            <MenuItem
              key={theme}
              onClick={() => handleThemeSelect(theme)}
              selected={theme === currentTheme}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Deployment Event Handler for real-time notifications */}
      <DeploymentEventHandler />
    </Box>
  );
};

export default MainLayout;
