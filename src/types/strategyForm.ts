import { Dayjs } from 'dayjs';

// Import and re-export OptionLeg from OptionsLegBuilder
import type { OptionLeg } from '../components/StrategyBuilder/OptionsLegBuilder';
export type { OptionLeg } from '../components/StrategyBuilder/OptionsLegBuilder';

export interface Instrument {
  exchange_security_id: number;
  exchange: string;
  segment: string;
  symbol: string;
  instrument: string;
  instrument_id: number;
  start_date: string;
  expiry: string;
}

export interface FormData {
  id?: string; // Make id optional since it won't exist for new strategies
  name: string;
  description: string;
  instrumentType: 'equity' | 'futures' | 'options';
  buyOrSell: 'buy' | 'sell';
  instruments: number[];
  candlestickType: string;
  timeframe: string;
  tradeType: string;
  maxAllocation: string;
  maxQuantity: string;
  entryConditions: any[];
  exitConditions: any[];
  // New fields for options legs
  entryOptionLegs: OptionLeg[];
  exitOptionLegs: OptionLeg[];
  expirationStrategy: 'EXPIRE' | 'CLOSE' | 'EXERCISE';
  stopLoss: string;
  stopLossType: 'ABSOLUTE' | 'PERCENTAGE';
  targetProfit: string;
  targetProfitType: 'ABSOLUTE' | 'PERCENTAGE';
  trailingStopLoss: string;
  trailingStopLossType: 'ABSOLUTE' | 'PERCENTAGE';
  entryStartTime: Dayjs | null;
  entryEndTime: Dayjs | null;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  brickSize: string;
  brokerage: string;
  slippage: string;
}

export interface ApiFormData {
  id?: string; // Make ID optional since it won't exist for new strategies
  name: string;
  description: string;
  instrument_type: 'equity' | 'futures' | 'options';
  position_type: 'LONG' | 'SHORT';
  instruments: number[];
  chart_type: string;
  chart_timeframe: string;
  trade_type: string;
  brick_size?: number;
  qty: number;
  max_allocation: number; // Added this property to match the form data
  entry_expression: string;
  exit_expression: string;
  entry_option_legs?: OptionLeg[];
  exit_option_legs?: OptionLeg[];
  expiration_strategy?: 'EXPIRE' | 'CLOSE' | 'EXERCISE';
  target_profit: number;
  target_profit_type: 'ABSOLUTE' | 'PERCENTAGE';
  stop_loss: number;
  stop_loss_type: 'ABSOLUTE' | 'PERCENTAGE';
  trailing_stop_loss: number;
  trailing_stop_loss_type: 'ABSOLUTE' | 'PERCENTAGE';
  capital: number;
  max_trades: number;
  brokerage?: number;
  slippage?: number;
  entry_start_time: string | null;
  entry_end_time: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface StrategyFormProps {
  initialData?: any;
  initialInstruments?: Instrument[];
  pageTitle?: string;
}

export interface BacktestPosition {
  id: string;
  run_id: string;
  state: string;
  direction: string;
  entry_price_signal: number;
  entry_time_signal: string;
  entry_price_order: number;
  entry_time_order: string;
  entry_signal: string;
  exit_price_signal: number;
  exit_time_signal: number;
  exit_price_order: number;
  exit_time_order: string;
  exit_signal: string;
  exit_reason: string;
  profit_loss_absolute: number;
  profit_loss_percentage: number;
  transaction_cost: number;
  entry_fees: number;
  exit_fees: number;
  net_profit_loss: number;
  position_size: number;
}

export interface BacktestMetric {
  id: string;
  run_id: string;
  total_return_pct: number;
  annualized_return: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown: number;
  max_drawdown_duration: number;
  std_deviation: number;
  total_trades: number;
  win_rate: number;
  avg_win_size: number;
  avg_loss_size: number;
  avg_trade_duration: number;
  profit_factor: number;
  total_commission: number;
  total_slippage: number;
  transaction_costs_pct: number;
  metric_json: string;
}

export interface BacktestRun {
  instrument_id: string | number;
  positions: BacktestPosition[] | null;
  metrics: BacktestMetric;
  exchange?: string;
  instrument_master?: {
    instrument_name: string;
  };
}

export interface BacktestData {
  message: string;
  results: BacktestRun[];
  strategy_id?: string;
}

// Initial form data constant
export const getInitialFormData = (): FormData => ({
  id: undefined, // Initialize with undefined
  name: '',
  description: '',
  instrumentType: 'equity',
  buyOrSell: 'buy',
  instruments: [],
  candlestickType: 'CANDLESTICK',
  timeframe: '1m',
  tradeType: 'MIS',
  maxAllocation: '',
  maxQuantity: '',
  entryConditions: [],
  exitConditions: [],
  entryOptionLegs: [],
  exitOptionLegs: [],
  expirationStrategy: 'CLOSE',
  stopLoss: '',
  stopLossType: 'PERCENTAGE',
  targetProfit: '',
  targetProfitType: 'PERCENTAGE',
  trailingStopLoss: '',
  trailingStopLossType: 'PERCENTAGE',
  entryStartTime: null,
  entryEndTime: null,
  startDate: null,
  endDate: null,
  brickSize: '',
  brokerage: '20',
  slippage: '0.5',
});
