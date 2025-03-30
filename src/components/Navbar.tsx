import Link from 'next/link';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Box, Button, useTheme } from '@mui/material';
import { useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
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
          सूत्रम्
        </Typography>
        
        {/* Centered navigation items */}
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
            href="/docs"
            sx={{ fontSize: '1.1rem' }}
          >
            Docs
          </Button>
        </Box>
        
        {/* Profile icon with further increased spacing */}
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
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={Link} href="/profile" onClick={handleClose}>Profile</MenuItem>
          <MenuItem component={Link} href="/support" onClick={handleClose}>Support</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
