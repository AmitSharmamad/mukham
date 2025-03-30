export interface Strategy {
  id: string;
  user_id: string;
  name: string;
  description: string;
  position_type: 'LONG' | 'SHORT';
  instruments: number[];
  chart_type: string;
  chart_timeframe: string;
  qty: number;
  entry_expression: string;
  exit_expression: string;
  target_profit: number;
  target_profit_type: 'ABSOLUTE' | 'PERCENTAGE';
  stop_loss: number;
  stop_loss_type: 'ABSOLUTE' | 'PERCENTAGE';
  trailing_stop_loss: number;
  trailing_stop_loss_type: 'ABSOLUTE' | 'PERCENTAGE';
  exit_type: string;
  capital: number;
  max_trades: number;
  entry_start_time: string;
  entry_end_time: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StrategyResponse {
  result: boolean;
  data: Strategy[];
}

export interface BacktestMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  totalPnL: number;
  maxDrawdown: number;
  sharpeRatio: number;
  instrumentId: number;
  instrumentName: string;
}

export interface BacktestResult {
  strategyId: string;
  results: BacktestMetrics[];
  aggregatedMetrics: BacktestMetrics;
}