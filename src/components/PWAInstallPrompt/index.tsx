import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Snackbar, 
  Alert, 
  Typography,
  Slide,
  useTheme
} from '@mui/material';
import { Download, Close } from '@mui/icons-material';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // The deferredPrompt can only be used once, nullify it
    setDeferredPrompt(null);
    setShowPrompt(false);
    
    // Optionally, send analytics event with outcome details
    console.log(`User ${outcome} the PWA installation`);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <Snackbar
      open={showPrompt}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Slide}
    >
      <Alert 
        severity="info"
        icon={<Download />}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="primary" 
              size="small" 
              variant="contained" 
              onClick={handleInstallClick}
              sx={{ mr: 1 }}
            >
              Install
            </Button>
            <Button 
              size="small" 
              onClick={handleClose}
              color="inherit"
            >
              <Close fontSize="small" />
            </Button>
          </Box>
        }
        sx={{ 
          width: '100%', 
          maxWidth: 500,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2">
          Install Mukham for a better experience
        </Typography>
      </Alert>
    </Snackbar>
  );
}