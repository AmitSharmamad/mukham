import { useEffect } from 'react';
import { useWebSocketContext } from '../../context/WebSocketContext';
import { useGlobalAlerts } from '../../hooks/useGlobalAlerts';
import { useToastContext } from '../../context/ToastContext';
import { WebEvent } from '../../types/websocket';

export const GlobalEventHandler = () => {
  const { subscribe, unsubscribe, isConnected } = useWebSocketContext();
  const { markAsRead } = useGlobalAlerts();
  const toast = useToastContext();

  useEffect(() => {
    // Only set up event handlers if we have a WebSocket connection available
    if (!isConnected) {
      console.log('GlobalEventHandler: WebSocket not connected, skipping event setup');
      return;
    }

    // Handle global alert notifications with toast messages
    const handleAlertNotification = (event: WebEvent) => {
      const { data } = event;
      
      switch (data.severity) {
        case 'critical':
          toast.showError(data.title, data.message);
          break;
        case 'warning':
          toast.showWarning(data.title, data.message);
          break;
        case 'info':
          toast.showInfo(data.title, data.message);
          break;
      }
    };

    // Handle specific trading events with custom toast messages
    const handleTradingEvents = (event: WebEvent) => {
      const { event_type, data } = event;

      switch (event_type) {
        case 'deployment_detail.position_opened':
          toast.showSuccess(
            'Position Opened',
            `${data.direction} ${data.quantity} @ ₹${data.entry_price}`
          );
          break;

        case 'deployment_detail.position_closed':
          const pnlText = data.pnl >= 0 ? `+₹${data.pnl}` : `-₹${Math.abs(data.pnl)}`;
          if (data.pnl >= 0) {
            toast.showSuccess(
              'Position Closed - Profit',
              pnlText
            );
          } else {
            toast.showError(
              'Position Closed - Loss',
              pnlText
            );
          }
          break;

        case 'deployment_detail.signal_detected':
          if (data.signal_type === 'entry') {
            toast.showInfo(
              'Entry Signal Detected',
              `${data.reason} (Confidence: ${(data.confidence * 100).toFixed(0)}%)`
            );
          }
          break;
      }
    };

    // Subscribe to global events
    subscribe('alerts.new_notification', handleAlertNotification);
    subscribe('deployment_detail.position_opened', handleTradingEvents);
    subscribe('deployment_detail.position_closed', handleTradingEvents);
    subscribe('deployment_detail.signal_detected', handleTradingEvents);

    return () => {
      unsubscribe('alerts.new_notification', handleAlertNotification);
      unsubscribe('deployment_detail.position_opened', handleTradingEvents);
      unsubscribe('deployment_detail.position_closed', handleTradingEvents);
      unsubscribe('deployment_detail.signal_detected', handleTradingEvents);
    };
  }, [subscribe, unsubscribe, isConnected, toast]);

  // This component doesn't render anything - it just handles events
  return null;
};
