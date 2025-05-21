import { useState, useCallback } from 'react';
import { AlertProps } from '@mui/material';

interface UseToastReturn {
  /**
   * Whether the toast is currently visible
   */
  isOpen: boolean;
  /**
   * Toast message
   */
  message: string;
  /**
   * Toast severity (affects color and icon)
   */
  severity: AlertProps['severity'];
  /**
   * Optional description to show below the main message
   */
  description?: string;
  /**
   * Show a success toast with the given message
   */
  showSuccess: (message: string, description?: string) => void;
  /**
   * Show an error toast with the given message
   */
  showError: (message: string, description?: string) => void;
  /**
   * Show a warning toast with the given message
   */
  showWarning: (message: string, description?: string) => void;
  /**
   * Show an info toast with the given message
   */
  showInfo: (message: string, description?: string) => void;
  /**
   * Show a toast with custom severity and message
   */
  showToast: (message: string, severity?: AlertProps['severity'], description?: string) => void;
  /**
   * Close the currently visible toast
   */
  closeToast: () => void;
}

/**
 * A hook to manage toast notifications throughout the application
 */
export const useToast = (): UseToastReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertProps['severity']>('info');
  const [description, setDescription] = useState<string | undefined>(undefined);

  const closeToast = useCallback(() => {
    setIsOpen(false);
  }, []);

  const showToast = useCallback((message: string, severity: AlertProps['severity'] = 'info', description?: string) => {
    setMessage(message);
    setSeverity(severity);
    setDescription(description);
    setIsOpen(true);
  }, []);

  const showSuccess = useCallback((message: string, description?: string) => {
    showToast(message, 'success', description);
  }, [showToast]);

  const showError = useCallback((message: string, description?: string) => {
    showToast(message, 'error', description);
  }, [showToast]);

  const showWarning = useCallback((message: string, description?: string) => {
    showToast(message, 'warning', description);
  }, [showToast]);

  const showInfo = useCallback((message: string, description?: string) => {
    showToast(message, 'info', description);
  }, [showToast]);

  return {
    isOpen,
    message,
    severity,
    description,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToast,
    closeToast
  };
};
