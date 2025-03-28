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
      position="static" 
      sx={{ 
        backgroundColor: theme.palette.mode === 'dark' 
          ? theme.palette.background.paper // Use paper color in dark mode
          : theme.palette.primary.dark, // Use primary dark in light mode
        boxShadow: 1
      }}
    >
      <Toolbar>
        {/* Left spacer */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Centered navigation items */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} href="/home">Home</Button>
          <Button color="inherit" component={Link} href="/strategy">Strategy</Button>
          <Button color="inherit" component={Link} href="/reports">Reports</Button>
          <Button color="inherit" component={Link} href="/docs">Docs</Button>
        </Box>
        
        {/* Right spacer and profile icon */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton size="large" onClick={handleMenu} color="inherit">
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
