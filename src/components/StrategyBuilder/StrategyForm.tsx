import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useToastContext } from '../../context/ToastContext';
import { 
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Tooltip,
  Switch
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Add from '@mui/icons-material/Add';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import dayjs, { Dayjs } from 'dayjs';
import { Button } from '../Button';
import { Select } from '../Select';
import { TextField } from '../TextField';
import { Toast } from '../';
import InstrumentSelector from './InstrumentSelector';
import { IndicatorExpressionBuilder } from './IndicatorExpressionBuilder';
import { OptionsLegBuilder, OptionLeg } from './OptionsLegBuilder';
import MetricsSection from './MetricsSection';
import { PROFIT_LOSS_TYPES, TIMEFRAME_OPTIONS } from '../../constants';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { BacktestResult } from '../../types/strategy';

export interface Instrument {
  id: number;
  exchange: string;
  segment: string;
  symbol: string;
  instrument: string;
  instrument_id: number;
  start_date: string;
  expiry: string;
}

interface Indicator {
  name: string;
  config: Record<string, any>;
  value?: string; // Making value optional since it's not always needed
}

interface IndicatorExpression {
  indicator1: Indicator;
  operator: string;
  indicator2: Indicator;
  logicalOperator?: string;
}

interface FormData {
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
  initialCapital: string;
  entryStartTime: Dayjs | null;
  entryEndTime: Dayjs | null;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  brickSize: string;
}

const initialFormData: FormData = {
  id: undefined,  // Initialize with undefined
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
  initialCapital: '',
  entryStartTime: null,
  entryEndTime: null,
  startDate: null,
  endDate: null,
  brickSize: '',
};

export interface ValidationErrors {
  [key: string]: string | undefined;
}

const setErrorsWithType = (prev: ValidationErrors) => ({
  ...prev,
});

export interface StrategyFormProps {
  initialData?: any;
  initialInstruments?: Instrument[];
  pageTitle?: string;
}

interface ApiFormData {
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
  entry_start_time: string | null;
  entry_end_time: string | null;
  start_date: string | null;
  end_date: string | null;
}

interface BacktestPosition {
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

interface BacktestMetric {
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

interface BacktestRun {
  instrument_id: string | number;
  positions: BacktestPosition[] | null;
  metrics: BacktestMetric;
  exchange?: string;
}

interface BacktestData {
  message: string;
  results: BacktestRun[];
  strategy_id?: string;
}  const convertFormToApiData = (formData: FormData): ApiFormData => {
    const stringifyExpression = (expression: IndicatorExpression): string => {
      const getIndicatorString = (indicator: Indicator): string => {
        if (indicator.name === 'Number') {
          return indicator.config.value?.toString() || '0';
        }
        switch (indicator.name) {
          case 'SMA':
          case 'EMA':
          case 'RSI':
            return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 14}, ${indicator.config?.offset || 0})`;
          case 'MACD':
            return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.fastPeriod || 12}, ${indicator.config?.slowPeriod || 26}, ${indicator.config?.signalPeriod || 9}, ${indicator.config?.offset || 0})`;
          case 'BB_UPPER':
          case 'BB_LOWER':
          case 'BB_MIDDLE':
            return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || ''}, ${indicator.config?.deviations || ''}, ${indicator.config?.offset || 0})`;
          case 'CLOSE':
            return `CLOSE(${indicator.config?.offset || 0})`;
          case 'OPEN':
          case 'HIGH':
          case 'LOW':
          case 'VOLUME':
          case 'MARKET_POSITION':
            return indicator.name;
          default:
            return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || ''}, ${indicator.config?.offset || 0})`;
        }
      };

      const expr = `${getIndicatorString(expression.indicator1)} ${expression.operator} ${getIndicatorString(expression.indicator2)}`;
      return expr;
    };

    const stringifyConditions = (conditions: IndicatorExpression[]): string => {
      if (conditions.length === 0) return '';
      if (conditions.length === 1) return stringifyExpression(conditions[0]);

      return conditions.reduce((acc, condition, index) => {
        if (index === 0) return stringifyExpression(condition);
        return `${acc} ${condition.logicalOperator} ${stringifyExpression(condition)}`;
      }, '');
    };
    
    // Validate option legs before sending to ensure all required fields are filled
    const validatedEntryOptionLegs = formData.instrumentType === 'options' 
      ? formData.entryOptionLegs.filter(leg => 
          leg.strike !== '' && leg.expiry !== '' && leg.quantity !== '')
      : [];
    
    const validatedExitOptionLegs = formData.instrumentType === 'options'
      ? formData.exitOptionLegs.filter(leg => 
          leg.strike !== '' && leg.expiry !== '' && leg.quantity !== '')
      : [];

    return {
      id: formData.id, // Include the ID in the API data if it exists
      name: formData.name,
      description: formData.description,
      instrument_type: formData.instrumentType,
      position_type: formData.buyOrSell === 'buy' ? 'LONG' : 'SHORT',
      instruments: formData.instruments,
      chart_type: formData.candlestickType,
      chart_timeframe: formData.timeframe,
      trade_type: formData.tradeType,
      brick_size: formData.candlestickType === 'RENKO' && formData.brickSize ? parseFloat(formData.brickSize) : undefined,
      qty: parseInt(formData.maxQuantity) || 0,
      capital: parseInt(formData.maxAllocation) || 0,
      entry_expression: formData.instrumentType !== 'options' ? stringifyConditions(formData.entryConditions) : '',
      exit_expression: formData.instrumentType !== 'options' ? stringifyConditions(formData.exitConditions) : '',
      entry_option_legs: formData.instrumentType === 'options' ? validatedEntryOptionLegs : undefined,
      exit_option_legs: formData.instrumentType === 'options' ? validatedExitOptionLegs : undefined,
      expiration_strategy: formData.instrumentType === 'options' ? formData.expirationStrategy : undefined,
      stop_loss: parseFloat(formData.stopLoss) || 0,
      stop_loss_type: formData.stopLossType,
      target_profit: parseFloat(formData.targetProfit) || 0,
      target_profit_type: formData.targetProfitType,
      trailing_stop_loss: parseFloat(formData.trailingStopLoss) || 0,
      trailing_stop_loss_type: formData.trailingStopLossType,
      entry_start_time: formData.entryStartTime?.isValid() ? formData.entryStartTime.format('YYYY-MM-DDTHH:mm:ssZ') : null,
      entry_end_time: formData.entryEndTime?.isValid() ? formData.entryEndTime.format('YYYY-MM-DDTHH:mm:ssZ') : null,
      start_date: formData.startDate?.isValid() ? formData.startDate.format('YYYY-MM-DDTHH:mm:ssZ') : null,
      end_date: formData.endDate?.isValid() ? formData.endDate.format('YYYY-MM-DDTHH:mm:ssZ') : null,
      max_trades: 5
    };
};

