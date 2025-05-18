import { Box, Grid, IconButton, Typography, FormHelperText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Clear as ClearIcon, AutoAwesome as CopilotIcon } from '@mui/icons-material';
import { Select } from '../Select';
import { TextField } from '../TextField';
import { Button } from '../Button';
import { useState, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Default values for indicators
const DEFAULT_INDICATOR_VALUES = {
  // Price indicators
  OPEN: { offset: 0 },
  HIGH: { offset: 0 },
  LOW: { offset: 0 },
  CLOSE: { offset: 0 },
  VOLUME: { offset: 0 },
  
  // Basic Moving Averages
  SMA: { period: 14, offset: 0, field: 'CLOSE' },
  EMA: { period: 9, offset: 0, field: 'CLOSE' },
  
  // Technical Indicators
  SUPERTREND: { period: 10, multiplier: 3, offset: 0, field: 'CLOSE' },
  MACD: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, offset: 0, field: 'CLOSE' },
  VORTEX: { period: 14, offset: 0 },
  BOLLINGER: { period: 20, deviations: 2, offset: 0, field: 'CLOSE' },
  DMI: { period: 14, offset: 0 },
  KELTNER: { period: 20, atrPeriod: 10, multiplier: 2, offset: 0, field: 'CLOSE' },
  PSAR: { accelerationFactor: 0.02, maxAcceleration: 0.2, offset: 0 },
  FISHER: { period: 10, offset: 0 },
  MFI: { period: 14, offset: 0 },
  VWAP: { offset: 0 },
  TSI: { longPeriod: 25, shortPeriod: 13, signalPeriod: 13, offset: 0, field: 'CLOSE' },
  VO: { fastPeriod: 14, slowPeriod: 28, offset: 0 },
  UO: { period1: 7, period2: 14, period3: 28, offset: 0 },
  
  // Utility Indicator
  Number: { value: 0 }
} as const;

const INDICATORS = [
  // Price indicators
  { value: 'OPEN', label: 'Open Price' },
  { value: 'HIGH', label: 'High Price' },
  { value: 'LOW', label: 'Low Price' },
  { value: 'CLOSE', label: 'Close Price' },
  { value: 'VOLUME', label: 'Volume' },
  
  // Basic Moving Averages
  { value: 'SMA', label: 'Simple Moving Average' },
  { value: 'EMA', label: 'Exponential Moving Average' },
  
  // Technical Indicators
  { value: 'SUPERTREND', label: 'SuperTrend' },
  { value: 'MACD', label: 'MACD' },
  { value: 'VORTEX', label: 'Vortex Indicator' },
  { value: 'BOLLINGER', label: 'Bollinger Bands' },
  { value: 'DMI', label: 'Directional Movement Index' },
  { value: 'KELTNER', label: 'Keltner Channels' },
  { value: 'PSAR', label: 'Parabolic SAR' },
  { value: 'FISHER', label: 'Fisher Transform' },
  { value: 'MFI', label: 'Money Flow Index' },
  { value: 'VWAP', label: 'Volume Weighted Average Price' },
  { value: 'TSI', label: 'True Strength Index' },
  { value: 'VO', label: 'Volume Oscillator' },
  { value: 'UO', label: 'Ultimate Oscillator' },
  
  // Utility Indicator
  { value: 'Number', label: 'Number' },
];

const FIELD_OPTIONS = [
  { value: 'CLOSE', label: 'Close' },
  { value: 'OPEN', label: 'Open' },
  { value: 'HIGH', label: 'High' },
  { value: 'LOW', label: 'Low' },
  { value: 'VOLUME', label: 'Volume' },
];

const OPERATORS = [
  { value: 'CrossesAbove', label: 'Crosses Above' },
  { value: 'CrossesBelow', label: 'Crosses Below' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '==', label: '==' },
  { value: '!=', label: '!=' },
];

