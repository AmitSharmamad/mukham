import { useState } from 'react';
import { AppBar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AccountCircle, Brightness4, Brightness7, Palette } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../Button';
import { Footer } from '../Footer';
import { ThemeColor, themes } from '../../theme';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Strategy', path: '/strategy' },
  { label: 'Scanners', path: '/scanners' },
  { label: 'Community', path: '/community' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'Docs', path: '/docs' }
];

const profileMenuItems = [
  { label: 'Profile', path: '/profile' },
  { label: 'Support', path: '/support' }
];

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    router.push(path);
    handleClose();
  };

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.background.paper
            : theme.palette.primary.dark,
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          {/* Brand text on the left */}
          <Typography          variant="h6"
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
          
          {/* Centered navigation items */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexGrow: 1,
            justifyContent: 'center'
          }}>
            {!isMobile && navItems.map((item) => (
              <Button 
                key={item.path}
                color="inherit" 
                href={item.path}
                sx={{ fontSize: '1.1rem' }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Toggle light/dark mode">
              <IconButton onClick={onToggleTheme} color="inherit">
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Change theme color">
              <IconButton
                onClick={handleThemeMenuOpen}
                color="inherit"
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

            {/* Profile icon with increased spacing */}
            <Box sx={{ 
              paddingLeft: '72px',
              paddingRight: '72px'
            }}>
              <IconButton 
                size="large" 
                onClick={handleMenu} 
                color="inherit"
                sx={{ fontSize: '1.75rem' }}
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {profileMenuItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => handleMenuItemClick(item.path)}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flex: 1, py: 4, mt: 8 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;