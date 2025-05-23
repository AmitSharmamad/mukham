import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, AlertProps, Box, Typography, SxProps, Theme, Grow, LinearProgress } from '@mui/material';
import { CheckCircle, Warning, Error, Info } from '@mui/icons-material';

export interface ToastProps {
  /**
   * Whether the toast is open
   */
  open: boolean;
  /**
   * The message to display in the toast
   */
  message: string;
  /**
   * The severity of the toast (affects color and icon)
   */
  severity?: AlertProps['severity'];
  /**
   * Function to call when the toast is closed
   */
  onClose: () => void;
  /**
   * Auto-hide duration in milliseconds
   */
  autoHideDuration?: number;
  /**
   * Additional styles for the toast
   */
  sx?: SxProps<Theme>;
  /**
   * Optional action component to display in the toast
   */
  action?: React.ReactNode;
  /**
   * Optional description to display below the main message
   */
  description?: string;
  /**
   * Position of the toast
   */
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /**
   * Whether to show the progress bar indicator
   */
  showProgress?: boolean;
}

/**
 * Enhanced Toast component with larger size and better design
 */
const Toast: React.FC<ToastProps> = ({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 5000, // Changed from 6000 to 5000 as per requirement
  sx,
  action,
  description,
  position = { vertical: 'top', horizontal: 'right' },
  showProgress = true
}) => {
  const [progress, setProgress] = useState(100);
  const [timeLeft, setTimeLeft] = useState(autoHideDuration);

  // Reset progress when toast opens or when duration changes
  useEffect(() => {
    if (open) {
      setTimeLeft(autoHideDuration);
      setProgress(100);
    }
  }, [open, autoHideDuration]);

  // Progress bar animation effect
  useEffect(() => {
    if (!open || !showProgress) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const newTimeLeft = prevTimeLeft - 100;
        const newProgress = (newTimeLeft / autoHideDuration) * 100;
        setProgress(newProgress);
        return newTimeLeft;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [open, showProgress, autoHideDuration]);

  // Get the appropriate icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircle fontSize="large" />;
      case 'warning':
        return <Warning fontSize="large" />;
      case 'error':
        return <Error fontSize="large" />;
      case 'info':
      default:
        return <Info fontSize="large" />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={position}
      sx={{ maxWidth: '420px', width: '100%' }}
      TransitionComponent={Grow}
      TransitionProps={{ 
        timeout: { enter: 400, exit: 300 },
        style: { transformOrigin: position.vertical === 'top' ? 'top' : 'bottom' }
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        icon={getIcon()}
        sx={{
          width: '100%',
          boxShadow: 4,
          padding: '12px 16px',
          fontSize: '1rem',
          borderRadius: '10px', // Adding slightly rounded corners
          position: 'relative',
          overflow: 'hidden',
          ...sx
        }}
        action={action}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '1rem' }}>
            {message}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ fontSize: '0.875rem', mt: 0.5, opacity: 0.9 }}>
              {description}
            </Typography>
          )}
        </Box>
        {showProgress && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
              '& .MuiLinearProgress-bar': {
                transition: 'transform 0.1s linear'
              }
            }}
          />
        )}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