const LOGICAL_OPERATORS = [
  { value: 'AND', label: 'Match All' },
  { value: 'OR', label: 'Match Any' },
];

const ItemTypes = {
  EXPRESSION: 'expression'
};

interface DragItem {
  type: string;
  index: number;
  parentLevel: number;
  expression: IndicatorExpression;
}

interface IndicatorConfig {
  period?: number;
  value?: number;
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
  deviations?: number;
  offset?: number;
  field?: string;
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

interface Indicator {
  name: string;
  config: IndicatorConfig;
}

// Update IndicatorExpression interface to support nested conditions
interface IndicatorExpression {
  indicator1: Indicator;
  operator: string;
  indicator2: Indicator;
  logicalOperator?: string;
  isNested?: boolean;
  nestedConditions?: IndicatorExpression[];
}

interface NestedExpression extends Omit<IndicatorExpression, 'indicator1' | 'operator' | 'indicator2'> {
  isNested: true;
  nestedConditions: IndicatorExpression[];
}

interface IndicatorComponentProps {
  value: IndicatorExpression;
  onChange: (value: IndicatorExpression) => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

interface IndicatorExpressionBuilderProps {
  value: IndicatorExpression[];
  onChange: (value: IndicatorExpression[]) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  isOptional?: boolean;
}

const getIndicatorFormula = (name: string): string => {
  switch (name) {
    case 'SUPERTREND':
      return 'SUPERTREND(field, period, multiplier, offset)';
    case 'MACD':
      return 'MACD(field, fastPeriod, slowPeriod, signalPeriod, offset)';
    case 'VORTEX':
      return 'VORTEX(period, offset)';
    case 'BOLLINGER':
      return 'BOLLINGER(field, period, deviations, offset)';
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

const getIndicatorString = (indicator: Indicator): string => {
  if (!indicator.name) return '';
  
  switch (indicator.name) {
    case 'SMA':
    case 'EMA':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 14}, ${indicator.config?.offset || 0})`;
    case 'SUPERTREND':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 10}, ${indicator.config?.multiplier || 3}, ${indicator.config?.offset || 0})`;
    case 'MACD':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.fastPeriod || ''}, ${indicator.config?.slowPeriod || ''}, ${indicator.config?.signalPeriod || ''}, ${indicator.config?.offset || 0})`;
    case 'VORTEX':
      return `${indicator.name}(${indicator.config?.period || 14}, ${indicator.config?.offset || 0})`;
    case 'BOLLINGER':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 20}, ${indicator.config?.deviations || 2}, ${indicator.config?.offset || 0})`;
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
    case 'Number':
      return indicator.config?.value?.toString() || '';
    case 'OPEN':
    case 'HIGH':
    case 'LOW':
    case 'CLOSE':
    case 'VOLUME':
      return `${indicator.name}(${indicator.config?.offset || 0})`;
    default:
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || ''}, ${indicator.config?.offset || 0})`;
  }
};

const isIndicatorComplete = (indicator: Indicator): boolean => {
  if (!indicator.name) return false;
  
  switch (indicator.name) {
    case 'SUPERTREND':
      return !!(indicator.config?.period && indicator.config?.multiplier);
    case 'MACD':
      return !!(indicator.config?.fastPeriod && indicator.config?.slowPeriod && indicator.config?.signalPeriod);
    case 'VORTEX':
      return !!indicator.config?.period;
    case 'BOLLINGER':
      return !!(indicator.config?.period && indicator.config?.deviations);
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
      return true;
    case 'TSI':
      return !!(indicator.config?.longPeriod && indicator.config?.shortPeriod && indicator.config?.signalPeriod);
    case 'VO':
      return !!(indicator.config?.fastPeriod && indicator.config?.slowPeriod);
    case 'UO':
      return !!(indicator.config?.period1 && indicator.config?.period2 && indicator.config?.period3);
    case 'Number':
      return indicator.config?.value !== undefined;
    case 'OPEN':
    case 'HIGH':
    case 'LOW':
    case 'CLOSE':
    case 'VOLUME':
      return true;
    default:
      return !!indicator.config?.period;
  }
};

const isExpressionComplete = (expression: IndicatorExpression): boolean => {
  return (
    isIndicatorComplete(expression.indicator1) &&
    !!expression.operator &&
    isIndicatorComplete(expression.indicator2)
  );
};

const getExpressionString = (indicator: Indicator): string => {
  if (!indicator.name) return '';
  
  switch (indicator.name) {
    case 'Number':
      return indicator.config?.value?.toString() || '';
    case 'SUPERTREND':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 10}, ${indicator.config?.multiplier || 3}, ${indicator.config?.offset || 0})`;
    case 'MACD':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.fastPeriod || ''}, ${indicator.config?.slowPeriod || ''}, ${indicator.config?.signalPeriod || ''}, ${indicator.config?.offset || 0})`;
    case 'VORTEX':
      return `${indicator.name}(${indicator.config?.period || 14}, ${indicator.config?.offset || 0})`;
    case 'BOLLINGER':
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || 20}, ${indicator.config?.deviations || 2}, ${indicator.config?.offset || 0})`;
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
    case 'OPEN':
    case 'HIGH':
    case 'LOW':
    case 'CLOSE':
    case 'VOLUME':
      return `${indicator.name}(${indicator.config?.offset || 0})`;
    default:
      return `${indicator.name}(${indicator.config?.field || 'CLOSE'}, ${indicator.config?.period || ''}, ${indicator.config?.offset || 0})`;
  }
};

