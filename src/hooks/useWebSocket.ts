import { useEffect, useRef, useState, useCallback } from 'react';
import { SutramWebSocket } from '../services/WebSocketService';
import { WebEvent, PageContext, ConnectionStatus, WebSocketConfig } from '../types/websocket';

export interface UseWebSocketReturn {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  events: WebEvent[];
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (eventType: string, handler: (event: WebEvent) => void) => void;
  unsubscribe: (eventType: string, handler: (event: WebEvent) => void) => void;
  updateContext: (newPageContext: PageContext) => void;
  clearEvents: () => void;
}

export function useWebSocket(
  pageContext: PageContext,
  token: string,
  config: WebSocketConfig = {}
): UseWebSocketReturn {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [events, setEvents] = useState<WebEvent[]>([]);
  const wsRef = useRef<SutramWebSocket | null>(null);
  const handlersRef = useRef<Map<string, (event: WebEvent) => void>>(new Map());

  const initializeWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }

    wsRef.current = new SutramWebSocket(pageContext, token, {
      debug: true,
      ...config
    });

    wsRef.current.onStatusChange(setConnectionStatus);

    // Global event handler to track all events
    const globalHandler = (event: WebEvent) => {
      setEvents(prev => {
        // Keep last 100 events
        const newEvents = [event, ...prev.slice(0, 99)];
        return newEvents;
      });
    };

    wsRef.current.on('*', globalHandler);
    handlersRef.current.set('*', globalHandler);

  }, [pageContext, token, config]);

  useEffect(() => {
    initializeWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, [initializeWebSocket]);

  const connect = useCallback(async () => {
    if (wsRef.current) {
      try {
        await wsRef.current.connect();
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
  }, []);

  const subscribe = useCallback((eventType: string, handler: (event: WebEvent) => void) => {
    if (wsRef.current) {
      wsRef.current.on(eventType, handler);
      handlersRef.current.set(`${eventType}-${handler.toString()}`, handler);
    }
  }, []);

  const unsubscribe = useCallback((eventType: string, handler: (event: WebEvent) => void) => {
    if (wsRef.current) {
      wsRef.current.off(eventType, handler);
      handlersRef.current.delete(`${eventType}-${handler.toString()}`);
    }
  }, []);

  const updateContext = useCallback((newPageContext: PageContext) => {
    if (wsRef.current) {
      wsRef.current.updatePageContext(newPageContext);
    }
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    events,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    updateContext,
    clearEvents
  };
}