// Import the OptionLeg type from our options leg builder
import { OptionLeg } from './OptionsLegBuilder';
import { Dayjs } from 'dayjs';

export interface FormData {
  id?: string;  // Make id optional since it won't exist for new strategies
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
  brickSize?: string; // Brick size for Renko charts
  entryConditions: any[];
  exitConditions: any[];
  // New fields for options legs
  entryOptionLegs: OptionLeg[];
  exitOptionLegs: OptionLeg[];
  // Options expiration strategy
  expirationStrategy: 'EXPIRE' | 'CLOSE' | 'EXERCISE';
  stopLoss: string;
  stopLossType: 'ABSOLUTE' | 'PERCENTAGE';
  targetProfit: string;
  targetProfitType: 'ABSOLUTE' | 'PERCENTAGE';
  trailingStopLoss: string;
  trailingStopLossType: 'ABSOLUTE' | 'PERCENTAGE';
  initialCapital: string;
  entryStartTime: Dayjs | null;
  entryEndTime: Dayjs | null;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export const initialFormData: FormData = {
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
  brickSize: '',
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
  initialCapital: '',
  entryStartTime: null,
  entryEndTime: null,
  startDate: null,
  endDate: null,
};
