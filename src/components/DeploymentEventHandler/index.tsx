import { useEffect } from 'react';
import { useToastContext } from '../../context/ToastContext';

// This component is now deprecated - replaced by GlobalEventHandler
// Keeping for backward compatibility but no longer functional
export const DeploymentEventHandler = () => {
  console.warn('DeploymentEventHandler is deprecated. Please use GlobalEventHandler instead.');
  
  // This component no longer does anything - events are handled by GlobalEventHandler
  return null;
};
