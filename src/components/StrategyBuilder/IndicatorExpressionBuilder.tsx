import { Box, Grid, IconButton, Typography, FormHelperText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, CircularProgress, InputAdornment, Paper, List, ListItem, ListItemText, keyframes } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Clear as ClearIcon, AutoAwesome as AutoAwesomeIcon, Search as SearchIcon } from '@mui/icons-material';
import { Select } from '../Select';
import { TextField } from '../TextField';
import { Button } from '../Button';
import { useState, useMemo, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  IndicatorConfig, 
  Indicator, 
  IndicatorExpression,
  stringifyExpression, 
  stringifyConditions,
  getIndicatorString,
  getIndicatorFormula,
  isIndicatorComplete
} from './utils/indicatorExpressionUtils';

import { getAvailableIndicators, getIndicatorDefaults } from '../../services/indicatorService';

// Price indicators constant values
const PRICE_INDICATORS = {
  OPEN: { offset: 0 },
  HIGH: { offset: 0 },
  LOW: { offset: 0 },
  CLOSE: { offset: 0 },
  VOLUME: { offset: 0 },
  Number: { value: 0 }
};

// Get default values from the indicators.json through the service
const DEFAULT_INDICATOR_VALUES: Record<string, any> = {
  ...PRICE_INDICATORS,
  // The rest will be loaded dynamically based on indicators.json
};

// Populate available indicators from the service
const INDICATORS = [
  // Price indicators (static)
  // { value: 'OPEN', label: 'Open Price' },
  // { value: 'HIGH', label: 'High Price' },
  // { value: 'LOW', label: 'Low Price' },
  // { value: 'CLOSE', label: 'Close Price' },
  // { value: 'VOLUME', label: 'Volume' },
  // { value: 'Number', label: 'Number' },
  
  // Dynamic indicators from indicators.json
  ...getAvailableIndicators().map(indicator => ({
    value: indicator.value,
    label: indicator.label // Using the label from the indicator definition
  }))
];

// Initialize default values for each indicator from indicators.json
getAvailableIndicators().forEach(indicator => {
  DEFAULT_INDICATOR_VALUES[indicator.value] = getIndicatorDefaults(indicator.value);
});

const FIELD_OPTIONS = [
  { value: 'CLOSE', label: 'Close' },
  { value: 'OPEN', label: 'Open' },
  { value: 'HIGH', label: 'High' },
  { value: 'LOW', label: 'Low' },
  { value: 'VOLUME', label: 'Volume' },
];

