import { FormData, ApiFormData } from '../types/strategyForm';
import { stringifyConditions } from '../components/StrategyBuilder/utils/indicatorExpressionUtils';

/**
 * Normalizes segment values from API to handle different encodings
 */
export const normalizeSegment = (segment: string): string => {
  // Handle various encodings of F&O that might come from the backend
  if (segment === 'F\\u0026O' || segment === 'F\u0026O' || segment === 'F%26O') {
    return 'F&O';
  }
  return segment;
};

/**
 * Converts API segment to instrumentType
 */
export const segmentToInstrumentType = (segment: string): 'equity' | 'futures' | 'options' => {
  const normalizedSegment = normalizeSegment(segment);
  
  if (normalizedSegment === 'F&O') {
    return 'options'; // F&O maps to options in the form
  }
  return 'equity'; // EQ and other segments map to equity
};

/**
 * Converts API strategy_type to form strategyType for F&O strategies
 */
export const apiStrategyTypeToFormType = (apiStrategyType: string): 'expression' | 'time-based' | '' => {
  switch (apiStrategyType) {
    case 'TIME_BASED':
      return 'time-based';
    case 'CONDITIONAL':
      return 'expression';
    default:
      return '';
  }
};

/**
 * Converts form data to API data format
 */
export const convertFormToApiData = (formData: FormData): ApiFormData => {
  // Map instrumentType to segment
  const getSegment = (instrumentType: string): string => {
    let segment: string;
    switch (instrumentType) {
      case 'equity':
        segment = 'EQ';
        break;
      case 'options':
      case 'futures':
        segment = 'F&O';
        break;
      default:
        segment = 'EQ'; // Default fallback
    }
    
    // Ensure F&O is properly formatted (not URL-encoded)
    if (segment === 'F\\u0026O' || segment === 'F\u0026O' || segment === 'F%26O') {
      segment = 'F&O';
    }
    
    return segment;
  };

  // Map strategy type based on segment and form data
  const getStrategyType = (instrumentType: string, strategyType: string): 'CONDITIONAL' | 'TIME_BASED' => {
    if (instrumentType === 'equity') {
      // For EQ segment, always send CONDITIONAL
      return 'CONDITIONAL';
    } else {
      // For F&O segment, map the form strategy type
      return strategyType === 'time-based' ? 'TIME_BASED' : 'CONDITIONAL';
    }
  };

  // Transform option legs for API
  // This function converts the option legs from the form format to the API format
  // and combines entry and exit legs into a single array for the API
  const transformOptionLegs = (legs: any[]): any[] => {
    if (!legs || !Array.isArray(legs)) return [];
    
    return legs.map((leg, index) => {
      // Only include id if it's a valid UUID (not the temporary leg_* format)
      const isValidUUID = leg.id && leg.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      
      // Determine the correct segment value based on leg type
      let segmentValue: string;
      if (leg.segment === 'Options' || leg.segment === 'Futures') {
        segmentValue = 'F&O';
      } else {
        segmentValue = 'EQ'; // Default to EQ for equity or any other type
      }
      
      const legData: any = {
        leg_sequence: index + 1, // Sequential numbering for legs
        select_index: leg.selectedInstrument?.symbol || leg.selectedInstrument?.instrument || 'NIFTY', // Default to NIFTY if not available
        exchange_security_id: leg.selectedInstrument?.exchange_security_id || leg.selectedInstrument?.value, // From Add Instrument dropdown
        asset: leg.instrumentType?.toUpperCase() || 'INDEX', // Convert 'Index'/'Stock' to 'INDEX'/'STOCK'
        exchange: leg.exchange || 'NSE', // Exchange from the leg
        instrument_type: leg.segment === 'Options' ? 'OPTIONS' : leg.segment?.toUpperCase(), // Convert segment to uppercase
        segment: segmentValue, // Always set to either "F&O" or "EQ"
        option_type: leg.optionType === 'CE' ? 'CALL' : leg.optionType === 'PE' ? 'PUT' : leg.optionType,
        action_type: leg.buySell?.toUpperCase(), // 'BUY' or 'SELL'
        strike_type: leg.strikeType || 'ATM', // Always include strikeType, default to 'ATM' if not provided
        strike_offset: leg.strikeType ? parseInt(leg.strikeType.replace(/[^\d]/g, '')) || 0 : 0, // Extract numeric offset from strike type
        total_lot: parseInt(leg.lots) || 1,
        order_type: 'MARKET', // Default to MARKET order
        expiry_type: leg.expiryType?.toUpperCase() || 'MONTHLY',
        expiry_cycle: leg.expiry ? leg.expiry.toUpperCase() : 'CURRENT',
      };
      
      // Only include id for existing legs (when editing), not for new legs
      if (isValidUUID) {
        legData.id = leg.id;
      }
      
      return legData;
    });
  };

  // Combine entry and exit option legs
  const allOptionLegs = [
    ...(formData.entryOptionLegs || []),
    ...(formData.exitOptionLegs || [])
  ];

  return {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    instrument_type: formData.instrumentType,
    segment: getSegment(formData.instrumentType),
    strategy_type: getStrategyType(formData.instrumentType, formData.strategyType),
    position_type: formData.buyOrSell === 'buy' ? 'LONG' : 'SHORT',
    instruments: formData.instruments,
    chart_type: formData.candlestickType,
    chart_timeframe: formData.timeframe,
    trade_type: formData.tradeType,
    brick_size: formData.brickSize ? parseInt(formData.brickSize) : undefined,
    qty: parseInt(formData.maxQuantity),
    max_allocation: parseFloat(formData.maxAllocation),
    entry_expression: stringifyConditions(formData.entryConditions),
    exit_expression: stringifyConditions(formData.exitConditions),
    option_legs: transformOptionLegs(allOptionLegs), // Transformed combined option legs
    expiration_strategy: formData.expirationStrategy,
    target_profit: parseFloat(formData.targetProfit),
    target_profit_type: formData.targetProfitType,
    stop_loss: parseFloat(formData.stopLoss),
    stop_loss_type: formData.stopLossType,
    trailing_stop_loss: parseFloat(formData.trailingStopLoss),
    trailing_stop_loss_type: formData.trailingStopLossType,
    capital: 100000, // Default capital value since it's removed from form
    brokerage: formData.brokerage && formData.brokerage.trim() !== '' ? parseInt(formData.brokerage) : undefined,
    slippage: formData.slippage && formData.slippage.trim() !== '' ? parseFloat(formData.slippage) : undefined,
    max_trades: 100, // Default value for now
    entry_start_time: formData.entryStartTime ? formData.entryStartTime.format('HH:mm:ss') : null,
    entry_end_time: formData.entryEndTime ? formData.entryEndTime.format('HH:mm:ss') : null,
    trading_days: formData.tradingDays,
    start_date: formData.startDate ? formData.startDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss') + '+05:30' : null,
    end_date: formData.endDate ? formData.endDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss') + '+05:30' : null,
  };
};

