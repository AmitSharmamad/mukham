import { useEffect, useState, useCallback } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';
import { AlertNotificationData, WebEvent } from '../types/websocket';

export interface GlobalAlertsData {
  alerts: AlertNotificationData[];
  unreadCount: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
}

export const useGlobalAlerts = () => {
  const { subscribe, unsubscribe } = useWebSocketContext();
  
  const [alertsData, setAlertsData] = useState<GlobalAlertsData>({
    alerts: [],
    unreadCount: 0,
    criticalCount: 0,
    warningCount: 0,
    infoCount: 0
  });

  const [readAlerts, setReadAlerts] = useState<Set<string>>(new Set());

  // Event handlers
  const handleAlertNotification = useCallback((event: WebEvent) => {
    const data = event.data as AlertNotificationData;
    
    setAlertsData(prev => {
      const newAlerts = [data, ...prev.alerts.slice(0, 99)]; // Keep last 100 alerts
      
      // Calculate counts
      const criticalCount = newAlerts.filter(alert => alert.severity === 'critical').length;
      const warningCount = newAlerts.filter(alert => alert.severity === 'warning').length;
      const infoCount = newAlerts.filter(alert => alert.severity === 'info').length;
      
      // Count unread alerts
      const unreadCount = newAlerts.filter(alert => !readAlerts.has(alert.alert_id)).length;
      
      return {
        alerts: newAlerts,
        unreadCount,
        criticalCount,
        warningCount,
        infoCount
      };
    });
  }, [readAlerts]);

  // Subscribe to global alert events
  useEffect(() => {
    if (!subscribe || !unsubscribe) return;
    
    subscribe('alerts.new_notification', handleAlertNotification);

    return () => {
      unsubscribe('alerts.new_notification', handleAlertNotification);
    };
  }, [subscribe, unsubscribe, handleAlertNotification]);

  const markAsRead = useCallback((alertId: string) => {
    setReadAlerts(prev => {
      const newSet = new Set(prev);
      newSet.add(alertId);
      return newSet;
    });
    
    setAlertsData(prev => ({
      ...prev,
      unreadCount: Math.max(0, prev.unreadCount - 1)
    }));
  }, []);

  const markAllAsRead = useCallback(() => {
    const allAlertIds = alertsData.alerts.map(alert => alert.alert_id);
    setReadAlerts(new Set(allAlertIds));
    
    setAlertsData(prev => ({
      ...prev,
      unreadCount: 0
    }));
  }, [alertsData.alerts]);

  const clearAlerts = useCallback(() => {
    setAlertsData({
      alerts: [],
      unreadCount: 0,
      criticalCount: 0,
      warningCount: 0,
      infoCount: 0
    });
    setReadAlerts(new Set());
  }, []);

  const getAlertsBySeverity = useCallback((severity: 'critical' | 'warning' | 'info'): AlertNotificationData[] => {
    return alertsData.alerts.filter(alert => alert.severity === severity);
  }, [alertsData.alerts]);

  const getUnreadAlerts = useCallback((): AlertNotificationData[] => {
    return alertsData.alerts.filter(alert => !readAlerts.has(alert.alert_id));
  }, [alertsData.alerts, readAlerts]);

  const getCriticalAlerts = useCallback((): AlertNotificationData[] => {
    return getAlertsBySeverity('critical');
  }, [getAlertsBySeverity]);

  const hasUnreadCriticalAlerts = useCallback((): boolean => {
    return getCriticalAlerts().some(alert => !readAlerts.has(alert.alert_id));
  }, [getCriticalAlerts, readAlerts]);

  return {
    ...alertsData,
    markAsRead,
    markAllAsRead,
    clearAlerts,
    getAlertsBySeverity,
    getUnreadAlerts,
    getCriticalAlerts,
    hasUnreadCriticalAlerts,
    isRead: (alertId: string) => readAlerts.has(alertId)
  };
};
