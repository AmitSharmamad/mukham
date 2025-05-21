import { OptionLeg } from './OptionsLegBuilder';

export interface ApiFormData {
  name: string;
  description: string;
  instrument_type: 'equity' | 'futures' | 'options';
  position_type: 'LONG' | 'SHORT';
  instruments: number[];
  chart_type: string;
  chart_timeframe: string;
  trade_type: string;
  brick_size?: number; // Brick size for Renko chart
  qty: number;
  entry_expression: string;
  exit_expression: string;
  // New fields for options
  entry_option_legs?: OptionLeg[];
  exit_option_legs?: OptionLeg[];
  expiration_strategy?: 'EXPIRE' | 'CLOSE' | 'EXERCISE';
  target_profit: number;
  target_profit_type: 'ABSOLUTE' | 'PERCENTAGE';
  stop_loss: number;
  stop_loss_type: 'ABSOLUTE' | 'PERCENTAGE';
  trailing_stop_loss: number;
  trailing_stop_loss_type: 'ABSOLUTE' | 'PERCENTAGE';
  max_allocation: number;
  max_trades: number;
  entry_start_time: string | null;
  entry_end_time: string | null;
  start_date: string | null;
  end_date: string | null;
}
