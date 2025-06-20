export interface DashboardStatistics {
  generated_at: string;
  trading_performance: {
    total_pnl: number;
    current_portfolio_value: number;
    active_deployments_count: number;
    todays_pnl: number;
    overall_win_rate: number;
    best_performing_strategy: {
      strategy_id: string;
      strategy_name: string;
      return_pct: number;
    };
    max_drawdown: number;
    total_trades_executed: number;
  };
  live_trading_status: {
    active_positions: number;
    pending_orders: number;
    recent_trades: RecentTrade[];
    strategy_statuses: StrategyStatus[];
  };
  strategy_development: {
    total_strategies_created: number;
    backtests_completed: number;
    most_profitable_backtest_pct: number;
    average_backtest_performance: number;
  };
  marketplace_activity: {
    total_revenue_earned: number;
    active_listings: number;
    total_subscribers: number;
    average_strategy_rating: number;
  };
  community_engagement: {
    reputation_score: number;
    badges_earned: number;
    topic_count: number;
    post_count: number;
    followers_count: number;
    recent_badges: any[];
  };
  quick_analytics: {
    monthly_performance: MonthlyPerformance[];
    asset_allocation: AssetAllocation[];
    trading_frequency: {
      trades_per_day: number;
      trades_per_week: number;
      avg_trade_duration_hours: number;
    };
    risk_metrics: {
      volatility: number;
    };
  };
  recent_activity: {
    deployment_events: DeploymentEvent[];
    system_notifications: SystemNotification[];
    community_activity: any[];
    marketplace_updates: any[];
  };
}

export interface StrategyStatus {
  deployment_id: string;
  strategy_name: string;
  instrument_name: string;
  is_active: boolean;
  current_pnl: number;
}

export interface MonthlyPerformance {
  month: string;
  pnl: number;
}

export interface AssetAllocation {
  instrument_name: string;
  allocation_pct: number;
  current_value: number;
}

export interface DeploymentEvent {
  event_id: string;
  event_type: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface SystemNotification {
  event_id: string;
  event_type: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface Position {
  id: string;
  instrument_id: number;
  instrument_name: string;
  quantity: number;
  average_price: number;
  current_price: number;
  pnl: number;
  direction: 'LONG' | 'SHORT';
  created_at: string;
}

export interface DailyPnL {
  date: string;
  pnl: number;
}

export interface StrategyPerformance {
  strategy_id: string;
  name: string;
  pnl: number;
}

export interface RecentTrade {
  trade_id: string;
  strategy_name: string;
  instrument_name: string;
  direction: 'LONG' | 'SHORT';
  pnl: number;
  executed_at: string;
}

export interface RecentDeployment {
  id: string;
  strategy_name: string;
  status: 'RUNNING' | 'STOPPED' | 'PAUSED';
  created_at: string;
}

export interface DashboardApiResponse {
  success: boolean;
  data: DashboardStatistics;
}
