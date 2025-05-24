import { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Step,
  StepLabel,
  Stepper,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { 
  GetApp, 
  Smartphone, 
  Computer, 
  Share, 
  Add,
  MoreVert,
  Home
} from '@mui/icons-material';

interface PWAInstallInstructionsProps {
  open: boolean;
  onClose: () => void;
}

export function PWAInstallInstructions({ open, onClose }: PWAInstallInstructionsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  const getInstructions = () => {
    switch (selectedPlatform) {
      case 'ios':
        return {
          title: 'Install on iOS (Safari)',
          steps: [
            'Open Mukham in Safari browser',
            'Tap the Share button at the bottom',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to confirm installation'
          ],
          icons: [<Share key="share" />, <Add key="add" />, <Home key="home" />]
        };
      case 'android':
        return {
          title: 'Install on Android (Chrome)',
          steps: [
            'Open Mukham in Chrome browser',
            'Tap the menu button (three dots)',
            'Select "Add to Home screen"',
            'Tap "Add" to confirm installation'
          ],
          icons: [<MoreVert key="menu" />, <Add key="add" />, <Home key="home" />]
        };
      case 'desktop':
        return {
          title: 'Install on Desktop',
          steps: [
            'Open Mukham in Chrome, Edge, or Firefox',
            'Click the install icon in the address bar',
            'Or click the menu and select "Install Mukham"',
            'Click "Install" to confirm'
          ],
          icons: [<GetApp key="install" />, <Computer key="desktop" />]
        };
      default:
        return { title: '', steps: [], icons: [] };
    }
  };

  const instructions = getInstructions();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GetApp color="primary" />
          Install Mukham App
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" paragraph>
          Install Mukham as an app for a better trading experience with offline access and faster loading.
        </Typography>

        {/* Platform Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select your platform:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<Computer />}
              label="Desktop"
              clickable
              color={selectedPlatform === 'desktop' ? 'primary' : 'default'}
              onClick={() => setSelectedPlatform('desktop')}
            />
            <Chip
              icon={<Smartphone />}
              label="iOS (Safari)"
              clickable
              color={selectedPlatform === 'ios' ? 'primary' : 'default'}
              onClick={() => setSelectedPlatform('ios')}
            />
            <Chip
              icon={<Smartphone />}
              label="Android (Chrome)"
              clickable
              color={selectedPlatform === 'android' ? 'primary' : 'default'}
              onClick={() => setSelectedPlatform('android')}
            />
          </Box>
        </Box>

        {/* Instructions */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {instructions.title}
          </Typography>
          
          <Stepper orientation="vertical" sx={{ mt: 2 }}>
            {instructions.steps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>
                  <Typography variant="body2">
                    {step}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            backgroundColor: theme.palette.action.hover,
            borderRadius: 1 
          }}
        >
          <Typography variant="caption" color="text.secondary">
            <strong>Benefits:</strong> Faster loading, offline access, push notifications, 
            and a native app-like experience for better trading performance.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
