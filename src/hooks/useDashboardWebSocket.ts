import { useEffect, useState, useCallback } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';
import { DashboardSummaryData, DashboardActivityData, DashboardAlertsData, WebEvent } from '../types/websocket';

export interface DashboardData {
  summary: DashboardSummaryData | null;
  activities: DashboardActivityData[];
  alerts: DashboardAlertsData | null;
  lastUpdated: string | null;
}

export const useDashboardWebSocket = () => {
  const { subscribe, unsubscribe, updatePageContext, connectionStatus, isConnected } = useWebSocketContext();
  
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    summary: null,
    activities: [],
    alerts: null,
    lastUpdated: null
  });

  // Set page context to dashboard when hook is used
  useEffect(() => {
    // Only update page context if we have a WebSocket connection available
    if (updatePageContext) {
      updatePageContext({
        page_type: 'dashboard',
        page_params: {}
      });
    }
  }, [updatePageContext]);

  // Event handlers
  const handleSummaryUpdate = useCallback((event: WebEvent) => {
    const data = event.data as DashboardSummaryData;
    setDashboardData(prev => ({
      ...prev,
      summary: data,
      lastUpdated: event.timestamp
    }));
  }, []);

  const handleRecentActivity = useCallback((event: WebEvent) => {
    const data = event.data as DashboardActivityData;
    setDashboardData(prev => ({
      ...prev,
      activities: [data, ...prev.activities.slice(0, 9)], // Keep last 10 activities
      lastUpdated: event.timestamp
    }));
  }, []);

  const handleAlertsUpdate = useCallback((event: WebEvent) => {
    const data = event.data as DashboardAlertsData;
    setDashboardData(prev => ({
      ...prev,
      alerts: data,
      lastUpdated: event.timestamp
    }));
  }, []);

  // Subscribe to dashboard events
  useEffect(() => {
    // Only subscribe if we have WebSocket functionality available
    if (!subscribe || !unsubscribe) return;
    
    subscribe('dashboard.summary_updated', handleSummaryUpdate);
    subscribe('dashboard.recent_activity', handleRecentActivity);
    subscribe('dashboard.alerts_updated', handleAlertsUpdate);

    return () => {
      unsubscribe('dashboard.summary_updated', handleSummaryUpdate);
      unsubscribe('dashboard.recent_activity', handleRecentActivity);
      unsubscribe('dashboard.alerts_updated', handleAlertsUpdate);
    };
  }, [subscribe, unsubscribe, handleSummaryUpdate, handleRecentActivity, handleAlertsUpdate]);

  const clearActivities = useCallback(() => {
    setDashboardData(prev => ({
      ...prev,
      activities: []
    }));
  }, []);

  return {
    ...dashboardData,
    clearActivities,
    connectionStatus,
    isConnected
  };
};
