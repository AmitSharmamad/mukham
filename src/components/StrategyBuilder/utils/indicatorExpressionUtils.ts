export interface IndicatorConfig {
  period?: number;
  value?: number;
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
  deviations?: number;
  offset?: number;
  field?: string;
  type?: string;
  multiplier?: number;
  atrPeriod?: number;
  accelerationFactor?: number;
  maxAcceleration?: number;
  longPeriod?: number;
  shortPeriod?: number;
  period1?: number;
  period2?: number;
  period3?: number;
}

export interface Indicator {
  name: string;
  config: IndicatorConfig;
  value?: string; // Making value optional since it's not always needed
}

export interface IndicatorExpression {
  indicator1: Indicator;
  operator: string;
  indicator2: Indicator;
  logicalOperator?: string;
  isNested?: boolean;
  nestedConditions?: IndicatorExpression[];
}

/**
 * Returns a formatted string representation of an indicator's formula
 */
export const getIndicatorFormula = (name: string): string => {
  switch (name) {
    case 'SUPERTREND':
      return 'SUPERTREND(field, period, multiplier, offset)';
    case 'MACD':
      return 'MACD(field, fastPeriod, slowPeriod, signalPeriod, offset)';
    case 'VORTEX':
      return 'VORTEX(period, offset)';
    case 'BOLLINGER':
      return 'BOLLINGER(field, period, deviations, offset)';
    case 'LBB':
      return 'LBB(field, period, deviations, type, offset)';
    case 'DMI':
      return 'DMI(period, offset)';
    case 'KELTNER':
      return 'KELTNER(field, period, atrPeriod, multiplier, offset)';
    case 'PSAR':
      return 'PSAR(accelerationFactor, maxAcceleration, offset)';
    case 'FISHER':
      return 'FISHER(period, offset)';
    case 'MFI':
      return 'MFI(period, offset)';
    case 'VWAP':
      return 'VWAP(offset)';
    case 'TSI':
      return 'TSI(field, longPeriod, shortPeriod, signalPeriod, offset)';
    case 'VO':
      return 'VO(fastPeriod, slowPeriod, offset)';
    case 'UO':
      return 'UO(period1, period2, period3, offset)';
    case 'Number':
      return 'Number(value)';
    case 'RSI':
      return 'RSI(field, period, offset)';
    case 'BB_UPPER':
    case 'BB_LOWER':
    case 'BB_MIDDLE':
      return `${name}(field, period, deviations, offset)`;
    case 'OPEN':
    case 'HIGH':
    case 'LOW':
    case 'CLOSE':
    case 'VOLUME':
      return `${name}(offset)`;
    default:
      return `${name}(field, period, offset)`;
  }
};

/**
 * Returns a formatted string with the actual values for an indicator
 */
