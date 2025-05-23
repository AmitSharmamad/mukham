import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select as MuiSelect, 
  MenuItem, 
  TextField, 
  SelectChangeEvent,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Divider 
} from '@mui/material';
import { AlertProps } from '@mui/material';
import { useToastContext } from '../context/ToastContext';
import { Toast } from '../components';

export default function ToastDemo() {
  const { showToast } = useToastContext();
  
  // Local state for demo toasts
  const [demoToast, setDemoToast] = useState({
    open: false,
    message: 'This is a demo toast message',
    severity: 'success' as AlertProps['severity'],
    description: 'This is an optional description for the toast message'
  });
  
  // Form state for creating custom toasts
  const [toastConfig, setToastConfig] = useState({
    message: 'Custom toast message',
    description: 'Custom description (optional)',
    severity: 'info' as AlertProps['severity']
  });

  const handleSeverityChange = (event: SelectChangeEvent) => {
    setToastConfig({
      ...toastConfig,
      severity: event.target.value as AlertProps['severity']
    });
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToastConfig({
      ...toastConfig,
      message: event.target.value
    });
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToastConfig({
      ...toastConfig,
      description: event.target.value
    });
  };

  const handleShowDemoToast = () => {
    setDemoToast({
      ...demoToast,
      open: true
    });
  };

  const handleCloseDemoToast = () => {
    setDemoToast({
      ...demoToast,
      open: false
    });
  };

  const handleShowSuccessToast = () => {
    showToast('Operation completed successfully!', 'success', 'Your changes have been saved.');
  };

  const handleShowErrorToast = () => {
    showToast('An error occurred', 'error', 'Please try again later or contact support.');
  };

  const handleShowWarningToast = () => {
    showToast('Warning: Low disk space', 'warning', 'Your storage is almost full. Consider freeing up some space.');
  };

  const handleShowInfoToast = () => {
    showToast('New update available', 'info', 'Version 2.0 is now available for download.');
  };

  const handleShowCustomToast = () => {
    showToast(
      toastConfig.message, 
      toastConfig.severity, 
      toastConfig.description || undefined
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Toast Message Demo
      </Typography>
      <Typography variant="body1" paragraph>
        This page demonstrates the enhanced toast notification system with larger and more user-friendly messages.
        Toasts now feature smooth entry/exit animations and a progress bar indicating the time remaining before automatic dismissal.
      </Typography>

      <Grid container spacing={4}>
        {/* Predefined Toasts */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Predefined Toast Types" />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={handleShowSuccessToast}
                  fullWidth
                >
                  Show Success Toast
                </Button>
                
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={handleShowErrorToast}
                  fullWidth
                >
                  Show Error Toast
                </Button>
                
                <Button 
                  variant="contained" 
                  color="warning" 
                  onClick={handleShowWarningToast}
                  fullWidth
                >
                  Show Warning Toast
                </Button>
                
                <Button 
                  variant="contained" 
                  color="info" 
                  onClick={handleShowInfoToast}
                  fullWidth
                >
                  Show Info Toast
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Custom Toast Configuration */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Custom Toast Configuration" />
            <Divider />
            <CardContent>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <TextField 
                    label="Message"
                    value={toastConfig.message}
                    onChange={handleMessageChange}
                    variant="outlined"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField 
                    label="Description (optional)"
                    value={toastConfig.description}
                    onChange={handleDescriptionChange}
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="severity-select-label">Severity</InputLabel>
                  <MuiSelect
                    labelId="severity-select-label"
                    value={toastConfig.severity}
                    label="Severity"
                    onChange={handleSeverityChange}
                  >
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                  </MuiSelect>
                </FormControl>

                <Button 
                  variant="contained" 
                  onClick={handleShowCustomToast}
                >
                  Show Custom Toast
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Local Toast Demo */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title="Local Component Toast (without Context)" />
            <Divider />
            <CardContent>
              <Typography variant="body2" paragraph>
                This demonstrates how to use the Toast component directly in a component without the context.
                Note the smooth entrance animation and progress bar at the bottom indicating time remaining.
              </Typography>
              
              <Button 
                variant="contained" 
                onClick={handleShowDemoToast}
              >
                Show Local Toast
              </Button>

              <Toast
                open={demoToast.open}
                message={demoToast.message}
                severity={demoToast.severity}
                description={demoToast.description}
                onClose={handleCloseDemoToast}
                autoHideDuration={5000}
                position={{ vertical: 'bottom', horizontal: 'left' }}
                showProgress={true}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Code Example */}
      <Paper sx={{ mt: 4, p: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          How to use the Toast system
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
{`// Option 1: Using the ToastContext (recommended)
import { useToastContext } from '../context/ToastContext';

function MyComponent() {
  const { showToast, showSuccess, showError, showWarning, showInfo } = useToastContext();
  
  // Basic usage
  showToast('Your message here', 'success');
  
  // With description
  showToast('Message with details', 'info', 'This is additional information');
  
  // Helper methods
  showSuccess('Operation completed successfully!');
  showError('An error occurred');
  showWarning('Proceed with caution');
  showInfo('Just FYI');
  
  return <div>Your component</div>;
}

// Option 2: Directly using the Toast component
import { Toast } from '../components';

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  
  return (
    <>
      <button onClick={handleOpen}>Show Toast</button>
      <Toast
        open={open}
        message="Your message here"
        severity="success"
        description="Optional description"
        onClose={handleClose}
        autoHideDuration={5000}
        showProgress={true}
      />
    </>
  );
}`}
        </Typography>
      </Paper>
    </Box>
  );
}
