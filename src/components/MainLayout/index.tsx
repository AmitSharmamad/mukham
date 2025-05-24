// filepath: /Users/amit/workspace/mukham/src/components/MainLayout/index.tsx
import { useState } from 'react';
import { Box, Container, IconButton, Menu, MenuItem, useMediaQuery, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Palette } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Footer } from '../Footer';
import { AIChat } from '../AIChat';
import Navbar from '../Navbar';
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
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

      <Container component="main" sx={{ 
        flex: 1, 
        py: 4, 
        mt: 8, 
        overflow: 'auto', 
        maxHeight: 'calc(100vh - 64px)', // Adjusted height to remove footer spacing
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {children}
      </Container>
      <AIChat />
    </Box>
  );
};

export default MainLayout;