const parseExpressions = (expressionStr: string): IndicatorExpression[] => {
  try {
    if (!expressionStr) return [];
    
    // Split by logical operators while preserving them
    const parts = expressionStr.split(/(AND|OR)/).map(part => part.trim()).filter(Boolean);
    
    const expressions: IndicatorExpression[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      const expr = parts[i];
      const logicalOp = parts[i + 1];
      
      // Match indicator expressions like "SMA(close, 20) > SMA(close, 50)"
      const match = expr.match(/(\w+)\((.*?)\)\s*([><=!]+|CrossesAbove|CrossesBelow)\s*(\w+)\((.*?)\)/);
      if (match) {
        const [, indicator1Name, indicator1Params, operator, indicator2Name, indicator2Params] = match;
        
        const parseParams = (params: string) => {
          const [field = 'CLOSE', ...rest] = params.split(',').map(p => p.trim());
          if (indicator1Name === 'Number' || indicator2Name === 'Number') {
            return { value: parseFloat(field) || 0 };
          }
          return {
            field,
            period: parseInt(rest[0]) || 0,
            offset: parseInt(rest[1]) || 0
          };
        };
        
        expressions.push({
          indicator1: {
            name: indicator1Name,
            config: parseParams(indicator1Params),
            value: expr.split(operator)[0].trim()
          },
          operator,
          indicator2: {
            name: indicator2Name,
            config: parseParams(indicator2Params),
            value: expr.split(operator)[1].trim()
          },
          logicalOperator: logicalOp
        });
      }
    }
    return expressions;
  } catch (err) {
    console.error('Failed to parse expression string:', err);
    return [];
  }
};

const sampleBacktestResults: BacktestResult = {
  strategyId: '',
  results: [],
  aggregatedMetrics: {
    instrumentId: 0,
    instrumentName: 'Total',
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    profitFactor: 0,
    totalPnL: 0,
    maxDrawdown: 0,
    sharpeRatio: 0
  }
};

