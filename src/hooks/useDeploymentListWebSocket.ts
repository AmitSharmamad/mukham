import { useEffect, useState, useCallback } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';
import { DeploymentListItemData, WebEvent } from '../types/websocket';

export interface DeploymentListData {
  deployments: Map<string, DeploymentListItemData>;
  lastUpdated: string | null;
}

export const useDeploymentListWebSocket = () => {
  const { subscribe, unsubscribe, updatePageContext, connectionStatus, isConnected } = useWebSocketContext();
  
  const [deploymentListData, setDeploymentListData] = useState<DeploymentListData>({
    deployments: new Map(),
    lastUpdated: null
  });

  // Set page context to deployment_list when hook is used
  useEffect(() => {
    if (updatePageContext) {
      updatePageContext({
        page_type: 'deployment_list',
        page_params: {}
      });
    }
  }, [updatePageContext]);

  // Event handlers
  const handleDeploymentItemUpdate = useCallback((event: WebEvent) => {
    const data = event.data as DeploymentListItemData;
    setDeploymentListData(prev => {
      const newDeployments = new Map(prev.deployments);
      newDeployments.set(data.deployment_id, data);
      
      return {
        deployments: newDeployments,
        lastUpdated: event.timestamp
      };
    });
  }, []);

  // Subscribe to deployment list events
  useEffect(() => {
    if (!subscribe || !unsubscribe) return;
    
    subscribe('deployment_list.item_updated', handleDeploymentItemUpdate);

    return () => {
      unsubscribe('deployment_list.item_updated', handleDeploymentItemUpdate);
    };
  }, [subscribe, unsubscribe, handleDeploymentItemUpdate]);

  const getDeploymentData = useCallback((deploymentId: string): DeploymentListItemData | null => {
    return deploymentListData.deployments.get(deploymentId) || null;
  }, [deploymentListData.deployments]);

  const getAllDeployments = useCallback((): DeploymentListItemData[] => {
    return Array.from(deploymentListData.deployments.values());
  }, [deploymentListData.deployments]);

  const getActiveDeployments = useCallback((): DeploymentListItemData[] => {
    return Array.from(deploymentListData.deployments.values()).filter(
      deployment => deployment.status === 'active'
    );
  }, [deploymentListData.deployments]);

  const clearDeployments = useCallback(() => {
    setDeploymentListData({
      deployments: new Map(),
      lastUpdated: null
    });
  }, []);

  return {
    deployments: deploymentListData.deployments,
    lastUpdated: deploymentListData.lastUpdated,
    getDeploymentData,
    getAllDeployments,
    getActiveDeployments,
    clearDeployments,
    connectionStatus,
    isConnected
  };
};
