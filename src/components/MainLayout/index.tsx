// filepath: /Users/amit/workspace/mukham/src/components/MainLayout/index.tsx
import { useState, useEffect } from 'react';
import { Box, Container, IconButton, useMediaQuery, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Footer } from '../Footer';
import Navbar from '../Navbar';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { DeploymentSidebar } from '../DeploymentSidebar';
import { DeploymentEventHandler } from '../DeploymentEventHandler';
import { ThemeColor } from '../../theme';

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
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed to true to keep it open by default
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Effect to handle initial sidebar state based on screen size
  useEffect(() => {
    // Keep sidebar open by default on all screen sizes
    setSidebarOpen(true);
  }, [isMobile]);

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
            onToggle={handleSidebarToggle}
            variant={isMobile ? 'temporary' : 'persistent'}
            anchor="left"
          />
        )}

        {/* Floating Burger Menu - positioned just outside the left nav */}
        {shouldShowSidebar && (
          <Box
            sx={{
              position: 'fixed',
              top: 76,
              left: sidebarOpen && !isMobile ? 352 : 16, // Position just outside the sidebar (340px + 12px margin)
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
            ml: shouldShowSidebar && sidebarOpen && !isMobile ? '85px' : 'auto',
            mr: shouldShowSidebar && sidebarOpen && !isMobile ? '85px' : 'auto',
            transition: theme.transitions.create(['margin-left', 'margin-right'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            width: shouldShowSidebar && sidebarOpen && !isMobile ? 'calc(100% - 170px)' : '100%', // Adjust width when sidebar is open
          }}
        >
          {children}
        </Container>
      </Box>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Deployment Event Handler for real-time notifications */}
      <DeploymentEventHandler />
    </Box>
  );
};

export default MainLayout;
