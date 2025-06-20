import { useState, useEffect, useCallback, useRef } from 'react';

// Event types from the WebSocket API
export interface DeploymentEvent {
  event_type: string;
  deployment_id: string;
  strategy_id: string;
  instrument_id: number;
  timestamp: string;
  data: any;
  metadata: {
    user_id: string;
    strategy_name: string;
    instrument_symbol: string;
    market_price: number;
  };
}

export interface DeploymentEventMetrics {
  [deploymentId: string]: {
    pnl: number;
    unrealizedPnl: number;
    openPositions: number;
    totalTrades: number;
    winTrades: number;
    lossTrades: number;
    lastUpdateTime: string;
    status: 'active' | 'inactive' | 'error';
  };
}

export const useDeploymentEvents = () => {
  const [events, setEvents] = useState<DeploymentEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [deploymentMetrics, setDeploymentMetrics] = useState<DeploymentEventMetrics>({});
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      const wsUrl = 'ws://localhost:9099/ws/api/deployment/events/ws';
      const websocket = new WebSocket(wsUrl);
      
      websocket.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        console.log('Connected to deployment events WebSocket');
      };
      
      websocket.onmessage = (event) => {
        try {
          const deploymentEvent: DeploymentEvent = JSON.parse(event.data);
          console.log('Received deployment event:', deploymentEvent);
          
          // Batch the updates to ensure they happen together
          setDeploymentMetrics(prev => {
            const updated = updateMetricsFromEvent(prev, deploymentEvent);
            
            // After metrics are updated, update events
            setEvents(prevEvents => [deploymentEvent, ...prevEvents.slice(0, 99)]);
            
            return updated;
          });
          
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      websocket.onclose = (event) => {
        setConnectionStatus('disconnected');
        console.log('WebSocket connection closed:', event.code, event.reason);
        
        // Attempt reconnection if not manually closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };
      
      websocket.onerror = (error) => {
        setConnectionStatus('error');
        console.error('WebSocket error:', error);
      };
      
      wsRef.current = websocket;
      
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('error');
      scheduleReconnect();
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    reconnectAttemptsRef.current++;
    const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);
    
    console.log(`Scheduling reconnection attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [connect]);

  const updateMetricsFromEvent = useCallback((currentMetrics: DeploymentEventMetrics, event: DeploymentEvent): DeploymentEventMetrics => {
    const { event_type, deployment_id, data } = event;
    
    console.log('Updating deployment metrics for event:', {
      event_type,
      deployment_id,
      data
    });
    
    const current = currentMetrics[deployment_id] || {
      pnl: 0,
      unrealizedPnl: 0,
      openPositions: 0,
      totalTrades: 0,
      winTrades: 0,
      lossTrades: 0,
      lastUpdateTime: event.timestamp,
      status: 'active' as const
    };

    let updated = { ...current, lastUpdateTime: event.timestamp };

    switch (event_type) {
      case 'position_opened':
        updated.openPositions++;
        updated.totalTrades++;
        break;
        
      case 'position_closed':
        updated.openPositions = Math.max(0, updated.openPositions - 1);
        if (data.pnl !== undefined) {
          updated.pnl += data.pnl;
          // Track win/loss trades based on PnL
          if (data.pnl > 0) {
            updated.winTrades++;
          } else if (data.pnl < 0) {
            updated.lossTrades++;
          }
        }
        break;
        
      case 'position_update':
        if (data.unrealized_pnl !== undefined) {
          updated.unrealizedPnl = data.unrealized_pnl;
        }
        break;
        
      case 'stop_loss_triggered':
      case 'target_profit_triggered':
      case 'eod_square_off':
        updated.openPositions = Math.max(0, updated.openPositions - 1);
        if (data.pnl !== undefined) {
          updated.pnl += data.pnl;
          // Track win/loss trades based on PnL
          if (data.pnl > 0) {
            updated.winTrades++;
          } else if (data.pnl < 0) {
            updated.lossTrades++;
          }
        }
        break;
        
      case 'deployment_error':
        updated.status = 'error';
        break;
        
      case 'entry_window_closed':
        // Don't change status, just log the event
        break;
        
      case 'evaluation_started':
      case 'entry_signal_detected':
      case 'exit_signal_detected':
      case 'no_signal':
      case 'trailing_stop_updated':
        // These events don't directly affect metrics but indicate activity
        updated.status = 'active';
        break;
        
      default:
        // Handle other event types as needed
        console.log('Unhandled event type:', event_type);
        break;
    }

    const newMetrics = {
      ...currentMetrics,
      [deployment_id]: updated
    };
    
    console.log('Updated deployment metrics:', {
      deployment_id,
      updated,
      totalMetrics: Object.keys(newMetrics).length
    });
    
    return newMetrics;
  }, []);

  const updateDeploymentMetrics = useCallback((event: DeploymentEvent) => {
    setDeploymentMetrics(prev => updateMetricsFromEvent(prev, event));
  }, [updateMetricsFromEvent]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    reconnectAttemptsRef.current = 0;
  }, []);

  const getDeploymentMetrics = useCallback((deploymentId: string) => {
    return deploymentMetrics[deploymentId] || null;
  }, [deploymentMetrics]);

  const getEventsByType = useCallback((eventType: string) => {
    return events.filter(event => event.event_type === eventType);
  }, [events]);

  const getEventsByDeployment = useCallback((deploymentId: string) => {
    return events.filter(event => event.deployment_id === deploymentId);
  }, [events]);

  // Auto-connect on mount, but allow manual control
  useEffect(() => {
    // Don't auto-connect immediately, let the component control when to connect
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    events,
    connectionStatus,
    deploymentMetrics,
    connect,
    disconnect,
    getDeploymentMetrics,
    getEventsByType,
    getEventsByDeployment
  };
};
