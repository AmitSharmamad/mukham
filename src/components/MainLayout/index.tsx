import { useState } from 'react';
import { AppBar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../Button';

interface MainLayoutProps {
  children: React.ReactNode;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Strategy', path: '/strategy' },
  { label: 'Reports', path: '/reports' },
  { label: 'Docs', path: '/docs' },
];

const profileMenuItems = [
  { label: 'Profile', path: '/profile' },
  { label: 'Support', path: '/support' },
];

export const MainLayout = ({ children, onToggleTheme, isDarkMode }: MainLayoutProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
            सुत्रम्
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
            <IconButton onClick={onToggleTheme} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

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
    </Box>
  );
};

export default MainLayout;