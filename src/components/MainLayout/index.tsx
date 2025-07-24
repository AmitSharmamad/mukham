// filepath: /Users/amit/workspace/mukham/src/components/MainLayout/index.tsx
import { useEffect } from 'react';
import { Box, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { Footer } from '../Footer';
import Navbar from '../Navbar';
import { PWAInstallPrompt } from '../PWAInstallPrompt';
import { DeploymentSidebar } from '../DeploymentSidebar';
import { DeploymentEventHandler } from '../DeploymentEventHandler';
import { ThemeColor } from '../../theme';
import { useDeploymentContext } from '../../context/DeploymentContext';
import { useAuth } from '../../context/AuthContext';

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
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isLoggedIn, user } = useAuth(); // Get authentication status
  
  // Initialize WebSocket connection for real-time updates
  const { connect, disconnect, connectionStatus } = useDeploymentContext();

  // Connect to WebSocket when component mounts
  useEffect(() => {
    console.log('🚀 MainLayout: Connecting to WebSocket...');
    connect();
    
    return () => {
      console.log('🔌 MainLayout: Disconnecting WebSocket...');
      disconnect();
    };
  }, [connect, disconnect]);

  // Log connection status changes
  useEffect(() => {
    console.log(`🔗 MainLayout: WebSocket connection status: ${connectionStatus}`);
  }, [connectionStatus]);

  // Determine if we should show the sidebar based on route and authentication
  const shouldShowSidebar = false; // Hidden for all pages

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
    }}>
      {/* Use the updated Navbar component */}
      <Navbar 
        onToggleTheme={onToggleTheme}
        isDarkMode={isDarkMode}
      />
      
      <Box sx={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Deployment Sidebar */}
        {shouldShowSidebar && (
          <DeploymentSidebar
            open={true}
            onClose={() => {}}
            onToggle={() => {}}
            variant="persistent"
            anchor="left"
          />
        )}

        {/* Main Content with Scroll */}
        <Box
          sx={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            ml: shouldShowSidebar && !isMobile ? '80px' : 0,
            transition: theme.transitions.create('margin-left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Container 
              component="main" 
              maxWidth={false}
              sx={{ 
                py: 2, 
                mt: 8,
                px: { xs: 1, sm: 2, md: 3, lg: 4 }, // Custom horizontal padding - half of default Container margins
                maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: '1400px', xl: '1600px' }, // Wider than default 'lg' (1200px)
                mx: 'auto', // Center the container
                minHeight: 'calc(100vh - 64px - 200px)', // Ensure minimum height minus navbar and footer space
              }}
            >
              {children}
            </Container>
          </Box>
          
          {/* Footer - positioned at the end of content */}
          <Footer />
        </Box>
      </Box>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Deployment Event Handler for real-time notifications */}
      <DeploymentEventHandler />
    </Box>
  );
};

export default MainLayout;
