import Link from 'next/link';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Box, Button, useTheme as useMuiTheme, Tooltip } from '@mui/material';
import { useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const muiTheme = useMuiTheme();
  const { mode, toggleMode } = useTheme();
  const { isLoggedIn } = useAuth();
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
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
          <Button 
            color="inherit" 
            component={Link} 
            href="/home"
            sx={{ fontSize: '1.1rem' }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            href="/strategy"
            sx={{ fontSize: '1.1rem' }}
          >
            Strategy
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            href="/reports"
            sx={{ fontSize: '1.1rem' }}
          >
            Reports
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            href="/community"
            sx={{ fontSize: '1.1rem' }}
          >
            Community
          </Button>
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
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton 
              color="inherit" 
              onClick={toggleMode} 
              sx={{ mr: 2 }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          {isLoggedIn ? (
            <>
              <IconButton 
                size="large" 
                onClick={handleMenu} 
                color="inherit"
                sx={{ fontSize: '1.75rem' }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} href="/profile" onClick={handleClose}>Profile</MenuItem>
                <MenuItem component={Link} href="/support" onClick={handleClose}>Support</MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit"
              onClick={handleLoginClick}
              sx={{ fontSize: '1.1rem' }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
