import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { AlertProps } from '@mui/material';
import { Toast } from '../components';

type ToastContextType = {
  isOpen: boolean;
  message: string;
  severity: AlertProps['severity'];
  description?: string;
  showSuccess: (message: string, description?: string) => void;
  showError: (message: string, description?: string) => void;
  showWarning: (message: string, description?: string) => void;
  showInfo: (message: string, description?: string) => void;
  showToast: (message: string, severity: AlertProps['severity'], description?: string) => void;
  closeToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <ToastContext.Provider
      value={{
        isOpen,
        message,
        severity,
        description,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showToast,
        closeToast,
      }}
    >
      {children}
      <Toast
        open={isOpen}
        message={message}
        severity={severity}
        description={description}
        onClose={closeToast}
        autoHideDuration={5000}
        position={{ vertical: 'top', horizontal: 'right' }}
        showProgress={true}
      />
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
