import { FormData, ApiFormData } from '../types/strategyForm';
import { stringifyConditions } from '../components/StrategyBuilder/utils/indicatorExpressionUtils';

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
    if (segment === 'F\\u0026O' || segment === 'F%26O') {
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
    entry_option_legs: formData.entryOptionLegs,
    exit_option_legs: formData.exitOptionLegs,
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
    start_date: formData.startDate ? formData.startDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss') + '+05:30' : null,
    end_date: formData.endDate ? formData.endDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss') + '+05:30' : null,
  };
};
