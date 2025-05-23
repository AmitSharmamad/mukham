import React from 'react';
import { Snackbar, Alert, AlertProps, Box, Typography, SxProps, Theme } from '@mui/material';
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
}

/**
 * Enhanced Toast component with larger size and better design
 */
const Toast: React.FC<ToastProps> = ({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 6000,
  sx,
  action,
  description,
  position = { vertical: 'top', horizontal: 'right' }
}) => {
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
      </Alert>
    </Snackbar>
  );
};

export default Toast;