/**
 * Maps trading days from API response to form format
 * API sends full day names or abbreviations, form expects specific abbreviations
 */
export const mapApiTradingDaysToForm = (apiTradingDays: string[]): string[] => {
  if (!apiTradingDays || !Array.isArray(apiTradingDays)) {
    return [];
  }

  const dayMapping: { [key: string]: string } = {
    // Full day names to abbreviations
    'MONDAY': 'MON',
    'TUESDAY': 'TUE', 
    'WEDNESDAY': 'WED',
    'THURSDAY': 'THU',
    'FRIDAY': 'FRI',
    // Common abbreviations
    'MON': 'MON',
    'TUE': 'TUE',
    'WED': 'WED',
    'THU': 'THU',
    'FRI': 'FRI',
    // Alternative abbreviations
    'TUES': 'TUE',
    'THURS': 'THU',
    // In case they come as numbers (1=Monday, 2=Tuesday, etc.)
    '1': 'MON',
    '2': 'TUE',
    '3': 'WED',
    '4': 'THU',
    '5': 'FRI',
  };

  return apiTradingDays
    .map(day => dayMapping[day.toUpperCase()] || day)
    .filter(day => ['MON', 'TUE', 'WED', 'THU', 'FRI'].includes(day))
    .filter((day, index, arr) => arr.indexOf(day) === index); // Remove duplicates
};