export const StrategyForm: React.FC<StrategyFormProps> = ({ initialData, initialInstruments = [], pageTitle }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    instrumentType: initialData?.instrumentType || 'equity',
    buyOrSell: initialData?.buyOrSell || 'buy',
    instruments: initialData?.instruments || [],
    candlestickType: initialData?.candlestickType || 'CANDLESTICK',
    timeframe: initialData?.timeframe || '1m',
    tradeType: initialData?.tradeType || 'MIS',
    maxAllocation: initialData?.maxAllocation || '',
    maxQuantity: initialData?.maxQuantity || '',
    brickSize: initialData?.brickSize || '',
    entryConditions: initialData?.entryConditions ? parseExpressions(initialData.entryConditions) : [],
    exitConditions: initialData?.exitConditions ? parseExpressions(initialData.exitConditions) : [],
    entryOptionLegs: initialData?.entryOptionLegs || [],
    exitOptionLegs: initialData?.exitOptionLegs || [],
    expirationStrategy: initialData?.expirationStrategy || 'CLOSE',
    stopLoss: initialData?.stopLoss || '',
    stopLossType: initialData?.stopLossType || 'PERCENTAGE',
    targetProfit: initialData?.targetProfit || '',
    targetProfitType: initialData?.targetProfitType || 'PERCENTAGE',
    trailingStopLoss: initialData?.trailingStopLoss || '',
    trailingStopLossType: initialData?.trailingStopLossType || 'PERCENTAGE',
    initialCapital: initialData?.initialCapital || '',
    entryStartTime: initialData?.entryStartTime ? dayjs(initialData.entryStartTime, 'HH:mm') : null,
    entryEndTime: initialData?.entryEndTime ? dayjs(initialData.entryEndTime, 'HH:mm') : null,
    startDate: initialData?.startDate ? dayjs(initialData.startDate) : null,
    endDate: initialData?.endDate ? dayjs(initialData.endDate) : null,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(['name']);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isInstrumentSelectorOpen, setInstrumentSelectorOpen] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(initialInstruments);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(sampleBacktestResults);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [deployingInstruments, setDeployingInstruments] = useState<Set<number>>(new Set());
  const backtestResultsRef = useRef<HTMLDivElement>(null);
  const [expandedInstrument, setExpandedInstrument] = useState<number | null>(null);
  const [showingPositions, setShowingPositions] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast, showSuccess, showError } = useToastContext();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showBacktestResults, setShowBacktestResults] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Make sure to set hasUnsavedChanges to false when initializing with existing data
      setHasUnsavedChanges(false);
      const isNullTime = (time: string) => !time || time === "0001-01-01T00:00:00Z";
      
      setFormData({
        id: initialData?.id, // Ensure ID is properly set if it exists
        name: initialData?.name || '',
        description: initialData?.description || '',
        instrumentType: initialData?.instrumentType || 'equity',
        buyOrSell: initialData?.buyOrSell || 'buy',
        instruments: initialData?.instruments || [],
        candlestickType: initialData?.candlestickType || 'CANDLESTICK',
        timeframe: initialData?.timeframe || '1m',
        tradeType: initialData?.tradeType || 'MIS',
        maxAllocation: initialData?.maxAllocation || '',
        maxQuantity: initialData?.maxQuantity || '',
        brickSize: initialData?.brickSize || '',
        entryConditions: initialData?.entryConditions ? parseExpressions(initialData.entryConditions) : [],
        exitConditions: initialData?.exitConditions ? parseExpressions(initialData.exitConditions) : [],
        entryOptionLegs: initialData?.entryOptionLegs || [],
        exitOptionLegs: initialData?.exitOptionLegs || [],
        expirationStrategy: initialData?.expirationStrategy || 'CLOSE',
        stopLoss: initialData?.stopLoss || '',
        stopLossType: initialData?.stopLossType || 'PERCENTAGE',
        targetProfit: initialData?.targetProfit || '',
        targetProfitType: initialData?.targetProfitType || 'PERCENTAGE',
        trailingStopLoss: initialData?.trailingStopLoss || '',
        trailingStopLossType: initialData?.trailingStopLossType || 'PERCENTAGE',
        initialCapital: initialData?.initialCapital || '',
        entryStartTime: isNullTime(initialData.entryStartTime) ? null : dayjs(initialData.entryStartTime),
        entryEndTime: isNullTime(initialData.entryEndTime) ? null : dayjs(initialData.entryEndTime),
        startDate: dayjs(initialData.startDate),
        endDate: dayjs(initialData.endDate),
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (initialInstruments.length > 0) {
      setSelectedInstruments(initialInstruments);
    }
  }, [initialInstruments]);

  // Using toast context instead of local state

  const fetchInstrumentsByIds = async (instrumentIds: number[]): Promise<Instrument[]> => {
    try {
      const response = await fetch(`/api/instrument-master/by-ids?ids=${instrumentIds.join(',')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch instruments');
      }
    } catch (error) {
      console.error('Error fetching instruments:', error);
      throw error;
    }
  };

  const isFormValid = () => {
    const isOptionsType = formData.instrumentType === 'options';
    const isRenkoType = formData.candlestickType === 'RENKO';
    
    return !!(
      formData.name.trim() &&
      formData.instrumentType &&
      formData.buyOrSell &&
      selectedInstruments.length > 0 &&
      formData.candlestickType &&
      formData.timeframe &&
      formData.tradeType &&
      (!isRenkoType || (isRenkoType && formData.brickSize)) &&
      (isOptionsType ? formData.entryOptionLegs.length > 0 : formData.entryConditions.length > 0) &&
      formData.stopLoss &&
      formData.targetProfit &&
      formData.initialCapital &&
      formData.startDate &&
      formData.endDate &&
      (!formData.entryStartTime || !formData.entryEndTime || validateTimeRange(formData.entryStartTime, formData.entryEndTime)) &&
      validateDateRange(formData.startDate, formData.endDate)
    );
  };

  const handleChange = (field: keyof FormData) => (value: any) => {
    // Log timeframe changes for debugging
    if (field === 'timeframe') {
      console.log('Timeframe changed to:', value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    setHasUnsavedChanges(true);
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    const isOptionsType = formData.instrumentType === 'options';
    
    if (!formData.name.trim()) {
      newErrors.name = 'Strategy name is required';
    }
    
    if (!formData.instrumentType) {
      newErrors.instrumentType = 'Instrument type is required';
    }
    
    if (!formData.buyOrSell) {
      newErrors.buyOrSell = 'Position type is required';
    }
    
    if (!formData.candlestickType) {
      newErrors.candlestickType = 'Candlestick type is required';
    }
    
    if (!formData.timeframe) {
      newErrors.timeframe = 'Timeframe is required';
    }
    
    if (formData.candlestickType === 'RENKO' && !formData.brickSize) {
      newErrors.brickSize = 'Brick size is required for Renko charts';
    }
    
    if (!formData.tradeType) {
      newErrors.tradeType = 'Trade type is required';
    }
    
    if (isOptionsType) {
      if (formData.entryOptionLegs.length === 0) {
        newErrors.entryOptionLegs = 'At least one entry option leg is required';
      }
    } else {
      if (formData.entryConditions.length === 0) {
        newErrors.entryConditions = 'At least one entry condition is required';
      }
    }
    
    if (formData.stopLoss === '') {
      newErrors.stopLoss = 'Stop loss is required';
    }
    
    if (formData.targetProfit === '') {
      newErrors.targetProfit = 'Target profit is required';
    }
    
    if (formData.initialCapital === '') {
      newErrors.initialCapital = 'Initial capital is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      if (formData.startDate.isAfter(formData.endDate)) {
        newErrors.startDate = 'Start date cannot be after end date';
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    if (formData.entryStartTime && formData.entryEndTime) {
      if (formData.entryStartTime.isAfter(formData.entryEndTime)) {
        newErrors.entryStartTime = 'Start time cannot be after end time';
        newErrors.entryEndTime = 'End time cannot be before start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTimeRange = (startTime: Dayjs | null, endTime: Dayjs | null) => {
    if (startTime && endTime && startTime.isAfter(endTime)) {
      return false;
    }
    return true;
  };

  const validateDateRange = (startDate: Dayjs | null, endDate: Dayjs | null) => {
    if (startDate && endDate) {
      const start = startDate.startOf('day');
      const end = endDate.startOf('day');
      return !start.isAfter(end);
    }
    return true;
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => (value: Dayjs | null) => {
    const otherField = field === 'startDate' ? 'endDate' : 'startDate';
    const otherValue = formData[otherField];

    if (errors.startDate || errors.endDate) {
      setErrors(prev => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (value && otherValue) {
      const isStartDate = field === 'startDate';
      const start = isStartDate ? value : otherValue;
      const end = isStartDate ? otherValue : value;

      if (!validateDateRange(start, end)) {
        setErrors(prev => ({
          ...prev,
          startDate: isStartDate ? 'Start date cannot be after end date' : undefined,
          endDate: !isStartDate ? 'End date cannot be before start date' : undefined,
        }));
      }
    }

    setHasUnsavedChanges(true);
  };

  const handleTimeChange = (field: 'entryStartTime' | 'entryEndTime') => (value: Dayjs | null) => {
    const otherField = field === 'entryStartTime' ? 'entryEndTime' : 'entryStartTime';
    const otherValue = formData[otherField];

    if (errors.entryStartTime || errors.entryEndTime) {
      setErrors(prev => ({
        ...prev,
        entryStartTime: undefined,
        entryEndTime: undefined,
      }));
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (value && otherValue) {
      const isStartTime = field === 'entryStartTime';
      const start = isStartTime ? value : otherValue;
      const end = isStartTime ? otherValue : value;

      if (!validateTimeRange(start, end)) {
        setErrors(prev => ({
          ...prev,
          [field]: `Invalid time range`,
        }));
      }
    }

    setHasUnsavedChanges(true);
  };
  
  // Function to clear time fields
  const handleClearTime = (field: 'entryStartTime' | 'entryEndTime') => () => {
    setFormData(prev => ({
      ...prev,
      [field]: null,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
    
    setHasUnsavedChanges(true);
    return null;
  };

  const handleInstrumentSelect = (instruments: Instrument[]) => {
    setSelectedInstruments(instruments);
    handleChange('instruments')(instruments.map(i => i.id));
  };

  const isSectionComplete = (sectionId: string): boolean => {
    const isOptionsType = formData.instrumentType === 'options';
    
    switch (sectionId) {
      case 'name':
        return !!formData.name.trim();
      
      case 'positions':
        return (
          !!formData.instrumentType &&
          !!formData.buyOrSell &&
          selectedInstruments.length > 0 &&
          !!formData.candlestickType &&
          !!formData.timeframe &&
          !!formData.tradeType
        );
      
      case 'entry':
        return isOptionsType
          ? Array.isArray(formData.entryOptionLegs) && formData.entryOptionLegs.length > 0
          : Array.isArray(formData.entryConditions) && formData.entryConditions.length > 0;
      
      case 'exit':
        return (
          formData.stopLoss !== '' &&
          formData.targetProfit !== ''
        );
      
      case 'backtest':
        return (
          formData.initialCapital !== '' &&
          !!formData.startDate &&
          !!formData.endDate &&
          (!formData.entryStartTime || !formData.entryEndTime || validateTimeRange(formData.entryStartTime, formData.entryEndTime)) &&
          validateDateRange(formData.startDate, formData.endDate)
        );
      
      default:
        return false;
    }
  };

  const sections = [
    {
      id: 'name',
      title: 'Name',
      component: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="name"
              label="Strategy Name"
              value={formData.name}
              onChange={(e) => handleChange('name')(e.target.value)}
              error={attemptedSubmit && !!errors.name}
              helperText={attemptedSubmit && errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description')(e.target.value)}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      id: 'positions',
      title: 'Positions',
      component: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Position Type</FormLabel>
                <RadioGroup
                  row
                  name="position_type"
                  id="position_type"
                  value={formData.buyOrSell}
                  onChange={(e) => handleChange('buyOrSell')(e.target.value)}
                >
                  <FormControlLabel value="buy" control={<Radio />} label="Buy" />
                  <FormControlLabel value="sell" control={<Radio />} label="Sell" />
                </RadioGroup>
              </FormControl>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flex: 1,
                justifyContent: 'center'
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setInstrumentSelectorOpen(true)}
                >
                  Add Instrument
                </Button>
                
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  {selectedInstruments.map((instrument) => (
                    <Chip
                      key={instrument.id}
                      label={instrument.symbol}
                      onDelete={() => {
                        const newInstruments = selectedInstruments.filter(i => i.id !== instrument.id);
                        setSelectedInstruments(newInstruments);
                        handleChange('instruments')(newInstruments.map(i => i.id));
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Select
                  fullWidth
                  id="chart_type"
                  label="Candlestick Type"
                  options={[
                    { label: 'Candlestick', value: 'CANDLESTICK' },
                    { label: 'Renko', value: 'RENKO' }
                  ]}
                  value={formData.candlestickType}
                  onChange={handleChange('candlestickType')}
                  error={attemptedSubmit && !!errors.candlestickType}
                  required
                />
                {attemptedSubmit && errors.candlestickType && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {errors.candlestickType}
                  </Typography>
                )}
              </Grid>
              {formData.candlestickType === 'RENKO' && (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    id="brick_size"
                    label="Brick Size"
                    type="number"
                    value={formData.brickSize || ''}
                    onChange={(e) => handleChange('brickSize')(e.target.value)}
                    error={attemptedSubmit && !!errors.brickSize}
                    helperText={attemptedSubmit && errors.brickSize}
                    required
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={formData.candlestickType === 'RENKO' ? 3 : 3}>
                <Select
                  fullWidth
                  id="chart_timeframe"
                  label="Timeframe"
                  options={TIMEFRAME_OPTIONS}
                  value={formData.timeframe}
                  onChange={handleChange('timeframe')}
                  error={attemptedSubmit && !!errors.timeframe}
                  required
                />
                {attemptedSubmit && errors.timeframe && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {errors.timeframe}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={3}>
                <Select
                  fullWidth
                  id="chart_unknown"
                  label="Trade Type"
                  options={[
                    { label: 'MIS', value: 'MIS' },
                    { label: 'CNC/NRML', value: 'CNC/NRML' }
                  ]}
                  value={formData.tradeType}
                  onChange={handleChange('tradeType')}
                  error={attemptedSubmit && !!errors.tradeType}
                  required
                />
                {attemptedSubmit && errors.tradeType && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {errors.tradeType}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Allocation (in rupees)"
                  type="number"
                  value={formData.maxAllocation}
                  onChange={(e) => handleChange('maxAllocation')(e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="qty"
                  label="Max Quantity"
                  type="number"
                  value={formData.maxQuantity}
                  onChange={(e) => handleChange('maxQuantity')(e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ),
    },
    {
      id: 'entry',
      title: 'Entry Condition',
      component: (
        <Box>
          {formData.instrumentType === 'options' ? (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Design your options strategy by adding one or more option legs. For complex strategies like spreads or 
                condors, add multiple legs with different strike prices and option types.
              </Typography>
              <OptionsLegBuilder
                value={formData.entryOptionLegs}
                onChange={handleChange('entryOptionLegs')}
                label="Entry Option Legs"
                error={attemptedSubmit && !!errors.entryOptionLegs}
                helperText={attemptedSubmit ? errors.entryOptionLegs : undefined}
                required
              />
            </>
          ) : (
            <IndicatorExpressionBuilder
              value={formData.entryConditions}
              onChange={handleChange('entryConditions')}
              label="Entry Conditions"
              error={attemptedSubmit && !!errors.entryConditions}
              helperText={attemptedSubmit ? errors.entryConditions : undefined}
              required
            />
          )}
        </Box>
      ),
    },
    {
      id: 'exit',
      title: 'Exit Conditions',
      component: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {formData.instrumentType === 'options' ? (
              <>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Define how you want to exit your options position. You can add exit legs to close specific entry legs
                  or let the stop loss and target profit handle your exits automatically.
                </Typography>
                <OptionsLegBuilder
                  value={formData.exitOptionLegs}
                  onChange={handleChange('exitOptionLegs')}
                  label="Exit Option Legs"
                  isOptional
                />
              </>
            ) : (
              <IndicatorExpressionBuilder
                label="Exit Conditions"
                value={formData.exitConditions}
                onChange={handleChange('exitConditions')}
                isOptional
              />
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="stop_loss"
              label="Stop Loss"
              type="number"
              value={formData.stopLoss}
              onChange={(e) => handleChange('stopLoss')(e.target.value)}
              error={attemptedSubmit && !!errors.stopLoss}
              helperText={attemptedSubmit && errors.stopLoss}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth 
              id="stop_loss_type"
              label="Stop Loss Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.stopLossType}
              onChange={handleChange('stopLossType')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="target_profit"
              label="Target Profit"
              type="number"
              value={formData.targetProfit}
              onChange={(e) => handleChange('targetProfit')(e.target.value)}
              error={attemptedSubmit && !!errors.targetProfit}
              helperText={attemptedSubmit && errors.targetProfit}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth
              id="target_profit_type"
              label="Target Profit Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.targetProfitType}
              onChange={handleChange('targetProfitType')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="trailing_stop_loss"
              label="Trailing Stop Loss"
              type="number"
              value={formData.trailingStopLoss}
              onChange={(e) => handleChange('trailingStopLoss')(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              fullWidth
              id="trailing_stop_loss_type"
              label="Trailing Stop Loss Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.trailingStopLossType}
              onChange={handleChange('trailingStopLossType')}
            />
          </Grid>
          
          {formData.instrumentType === 'options' && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Expiration Strategy</Typography>
              <Select
                fullWidth
                id="expiration_strategy"
                label="Strategy at Expiration"
                options={[
                  { label: 'Let options expire', value: 'EXPIRE' },
                  { label: 'Close position before expiration', value: 'CLOSE' },
                  { label: 'Exercise ITM options', value: 'EXERCISE' }
                ]}
                value={formData.expirationStrategy}
                onChange={handleChange('expirationStrategy')}
              />
              <FormHelperText>
                Determines what should happen when your options approach expiration
              </FormHelperText>
            </Grid>
          )}
        </Grid>
      ),
    },
    {
      id: 'backtest',
      title: 'Backtest Parameters',
      component: (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="capital"
                label="Initial Capital"
                type="number"
                value={formData.initialCapital}
                onChange={(e) => handleChange('initialCapital')(e.target.value)}
                error={attemptedSubmit && !!errors.initialCapital}
                helperText={attemptedSubmit && errors.initialCapital}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TimePicker
                label="Entry Start Time"
                value={formData.entryStartTime}
                onChange={handleTimeChange('entryStartTime')}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.entryStartTime,
                    helperText: errors.entryStartTime,
                  },
                  field: {
                    clearable: true,
                    onClear: handleClearTime('entryStartTime'),
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TimePicker
                label="Entry End Time"
                value={formData.entryEndTime}
                onChange={handleTimeChange('entryEndTime')}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.entryEndTime,
                    helperText: errors.entryEndTime,
                  },
                  field: {
                    clearable: true,
                    onClear: handleClearTime('entryEndTime'),
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={handleDateChange('startDate')}
                sx={{ width: '100%' }}
                maxDate={formData.endDate || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!(errors.startDate),
                    helperText: errors.startDate || undefined,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={handleDateChange('endDate')}
                sx={{ width: '100%' }}
                minDate={formData.startDate || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!(errors.endDate),
                    helperText: errors.endDate || undefined,
                  }
                }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      ),
    },
  ];

  const handleAccordionChange = (sectionId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSections(prev => 
      isExpanded 
        ? [...prev, sectionId]
        : prev.filter(id => id !== sectionId)
    );
  };

  const toggleExpandAll = () => {
    setExpandedSections(prev => 
      prev.length === sections.length 
        ? [] 
        : sections.map(section => section.id)
    );
    setIsAllExpanded(prev => !prev);
  };

  const handleSave = async () => {
    setAttemptedSubmit(true);
    if (validateForm()) {
      try {
        setLoading(true);

        // Make sure we have the instrument IDs correctly set in formData before sending
        if (selectedInstruments.length > 0) {
          // Update formData.instruments with the correct instrument IDs from selectedInstruments
          const instrumentIds = selectedInstruments.map(instrument => instrument.id);
          setFormData(prev => ({
            ...prev,
            instruments: instrumentIds
          }));
          
          // Create a modified copy of the form data with the correct instrument ids for the API call
          const modifiedFormData = {
            ...formData,
            instruments: instrumentIds
          };
          
          const apiData = convertFormToApiData(modifiedFormData);
          const isEdit = !!initialData?.id;
          
          // Determine the appropriate API endpoint based on whether this is an edit or create operation
          const url = isEdit ? `/api/strategy/${initialData.id}` : '/api/strategy';
          
          // Log the API data to console for debugging
          console.log('Submitting strategy data:', apiData);
          
          const response = await fetch(url, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          if (result.success) {
            showToast('Strategy saved successfully', 'success');
            setHasUnsavedChanges(false); // Reset unsaved changes after successful save
            
            // Update the formData with the returned strategy ID if it's a new strategy
            if (result.data && result.data.id) {
              setFormData(prev => ({ ...prev, id: result.data.id }));
            }
            
            if (!isEdit) {
              router.push('/strategy'); // Only redirect if it's a new strategy
            }
            
            // Return the strategy data for use in other functions
            return result.data;
          } else {
            throw new Error(result.error || 'Failed to save strategy');
          }
        } else {
          throw new Error('No instruments selected');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error connecting to server';
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBacktest = async () => {
    setAttemptedSubmit(true);
    if (validateForm()) {
      try {
        setIsBacktesting(true);
        setShowBacktestResults(true);
        
        // Scroll to the backtest results section
        setTimeout(() => {
          if (backtestResultsRef.current) {
            backtestResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
        
        // First save the strategy if it's a new one or has unsaved changes
        let currentStrategyId = initialData?.id || formData.id || '';
        
        if (!currentStrategyId || hasUnsavedChanges) {
          // Save the strategy and get the updated ID
          const saveResponse = await handleSave();
          if (saveResponse?.id) {
            currentStrategyId = saveResponse.id;
          }
        }
        
        // Ensure we have a valid strategy ID
        if (!currentStrategyId) {
          throw new Error('Cannot backtest: No valid strategy ID found');
        }
        
        // Make the API call to run backtest using the current strategy ID
        const response = await fetch(`/api/backtest/run?strategy_id=${currentStrategyId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(convertFormToApiData(formData))
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const backtestData: BacktestData = await response.json();
        
        if (backtestData && backtestData.results) {
          // Filter out any runs with null metrics or instrument_id = 0 (aggregated metrics)
          const validRuns = backtestData.results.filter(run => 
            run.metrics && String(run.instrument_id) !== "0");
          
          // Transform the API response to match our BacktestResult interface
          const transformedResults: BacktestResult = {
            strategyId: backtestData.strategy_id || initialData?.id || '',
            results: validRuns.map((run: BacktestRun) => {
              // Calculate winning trades by counting positions with positive P&L
              const winningTrades = run.positions ? 
                run.positions.filter(pos => pos.profit_loss_absolute > 0).length : 0;
              
              // Count total trades from positions or fallback to metrics
              const totalTrades = run.positions ? run.positions.length : run.metrics.total_trades;
              
              // Calculate win rate based on winning trades and total trades
              const winRate = totalTrades > 0 ? winningTrades / totalTrades : 0;
              
              return {
                instrumentId: Number(run.instrument_id),
                instrumentName: run.exchange || `Instrument ${run.instrument_id}`,
                totalTrades,
                winningTrades,
                losingTrades: totalTrades - winningTrades,
                winRate,
                profitFactor: run.metrics.profit_factor || 0,
                totalPnL: run.metrics.total_return_pct,
                maxDrawdown: run.metrics.max_drawdown,
                sharpeRatio: run.metrics.sharpe_ratio
              };
            }),
            aggregatedMetrics: {
              instrumentId: 0,
              instrumentName: 'Total',
              totalTrades: validRuns.reduce((sum: number, run: BacktestRun) => 
                sum + (run.positions ? run.positions.length : run.metrics.total_trades), 0),
              winningTrades: validRuns.reduce((sum: number, run: BacktestRun) => {
                if (run.positions) {
                  return sum + run.positions.filter(pos => pos.profit_loss_absolute > 0).length;
                }
                return sum;
              }, 0),
              losingTrades: validRuns.reduce((sum: number, run: BacktestRun) => {
                if (run.positions) {
                  return sum + run.positions.filter(pos => pos.profit_loss_absolute <= 0).length;
                }
                return sum;
              }, 0),
              winRate: validRuns.length > 0 ? 
                validRuns.reduce((sum: number, run: BacktestRun) => {
                  if (run.positions) {
                    const winningPositions = run.positions.filter(pos => pos.profit_loss_absolute > 0).length;
                    const winRate = run.positions.length > 0 ? winningPositions / run.positions.length : 0;
                    return sum + winRate;
                  }
                  return sum;
                }, 0) / validRuns.length : 0,
              profitFactor: validRuns.reduce((sum: number, run: BacktestRun, _: number, arr: BacktestRun[]) => 
                sum + (run.metrics.profit_factor || 0) / arr.length, 0),
              totalPnL: validRuns.reduce((sum: number, run: BacktestRun) => 
                sum + run.metrics.total_return_pct, 0),
              maxDrawdown: validRuns.length > 0 ? 
                Math.max(...validRuns.map((run: BacktestRun) => run.metrics.max_drawdown || 0)) : 0,
              sharpeRatio: validRuns.reduce((sum: number, run: BacktestRun, _: number, arr: BacktestRun[]) => 
                sum + (run.metrics.sharpe_ratio || 0) / arr.length, 0)
            }
          };
          
          setBacktestResults(transformedResults);
          setShowBacktestResults(true);
          showToast('Backtest completed successfully', 'success');
        } else {
          throw new Error('Invalid backtest response format');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error running backtest';
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
        showToast(errorMessage, 'error');
      } finally {
        setIsBacktesting(false);
      }
    }
  };

  const handleDeploy = async (instrumentId: number) => {
    try {
      const newSet = new Set(deployingInstruments);
      newSet.add(instrumentId);
      setDeployingInstruments(newSet);
      
      const response = await fetch('/api/strategy/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategyId: initialData?.id,
          instrumentId,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        setErrors(prev => ({
          ...prev,
          submit: `Failed to deploy strategy for instrument ${instrumentId}`
        }));
        showError(
          `Failed to deploy strategy for instrument ${instrumentId}`, 
          'The server returned an error. Please check your configuration and try again.'
        );
      } else {
        showSuccess(
          `Strategy deployed successfully for instrument ${instrumentId}`,
          'Your strategy is now live and will execute trades based on your defined conditions.'
        );
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Error connecting to server'
      }));
      showToast('Error connecting to server', 'error');
    } finally {
      const newSet = new Set(deployingInstruments);
      newSet.delete(instrumentId);
      setDeployingInstruments(newSet);
    }
  };

  const handleDeployAll = async () => {
    if (!backtestResults) return;
    
    const instrumentIds = backtestResults.results.map(r => r.instrumentId);
    for (const instrumentId of instrumentIds) {
      await handleDeploy(instrumentId);
    }
  };

  const renderBacktestResults = () => {
    // Return loading animation if we're still backtesting
    if (isBacktesting) {
      return (
        <Box 
          ref={backtestResultsRef}
          sx={{ 
            mt: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 8
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">Running Backtest...</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we simulate your strategy on historical data.
          </Typography>
        </Box>
      );
    }

    if (!backtestResults) return null;

    // Function to toggle positions display
    const togglePositions = (instrumentId: number) => {
      if (expandedInstrument === instrumentId) {
        setExpandedInstrument(null);
        setShowingPositions(false);
      } else {
        setExpandedInstrument(instrumentId);
        setShowingPositions(true);
      }
    };

    return (
      <Box ref={backtestResultsRef} sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Backtest Results</Typography>
        <TableContainer 
          component={Paper}
          sx={{ 
            animation: 'fadeIn 0.8s ease-in-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Instrument</TableCell>
                <TableCell align="right">Total Trades</TableCell>
                <TableCell align="right">Win/Loss</TableCell>
                <TableCell align="right">Win Rate</TableCell>
                <TableCell align="right">Profit Factor</TableCell>
                <TableCell align="right">Total P&L</TableCell>
                <TableCell align="right">Max Drawdown</TableCell>
                <TableCell align="right">Sharpe Ratio</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell align="right"><strong>{backtestResults.aggregatedMetrics.totalTrades}</strong></TableCell>
                <TableCell align="right">
                  <strong>
                    {backtestResults.aggregatedMetrics.winningTrades} / {backtestResults.aggregatedMetrics.losingTrades}
                  </strong>
                </TableCell>
                <TableCell align="right"><strong>{(backtestResults.aggregatedMetrics.winRate * 100).toFixed(2)}%</strong></TableCell>
                <TableCell align="right"><strong>{backtestResults.aggregatedMetrics.profitFactor.toFixed(2)}</strong></TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: backtestResults.aggregatedMetrics.totalPnL >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 'bold'
                  }}
                >
                  {backtestResults.aggregatedMetrics.totalPnL.toFixed(2)}%
                </TableCell>
                <TableCell align="right"><strong>{backtestResults.aggregatedMetrics.maxDrawdown.toFixed(2)}%</strong></TableCell>
                <TableCell align="right"><strong>{backtestResults.aggregatedMetrics.sharpeRatio.toFixed(2)}</strong></TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleDeployAll}
                    disabled={deployingInstruments.size > 0}
                  >
                    {deployingInstruments.size > 0 ? (
                      <CircularProgress size={20} />
                    ) : 'Deploy All'}
                  </Button>
                </TableCell>
              </TableRow>
              {backtestResults.results.map((result) => (
                <React.Fragment key={result.instrumentId}>
                  <TableRow 
                    hover
                    onClick={() => togglePositions(result.instrumentId)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{result.instrumentName}</TableCell>
                    <TableCell align="right">{result.totalTrades}</TableCell>
                    <TableCell align="right">
                      {result.winningTrades} / {result.losingTrades}
                    </TableCell>
                    <TableCell align="right">{(result.winRate * 100).toFixed(2)}%</TableCell>
                    <TableCell align="right">{result.profitFactor.toFixed(2)}</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: result.totalPnL >= 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      {result.totalPnL.toFixed(2)}%
                    </TableCell>
                    <TableCell align="right">{result.maxDrawdown.toFixed(2)}%</TableCell>
                    <TableCell align="right">{result.sharpeRatio.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleDeploy(result.instrumentId);
                        }}
                        disabled={deployingInstruments.has(result.instrumentId)}
                      >
                        {deployingInstruments.has(result.instrumentId) ? (
                          <CircularProgress size={20} />
                        ) : 'Deploy'}
                      </Button>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Add Metrics Section below the table */}
        <MetricsSection backtestResults={backtestResults} />
        {/* Performance Charts Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Win/Loss Ratio</Typography>
                <Box sx={{ 
                  display: 'flex', 
                  height: 40, 
                  borderRadius: 1, 
                  overflow: 'hidden', 
                  mb: 1
                }}>
                  <Box 
                    sx={{ 
                      width: `${(backtestResults.aggregatedMetrics.winRate || 0) * 100}%`, 
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    {backtestResults.aggregatedMetrics.winningTrades || 0}
                  </Box>
                  <Box 
                    sx={{ 
                      width: `${100 - ((backtestResults.aggregatedMetrics.winRate || 0) * 100)}%`, 
                      bgcolor: 'error.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    {backtestResults.aggregatedMetrics.losingTrades || 0}
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Win Rate: {((backtestResults.aggregatedMetrics.winRate || 0) * 100).toFixed(2)}%
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Key Statistics</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Total Trades:</Typography>
                    <Typography variant="body2">{backtestResults.aggregatedMetrics.totalTrades || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Profit Factor:</Typography>
                    <Typography variant="body2">{(backtestResults.aggregatedMetrics.profitFactor || 0).toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Max Drawdown:</Typography>
                    <Typography variant="body2">{(backtestResults.aggregatedMetrics.maxDrawdown || 0).toFixed(2)}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Sharpe Ratio:</Typography>
                    <Typography variant="body2">{(backtestResults.aggregatedMetrics.sharpeRatio || 0).toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  const fetchStrategy = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/strategy/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const strategyData = data.data;
        
        // First fetch the instrument details
        let instrumentsData: Instrument[] = [];
        if (strategyData.instruments && strategyData.instruments.length > 0) {
          instrumentsData = await fetchInstrumentsByIds(strategyData.instruments);
          setSelectedInstruments(instrumentsData);
        }
        
        const entryConditions = parseExpressions(strategyData.entry_expression);
        const exitConditions = parseExpressions(strategyData.exit_expression);
        
        const formData: FormData = {
          id: strategyData.id,
          name: strategyData.name,
          description: strategyData.description,
          instrumentType: strategyData.instrument_type || 'equity',
          buyOrSell: strategyData.position_type === 'LONG' ? 'buy' : 'sell',
          instruments: strategyData.instruments || [],
          candlestickType: strategyData.chart_type || 'CANDLESTICK',
          timeframe: strategyData.chart_timeframe,
          tradeType: strategyData.trade_type || 'MIS',
          maxAllocation: strategyData.capital?.toString() || '',
          maxQuantity: strategyData.qty?.toString() || '',
          entryConditions,
          exitConditions,
          entryOptionLegs: strategyData.entry_option_legs || [],
          exitOptionLegs: strategyData.exit_option_legs || [],
          expirationStrategy: strategyData.expiration_strategy || 'CLOSE',
          stopLoss: strategyData.stop_loss?.toString() || '',
          stopLossType: strategyData.stop_loss_type || 'ABSOLUTE',
          targetProfit: strategyData.target_profit?.toString() || '',
          targetProfitType: strategyData.target_profit_type || 'ABSOLUTE',
          trailingStopLoss: strategyData.trailing_stop_loss?.toString() || '',
          trailingStopLossType: strategyData.trailing_stop_loss_type || 'ABSOLUTE',
          initialCapital: strategyData.capital?.toString() || '',
          entryStartTime: strategyData.entry_start_time ? dayjs(strategyData.entry_start_time) : null,
          entryEndTime: strategyData.entry_end_time ? dayjs(strategyData.entry_end_time) : null,
          startDate: strategyData.start_date ? dayjs(strategyData.start_date) : null,
          endDate: strategyData.end_date ? dayjs(strategyData.end_date) : null,
          brickSize: strategyData.brickSize || null,
        };
        
        setFormData(formData);
        // Reset unsaved changes when loading a strategy
        setHasUnsavedChanges(false);
      } else {
        throw new Error(data.error || 'Failed to fetch strategy');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const savedStrategy = await handleSave();
    // If we saved successfully and got a strategy ID, update the form data
    if (savedStrategy?.id && !formData.id) {
      setFormData(prev => ({
        ...prev,
        id: savedStrategy.id
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center', 
        mb: 3,
        pl: 2,
        pt: 2
      }}>
        <Box sx={{ flex: 1 }}>
          {pageTitle && (
            <Typography variant="h4">
              {pageTitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              name="instrumentTypeRadio"
              value={formData.instrumentType === 'options' ? 'options' : 'equity'}
              onChange={(e) => handleChange('instrumentType')(e.target.value)}
            >
              <FormControlLabel value="equity" control={<Radio />} label="Equity / Futures" />
              <FormControlLabel value="options" control={<Radio />} label="Options" />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', mr: 2 }}>
          <Button 
            variant="text" 
            onClick={toggleExpandAll}
            size="small"
          >
            {isAllExpanded ? 'Collapse All' : 'Expand All'}
          </Button>
        </Box>
      </Box>

      {sections.map((section) => (
        <Accordion
          key={section.id}
          expanded={expandedSections.includes(section.id)}
          onChange={handleAccordionChange(section.id)}
          sx={{
            mb: 2,
            '&:before': { display: 'none' },
            boxShadow: 'none',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: '8px !important',
            overflow: 'hidden',
            '&.Mui-expanded': {
              margin: '0 0 16px 0',
            },
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{
              borderBottom: (theme) => 
                expandedSections.includes(section.id) 
                  ? `1px solid ${theme.palette.divider}` 
                  : 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {section.title}
              </Typography>
              <Tooltip 
                title={isSectionComplete(section.id) ? "Section is complete" : "Section is incomplete"}
                arrow
              >
                {isSectionComplete(section.id) ? (
                  <CheckCircle color="success" sx={{ fontSize: 20 }} />
                ) : (
                  <Cancel color="error" sx={{ fontSize: 20 }} />
                )}
              </Tooltip>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            {section.component}
          </AccordionDetails>
        </Accordion>
      ))}
      
      <InstrumentSelector
        open={isInstrumentSelectorOpen}
        onClose={() => setInstrumentSelectorOpen(false)}
        onSelect={handleInstrumentSelect}
        selectedInstruments={selectedInstruments}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading || (initialData && !hasUnsavedChanges)}
          type="submit"
        >
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
        <Button 
          variant="contained" 
          onClick={handleBacktest}
          disabled={isBacktesting || (initialData && hasUnsavedChanges)}
        >
          {isBacktesting ? <CircularProgress size={24} /> : 'Backtest'}
        </Button>
      </Box>

      {showBacktestResults && renderBacktestResults()}
    </form>
  );
};