const TYPE_OPTIONS = [
  { value: 'SIMPLE', label: 'Simple' },
  { value: 'EXPONENTIAL', label: 'Exponential' },
  { value: 'WEIGHTED', label: 'Weighted' },
  { value: 'TRIPLE', label: 'Triple' },
  { value: 'TRIANGULAR', label: 'Triangular' },
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

// Use the isIndicatorComplete function from utils
const isExpressionComplete = (expression: IndicatorExpression): boolean => {
  return (
    isIndicatorComplete(expression.indicator1) &&
    !!expression.operator &&
    isIndicatorComplete(expression.indicator2)
  );
};

const getExpressionText = (conditions: IndicatorExpression[]): string => {
  return conditions
    .map((condition: IndicatorExpression, index: number) => {
      if (condition.isNested && condition.nestedConditions) {
        return `(${getExpressionText(condition.nestedConditions)})`;
      }

      const exp1 = getIndicatorString(condition.indicator1);
      const exp2 = getIndicatorString(condition.indicator2);

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
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [showIndicatorList1, setShowIndicatorList1] = useState(false);
  const [showIndicatorList2, setShowIndicatorList2] = useState(false);

  // Filter indicators based on search query
  const filteredIndicators1 = useMemo(() => {
    return INDICATORS.filter(indicator => 
      indicator.label.toLowerCase().includes(searchQuery1.toLowerCase()) || 
      indicator.value.toLowerCase().includes(searchQuery1.toLowerCase())
    );
  }, [searchQuery1]);

  const filteredIndicators2 = useMemo(() => {
    return INDICATORS.filter(indicator => 
      indicator.label.toLowerCase().includes(searchQuery2.toLowerCase()) || 
      indicator.value.toLowerCase().includes(searchQuery2.toLowerCase())
    );
  }, [searchQuery2]);

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

  const handleConfigChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    // Dynamically determine if the parameter is a string based on the indicator definition
    const isStringParameter = () => {
      if (!editingIndicator) return false;
      
      const { indicators } = require('../../services/indicatorService');
      const indicatorDef = indicators[editingIndicator.indicator.name];
      
      if (!indicatorDef) return false;
      
      const param = indicatorDef.config.find((p: any) => p.name === key);
      return param && param.type === 'string';
    };

    setModalConfig(prev => ({
      ...prev,
      [key]: isStringParameter() ? e.target.value : Number(e.target.value)
    }));
  };

  const handleSearchChange = (field: 'indicator1' | 'indicator2') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'indicator1') {
      setSearchQuery1(e.target.value);
      setShowIndicatorList1(true);
    } else {
      setSearchQuery2(e.target.value);
      setShowIndicatorList2(true);
    }
  };

  const handleIndicatorSelect = (field: 'indicator1' | 'indicator2', value: string) => {
    handleChange(field)(value);
    if (field === 'indicator1') {
      setShowIndicatorList1(false);
      setSearchQuery1('');
    } else {
      setShowIndicatorList2(false);
      setSearchQuery2('');
    }
  };

  const renderIndicatorSelect = (field: 'indicator1' | 'indicator2') => {
    const searchQuery = field === 'indicator1' ? searchQuery1 : searchQuery2;
    const filteredIndicators = field === 'indicator1' ? filteredIndicators1 : filteredIndicators2;
    const showIndicatorList = field === 'indicator1' ? showIndicatorList1 : showIndicatorList2;
    const setShowIndicatorList = field === 'indicator1' ? setShowIndicatorList1 : setShowIndicatorList2;

    return (
      <Box sx={{ position: 'relative', width: '100%', minWidth: 200 }}>
        <TextField
          fullWidth
          label={`Indicator ${field === 'indicator1' ? '1' : '2'}`}
          value={searchQuery}
          onChange={handleSearchChange(field)}
          onFocus={() => setShowIndicatorList(true)}            placeholder="Search indicators..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {showIndicatorList && (
            <Paper 
              elevation={3} 
              className="indicator-list"
              sx={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                right: 0, 
                zIndex: 1000, 
                maxHeight: 250, 
                overflow: 'auto'
              }}
            >
            <List dense>
              {filteredIndicators.length > 0 ? (
                filteredIndicators.map((indicator) => (
                  <ListItem 
                    key={indicator.value} 
                    button 
                    onClick={() => handleIndicatorSelect(field, indicator.value)}
                    sx={{ 
                      py: 1,
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        borderLeft: '3px solid',
                        borderColor: 'primary.main',
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ListItemText 
                      primary={indicator.label} 
                      secondary={indicator.value}
                      primaryTypographyProps={{
                        fontWeight: searchQuery && indicator.label.toLowerCase().includes(searchQuery.toLowerCase()) ? 'bold' : 'normal'
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ py: 2, justifyContent: 'center' }}>
                  <ListItemText 
                    primary="No matching indicators" 
                    primaryTypographyProps={{
                      align: 'center',
                      color: 'text.secondary',
                      fontStyle: 'italic'
                    }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        )}
      </Box>
    );
  };

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

    // Import indicator service here to avoid any module issues
    const { indicators, getParameterOptions } = require('../../services/indicatorService');

    const renderParameterField = (param: { name: string; type: string; enum?: string[]; default?: any; required?: boolean }) => {
      const paramValue = modalConfig[param.name] !== undefined ? modalConfig[param.name] : param.default;
      
      // If parameter has enum options, render a select
      if (param.enum) {
        const options = param.enum.map(value => ({ value, label: value }));
        return (
          <Grid item xs={12} key={param.name}>
            <Select
              label={`${param.name.charAt(0).toUpperCase() + param.name.slice(1)}${param.required ? ' *' : ''}`}
              options={options}
              value={paramValue}
              onChange={(value) => {
                setModalConfig(prev => ({
                  ...prev,
                  [param.name]: value
                }));
              }}
              sx={{ width: '100%' }}
            />
          </Grid>
        );
      }
      
      // Otherwise render a text field (number or string)
      const isNumber = param.type === 'number';
      const getStepValue = () => {
        if (!isNumber) return undefined;
        if (['multiplier', 'deviations', 'minimumAF', 'maximumAF'].includes(param.name)) return 0.1;
        return 1;
      };
      
      return (
        <Grid item xs={12} key={param.name}>
          <TextField
            fullWidth
            label={`${param.name.charAt(0).toUpperCase() + param.name.slice(1)}${param.required ? ' *' : ''}`}
            type={isNumber ? "number" : "text"}
            value={paramValue ?? ''}
            onChange={handleConfigChange(param.name)}
            required={param.required}
            inputProps={isNumber ? { 
              min: 0, 
              step: getStepValue() 
            } : {}}
          />
        </Grid>
      );
    };

    const renderParameters = () => {
      // Special case for price indicators and Number
      if (indicator.name === 'Number') {
        return (
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
        );
      }

      if (['OPEN', 'HIGH', 'LOW', 'CLOSE', 'VOLUME'].includes(indicator.name)) {
        return (
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
        );
      }

      // Dynamic rendering based on indicators.json
      const { indicators } = require('../../services/indicatorService');
      const indicatorDef = indicators[indicator.name];
      
      if (!indicatorDef) {
        // Fallback for indicators not found in indicators.json
        return (
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
        );
      }

      // Render fields based on indicator definition
      return indicatorDef.config.map(renderParameterField);
    };

    return (
      <Dialog open={true} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          Edit {INDICATORS.find(i => i.value === indicator.name)?.label || indicator.name} Parameters
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              {renderParameters()}
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

  // Click outside handler to close indicator lists
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showIndicatorList1 || showIndicatorList2) {
        const target = event.target as HTMLElement;
        // Don't close if clicking on the search input itself
        const isTextField = target.closest('.MuiInputBase-root, .MuiTextField-root');
        if (!isTextField && !target.closest('.indicator-list')) {
          setShowIndicatorList1(false);
          setShowIndicatorList2(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showIndicatorList1, showIndicatorList2]);

  return (
    <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
      <Grid 
        container 
        spacing={2} 
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: 800, mx: 'auto' }}
      >
        <Grid item xs={12} sm={4} className="indicator-select-container">
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

        <Grid item xs={12} sm={4} className="indicator-select-container">
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (prompt.trim()) {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/ai/build-expression', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: prompt.trim() }),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        // Support different response formats
        const data = await response.json();
        let expressionString = '';
        
        if (typeof data === 'string') {
          expressionString = data;
        } else if (data.expression) {
          expressionString = data.expression;
        } else if (data.result) {
          expressionString = data.result;
        } else {
          console.log('Full API response:', data);
          throw new Error('Could not extract expression from the API response');
        }
        
        // Log the extracted expression for debugging
        console.log('Using expression from API:', expressionString);
        
        onSubmit(expressionString);
        setPrompt('');
        onClose(); // Close the modal after successful submission
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate expression');
        console.error('Error generating expression:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ 
          position: 'relative', 
          width: 28, 
          height: 28, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {/* Gemini-like orbiting particles */}
          {[...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                width: 3,
                height: 3,
                borderRadius: '50%',
                backgroundColor: (theme) => theme.palette.primary.main,
                animation: `spin 3.5s linear infinite`,
                animationDelay: `${index * 0.2}s`,
                opacity: 0.7,
                transform: `rotate(${index * 72}deg) translateX(12px)`,
                '@keyframes spin': {
                  '0%': {
                    transform: `rotate(${index * 72}deg) translateX(12px) rotate(0deg)`,
                  },
                  '100%': {
                    transform: `rotate(${index * 72 + 360}deg) translateX(12px) rotate(-360deg)`,
                  },
                },
              }}
            />
          ))}
          {/* Central icon with pulse effect */}
          <Box
            sx={{
              animation: `pulse 2.5s ease-in-out infinite`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 0.8 },
                '50%': { transform: 'scale(1.3)', opacity: 1, filter: 'drop-shadow(0 0 2px currentColor)' },
                '100%': { transform: 'scale(1)', opacity: 0.8 },
              },
            }}
          >
            <AutoAwesomeIcon fontSize="small" color="primary" />
          </Box>
        </Box>
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
            disabled={loading}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={loading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
          disabled={!prompt.trim() || loading}
        >
          {loading ? 'Generating...' : 'Generate'}
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
  const handleAiPromptSubmit = (expressionString: string) => {
    try {
      // Simply parse the standard expression format directly
      console.log("Received expression from API:", expressionString);
      
      // Basic check to make sure we have an operator
      if (!expressionString.match(/(CrossesAbove|CrossesBelow|>|<|>=|<=|==|!=)/i)) {
        console.error('No valid operator found in expression:', expressionString);
        window.alert(`Expression missing valid operator: "${expressionString}"`);
        return;
      }
      
      // Split the expression once at the operator
      const parts = expressionString.split(/(CrossesAbove|CrossesBelow)/i);
      
      if (parts.length !== 3) {
        console.error('Invalid expression format:', expressionString);
        window.alert(`Could not parse expression: "${expressionString}"`);
        return;
      }
      
      // Extract components
      const leftExprStr = parts[0].trim();
      const operatorStr = parts[1].trim();
      const rightExprStr = parts[2].trim();
      
      console.log("Left:", leftExprStr, "Operator:", operatorStr, "Right:", rightExprStr);
      
      // Parse left indicator (SMA)
      const smaMatch = leftExprStr.match(/SMA\(([^,]+),\s*(\d+),\s*(\d+)\)/);
      if (!smaMatch) {
        console.error('Could not parse left indicator:', leftExprStr);
        window.alert(`Could not parse left indicator: "${leftExprStr}"`);
        return;
      }
      
      // Parse right indicator (EMA)
      const emaMatch = rightExprStr.match(/EMA\(([^,]+),\s*(\d+),\s*(\d+)\)/);
      if (!emaMatch) {
        console.error('Could not parse right indicator:', rightExprStr);
        window.alert(`Could not parse right indicator: "${rightExprStr}"`);
        return;
      }
      
      // Create indicators with exact values from the expression
      const leftIndicator: Indicator = {
        name: 'SMA',
        config: {
          field: smaMatch[1],
          period: parseInt(smaMatch[2], 10),
          offset: parseInt(smaMatch[3], 10)
        }
      };
      
      const rightIndicator: Indicator = {
        name: 'EMA',
        config: {
          field: emaMatch[1],
          period: parseInt(emaMatch[2], 10),
          offset: parseInt(emaMatch[3], 10)
        }
      };
      
      // Create the condition object
      const newCondition: IndicatorExpression = {
        indicator1: leftIndicator,
        operator: operatorStr,
        indicator2: rightIndicator,
        logicalOperator: 'AND'
      };
      
      console.log("Created condition:", newCondition);
      
      // Replace any existing expressions with this one
      onChange([newCondition]);
      
      setAiModalOpen(false);
    } catch (err) {
      console.error('Error parsing expression:', err);
      window.alert(`Error processing expression: "${expressionString}"\n\nPlease check format and try again.`);
    }
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
              <Tooltip title="Generate Expression with AI">
                <IconButton onClick={handleAiModalOpen} size="small" color="primary">
                  <Box sx={{ 
                    position: 'relative', 
                    width: 28, 
                    height: 28, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {/* Gemini-like orbiting particles */}
                    {[...Array(6)].map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'absolute',
                          width: 3.5,
                          height: 3.5,
                          borderRadius: '50%',
                          backgroundColor: (theme) => theme.palette.primary.main,
                          animation: `spin 3s linear infinite`,
                          animationDelay: `${index * 0.2}s`,
                          opacity: ({ palette }) => palette.mode === 'dark' ? 0.8 : 0.7,
                          transform: `rotate(${index * 60}deg) translateX(12px)`,
                          '@keyframes spin': {
                            '0%': {
                              transform: `rotate(${index * 60}deg) translateX(12px) rotate(0deg)`,
                            },
                            '100%': {
                              transform: `rotate(${index * 60 + 360}deg) translateX(12px) rotate(-360deg)`,
                            },
                          },
                        }}
                      />
                    ))}
                    {/* Secondary orbit */}
                    {[...Array(4)].map((_, index) => (
                      <Box
                        key={`inner-${index}`}
                        sx={{
                          position: 'absolute',
                          width: 2.5,
                          height: 2.5,
                          borderRadius: '50%',
                          backgroundColor: (theme) => theme.palette.primary.light,
                          animation: `spinReverse 4s linear infinite`,
                          animationDelay: `${index * 0.3}s`,
                          opacity: 0.6,
                          transform: `rotate(${index * 90}deg) translateX(8px)`,
                          '@keyframes spinReverse': {
                            '0%': {
                              transform: `rotate(${index * 90}deg) translateX(8px) rotate(0deg)`,
                            },
                            '100%': {
                              transform: `rotate(${index * 90 - 360}deg) translateX(8px) rotate(360deg)`,
                            },
                          },
                        }}
                      />
                    ))}
                    {/* Central icon with enhanced pulse effect */}
                    <Box
                      sx={{
                        animation: `enhancedPulse 2.5s ease-in-out infinite`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        '@keyframes enhancedPulse': {
                          '0%': { transform: 'scale(1)', opacity: 0.8 },
                          '50%': { transform: 'scale(1.3)', opacity: 1, filter: 'drop-shadow(0 0 2px currentColor)' },
                          '100%': { transform: 'scale(1)', opacity: 0.8 },
                        },
                      }}
                    >
                      <AutoAwesomeIcon fontSize="small" color="primary" />
                    </Box>
                  </Box>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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