const getExpressionText = (conditions: IndicatorExpression[]): string => {
  return conditions
    .map((condition: IndicatorExpression, index: number) => {
      if (condition.isNested && condition.nestedConditions) {
        return `(${getExpressionText(condition.nestedConditions)})`;
      }

      const exp1 = getExpressionString(condition.indicator1);
      const exp2 = getExpressionString(condition.indicator2);

      let expression = `${exp1} ${condition.operator} ${exp2}`;
      
      if (index < conditions.length - 1 && condition.logicalOperator) {
        expression += ` ${condition.logicalOperator}`;
      }
      
      return expression;
    })
    .join(' ');
};

const IndicatorComponent = ({ value, onChange, onDelete, showDelete = false }: IndicatorComponentProps) => {
  const [showIndicator1Select, setShowIndicator1Select] = useState(!value.indicator1.name);
  const [showIndicator2Select, setShowIndicator2Select] = useState(!value.indicator2.name);
  const [showOperatorSelect, setShowOperatorSelect] = useState(!value.operator);
  const [editingIndicator, setEditingIndicator] = useState<null | { indicator: Indicator; field: 'indicator1' | 'indicator2' }>(null);
  const [modalConfig, setModalConfig] = useState<IndicatorConfig>({});

  const handleChange = (field: keyof IndicatorExpression, subField?: keyof Indicator) => (newValue: any) => {
    if (subField) {
      onChange({
        ...value,
        [field]: {
          ...value[field as keyof Pick<IndicatorExpression, 'indicator1' | 'indicator2'>],
          [subField]: newValue,
        },
      });
    } else {
      if (field === 'indicator1' || field === 'indicator2') {
        const indicatorType = newValue as string;
        const defaultConfig = DEFAULT_INDICATOR_VALUES[indicatorType as keyof typeof DEFAULT_INDICATOR_VALUES] || {};
        
        onChange({
          ...value,
          [field]: {
            name: newValue,
            config: defaultConfig,
          },
        });

        if (field === 'indicator1') setShowIndicator1Select(false);
        if (field === 'indicator2') setShowIndicator2Select(false);
      } else if (field === 'operator') {
        onChange({
          ...value,
          operator: newValue,
        });
        setShowOperatorSelect(false);
      } else {
        onChange({
          ...value,
          [field]: newValue,
        });
      }
    }
  };

  const handleIndicatorClick = (indicator: Indicator, field: 'indicator1' | 'indicator2') => {
    setEditingIndicator({ indicator, field });
    setModalConfig({ ...indicator.config });
  };

  const handleIndicatorDelete = (field: 'indicator1' | 'indicator2') => {
    onChange({
      ...value,
      [field]: { name: '', config: {} },
    });
    if (field === 'indicator1') setShowIndicator1Select(true);
    if (field === 'indicator2') setShowIndicator2Select(true);
  };

  const handleOperatorDelete = () => {
    onChange({
      ...value,
      operator: '',
    });
    setShowOperatorSelect(true);
  };

  const handleEditClose = () => {
    setEditingIndicator(null);
    setModalConfig({});
  };

  const handleEditSave = () => {
    if (editingIndicator) {
      onChange({
        ...value,
        [editingIndicator.field]: {
          ...value[editingIndicator.field],
          config: modalConfig,
        },
      });
      setEditingIndicator(null);
      setModalConfig({});
    }
  };

  const handleConfigChange = (key: keyof IndicatorConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalConfig(prev => ({
      ...prev,
      [key]: Number(e.target.value)
    }));
  };

  const renderIndicatorSelect = (field: 'indicator1' | 'indicator2') => (
    <Select
      label={`Indicator ${field === 'indicator1' ? '1' : '2'}`}
      options={INDICATORS}
      value={value[field].name || ''}
      onChange={(newValue) => handleChange(field)(newValue)}
      sx={{ width: '100%', minWidth: 200 }}
    />
  );

  const renderOperatorSelect = () => (
    <Select
      label="Operator"
      options={OPERATORS}
      value={value.operator}
      onChange={handleChange('operator')}
      sx={{ width: '100%', minWidth: 150 }}
    />
  );

  const renderIndicatorChip = (indicator: Indicator, field: 'indicator1' | 'indicator2') => {
    if (!indicator.name) return null;
    
    const label = getIndicatorString(indicator);
    const formula = getIndicatorFormula(indicator.name);
    
    return (
      <Tooltip title={`Formula: ${formula}`} arrow placement="top">
        <Chip
          label={label}
          onDelete={() => handleIndicatorDelete(field)}
          onClick={() => handleIndicatorClick(indicator, field)}
          color="primary"
          sx={{
            width: '100%',
            minWidth: 200,
            height: 40,
            border: 'none',
            bgcolor: 'transparent',
            borderBottom: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
            '& .MuiChip-label': {
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              px: 2,
              color: 'text.primary'
            },
            '& .MuiChip-deleteIcon': {
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main'
              }
            },
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        />
      </Tooltip>
    );
  };

  const renderOperatorChip = () => {
    if (!value.operator) return null;

    const label = OPERATORS.find(op => op.value === value.operator)?.label || value.operator;
    return (
      <Chip
        label={label}
        onDelete={handleOperatorDelete}
        color="secondary"
        sx={{
          width: '100%',
          minWidth: 150,
          height: 40,
          border: 'none',
          bgcolor: 'transparent',
          borderBottom: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
          '& .MuiChip-label': {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            px: 2,
            color: 'text.primary'
          },
          '& .MuiChip-deleteIcon': {
            color: 'text.secondary',
            '&:hover': {
              color: 'error.main'
            }
          },
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      />
    );
  };

  const renderParameterModal = () => {
    if (!editingIndicator) return null;

    const { indicator } = editingIndicator;

    return (
      <Dialog open={true} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          Edit {INDICATORS.find(i => i.value === indicator.name)?.label || indicator.name} Parameters
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
          {!['Number', 'OPEN', 'HIGH', 'LOW', 'CLOSE', 'VOLUME', 'VORTEX', 'DMI', 'FISHER', 'MFI', 'VWAP', 'PSAR'].includes(indicator.name) && (
                <Grid item xs={12}>
                  <Select
                    label="Field"
                    options={FIELD_OPTIONS}
                    value={modalConfig.field ?? 'CLOSE'}
                    onChange={(value) => {
                      setModalConfig(prev => ({
                        ...prev,
                        field: value as string
                      }));
                    }}
                    sx={{ width: '100%' }}
                  />
                </Grid>
              )}
              {indicator.name === 'SUPERTREND' ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Period"
                      type="number"
                      value={modalConfig.period ?? 10}
                      onChange={handleConfigChange('period')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Multiplier"
                      type="number"
                      value={modalConfig.multiplier ?? 3}
                      onChange={handleConfigChange('multiplier')}
                      inputProps={{ min: 0, step: 0.1 }}
                    />
                  </Grid>
                </>
              ) : indicator.name === 'MACD' ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Fast Period"
                      type="number"
                      value={modalConfig.fastPeriod ?? 12}
                      onChange={handleConfigChange('fastPeriod')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Slow Period"
                      type="number"
                      value={modalConfig.slowPeriod ?? 26}
                      onChange={handleConfigChange('slowPeriod')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Signal Period"
                      type="number"
                      value={modalConfig.signalPeriod ?? 9}
                      onChange={handleConfigChange('signalPeriod')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </>
              ) : indicator.name === 'VORTEX' || indicator.name === 'DMI' || indicator.name === 'FISHER' || indicator.name === 'MFI' ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Period"
                    type="number"
                    value={modalConfig.period ?? 14}
                    onChange={handleConfigChange('period')}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              ) : indicator.name === 'BOLLINGER' ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Period"
                      type="number"
                      value={modalConfig.period ?? 20}
                      onChange={handleConfigChange('period')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Deviations"
                      type="number"
                      value={modalConfig.deviations ?? 2}
                      onChange={handleConfigChange('deviations')}
                      inputProps={{ min: 0, step: 0.1 }}
                    />
                  </Grid>
                </>
              ) : indicator.name === 'KELTNER' ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Period"
                      type="number"
                      value={modalConfig.period ?? 20}
                      onChange={handleConfigChange('period')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="ATR Period"
                      type="number"
                      value={modalConfig.atrPeriod ?? 10}
                      onChange={handleConfigChange('atrPeriod')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Multiplier"
                      type="number"
                      value={modalConfig.multiplier ?? 2}
                      onChange={handleConfigChange('multiplier')}
                      inputProps={{ min: 0, step: 0.1 }}
                    />
                  </Grid>
                </>
              ) : indicator.name === 'PSAR' ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Acceleration Factor"
                      type="number"
                      value={modalConfig.accelerationFactor ?? 0.02}
                      onChange={handleConfigChange('accelerationFactor')}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Max Acceleration"
                      type="number"
                      value={modalConfig.maxAcceleration ?? 0.2}
                      onChange={handleConfigChange('maxAcceleration')}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                </>
              ) : indicator.name === 'TSI' ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Long Period"
                      type="number"
                      value={modalConfig.longPeriod ?? 25}
                      onChange={handleConfigChange('longPeriod')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Short Period"
                      type="number"
                      value={modalConfig.shortPeriod ?? 13}
                      onChange={handleConfigChange('shortPeriod')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Signal Period"
                      type="number"
                      value={modalConfig.signalPeriod ?? 13}
                      onChange={handleConfigChange('signalPeriod')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </>
              ) : indicator.name === 'VO' ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Fast Period"
                      type="number"
                      value={modalConfig.fastPeriod ?? 14}
                      onChange={handleConfigChange('fastPeriod')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Slow Period"
                      type="number"
                      value={modalConfig.slowPeriod ?? 28}
                      onChange={handleConfigChange('slowPeriod')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </>
              ) : indicator.name === 'UO' ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Period 1"
                      type="number"
                      value={modalConfig.period1 ?? 7}
                      onChange={handleConfigChange('period1')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Period 2"
                      type="number"
                      value={modalConfig.period2 ?? 14}
                      onChange={handleConfigChange('period2')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Period 3"
                      type="number"
                      value={modalConfig.period3 ?? 28}
                      onChange={handleConfigChange('period3')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </>
              ) : indicator.name === 'Number' ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Value"
                    type="number"
                    value={modalConfig.value ?? 0}
                    onChange={handleConfigChange('value')}
                    inputProps={{ step: 'any' }}
                  />
                </Grid>
              ) : indicator.name === 'OPEN' || indicator.name === 'HIGH' || indicator.name === 'LOW' || indicator.name === 'CLOSE' || indicator.name === 'VOLUME' || indicator.name === 'VWAP' ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Offset"
                    type="number"
                    value={modalConfig.offset ?? 0}
                    onChange={handleConfigChange('offset')}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Period"
                      type="number"
                      value={modalConfig.period ?? 14}
                      onChange={handleConfigChange('period')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Offset"
                      type="number"
                      value={modalConfig.offset ?? 0}
                      onChange={handleConfigChange('offset')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="inherit">Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
      <Grid 
        container 
        spacing={2} 
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: 800, mx: 'auto' }}
      >
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {showIndicator1Select ? 
              renderIndicatorSelect('indicator1') : 
              renderIndicatorChip(value.indicator1, 'indicator1')
            }
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {showOperatorSelect ?
              renderOperatorSelect() :
              renderOperatorChip()
            }
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {showIndicator2Select ? 
              renderIndicatorSelect('indicator2') : 
              renderIndicatorChip(value.indicator2, 'indicator2')
            }
          </Box>
        </Grid>

        {showDelete && (
          <Grid item xs={12} sm="auto">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton onClick={onDelete} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        )}
      </Grid>
      {renderParameterModal()}
    </Box>
  );
};

const DraggableIndicatorComponent = ({ 
  value, 
  onChange, 
  onDelete, 
  showDelete, 
  index,
  parentLevel,
  moveExpression 
}: IndicatorComponentProps & { 
  index: number;
  parentLevel: number;
  moveExpression: (dragIndex: number, hoverIndex: number, sourceLevel: number, targetLevel: number) => void;
}) => {
  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: ItemTypes.EXPRESSION,
    item: { type: ItemTypes.EXPRESSION, index, parentLevel, expression: value },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div ref={(node: HTMLDivElement | null) => {
      if (typeof dragRef === 'function') {
        dragRef(node);
      }
    }}>
      <Box
        sx={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move'
        }}
      >
        <IndicatorComponent
          value={value}
          onChange={onChange}
          onDelete={onDelete}
          showDelete={showDelete}
        />
      </Box>
    </div>
  );
};

const DroppableBlock = ({ 
  children, 
  level,
  onDrop 
}: { 
  children: React.ReactNode;
  level: number;
  onDrop: (item: DragItem, targetIndex: number) => void;
}) => {
  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: ItemTypes.EXPRESSION,
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;
      onDrop(item, -1);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  }));

  return (
    <div ref={(node: HTMLDivElement | null) => {
      if (typeof dropRef === 'function') {
        dropRef(node);
      }
    }}>
      <Box
        sx={{
          position: 'relative',
          minHeight: '50px',
          background: isOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          transition: 'background 0.2s ease'
        }}
      >
        {children}
      </Box>
    </div>
  );
};

// AI prompt modal interface
interface AiPromptModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

// AI Prompt Modal Component
const AiPromptModal = ({ open, onClose, onSubmit }: AiPromptModalProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CopilotIcon color="primary" />
        Generate Expression with AI
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, pb: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Describe the trading condition you want to create in natural language, and AI will help generate the appropriate expression.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Describe your trading condition"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="For example: Buy when the 9-period EMA crosses above the 21-period EMA and RSI is above 50"
            sx={{ mt: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<CopilotIcon />}
          disabled={!prompt.trim()}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const IndicatorExpressionBuilder = ({
  value,
  onChange,
  label,
  required,
  error,
  helperText,
  isOptional = false,
  level = 0,
}: IndicatorExpressionBuilderProps & { level?: number }) => {
  const conditions = Array.isArray(value) ? value : [];
  const [aiModalOpen, setAiModalOpen] = useState(false);
  
  const isComplete = useMemo(() => {
    if (conditions.length === 0) return isOptional;
    return conditions.every((condition) => {
      if (condition.isNested && condition.nestedConditions) {
        return condition.nestedConditions.every(nestedCondition => isExpressionComplete(nestedCondition));
      }
      return isExpressionComplete(condition);
    });
  }, [conditions, isOptional]);

  const handleClearAll = () => {
    onChange([]);
  };

  const handleAiModalOpen = () => {
    setAiModalOpen(true);
  };

  const handleAiModalClose = () => {
    setAiModalOpen(false);
  };

  // Handle AI prompt submission and generate expression
  const handleAiPromptSubmit = (prompt: string) => {
    // In a real implementation, this would call an AI service to generate the expression
    // For now, we'll add a simple example condition as a placeholder
    const defaultLogicalOperator = conditions.length > 0 ? conditions[0].logicalOperator || 'AND' : 'AND';
    
    // Sample expression based on common patterns (in a real app, this would come from the AI)
    const newCondition: IndicatorExpression = {
      indicator1: { 
        name: 'EMA', 
        config: { period: 9, offset: 0, field: 'CLOSE' } 
      },
      operator: 'CrossesAbove',
      indicator2: { 
        name: 'EMA', 
        config: { period: 21, offset: 0, field: 'CLOSE' } 
      },
      logicalOperator: defaultLogicalOperator,
    };

    onChange([
      ...conditions.map(condition => ({
        ...condition,
        logicalOperator: defaultLogicalOperator
      })),
      newCondition,
    ]);
    
    setAiModalOpen(false);
  };

  const handleAddCondition = (isNested: boolean = false) => {
    const defaultLogicalOperator = conditions.length > 0 ? conditions[0].logicalOperator || 'AND' : 'AND';
    const newCondition: IndicatorExpression | NestedExpression = isNested ? {
      isNested: true,
      nestedConditions: [],
      logicalOperator: defaultLogicalOperator,
      indicator1: { name: '', config: {} },
      operator: '',
      indicator2: { name: '', config: {} }
    } : {
      indicator1: { name: '', config: {} },
      operator: '',
      indicator2: { name: '', config: {} },
      logicalOperator: defaultLogicalOperator,
    };

    onChange([
      ...conditions.map(condition => ({
        ...condition,
        logicalOperator: defaultLogicalOperator
      })),
      newCondition,
    ]);
  };

  const handleConditionChange = (index: number) => (newValue: any) => {
    const newConditions = [...conditions];
    if (newValue.isNested) {
      newConditions[index] = { 
        ...newValue,
        logicalOperator: conditions[0]?.logicalOperator || 'AND'
      };
    } else {
      newConditions[index] = { 
        ...newValue,
        logicalOperator: conditions[0]?.logicalOperator || 'AND'
      };
    }
    onChange(newConditions);
  };

  const handleNestedChange = (index: number) => (newValue: IndicatorExpression[]) => {
    const newConditions = [...conditions];
    newConditions[index] = {
      ...newConditions[index],
      nestedConditions: newValue,
    };
    onChange(newConditions);
  };

  const handleLogicalOperatorChange = (value: string) => {
    const newConditions = conditions.map(condition => ({
      ...condition,
      logicalOperator: value
    }));
    onChange(newConditions);
  };

  const handleDeleteCondition = (index: number) => () => {
    const newConditions = conditions.filter((_: any, i: number) => i !== index);
    onChange(newConditions);
  };

  const moveExpression = (dragIndex: number, hoverIndex: number, sourceLevel: number, targetLevel: number) => {
    if (sourceLevel !== targetLevel) return;

    const newConditions = [...conditions];
    const [draggedItem] = newConditions.splice(dragIndex, 1);
    newConditions.splice(hoverIndex, 0, draggedItem);
    onChange(newConditions);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ pl: level * 3 }}>
        {label && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <Typography variant="subtitle1">
                {label} {required && <span style={{ color: 'error.main' }}>*</span>}
              </Typography>
              {isComplete ? (
                <Tooltip title="Expression is complete">
                  <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                </Tooltip>
              ) : (
                <Tooltip title="Expression is incomplete">
                  <CancelIcon color="error" sx={{ fontSize: 20 }} />
                </Tooltip>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Generate with AI">
                <IconButton 
                  onClick={handleAiModalOpen} 
                  size="small" 
                  color="primary" 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'primary.contrastText', 
                    '&:hover': { bgcolor: 'primary.dark' } 
                  }}
                >
                  <CopilotIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {isOptional && conditions.length > 0 && (
                <Tooltip title="Clear all expressions">
                  <IconButton onClick={handleClearAll} size="small" color="error">
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        )}

        {conditions.length > 1 && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Select
              options={LOGICAL_OPERATORS}
              value={conditions[0]?.logicalOperator || 'AND'}
              onChange={(value: string | number) => handleLogicalOperatorChange(value.toString())}
              sx={{ width: 150 }}
            />
          </Box>
        )}
        
        {conditions.map((condition: any, index: number) => (
          <DroppableBlock
            key={index}
            level={level}
            onDrop={(item, targetIndex) => {
              if (targetIndex === -1) {
                moveExpression(item.index, conditions.length, item.parentLevel, level);
              } else {
                moveExpression(item.index, targetIndex, item.parentLevel, level);
              }
            }}
          >
            {condition.isNested ? (
              <Box sx={{ 
                mb: 2,
                p: 2,
                borderRadius: 1,
                border: '1px dashed',
                borderColor: 'divider'
              }}>
                <IndicatorExpressionBuilder
                  value={condition.nestedConditions || []}
                  onChange={handleNestedChange(index)}
                  level={level + 1}
                />
                {conditions.length > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <IconButton onClick={handleDeleteCondition(index)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            ) : (
              <DraggableIndicatorComponent
                value={condition}
                onChange={handleConditionChange(index)}
                onDelete={conditions.length > 1 ? handleDeleteCondition(index) : undefined}
                showDelete={conditions.length > 1}
                index={index}
                parentLevel={level}
                moveExpression={moveExpression}
              />
            )}
          </DroppableBlock>
        ))}

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Tooltip title="Add condition">
              <IconButton onClick={() => handleAddCondition(false)} color="primary">
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add nested block">
              <IconButton onClick={() => handleAddCondition(true)} color="secondary">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AddIcon />
                  <Box component="span" sx={{ 
                    border: '1px dashed',
                    borderColor: 'secondary.main',
                    width: 16,
                    height: 16,
                    borderRadius: 0.5,
                    ml: -0.5
                  }} />
                </Box>
              </IconButton>
            </Tooltip>
          </Box>

          {conditions.length > 0 && (
            <Typography
              variant="body2"
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                fontSize: '0.875rem'
              }}
            >
              Expression: {getExpressionText(conditions)}
            </Typography>
          )}

          {error && helperText && (
            <FormHelperText error sx={{ ml: 2 }}>
              {helperText}
            </FormHelperText>
          )}
        </Box>
      </Box>
      
      {/* AI Prompt Modal */}
      <AiPromptModal 
        open={aiModalOpen} 
        onClose={handleAiModalClose} 
        onSubmit={handleAiPromptSubmit} 
      />
    </DndProvider>
  );
};