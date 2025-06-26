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
