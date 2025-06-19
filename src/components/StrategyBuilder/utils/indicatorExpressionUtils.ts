import { formatIndicatorString, isIndicatorConfigComplete } from '../../../services/indicatorService';

export interface IndicatorConfig {
  // Generic config that can hold any parameters from indicators.json
  [key: string]: string | number | boolean | undefined;
  value?: number; // For Number type indicator
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
  if (['HIGH', 'LOW', 'CLOSE', 'VOLUME'].includes(name)) {
    return `${name}(offset)`;
  }
  
  if (name === 'Number') {
    return 'Number(value)';
  }
  
  // Use the formatIndicatorString with empty config to get a template
  return formatIndicatorString(name, {});
};

/**
 * Returns a formatted string with the actual values for an indicator
 */
export const getIndicatorString = (indicator: Indicator): string => {
  if (!indicator.name) return '';
  
  // Use the formatIndicatorString from the service
  return formatIndicatorString(indicator.name, indicator.config);
};

/**
 * Validates if an indicator has all required configuration
 */
export const isIndicatorComplete = (indicator: Indicator): boolean => {
  if (!indicator.name) return false;
  
  if (['HIGH', 'LOW', 'CLOSE', 'VOLUME', 'MARKET_POSITION'].includes(indicator.name)) {
    return true;
  }
  
  if (indicator.name === 'Number') {
    return indicator.config?.value !== undefined;
  }
  
  // Use the isIndicatorConfigComplete from the service
  return isIndicatorConfigComplete(indicator.name, indicator.config);
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
          // Handle empty params
          if (!params.trim()) return {};
          
          const paramArray = params.split(',').map(p => p.trim());
          
          if (indicatorName === 'Number') {
            return { value: parseFloat(paramArray[0]) || 0 };
          }
          
          if (['HIGH', 'LOW', 'CLOSE', 'VOLUME'].includes(indicatorName)) {
            return { offset: parseInt(paramArray[0]) || 0 };
          }
          
          // For other indicators, get their parameter names from the indicators.json
          // and map them to the values in the correct order
          const { indicators } = require('../../../services/indicatorService');
          const indicatorDef = indicators[indicatorName];
          
          if (!indicatorDef) {
            return { offset: 0 }; // Default fallback
          }
          
          // Create a config object with the parameter values
          const config: Record<string, any> = {};
          indicatorDef.config.forEach((param, index) => {
            if (index < paramArray.length) {
              const value = paramArray[index];
              // Convert to number if needed
              config[param.name] = param.type === 'number' ? parseFloat(value) || param.default : value;
            } else {
              // Use default if parameter is missing in the string
              config[param.name] = param.default;
            }
          });
          
          return config;
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
