import { FormData, ApiFormData } from '../types/strategyForm';
import { stringifyConditions } from '../components/StrategyBuilder/utils/indicatorExpressionUtils';

/**
 * Converts form data to API data format
 */
export const convertFormToApiData = (formData: FormData): ApiFormData => {
  return {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    instrument_type: formData.instrumentType,
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
    capital: parseFloat(formData.initialCapital),
    max_trades: 100, // Default value for now
    entry_start_time: formData.entryStartTime ? formData.entryStartTime.format('HH:mm') : null,
    entry_end_time: formData.entryEndTime ? formData.entryEndTime.format('HH:mm') : null,
    start_date: formData.startDate ? formData.startDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss') + '+05:30' : null,
    end_date: formData.endDate ? formData.endDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss') + '+05:30' : null,
  };
};
