import { 
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography 
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Add from '@mui/icons-material/Add';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import { Button } from '../Button';
import { Select } from '../Select';
import { TextField } from '../TextField';
import InstrumentSelector from './InstrumentSelector';
import { IndicatorExpressionBuilder } from './IndicatorExpressionBuilder';
import { PROFIT_LOSS_TYPES } from '../../constants';

export interface Instrument {
  id: number;
  name: string;
}

interface Indicator {
  name: string;
  value: string;
  config: Record<string, any>;
}

interface IndicatorExpression {
  indicator1: Indicator;
  operator: string;
  indicator2: Indicator;
}

interface FormData {
  name: string;
  description: string;
  position: 'buy' | 'sell';
  instruments: number[];
  candlestickType: string;
  timeframe: string;
  tradeType: string;
  maxAllocation: number;
  maxQuantity: number;
  entryConditions: IndicatorExpression[];
  exitConditions: IndicatorExpression[];
  stopLoss: number;
  stopLossType: string;
  targetProfit: number;
  targetProfitType: string;
  trailingStopLoss: number;
  initialCapital: number;
  entryStartTime: Dayjs | null;
  entryEndTime: Dayjs | null;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  position: 'buy',
  instruments: [],
  candlestickType: 'Candlestick',
  timeframe: '1 Minute',
  tradeType: 'MIS',
  maxAllocation: 0,
  maxQuantity: 0,
  entryConditions: [],
  exitConditions: [],
  stopLoss: 0,
  stopLossType: 'Absolute',
  targetProfit: 0,
  targetProfitType: 'Absolute',
  trailingStopLoss: 0,
  initialCapital: 0,
  entryStartTime: null,
  entryEndTime: null,
  startDate: null,
  endDate: null,
};

export interface ValidationErrors {
  [key: string]: string | undefined;
}

const setErrorsWithType = (prev: ValidationErrors) => ({
  ...prev,
});

export const StrategyForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(['name']);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isInstrumentSelectorOpen, setInstrumentSelectorOpen] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);

  const handleChange = (field: keyof FormData) => (value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear any existing errors for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Strategy name is required';
    }
    
    if (!formData.position) {
      newErrors.position = 'Position type is required';
    }
    
    if (!formData.candlestickType) {
      newErrors.candlestickType = 'Candlestick type is required';
    }
    
    if (!formData.timeframe) {
      newErrors.timeframe = 'Timeframe is required';
    }
    
    if (!formData.tradeType) {
      newErrors.tradeType = 'Trade type is required';
    }
    
    if (formData.entryConditions.length === 0) {
      newErrors.entryConditions = 'At least one entry condition is required';
    }
    
    if (!formData.stopLoss) {
      newErrors.stopLoss = 'Stop loss is required';
    }
    
    if (!formData.targetProfit) {
      newErrors.targetProfit = 'Target profit is required';
    }
    
    if (!formData.initialCapital) {
      newErrors.initialCapital = 'Initial capital is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    // Date range validation
    if (formData.startDate && formData.endDate) {
      if (formData.startDate.isAfter(formData.endDate)) {
        newErrors.startDate = 'Start date cannot be after end date';
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    // Time range validation
    if (formData.entryStartTime && formData.entryEndTime) {
      if (formData.entryStartTime.isAfter(formData.entryEndTime)) {
        newErrors.entryStartTime = 'Start time cannot be after end time';
        newErrors.entryEndTime = 'End time cannot be before start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to validate time range
  const validateTimeRange = (startTime: Dayjs | null, endTime: Dayjs | null) => {
    if (startTime && endTime && startTime.isAfter(endTime)) {
      return false;
    }
    return true;
  };

  // Helper function to validate date range by comparing only dates without time
  const validateDateRange = (startDate: Dayjs | null, endDate: Dayjs | null) => {
    if (startDate && endDate) {
      // Compare dates by setting both to start of day to ignore time component
      const start = startDate.startOf('day');
      const end = endDate.startOf('day');
      return !start.isAfter(end);
    }
    return true;
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => (value: Dayjs | null) => {
    const otherField = field === 'startDate' ? 'endDate' : 'startDate';
    const otherValue = formData[otherField];

    // Clear any existing date-related errors
    if (errors.startDate || errors.endDate) {
      setErrors(prev => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
    }

    // Update the date value
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Validate date range if both values exist
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
  };

  const handleTimeChange = (field: 'entryStartTime' | 'entryEndTime') => (value: Dayjs | null) => {
    const otherField = field === 'entryStartTime' ? 'entryEndTime' : 'entryStartTime';
    const otherValue = formData[otherField];

    // Clear any existing time-related errors
    if (errors.entryStartTime || errors.entryEndTime) {
      setErrors(prev => ({
        ...prev,
        entryStartTime: undefined,
        entryEndTime: undefined,
      }));
    }

    // Update the time value
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Validate time range if both values exist
    if (value && otherValue) {
      const isStartTime = field === 'entryStartTime';
      const start = isStartTime ? value : otherValue;
      const end = isStartTime ? otherValue : value;

      if (!validateTimeRange(start, end)) {
        setErrors(prev => ({
          ...prev,
          entryStartTime: isStartTime ? 'Start time cannot be after end time' : undefined,
          entryEndTime: !isStartTime ? 'End time cannot be before start time' : undefined,
        }));
      }
    }
  };

  const handleInstrumentSelect = (selectedInstruments: Instrument[]) => {
    handleChange('instruments')(selectedInstruments);
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
            <FormControl component="fieldset">
              <FormLabel component="legend">Position Type</FormLabel>
              <RadioGroup
                row
                name="position-type"
                value={formData.position}
                onChange={(e) => handleChange('position')(e.target.value)}
                sx={{ mb: 2 }}
              >
                <FormControlLabel value="buy" control={<Radio />} label="Buy" />
                <FormControlLabel value="sell" control={<Radio />} label="Sell" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setInstrumentSelectorOpen(true)}
              >
                Add Instrument
              </Button>
              {selectedInstruments.map((instrument) => (
                <Chip
                  key={instrument.id}
                  label={instrument.name}
                  onDelete={() => {
                    const newInstruments = selectedInstruments.filter(i => i.id !== instrument.id);
                    setSelectedInstruments(newInstruments);
                    handleChange('instruments')(newInstruments.map(i => i.id));
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Select
                  fullWidth
                  label="Candlestick Type"
                  options={[{ label: 'Candlestick', value: 'Candlestick' }]}
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
              <Grid item xs={12} md={4}>
                <Select
                  fullWidth
                  label="Timeframe"
                  options={[
                    { label: '1 Minute', value: '1 Minute' },
                    { label: '3 Minutes', value: '3 Minutes' },
                    { label: '5 Minutes', value: '5 Minutes' },
                    { label: '10 Minutes', value: '10 Minutes' },
                    { label: '15 Minutes', value: '15 Minutes' },
                    { label: '30 Minutes', value: '30 Minutes' },
                    { label: '1 Hour', value: '1 Hour' },
                    { label: '1 Day', value: '1 Day' }
                  ]}
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
              <Grid item xs={12} md={4}>
                <Select
                  fullWidth
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
        </Grid>
      ),
    },
    {
      id: 'entry',
      title: 'Entry Condition',
      component: (
        <Box>
          <IndicatorExpressionBuilder
            value={formData.entryConditions}
            onChange={handleChange('entryConditions')}
            label="Entry Conditions"
            error={attemptedSubmit && !!errors.entryConditions}
            helperText={attemptedSubmit ? errors.entryConditions : undefined}
            required
          />
        </Box>
      ),
    },
    {
      id: 'exit',
      title: 'Exit Conditions',
      component: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <IndicatorExpressionBuilder
              value={formData.exitConditions}
              onChange={handleChange('exitConditions')}
              label="Exit Conditions"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Stop Loss"
              type="number"
              value={formData.stopLoss}
              onChange={(e) => handleChange('stopLoss')(e.target.value)}
              error={attemptedSubmit && !!errors.stopLoss}
              helperText={attemptedSubmit && errors.stopLoss}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth
              label="Stop Loss Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.stopLossType}
              onChange={handleChange('stopLossType')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Target Profit"
              type="number"
              value={formData.targetProfit}
              onChange={(e) => handleChange('targetProfit')(e.target.value)}
              error={attemptedSubmit && !!errors.targetProfit}
              helperText={attemptedSubmit && errors.targetProfit}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth
              label="Target Profit Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.targetProfitType}
              onChange={handleChange('targetProfitType')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Trailing Stop Loss"
              type="number"
              value={formData.trailingStopLoss}
              onChange={(e) => handleChange('trailingStopLoss')(e.target.value)}
            />
          </Grid>
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
                label="Initial Capital"
                type="number"
                value={formData.initialCapital}
                onChange={(e) => handleChange('initialCapital')(e.target.value)}
                error={attemptedSubmit && !!errors.initialCapital}
                helperText={attemptedSubmit && errors.initialCapital}
                required
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

  const handleSave = () => {
    setAttemptedSubmit(true);
    if (validateForm()) {
      // Handle form submission
      console.log('Form is valid, submitting...', formData);
    } else {
      // Expand sections with errors
      const sectionsWithErrors = new Set<string>();
      Object.keys(errors).forEach(errorKey => {
        const section = sections.find(s => 
          (s.id === 'name' && errorKey === 'name') ||
          (s.id === 'positions' && ['buyOrSell', 'candlestickType', 'timeframe', 'tradeType'].includes(errorKey)) ||
          (s.id === 'entry' && errorKey === 'entryConditions') ||
          (s.id === 'exit' && ['stopLoss', 'targetProfit'].includes(errorKey)) ||
          (s.id === 'backtest' && ['initialCapital', 'startDate', 'endDate', 'entryStartTime', 'entryEndTime'].includes(errorKey))
        );
        if (section) {
          sectionsWithErrors.add(section.id);
        }
      });
      setExpandedSections(Array.from(sectionsWithErrors));
    }
  };

  return (
    <form>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="text" 
          onClick={toggleExpandAll}
          size="small"
        >
          {isAllExpanded ? 'Collapse All' : 'Expand All'}
        </Button>
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
            <Typography variant="h6">
              {section.title}
              {section.id === 'name' && errors.name && attemptedSubmit && (
                <Typography 
                  component="span" 
                  sx={{ 
                    color: 'error.main',
                    ml: 1,
                    fontSize: '0.8em'
                  }}
                >
                  (has errors)
                </Typography>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            {section.component}
          </AccordionDetails>
        </Accordion>
      ))}
      
      <InstrumentSelector
        open={isInstrumentSelectorOpen}
        onClose={() => setInstrumentSelectorOpen(false)}
        onSelect={setSelectedInstruments}
        selectedInstruments={selectedInstruments}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save Strategy</Button>
      </Box>
    </form>
  );
};