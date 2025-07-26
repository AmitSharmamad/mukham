import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SutramWebSocket } from '../services/WebSocketService';
import { PageContext, ConnectionStatus, WebEvent } from '../types/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  events: WebEvent[];
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (eventType: string, handler: (event: WebEvent) => void) => void;
  unsubscribe: (eventType: string, handler: (event: WebEvent) => void) => void;
  updatePageContext: (pageContext: PageContext) => void;
  clearEvents: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  token: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children, token }) => {
  const [ws, setWs] = useState<SutramWebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [events, setEvents] = useState<WebEvent[]>([]);

  useEffect(() => {
    // Only initialize WebSocket if we have a valid token
    if (!token) {
      setConnectionStatus('disconnected');
      return;
    }

    // Initialize WebSocket with default page context
    const webSocket = new SutramWebSocket(
      { page_type: 'dashboard', page_params: {} },
      token,
      { debug: true }
    );

    webSocket.onStatusChange(setConnectionStatus);

    // Global event handler to track all events
    const globalHandler = (event: WebEvent) => {
      setEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
    };

    webSocket.on('*', globalHandler);
    setWs(webSocket);

    // Auto-connect when provider mounts
    webSocket.connect().catch(error => {
      console.error('Failed to connect WebSocket:', error);
    });

    return () => {
      webSocket.disconnect();
    };
  }, [token]);

  const connect = async () => {
    if (ws && token) {
      try {
        await ws.connect();
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    }
  };

  const disconnect = () => {
    if (ws) {
      ws.disconnect();
    }
  };

  const subscribe = (eventType: string, handler: (event: WebEvent) => void) => {
    if (ws) {
      ws.on(eventType, handler);
    }
  };

  const unsubscribe = (eventType: string, handler: (event: WebEvent) => void) => {
    if (ws) {
      ws.off(eventType, handler);
    }
  };

  const updatePageContext = (pageContext: PageContext) => {
    if (ws) {
      ws.updatePageContext(pageContext);
    }
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const value: WebSocketContextType = {
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    events,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    updatePageContext,
    clearEvents
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
