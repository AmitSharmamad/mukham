// Import the indicators data
// In webpack/Next.js environment, we need to directly import the JSON
import indicators_data from '../../indicators.json';

export interface IndicatorParameter {
  name: string;
  type: 'string' | 'number';
  enum?: string[];
  default?: any;
  required?: boolean;
}

// Interface for the new indicator structure
export interface IndicatorDefinition {
  name: string;
  label: string;
  description: string;
  type: string;
  config: IndicatorParameter[];
}

// Helper function to convert the JSON structure to a map of indicator definitions
const processIndicatorData = (): Record<string, IndicatorDefinition> => {
  const result: Record<string, IndicatorDefinition> = {};
  
  // Process each indicator in the JSON file
  // The new JSON structure has name, label, description, type, and config fields
  Object.entries(indicators_data).forEach(([indicator, definition]) => {
    result[indicator] = definition as unknown as IndicatorDefinition;
  });

  return result;
};

export const indicators = processIndicatorData();

// Get the default values for an indicator
export const getIndicatorDefaults = (indicator: string): Record<string, any> => {
  const indicatorDef = indicators[indicator];
  if (!indicatorDef) return {};
  
  return indicatorDef.config.reduce((defaults, param) => {
    if (param.default !== undefined) {
      defaults[param.name] = param.default;
    }
    return defaults;
  }, {} as Record<string, any>);
};

// Get available indicators list with their names
export const getAvailableIndicators = (): { value: string; label: string }[] => {
  return Object.entries(indicators).map(([key, indicator]) => ({
    value: key,
    label: indicator.label || key
  }));
};

// Get parameter options for enum type parameters
export const getParameterOptions = (indicator: string, paramName: string): { value: string; label: string }[] | null => {
  const indicatorDef = indicators[indicator];
  if (!indicatorDef) return null;
  
  const param = indicatorDef.config.find(p => p.name === paramName);
  if (!param || !param.enum) return null;
  
  return param.enum.map(value => ({
    value: value,
    label: value
  }));
};

// Check if an indicator has all required parameters
export const isIndicatorConfigComplete = (indicator: string, config: Record<string, any>): boolean => {
  const indicatorDef = indicators[indicator];
  if (!indicatorDef) return false;
  
  return indicatorDef.config
    .filter(param => param.required)
    .every(param => config[param.name] !== undefined);
};

// Get formatted string representation of an indicator with its parameters
export const formatIndicatorString = (indicator: string, config: Record<string, any>): string => {
  const indicatorDef = indicators[indicator];
  if (!indicatorDef) return indicator;
  
  // If this is a price point indicator or a number, just return the value
  if (['HIGH', 'LOW', 'CLOSE', 'VOLUME', 'Number'].includes(indicator)) {
    if (indicator === 'Number') {
      return config.value?.toString() || '0';
    }
    return `${indicator}(${config.offset || 0})`;
  }
  
  // Create the parameter string based on the indicator definition
  const paramString = indicatorDef.config
    .map(param => config[param.name] !== undefined ? config[param.name] : param.default)
    .join(', ');
  
  return `${indicator}(${paramString})`;
};