export const getIndicatorString = (indicator: Indicator): string => {
  if (!indicator.name) return '';
  
  switch (indicator.name) {
    case 'SMA':
    case 'EMA':
    case 'RSI':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 14}, ${indicator.config?.offset || 0})`;
    case 'SUPERTREND':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 10}, ${indicator.config?.multiplier || 3}, ${indicator.config?.offset || 0})`;
    case 'MACD':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.fastPeriod || 12}, ${indicator.config?.slowPeriod || 26}, ${indicator.config?.signalPeriod || 9}, ${indicator.config?.offset || 0})`;
    case 'VORTEX':
      return `${indicator.name}(${indicator.config?.period || 14}, ${indicator.config?.offset || 0})`;
    case 'BOLLINGER':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 20}, ${indicator.config?.deviations || 2}, ${indicator.config?.offset || 0})`;
    case 'LBB':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 20}, ${indicator.config?.deviations || 2}, ${indicator.config?.type || 'TRIPLE'}, ${indicator.config?.offset || 0})`;
    case 'DMI':
      return `${indicator.name}(${indicator.config?.period || 14}, ${indicator.config?.offset || 0})`;
    case 'KELTNER':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 20}, ${indicator.config?.atrPeriod || 10}, ${indicator.config?.multiplier || 2}, ${indicator.config?.offset || 0})`;
    case 'PSAR':
      return `${indicator.name}(${indicator.config?.accelerationFactor || 0.02}, ${indicator.config?.maxAcceleration || 0.2}, ${indicator.config?.offset || 0})`;
    case 'FISHER':
      return `${indicator.name}(${indicator.config?.period || 10}, ${indicator.config?.offset || 0})`;
    case 'MFI':
      return `${indicator.name}(${indicator.config?.period || 14}, ${indicator.config?.offset || 0})`;
    case 'VWAP':
      return `${indicator.name}(${indicator.config?.offset || 0})`;
    case 'TSI':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.longPeriod || 25}, ${indicator.config?.shortPeriod || 13}, ${indicator.config?.signalPeriod || 13}, ${indicator.config?.offset || 0})`;
    case 'VO':
      return `${indicator.name}(${indicator.config?.fastPeriod || 14}, ${indicator.config?.slowPeriod || 28}, ${indicator.config?.offset || 0})`;
    case 'UO':
      return `${indicator.name}(${indicator.config?.period1 || 7}, ${indicator.config?.period2 || 14}, ${indicator.config?.period3 || 28}, ${indicator.config?.offset || 0})`;
    case 'BB_UPPER':
    case 'BB_LOWER':
    case 'BB_MIDDLE':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 20}, ${indicator.config?.deviations || 2}, ${indicator.config?.offset || 0})`;
    case 'Number':
      return indicator.config?.value?.toString() || '0';
    case 'OPEN':
    case 'HIGH':
    case 'LOW':
    case 'CLOSE':
    case 'VOLUME':
      return `${indicator.name}(${indicator.config?.offset || 0})`;
    case 'MARKET_POSITION':
      return indicator.name;
    default:
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || ''}, ${indicator.config?.offset || 0})`;
  }
};

/**
 * Validates if an indicator has all required configuration
 */
export const isIndicatorComplete = (indicator: Indicator): boolean => {
  if (!indicator.name) return false;
  
  switch (indicator.name) {
    case 'SMA':
    case 'EMA':
    case 'RSI':
      return !!indicator.config?.period;
    case 'SUPERTREND':
      return !!(indicator.config?.period && indicator.config?.multiplier);
    case 'MACD':
      return !!(indicator.config?.fastPeriod && indicator.config?.slowPeriod && indicator.config?.signalPeriod);
    case 'VORTEX':
      return !!indicator.config?.period;
    case 'BOLLINGER':
    case 'BB_UPPER':
    case 'BB_LOWER':
    case 'BB_MIDDLE':
      return !!(indicator.config?.period && indicator.config?.deviations);
    case 'LBB':
      return !!(indicator.config?.period && indicator.config?.deviations && indicator.config?.type);
    case 'DMI':
      return !!indicator.config?.period;
    case 'KELTNER':
      return !!(indicator.config?.period && indicator.config?.atrPeriod && indicator.config?.multiplier);
    case 'PSAR':
      return !!(indicator.config?.accelerationFactor && indicator.config?.maxAcceleration);
    case 'FISHER':
    case 'MFI':
      return !!indicator.config?.period;
    case 'VWAP':
    case 'OPEN':
    case 'HIGH':
    case 'LOW':
    case 'CLOSE':
    case 'VOLUME':
    case 'MARKET_POSITION':
      return true;
    case 'TSI':
      return !!(indicator.config?.longPeriod && indicator.config?.shortPeriod && indicator.config?.signalPeriod);
    case 'VO':
      return !!(indicator.config?.fastPeriod && indicator.config?.slowPeriod);
    case 'UO':
      return !!(indicator.config?.period1 && indicator.config?.period2 && indicator.config?.period3);
    case 'Number':
      return indicator.config?.value !== undefined;
    default:
      return !!indicator.config?.period;
  }
};

/**
 * Returns a stringified version of an indicator expression
 */
export const stringifyExpression = (expression: IndicatorExpression): string => {
  const expr = `${getIndicatorString(expression.indicator1)} ${expression.operator} ${getIndicatorString(expression.indicator2)}`;
  return expr;
};

/**
 * Converts an array of indicator expressions into a single string formula
 */
export const stringifyConditions = (conditions: IndicatorExpression[]): string => {
  if (conditions.length === 0) return '';
  if (conditions.length === 1) return stringifyExpression(conditions[0]);

  return conditions.reduce((acc, condition, index) => {
    if (index === 0) return stringifyExpression(condition);
    return `${acc} ${condition.logicalOperator} ${stringifyExpression(condition)}`;
  }, '');
};

/**
 * Parses a string expression back into an array of indicator expressions
 */
export const parseExpressions = (expressionStr: string): IndicatorExpression[] => {
  try {
    if (!expressionStr || expressionStr.trim() === '') {
      return [];
    }
    
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
        
        const parseParams = (params: string, indicatorName: string) => {
          const paramArray = params.split(',').map(p => p.trim());
          
          if (indicatorName === 'Number') {
            return { value: parseFloat(paramArray[0]) || 0 };
          }
          
          // Special case for LBB which has type parameter
          if (indicatorName === 'LBB') {
            return {
              field: paramArray[0] || 'CLOSE',
              period: parseInt(paramArray[1]) || 20,
              deviations: parseInt(paramArray[2]) || 2,
              type: paramArray[3] || 'TRIPLE',
              offset: parseInt(paramArray[4]) || 0
            };
          }
          
          // Default case
          const [field = 'CLOSE', ...rest] = paramArray;
          return {
            field,
            period: parseInt(rest[0]) || 0,
            offset: parseInt(rest[1]) || 0
          };
        };
        
        expressions.push({
          indicator1: {
            name: indicator1Name,
            config: parseParams(indicator1Params, indicator1Name),
            value: expr.split(operator)[0].trim()
          },
          operator,
          indicator2: {
            name: indicator2Name,
            config: parseParams(indicator2Params, indicator2Name),
            value: expr.split(operator)[1].trim()
          },
          logicalOperator: logicalOp
        });
      }
    }
    return expressions;
  } catch (err) {
    console.error('Error parsing expression string:', err);
    return [];
  }
};
