import { Deployment } from '../services/deploymentService';
import { DeploymentMetrics } from '../context/DeploymentContext';

export const getDeploymentStatus = (
  deployment: Deployment, 
  realtimeMetrics?: DeploymentMetrics,
  hasRecentErrors?: boolean
): 'active' | 'inactive' | 'error' => {
  if (hasRecentErrors) return 'error';
  if (!deployment.isActive) return 'inactive';
  if (realtimeMetrics && realtimeMetrics.status === 'error') return 'error';
  return 'active';
};

export const formatPnL = (
  deployment: Deployment,
  realtimeMetrics?: DeploymentMetrics
): number | null => {
  if (realtimeMetrics) {
    return realtimeMetrics.pnl + realtimeMetrics.unrealizedPnl;
  }
  return deployment.metrics?.total_pnl || null;
};

export const getPnLColor = (
  pnl: number | null,
  hasError: boolean,
  theme: any
): string => {
  if (hasError) {
    return theme.palette.error.main;
  }
  if (pnl === null || pnl === undefined) {
    return theme.palette.text.secondary;
  }
  return pnl >= 0 ? theme.palette.success.main : theme.palette.error.main;
};

export const formatPnLText = (pnl: number | null): string => {
  if (pnl === null || pnl === undefined) {
    return 'N/A';
  }
  return pnl >= 0 ? `+₹${pnl.toFixed(2)}` : `₹${pnl.toFixed(2)}`;
};

/**
 * Formats a date string for display without transforming it
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  
  try {
    // Extract date and time parts directly from the ISO string
    const date = dateString.split('T')[0]; // YYYY-MM-DD
    const timePart = dateString.split('T')[1];
    
    if (!timePart) {
      return date; // Return just the date if no time part
    }
    
    const time = timePart.split('.')[0]; // HH:MM:SS (remove milliseconds if present)
    const timeOnly = time.substring(0, 5); // HH:MM (remove seconds)
    
    // Format as DD/MM/YYYY HH:MM
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} ${timeOnly}`;
  } catch (error) {
    console.warn('Error formatting date:', dateString, error);
    return dateString; // Return original string if formatting fails
  }
};

/**
 * Formats a date string for display showing only date part
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDateOnly = (dateString: string): string => {
  if (!dateString) return '-';
  
  try {
    const date = dateString.split('T')[0]; // YYYY-MM-DD
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn('Error formatting date:', dateString, error);
    return dateString;
  }
};

/**
 * Formats a date string for display showing only time part
 * @param dateString ISO date string
 * @returns Formatted time string
 */
export const formatTimeOnly = (dateString: string): string => {
  if (!dateString) return '-';
  
  try {
    const timePart = dateString.split('T')[1];
    if (!timePart) return '-';
    
    const time = timePart.split('.')[0]; // HH:MM:SS (remove milliseconds if present)
    return time.substring(0, 5); // HH:MM (remove seconds)
  } catch (error) {
    console.warn('Error formatting time:', dateString, error);
    return dateString;
  }
};
