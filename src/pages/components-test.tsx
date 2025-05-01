import React from 'react';
import { Grid, Typography, Box, useTheme as useMuiTheme, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Paper, Button, TextField, Card, Select } from '../components';
import { useTheme } from '../context/ThemeContext';

const ComponentsTest = () => {
  const muiTheme = useMuiTheme();
  const { mode, toggleMode } = useTheme();
  
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Component Test Page
        </Typography>
        <IconButton onClick={toggleMode} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Typography variant="body1" paragraph>
        This page demonstrates the Paper component with proper styling in <strong>{mode}</strong> mode.
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Paper Component (Default)</Typography>
            <Typography variant="body2" paragraph>
              This is the default Paper component with our custom styling.
            </Typography>
            <Button variant="contained">Button Inside Paper</Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Paper Component (Elevation 3)</Typography>
            <Typography variant="body2" paragraph>
              This Paper has an elevation of 3 to show shadow differences.
            </Typography>
            <Button variant="outlined">Button Inside Paper</Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper>
            <Typography variant="h6" gutterBottom>Form Elements</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Text Input" fullWidth />
              <Select 
                label="Select Input"
                options={[
                  { value: '1', label: 'Option 1' },
                  { value: '2', label: 'Option 2' },
                  { value: '3', label: 'Option 3' }
                ]}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button variant="contained">Save</Button>
                <Button variant="outlined">Cancel</Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={0}>
            <Typography variant="h6" gutterBottom>Paper with Elevation 0</Typography>
            <Typography variant="body2" paragraph>
              This Paper has elevation set to 0, which means no shadow but still with our styling.
            </Typography>
            <Card sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2">Card Inside Paper</Typography>
              <Typography variant="body2">
                Demonstrating card component inside a paper.
              </Typography>
            </Card>
            <Button variant="text">Text Button</Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper noPadding sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <Typography variant="h6">Paper with Custom Header</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" paragraph>
                This paper uses noPadding prop to allow for a custom header with different background.
              </Typography>
              <Button variant="contained">Action Button</Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper noPadding sx={{ p: 0 }}>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'secondary.light', color: 'secondary.contrastText', borderRadius: '12px 12px 0 0' }}>
              <Typography variant="h5">Custom Content Area</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" paragraph>
                With noPadding, you can create custom layouts within the Paper component.
              </Typography>
              <Button variant="outlined">Learn More</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComponentsTest;
