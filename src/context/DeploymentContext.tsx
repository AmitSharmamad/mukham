import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

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

export interface DeploymentMetrics {
  pnl: number;
  unrealizedPnl: number;
  openPositions: number;
  totalTrades: number;
  winTrades: number;
  lossTrades: number;
  lastUpdateTime: string;
  status: 'active' | 'inactive' | 'error';
}

export interface DeploymentRealTimeData {
  [deploymentId: string]: DeploymentMetrics;
}

interface DeploymentContextType {
  // WebSocket connection
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  connect: () => void;
  disconnect: () => void;
  
  // Events and metrics
  events: DeploymentEvent[];
  deploymentMetrics: DeploymentRealTimeData;
  
  // Utility functions
  getDeploymentMetrics: (deploymentId: string) => DeploymentMetrics | null;
  getEventsByDeployment: (deploymentId: string) => DeploymentEvent[];
  getRecentEventCount: (deploymentId: string, minutes?: number) => number;
  hasRecentActivity: (deploymentId: string, minutes?: number) => boolean;
  hasRecentErrors: (deploymentId: string, minutes?: number) => boolean;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

interface DeploymentProviderProps {
  children: ReactNode;
}

export const DeploymentProvider: React.FC<DeploymentProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<DeploymentEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [deploymentMetrics, setDeploymentMetrics] = useState<DeploymentRealTimeData>({});
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  const updateDeploymentMetrics = useCallback((event: DeploymentEvent) => {
    const { deployment_id, event_type, data, timestamp } = event;
    console.log(`📈 DeploymentContext: Updating metrics for deployment ${deployment_id}, event: ${event_type}`, data);
    
    setDeploymentMetrics(prev => {
      const currentMetrics = prev[deployment_id] || {
        pnl: 0,
        unrealizedPnl: 0,
        openPositions: 0,
        totalTrades: 0,
        winTrades: 0,
        lossTrades: 0,
        lastUpdateTime: timestamp,
        status: 'active' as const
      };

      let updatedMetrics = { ...currentMetrics };

      // Update metrics based on event type - use data from event payload, never reset to defaults
      switch (event_type) {
        case 'position_opened':
          updatedMetrics.openPositions = data.open_positions !== undefined ? data.open_positions : currentMetrics.openPositions;
          updatedMetrics.totalTrades = data.total_trades !== undefined ? data.total_trades : currentMetrics.totalTrades;
          break;
          
        case 'position_closed':
          updatedMetrics.openPositions = data.open_positions !== undefined ? data.open_positions : currentMetrics.openPositions;
          updatedMetrics.pnl = data.realized_pnl !== undefined ? data.realized_pnl : currentMetrics.pnl;
          updatedMetrics.totalTrades = data.total_trades !== undefined ? data.total_trades : currentMetrics.totalTrades;
          updatedMetrics.winTrades = data.win_trades !== undefined ? data.win_trades : currentMetrics.winTrades;
          updatedMetrics.lossTrades = data.loss_trades !== undefined ? data.loss_trades : currentMetrics.lossTrades;
          break;
          
        case 'position_update':
          updatedMetrics.unrealizedPnl = data.unrealized_pnl !== undefined ? data.unrealized_pnl : currentMetrics.unrealizedPnl;
          updatedMetrics.openPositions = data.open_positions !== undefined ? data.open_positions : currentMetrics.openPositions;
          break;
          
        case 'stop_loss_triggered':
        case 'target_profit_triggered':
        case 'eod_square_off':
          updatedMetrics.pnl = data.realized_pnl !== undefined ? data.realized_pnl : currentMetrics.pnl;
          updatedMetrics.openPositions = data.open_positions !== undefined ? data.open_positions : currentMetrics.openPositions;
          updatedMetrics.totalTrades = data.total_trades !== undefined ? data.total_trades : currentMetrics.totalTrades;
          updatedMetrics.winTrades = data.win_trades !== undefined ? data.win_trades : currentMetrics.winTrades;
          updatedMetrics.lossTrades = data.loss_trades !== undefined ? data.loss_trades : currentMetrics.lossTrades;
          break;
          
        case 'deployment_error':
          updatedMetrics.status = 'error';
          break;
          
        case 'deployment_started':
          updatedMetrics.status = 'active';
          break;
          
        case 'deployment_stopped':
          updatedMetrics.status = 'inactive';
          break;
      }

      // Always update timestamp
      updatedMetrics.lastUpdateTime = timestamp;

      console.log(`✅ DeploymentContext: Updated metrics for deployment ${deployment_id}:`, updatedMetrics);

      return {
        ...prev,
        [deployment_id]: updatedMetrics
      };
    });
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('🔗 DeploymentContext: WebSocket already connected');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log('🔗 DeploymentContext: WebSocket already connecting');
      return;
    }

    setConnectionStatus('connecting');
    console.log('🔌 DeploymentContext: Attempting to connect to WebSocket...');
    
    try {
      const wsUrl = 'ws://localhost:9099/ws/api/deployment/events/ws';
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('✅ DeploymentContext: WebSocket connected successfully');
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📡 DeploymentContext: Received WebSocket message:', data);
          
          if (data.event_type && data.deployment_id) {
            const deploymentEvent: DeploymentEvent = {
              event_type: data.event_type,
              deployment_id: data.deployment_id,
              strategy_id: data.strategy_id || '',
              instrument_id: data.instrument_id || 0,
              timestamp: data.timestamp || new Date().toISOString(),
              data: data.data || {},
              metadata: data.metadata || {}
            };

            // Add event to events array (keep last 1000 events)
            setEvents(prev => {
              const newEvents = [deploymentEvent, ...prev].slice(0, 1000);
              console.log(`📊 DeploymentContext: Added event ${deploymentEvent.event_type} for deployment ${deploymentEvent.deployment_id}, total events: ${newEvents.length}`);
              return newEvents;
            });

            // Update deployment metrics based on event data
            updateDeploymentMetrics(deploymentEvent);
          } else {
            console.warn('⚠️ DeploymentContext: Received message without required fields:', data);
          }
        } catch (error) {
          console.error('❌ DeploymentContext: Error parsing WebSocket message:', error, 'Raw data:', event.data);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('❌ DeploymentContext: WebSocket disconnected', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect if it wasn't a clean close and backend might be available
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
          console.log(`🔄 DeploymentContext: Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.log('❌ DeploymentContext: Max reconnect attempts reached. Backend server may not be available.');
          setConnectionStatus('error');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ DeploymentContext: WebSocket error:', error);
        console.log('💡 DeploymentContext: Make sure the backend server is running on port 9099');
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('❌ DeploymentContext: Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [updateDeploymentMetrics]);

  const disconnect = useCallback(() => {
    console.log('🔌 DeploymentContext: Disconnecting WebSocket...');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Intentional disconnect');
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    reconnectAttemptsRef.current = 0;
  }, []);

  // Utility functions
  const getDeploymentMetrics = useCallback((deploymentId: string): DeploymentMetrics | null => {
    return deploymentMetrics[deploymentId] || null;
  }, [deploymentMetrics]);

  const getEventsByDeployment = useCallback((deploymentId: string): DeploymentEvent[] => {
    return events.filter(event => event.deployment_id === deploymentId);
  }, [events]);

  const getRecentEventCount = useCallback((deploymentId: string, minutes: number = 5): number => {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return events.filter(event => 
      event.deployment_id === deploymentId && 
      new Date(event.timestamp) > cutoffTime
    ).length;
  }, [events]);

  const hasRecentActivity = useCallback((deploymentId: string, minutes: number = 1): boolean => {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return events.some(event => 
      event.deployment_id === deploymentId && 
      new Date(event.timestamp) > cutoffTime
    );
  }, [events]);

  const hasRecentErrors = useCallback((deploymentId: string, minutes: number = 5): boolean => {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return events.some(event => 
      event.deployment_id === deploymentId && 
      event.event_type === 'deployment_error' &&
      new Date(event.timestamp) > cutoffTime
    );
  }, [events]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value: DeploymentContextType = {
    connectionStatus,
    connect,
    disconnect,
    events,
    deploymentMetrics,
    getDeploymentMetrics,
    getEventsByDeployment,
    getRecentEventCount,
    hasRecentActivity,
    hasRecentErrors
  };

  return (
    <DeploymentContext.Provider value={value}>
      {children}
    </DeploymentContext.Provider>
  );
};

export const useDeploymentContext = (): DeploymentContextType => {
  const context = useContext(DeploymentContext);
  if (!context) {
    throw new Error('useDeploymentContext must be used within a DeploymentProvider');
  }
  return context;
};
