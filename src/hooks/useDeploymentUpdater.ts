import { useCallback, useState, useMemo } from 'react';
import { Deployment } from '../services/deploymentService';
import { DeploymentEvent, DeploymentEventMetrics } from './useDeploymentEvents';

export interface DeploymentUpdate {
  deploymentId: string;
  updates: Partial<Deployment>;
  eventType: string;
  timestamp: string;
}

export const useDeploymentUpdater = () => {
  const [deploymentUpdates, setDeploymentUpdates] = useState<Map<string, DeploymentUpdate>>(new Map());

  const updateDeploymentFromEvent = useCallback((event: DeploymentEvent, realtimeMetrics: DeploymentEventMetrics) => {
    const { event_type, deployment_id, timestamp } = event;
    
    // Get real-time metrics for this deployment
    const metrics = realtimeMetrics[deployment_id];
    
    if (!metrics) return;

    // Create updates based on real-time metrics
    const updates: Partial<Deployment> = {
      lastUpdatedAt: timestamp,
      // Update metrics based on real-time data
      metrics: {
        id: `${deployment_id}_realtime`,
        deployment_id,
        metric_date: new Date().toISOString().split('T')[0],
        total_trades: metrics.totalTrades,
        win_trades: metrics.winTrades || Math.max(0, Math.floor(metrics.totalTrades * 0.6)), // Use real-time data or estimate
        loss_trades: metrics.lossTrades || Math.max(0, Math.ceil(metrics.totalTrades * 0.4)), // Use real-time data or estimate
        total_pnl: metrics.pnl + (metrics.unrealizedPnl || 0),
        max_drawdown: 0, // Would need historical data
        win_rate: metrics.totalTrades > 0 ? (Math.floor(metrics.totalTrades * 0.6) / metrics.totalTrades) * 100 : 0,
        avg_win: 0, // Would need detailed trade data
        avg_loss: 0, // Would need detailed trade data
        metadata: {
          avg_win: 0,
          avg_loss: 0,
          win_rate: metrics.totalTrades > 0 ? (Math.floor(metrics.totalTrades * 0.6) / metrics.totalTrades) * 100 : 0,
          avg_win_size: 0,
          max_drawdown: 0,
          sharpe_ratio: 0,
          total_trades: metrics.totalTrades,
          avg_loss_size: 0,
          profit_factor: 0,
          total_commission: 0,
          total_return_pct: 0,
        },
        created_at: timestamp,
        updated_at: timestamp,
      }
    };

    // Update status based on deployment events
    if (event_type === 'deployment_error') {
      updates.isActive = false;
    } else if (['position_opened', 'position_closed', 'position_update'].includes(event_type)) {
      updates.isActive = true;
      // Update position status based on open positions
      if (metrics.openPositions > 0) {
        updates.status = 'entered';
      } else {
        updates.status = 'waiting';
      }
    }

    setDeploymentUpdates(prev => new Map(prev.set(deployment_id, {
      deploymentId: deployment_id,
      updates,
      eventType: event_type,
      timestamp
    })));
  }, []);

  const applyUpdatesToDeployments = useCallback((deployments: Deployment[], realtimeMetrics: DeploymentEventMetrics): Deployment[] => {
    console.log('applyUpdatesToDeployments called with:', {
      deploymentsCount: deployments.length,
      realtimeMetricsCount: Object.keys(realtimeMetrics).length,
      realtimeMetricsKeys: Object.keys(realtimeMetrics),
      updatesCount: deploymentUpdates.size
    });
    
    return deployments.map(deployment => {
      const update = deploymentUpdates.get(deployment.id);
      const metrics = realtimeMetrics[deployment.id];
      
      if (update || metrics) {
        const updatedDeployment = { ...deployment };
        
        console.log(`Updating deployment ${deployment.id}:`, {
          hasUpdate: !!update,
          hasMetrics: !!metrics,
          currentPnl: deployment.metrics?.total_pnl,
          metricsData: metrics
        });
        
        // Apply stored updates
        if (update) {
          Object.assign(updatedDeployment, update.updates);
        }
        
        // Apply real-time metrics
        if (metrics && updatedDeployment.metrics) {
          const newTotalPnl = metrics.pnl + (metrics.unrealizedPnl || 0);
          console.log(`Updating P&L for ${deployment.id}: ${updatedDeployment.metrics.total_pnl} -> ${newTotalPnl}`);
          
          updatedDeployment.metrics = {
            ...updatedDeployment.metrics,
            total_pnl: newTotalPnl,
            total_trades: metrics.totalTrades,
            // Use real-time win/loss trades data when available
            win_trades: metrics.winTrades || Math.floor(metrics.totalTrades * 0.6),
            loss_trades: metrics.lossTrades || Math.ceil(metrics.totalTrades * 0.4),
            updated_at: metrics.lastUpdateTime,
          };
          
          // Update status based on open positions
          if (metrics.openPositions > 0) {
            updatedDeployment.status = 'entered';
          } else if (metrics.totalTrades > 0) {
            updatedDeployment.status = 'waiting';
          }
          
          // Update last updated time
          updatedDeployment.lastUpdatedAt = metrics.lastUpdateTime;
        }
        
        return updatedDeployment;
      }
      
      return deployment;
    });
  }, [deploymentUpdates]);

  const clearDeploymentUpdate = useCallback((deploymentId: string) => {
    setDeploymentUpdates(prev => {
      const newMap = new Map(prev);
      newMap.delete(deploymentId);
      return newMap;
    });
  }, []);

  const clearAllUpdates = useCallback(() => {
    setDeploymentUpdates(new Map());
  }, []);

  const hasUpdates = deploymentUpdates.size > 0;
  
  const getUpdatedDeploymentIds = useCallback(() => Array.from(deploymentUpdates.keys()), [deploymentUpdates]);

  return {
    updateDeploymentFromEvent,
    applyUpdatesToDeployments,
    clearDeploymentUpdate,
    clearAllUpdates,
    hasUpdates,
    getUpdatedDeploymentIds,
    deploymentUpdates
  };
};
