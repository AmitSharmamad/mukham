import { WebEvent, PageContext, ConnectionStatus, WebSocketConfig } from '../types/websocket';

export class SutramWebSocket {
  private ws: WebSocket | null = null;
  private pageContext: PageContext;
  private token: string;
  private eventHandlers: Map<string, Array<(event: WebEvent) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private debug: boolean;
  private url: string;
  private statusChangeCallback?: (status: ConnectionStatus) => void;

  constructor(
    pageContext: PageContext,
    token: string,
    config: WebSocketConfig = {}
  ) {
    this.pageContext = pageContext;
    this.token = token;
    this.maxReconnectAttempts = config.maxReconnectAttempts || 5;
    this.reconnectDelay = config.reconnectDelay || 1000;
    this.debug = config.debug || false;
    this.url = config.url || 'ws://localhost:9090/api/events/ws';
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log('[SutramWebSocket]', ...args);
    }
  }

  private error(...args: any[]) {
    console.error('[SutramWebSocket]', ...args);
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        this.log('WebSocket already connected or connecting');
        resolve();
        return;
      }

      this.setStatus('connecting');
      
      try {
        const params = new URLSearchParams({
          page_type: this.pageContext.page_type,
          page_params: JSON.stringify(this.pageContext.page_params || {})
        });

        const wsUrl = `${this.url}?${params.toString()}`;
        this.log('Connecting to:', wsUrl);
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.log('WebSocket connected successfully');
          this.setStatus('connected');
          this.reconnectAttempts = 0;
          
          // Send authentication message
          if (this.token) {
            this.send({
              type: 'auth',
              token: this.token
            });
          }
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const webEvent: WebEvent = JSON.parse(event.data);
            this.log('Received event:', webEvent.event_type, webEvent);
            this.handleEvent(webEvent);
          } catch (error) {
            this.error('Failed to parse WebSocket message:', error, event.data);
          }
        };

        this.ws.onclose = (event) => {
          this.log('WebSocket disconnected:', event.code, event.reason);
          this.setStatus('disconnected');
          
          // Don't reconnect if closed manually (code 1000)
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.handleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          this.error('WebSocket error:', error);
          this.setStatus('error');
          reject(error);
        };

      } catch (error) {
        this.error('Failed to create WebSocket connection:', error);
        this.setStatus('error');
        reject(error);
      }
    });
  }

  private handleEvent(webEvent: WebEvent) {
    // Handle specific event type handlers
    const handlers = this.eventHandlers.get(webEvent.event_type) || [];
    handlers.forEach(handler => {
      try {
        handler(webEvent);
      } catch (error) {
        this.error(`Error handling event ${webEvent.event_type}:`, error);
      }
    });

    // Handle global event handlers (*)
    const globalHandlers = this.eventHandlers.get('*') || [];
    globalHandlers.forEach(handler => {
      try {
        handler(webEvent);
      } catch (error) {
        this.error('Error in global event handler:', error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    this.setStatus('reconnecting');
    
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      30000
    );

    this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(error => {
        this.error('Reconnection failed:', error);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.handleReconnect();
        } else {
          this.error('Max reconnection attempts reached');
          this.setStatus('error');
        }
      });
    }, delay);
  }

  private setStatus(status: ConnectionStatus) {
    this.log('Status changed to:', status);
    if (this.statusChangeCallback) {
      this.statusChangeCallback(status);
    }
  }

  private send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.error('Cannot send message: WebSocket not connected');
    }
  }

  on(eventType: string, handler: (event: WebEvent) => void) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
    this.log(`Added handler for event: ${eventType}`);
  }

  off(eventType: string, handler: (event: WebEvent) => void) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        this.log(`Removed handler for event: ${eventType}`);
      }
    }
  }

  updatePageContext(newPageContext: PageContext) {
    this.log('Updating page context:', newPageContext);
    this.pageContext = newPageContext;
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.send({
        type: 'update_context',
        page_context: newPageContext
      });
    }
  }

  onStatusChange(callback: (status: ConnectionStatus) => void) {
    this.statusChangeCallback = callback;
  }

  disconnect() {
    this.log('Disconnecting WebSocket...');
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    
    this.setStatus('disconnected');
  }

  getConnectionStatus(): ConnectionStatus {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return this.reconnectAttempts > 0 ? 'reconnecting' : 'disconnected';
      default:
        return 'error';
    }
  }
}
