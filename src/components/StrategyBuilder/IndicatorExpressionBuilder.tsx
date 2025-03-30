import { Box, Grid, IconButton, Typography, FormHelperText } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Select } from '../Select';
import { TextField } from '../TextField';

const INDICATORS = [
  { value: 'SMA', label: 'SMA' },
  { value: 'EMA', label: 'EMA' },
  { value: 'Number', label: 'Number' },
];

const OPERATORS = [
  { value: 'CrossesAbove', label: 'Crosses Above' },
  { value: 'CrossesBelow', label: 'Crosses Below' },
];

const LOGICAL_OPERATORS = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
];

interface IndicatorConfig {
  period?: number;
  value?: number;
}

interface Indicator {
  name: string;
  config: IndicatorConfig;
}

interface IndicatorExpression {
  indicator1: Indicator;
  operator: string;
  indicator2: Indicator;
  logicalOperator?: string;
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
}

const IndicatorComponent = ({ value, onChange, onDelete, showDelete = false }: IndicatorComponentProps) => {
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
      onChange({
        ...value,
        [field]: newValue,
      });
    }
  };

  return (
    <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Select
            label="Indicator 1"
            options={INDICATORS}
            value={value.indicator1.name}
            onChange={handleChange('indicator1', 'name')}
          />
        </Grid>
        
        {value.indicator1.name && (
          <Grid item xs={12} sm={value.indicator1.name === 'Number' ? 2 : 1.5}>
            {value.indicator1.name !== 'Number' ? (
              <TextField
                fullWidth
                label="Period"
                type="number"
                size="small"
                value={value.indicator1.config?.period || ''}
                onChange={(e) => handleChange('indicator1', 'config')({ period: e.target.value })}
              />
            ) : (
              <TextField
                fullWidth
                label="Value"
                type="number"
                size="small"
                value={value.indicator1.config?.value || ''}
                onChange={(e) => handleChange('indicator1', 'config')({ value: e.target.value })}
              />
            )}
          </Grid>
        )}

        <Grid item xs={12} sm={2}>
          <Select
            label="Operator"
            options={OPERATORS}
            value={value.operator}
            onChange={handleChange('operator')}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Select
            label="Indicator 2"
            options={INDICATORS}
            value={value.indicator2.name}
            onChange={handleChange('indicator2', 'name')}
          />
        </Grid>

        {value.indicator2.name && (
          <Grid item xs={12} sm={value.indicator2.name === 'Number' ? 2 : 1.5}>
            {value.indicator2.name !== 'Number' ? (
              <TextField
                fullWidth
                label="Period"
                type="number"
                size="small"
                value={value.indicator2.config?.period || ''}
                onChange={(e) => handleChange('indicator2', 'config')({ period: e.target.value })}
              />
            ) : (
              <TextField
                fullWidth
                label="Value"
                type="number"
                size="small"
                value={value.indicator2.config?.value || ''}
                onChange={(e) => handleChange('indicator2', 'config')({ value: e.target.value })}
              />
            )}
          </Grid>
        )}

        {showDelete && (
          <Grid item>
            <IconButton onClick={onDelete} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export const IndicatorExpressionBuilder = ({
  value,
  onChange,
  label,
  required,
  error,
  helperText
}: IndicatorExpressionBuilderProps) => {
  // Ensure value is always an array
  const conditions = Array.isArray(value) ? value : [];

  const handleAddCondition = () => {
    onChange([
      ...conditions,
      {
        indicator1: { name: '', config: {} },
        operator: '',
        indicator2: { name: '', config: {} },
        logicalOperator: conditions.length > 0 ? 'AND' : undefined,
      },
    ]);
  };

  const handleConditionChange = (index: number) => (newValue: any) => {
    const newConditions = [...conditions];
    newConditions[index] = newValue;
    onChange(newConditions);
  };

  const handleLogicalOperatorChange = (index: number) => (newValue: string) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], logicalOperator: newValue };
    onChange(newConditions);
  };

  const handleDeleteCondition = (index: number) => () => {
    const newConditions = conditions.filter((_: any, i: number) => i !== index);
    onChange(newConditions);
  };

  const getExpressionString = () => {
    return conditions
      .map((condition: any, index: number) => {
        const exp1 = condition.indicator1.name === 'Number'
          ? condition.indicator1.config?.value
          : `${condition.indicator1.name}(${condition.indicator1.config?.period})`;
        
        const exp2 = condition.indicator2.name === 'Number'
          ? condition.indicator2.config?.value
          : `${condition.indicator2.name}(${condition.indicator2.config?.period})`;

        let expression = `${exp1} ${condition.operator} ${exp2}`;
        
        if (index < conditions.length - 1 && condition.logicalOperator) {
          expression += ` ${condition.logicalOperator}`;
        }
        
        return expression;
      })
      .join(' ');
  };

  return (
    <Box>
      {label && (
        <Typography variant="subtitle1" gutterBottom>
          {label} {required && <span style={{ color: 'error.main' }}>*</span>}
        </Typography>
      )}
      
      {conditions.map((condition: any, index: number) => (
        <Box key={index} sx={{ mb: 2 }}>
          <IndicatorComponent
            value={condition}
            onChange={handleConditionChange(index)}
            onDelete={conditions.length > 1 ? handleDeleteCondition(index) : undefined}
            showDelete={conditions.length > 1}
          />
          {index < conditions.length - 1 && (
            <Box sx={{ my: 1, display: 'flex', justifyContent: 'center' }}>
              <Select
                options={LOGICAL_OPERATORS}
                value={condition.logicalOperator || ''}
                onChange={(value: string | number) => handleLogicalOperatorChange(index)(value.toString())}
                sx={{ width: 120 }}
              />
            </Box>
          )}
        </Box>
      ))}

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <IconButton
          onClick={handleAddCondition}
          color="primary"
          sx={{ alignSelf: 'center' }}
        >
          <AddIcon />
        </IconButton>

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
            Expression: {getExpressionString()}
          </Typography>
        )}

        {error && helperText && (
          <FormHelperText error sx={{ ml: 2 }}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    </Box>
  );
};