// WebSocket types based on events.md documentation
export type PageType = "dashboard" | "deployment_list" | "deployment_detail" | "portfolio" | "settings";
export type EventPriority = "high" | "medium" | "low";

export interface WebEvent {
  event_type: string;
  page_type: PageType;
  priority: EventPriority;
  data: any;
  metadata?: Record<string, any>;
  timestamp: string;
  expires_at?: string;
}

export interface PageContext {
  page_type: PageType;
  page_params?: {
    deployment_id?: string;
    [key: string]: any;
  };
}

// Dashboard Events
export interface DashboardSummaryData {
  total_deployments: number;
  active_deployments: number;
  total_pnl: number;
  today_pnl: number;
  open_positions: number;
  win_rate: number;
  last_updated: string;
}

export interface DashboardActivityData {
  activity: string;
  deployment_id: string;
  deployment_name: string;
  timestamp: string;
  type: 'position_opened' | 'position_closed' | 'signal_detected' | 'deployment_started' | 'deployment_stopped';
  details: {
    direction?: "LONG" | "SHORT";
    quantity?: number;
    entry_price?: number;
    exit_price?: number;
    position_id?: string;
    pnl?: number;
  };
}

export interface DashboardAlertsData {
  critical_count: number;
  warning_count: number;
  info_count: number;
}

// Deployment List Events
export interface DeploymentListItemData {
  deployment_id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  pnl: number;
  open_positions: number;
  last_signal: string;
  last_active: string;
}

// Deployment Detail Events
export interface PositionOpenedData {
  position_id: string;
  entry_price: number;
  quantity: number;
  direction: "LONG" | "SHORT";
  status: "open";
  timestamp: string;
}

export interface PositionClosedData {
  position_id: string;
  exit_price: number;
  pnl: number;
  status: "closed";
  timestamp: string;
}

export interface SignalDetectedData {
  signal_type: "entry" | "exit";
  price: number;
  confidence: number;
  reason: string;
  timestamp: string;
}

export interface MetricsUpdatedData {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  average_pnl: number;
  max_drawdown: number;
  sharpe: number;
  last_updated: string;
}

export interface ChartUpdatedData {
  timestamp: string;
  price: number;
  volume: number;
  indicators: {
    rsi?: number;
    sma_20?: number;
    bollinger_upper?: number;
    bollinger_lower?: number;
    [key: string]: number | undefined;
  };
}

export interface LogEntryData {
  log_id: string;
  level: "info" | "warning" | "error";
  message: string;
  context: Record<string, any>;
  timestamp: string;
}

// Portfolio Events
export interface BalanceUpdatedData {
  total_balance: number;
  available_balance: number;
  used_margin: number;
  unrealized_pnl: number;
  realized_pnl: number;
  last_updated: string;
}

export interface PositionsSummaryData {
  total_positions: number;
  long_positions: number;
  short_positions: number;
  total_unrealized_pnl: number;
  total_realized_pnl: number;
}

// Global Events
export interface AlertNotificationData {
  alert_id: string;
  type: "deployment_error" | "stop_loss" | "target_profit" | "connection_error";
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  requires_action?: boolean;
  timestamp: string;
  context: Record<string, any>;
}

// WebSocket Connection States
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'reconnecting';

export interface WebSocketConfig {
  url?: string;
  token?: string;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  debug?: boolean;
}
