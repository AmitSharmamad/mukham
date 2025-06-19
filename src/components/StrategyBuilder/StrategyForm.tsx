import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useToastContext } from '../../context/ToastContext';
import { parseExpressions, stringifyConditions, Indicator, IndicatorExpression } from './utils/indicatorExpressionUtils';
import { 
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Tooltip,
  Switch
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Add from '@mui/icons-material/Add';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import Refresh from '@mui/icons-material/Refresh';
import dayjs, { Dayjs } from 'dayjs';
import { Button } from '../Button';
import { Select } from '../Select';
import { TextField } from '../TextField';
import { Toast } from '../';
import InstrumentSelector from './InstrumentSelector';
import { IndicatorExpressionBuilder } from './IndicatorExpressionBuilder';
import { OptionsLegBuilder, OptionLeg } from './OptionsLegBuilder';
import MetricsSection from './MetricsSection';
import { BacktestResultsDisplay } from './BacktestResultsDisplay';
import { PROFIT_LOSS_TYPES, TIMEFRAME_OPTIONS } from '../../constants';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { BacktestResult } from '../../types/strategy';
import { createDeployment, ApiResponse } from '../../services/deploymentService';
import { convertFormToApiData } from '../../utils/strategyFormUtils';
import { 
  validateForm, 
  isFormValid, 
  isSectionComplete, 
  getMissingSectionFields,
  validateTimeRange,
  validateDateRange
} from '../../utils/strategyFormValidation';

// Import types from the dedicated types file
import {
  Instrument,
  FormData,
  ApiFormData,
  ValidationErrors,
  StrategyFormProps,
  BacktestPosition,
  BacktestMetric,
  BacktestRun,
  BacktestData,
  getInitialFormData
} from '../../types/strategyForm';

// Using Indicator and IndicatorExpression interfaces from utils/indicatorExpressionUtils.ts

// Using parseExpressions function from utility file

export const StrategyForm: React.FC<StrategyFormProps> = ({ initialData, initialInstruments = [], pageTitle }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    instrumentType: initialData?.instrumentType || 'equity',
    buyOrSell: initialData?.buyOrSell || 'buy',
    instruments: initialData?.instruments || [],
    candlestickType: initialData?.candlestickType || 'CANDLESTICK',
    timeframe: initialData?.timeframe || '1m',
    tradeType: initialData?.tradeType || 'MIS',
    maxAllocation: initialData?.maxAllocation || '',
    maxQuantity: initialData?.maxQuantity || '',
    brickSize: initialData?.brickSize || '',
    entryConditions: initialData?.entryConditions ? parseExpressions(initialData.entryConditions) : [],
    exitConditions: initialData?.exitConditions ? parseExpressions(initialData.exitConditions) : [],
    entryOptionLegs: initialData?.entryOptionLegs || [],
    exitOptionLegs: initialData?.exitOptionLegs || [],
    expirationStrategy: initialData?.expirationStrategy || 'CLOSE',
    stopLoss: initialData?.stopLoss || '',
    stopLossType: initialData?.stopLossType || 'PERCENTAGE',
    targetProfit: initialData?.targetProfit || '',
    targetProfitType: initialData?.targetProfitType || 'PERCENTAGE',
    trailingStopLoss: initialData?.trailingStopLoss || '',
    trailingStopLossType: initialData?.trailingStopLossType || 'PERCENTAGE',
    entryStartTime: initialData?.entryStartTime ? dayjs(initialData.entryStartTime, 'HH:mm:ss') : null,
    entryEndTime: initialData?.entryEndTime ? dayjs(initialData.entryEndTime, 'HH:mm:ss') : null,
    startDate: initialData?.startDate ? dayjs(initialData.startDate) : null,
    endDate: initialData?.endDate ? dayjs(initialData.endDate) : null,
    brokerage: initialData?.brokerage || '20',
    slippage: initialData?.slippage || '0.5',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(['name']);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isInstrumentSelectorOpen, setInstrumentSelectorOpen] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(initialInstruments);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  const [rawBacktestData, setRawBacktestData] = useState<BacktestData | null>(null);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [deployingInstruments, setDeployingInstruments] = useState<Set<number>>(new Set());
  const backtestResultsRef = useRef<HTMLDivElement>(null);
  const [expandedInstrument, setExpandedInstrument] = useState<number | null>(null);
  const [showingPositions, setShowingPositions] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast, showSuccess, showError } = useToastContext();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showBacktestResults, setShowBacktestResults] = useState(false);
  const [deploymentStatuses, setDeploymentStatuses] = useState<Map<number, boolean>>(new Map());

  useEffect(() => {
    if (initialData) {
      // Make sure to set hasUnsavedChanges to false when initializing with existing data
      setHasUnsavedChanges(false);
      const isNullTime = (time: string) => !time || time === "0001-01-01T00:00:00Z" || time === "00:00:00";
      
      setFormData({
        id: initialData?.id, // Ensure ID is properly set if it exists
        name: initialData?.name || '',
        description: initialData?.description || '',
        instrumentType: initialData?.instrumentType || 'equity',
        buyOrSell: initialData?.buyOrSell || 'buy',
        instruments: initialData?.instruments || [],
        candlestickType: initialData?.candlestickType || 'CANDLESTICK',
        timeframe: initialData?.timeframe || '1m',
        tradeType: initialData?.tradeType || 'MIS',
        maxAllocation: initialData?.maxAllocation || '',
        maxQuantity: initialData?.maxQuantity || '',
        brickSize: initialData?.brickSize || '',
        entryConditions: initialData?.entryConditions ? parseExpressions(initialData.entryConditions) : [],
        exitConditions: initialData?.exitConditions ? parseExpressions(initialData.exitConditions) : [],
        entryOptionLegs: initialData?.entryOptionLegs || [],
        exitOptionLegs: initialData?.exitOptionLegs || [],
        expirationStrategy: initialData?.expirationStrategy || 'CLOSE',
        stopLoss: initialData?.stopLoss || '',
        stopLossType: initialData?.stopLossType || 'PERCENTAGE',
        targetProfit: initialData?.targetProfit || '',
        targetProfitType: initialData?.targetProfitType || 'PERCENTAGE',
        trailingStopLoss: initialData?.trailingStopLoss || '',
        trailingStopLossType: initialData?.trailingStopLossType || 'PERCENTAGE',
        entryStartTime: isNullTime(initialData.entryStartTime) ? null : dayjs(initialData.entryStartTime, 'HH:mm:ss'),
        entryEndTime: isNullTime(initialData.entryEndTime) ? null : dayjs(initialData.entryEndTime, 'HH:mm:ss'),
        startDate: dayjs(initialData.startDate),
        endDate: dayjs(initialData.endDate),
        brokerage: initialData.brokerage || '20',
        slippage: initialData.slippage || '0.5',
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (initialInstruments.length > 0) {
      setSelectedInstruments(initialInstruments);
    }
  }, [initialInstruments]);

  // Using toast context instead of local state

  const fetchInstrumentsByIds = async (instrumentIds: number[]): Promise<Instrument[]> => {
    try {
      const response = await fetch(`/api/instrument-master/by-exchange-security-ids?exchange_security_ids=${instrumentIds.join(',')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch instruments');
      }
    } catch (error) {
      console.error('Error fetching instruments:', error);
      throw error;
    }
  };

  // Using imported validation functions from utils

  const handleChange = (field: keyof FormData) => (value: any) => {
    // Log timeframe changes for debugging
    if (field === 'timeframe') {
      console.log('Timeframe changed to:', value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    setHasUnsavedChanges(true);

    // Note: Backtest results are kept during editing and only cleared after successful save
  };

  // Using imported validation functions from strategyFormValidation.ts

  const handleDateChange = (field: 'startDate' | 'endDate') => (value: Dayjs | null) => {
    const otherField = field === 'startDate' ? 'endDate' : 'startDate';
    const otherValue = formData[otherField];

    if (errors.startDate || errors.endDate) {
      setErrors(prev => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

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

    setHasUnsavedChanges(true);
  };

  const handleTimeChange = (field: 'entryStartTime' | 'entryEndTime') => (value: Dayjs | null) => {
    const otherField = field === 'entryStartTime' ? 'entryEndTime' : 'entryStartTime';
    const otherValue = formData[otherField];

    if (errors.entryStartTime || errors.entryEndTime) {
      setErrors(prev => ({
        ...prev,
        entryStartTime: undefined,
        entryEndTime: undefined,
      }));
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (value && otherValue) {
      const isStartTime = field === 'entryStartTime';
      const start = isStartTime ? value : otherValue;
      const end = isStartTime ? otherValue : value;

      if (!validateTimeRange(start, end)) {
        setErrors(prev => ({
          ...prev,
          [field]: `Invalid time range`,
        }));
      }
    }

    setHasUnsavedChanges(true);
  };
  
  // Function to clear time fields
  const handleClearTime = (field: 'entryStartTime' | 'entryEndTime') => () => {
    setFormData(prev => ({
      ...prev,
      [field]: null,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
    
    setHasUnsavedChanges(true);
    return null;
  };

  const handleInstrumentSelect = (instruments: Instrument[]) => {
    setSelectedInstruments(instruments);
    handleChange('instruments')(instruments.map(i => i.exchange_security_id));
  };

  // Using imported isSectionComplete function from utils

  const sections = [
    {
      id: 'name',
      title: 'Name',
      component: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="name"
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
              id="description"
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Position Type</FormLabel>
                <RadioGroup
                  row
                  name="position_type"
                  id="position_type"
                  value={formData.buyOrSell}
                  onChange={(e) => handleChange('buyOrSell')(e.target.value)}
                >
                  <FormControlLabel value="buy" control={<Radio />} label="Buy" />
                  <FormControlLabel value="sell" control={<Radio />} label="Sell" />
                </RadioGroup>
              </FormControl>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flex: 1,
                justifyContent: 'center'
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setInstrumentSelectorOpen(true)}
                >
                  Add Instrument
                </Button>
                
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  {selectedInstruments.map((instrument) => (
                    <Chip
                      key={instrument.exchange_security_id}
                      label={instrument.symbol}
                      onDelete={() => {
                        const newInstruments = selectedInstruments.filter(i => i.exchange_security_id !== instrument.exchange_security_id);
                        setSelectedInstruments(newInstruments);
                        handleChange('instruments')(newInstruments.map(i => i.exchange_security_id));
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Select
                  fullWidth
                  id="chart_type"
                  label="Candlestick Type"
                  options={[
                    { label: 'Candlestick', value: 'CANDLESTICK' },
                    { label: 'Renko', value: 'RENKO' }
                  ]}
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
              {formData.candlestickType === 'RENKO' && (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    id="brick_size"
                    label="Brick Size"
                    type="number"
                    value={formData.brickSize || ''}
                    onChange={(e) => handleChange('brickSize')(e.target.value)}
                    error={attemptedSubmit && !!errors.brickSize}
                    helperText={attemptedSubmit && errors.brickSize}
                    required
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={formData.candlestickType === 'RENKO' ? 3 : 3}>
                <Select
                  fullWidth
                  id="chart_timeframe"
                  label="Timeframe"
                  options={TIMEFRAME_OPTIONS}
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
              <Grid item xs={12} md={3}>
                <Select
                  fullWidth
                  id="chart_unknown"
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
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Allocation (in rupees)"
                  type="number"
                  value={formData.maxAllocation}
                  onChange={(e) => handleChange('maxAllocation')(e.target.value)}
                  error={attemptedSubmit && !!errors.maxAllocation}
                  helperText={attemptedSubmit && errors.maxAllocation}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="qty"
                  label="Max Quantity"
                  type="number"
                  value={formData.maxQuantity}
                  onChange={(e) => handleChange('maxQuantity')(e.target.value)}
                  error={attemptedSubmit && !!errors.maxQuantity}
                  helperText={attemptedSubmit && errors.maxQuantity}
                  required
                  inputProps={{ min: 0 }}
                />
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
          {formData.instrumentType === 'options' ? (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Design your options strategy by adding one or more option legs. For complex strategies like spreads or 
                condors, add multiple legs with different strike prices and option types.
              </Typography>
              <OptionsLegBuilder
                value={formData.entryOptionLegs}
                onChange={handleChange('entryOptionLegs')}
                label="Entry Option Legs"
                error={attemptedSubmit && !!errors.entryOptionLegs}
                helperText={attemptedSubmit ? errors.entryOptionLegs : undefined}
                required
              />
            </>
          ) : (
            <IndicatorExpressionBuilder
              value={formData.entryConditions}
              onChange={handleChange('entryConditions')}
              label="Entry Conditions"
              error={attemptedSubmit && !!errors.entryConditions}
              helperText={attemptedSubmit ? errors.entryConditions : undefined}
              required
            />
          )}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
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
                    },
                    field: {
                      clearable: true,
                      onClear: handleClearTime('entryStartTime'),
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                    },
                    field: {
                      clearable: true,
                      onClear: handleClearTime('entryEndTime'),
                    }
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Box>
      ),
    },
    {
      id: 'exit',
      title: 'Exit Conditions',
      component: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {formData.instrumentType === 'options' ? (
              <>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Define how you want to exit your options position. You can add exit legs to close specific entry legs
                  or let the stop loss and target profit handle your exits automatically.
                </Typography>
                <OptionsLegBuilder
                  value={formData.exitOptionLegs}
                  onChange={handleChange('exitOptionLegs')}
                  label="Exit Option Legs"
                  isOptional
                />
              </>
            ) : (
              <IndicatorExpressionBuilder
                label="Exit Conditions"
                value={formData.exitConditions}
                onChange={handleChange('exitConditions')}
                isOptional
              />
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="stop_loss"
              label="Stop Loss"
              type="number"
              value={formData.stopLoss}
              onChange={(e) => handleChange('stopLoss')(e.target.value)}
              error={attemptedSubmit && !!errors.stopLoss}
              helperText={attemptedSubmit && errors.stopLoss}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth 
              id="stop_loss_type"
              label="Stop Loss Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.stopLossType}
              onChange={handleChange('stopLossType')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="target_profit"
              label="Target Profit"
              type="number"
              value={formData.targetProfit}
              onChange={(e) => handleChange('targetProfit')(e.target.value)}
              error={attemptedSubmit && !!errors.targetProfit}
              helperText={attemptedSubmit && errors.targetProfit}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth
              id="target_profit_type"
              label="Target Profit Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.targetProfitType}
              onChange={handleChange('targetProfitType')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="trailing_stop_loss"
              label="Trailing Stop Loss"
              type="number"
              value={formData.trailingStopLoss}
              onChange={(e) => handleChange('trailingStopLoss')(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              fullWidth
              id="trailing_stop_loss_type"
              label="Trailing Stop Loss Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.trailingStopLossType}
              onChange={handleChange('trailingStopLossType')}
            />
          </Grid>
          
          {formData.instrumentType === 'options' && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Expiration Strategy</Typography>
              <Select
                fullWidth
                id="expiration_strategy"
                label="Strategy at Expiration"
                options={[
                  { label: 'Let options expire', value: 'EXPIRE' },
                  { label: 'Close position before expiration', value: 'CLOSE' },
                  { label: 'Exercise ITM options', value: 'EXERCISE' }
                ]}
                value={formData.expirationStrategy}
                onChange={handleChange('expirationStrategy')}
              />
              <FormHelperText>
                Determines what should happen when your options approach expiration
              </FormHelperText>
            </Grid>
          )}
        </Grid>
      ),
    },
    {
      id: 'backtest',
      title: 'Backtest Parameters',
      component: (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3}>
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brokerage (Rs.)"
                type="number"
                value={formData.brokerage}
                onChange={(e) => handleChange('brokerage')(e.target.value)}
                error={!!errors.brokerage}
                helperText={errors.brokerage || 'Brokerage cost per trade in rupees'}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Slippage"
                type="number"
                value={formData.slippage}
                onChange={(e) => handleChange('slippage')(e.target.value)}
                error={!!errors.slippage}
                helperText={errors.slippage || 'Slippage as decimal (e.g., 0.1 for 0.1%)'}
                inputProps={{ min: 0, step: 0.01 }}
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

  const expandFirstIncompleteSection = () => {
    const firstIncompleteSection = sections.find(section => !isSectionComplete(section.id, formData, selectedInstruments));
    if (firstIncompleteSection && !expandedSections.includes(firstIncompleteSection.id)) {
      setExpandedSections(prev => [...prev, firstIncompleteSection.id]);
    }
  };

  const handleSave = async (clearBacktestResults = true) => {
    setAttemptedSubmit(true);
    
    if (!isFormValid(formData, selectedInstruments)) {
      // If form is not valid, expand the first incomplete section to guide the user
      expandFirstIncompleteSection();
      return;
    }
    
    const validationErrors = validateForm(formData, selectedInstruments);
    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);

        // Make sure we have the instrument IDs correctly set in formData before sending
        if (selectedInstruments.length > 0) {
          // Update formData.instruments with the correct instrument IDs from selectedInstruments
          const instrumentIds = selectedInstruments.map(instrument => instrument.exchange_security_id);
          setFormData(prev => ({
            ...prev,
            instruments: instrumentIds
          }));
          
          // Create a modified copy of the form data with the correct instrument ids for the API call
          const modifiedFormData = {
            ...formData,
            instruments: instrumentIds
          };
          
          const apiData = convertFormToApiData(modifiedFormData);
          const isEdit = !!initialData?.id;
          
          // Determine the appropriate API endpoint based on whether this is an edit or create operation
          const url = isEdit ? `/api/strategy/${initialData.id}` : '/api/strategy';
          
          // Log the API data to console for debugging
          console.log('Submitting strategy data:', apiData);
          
          const response = await fetch(url, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          if (result.success) {
            showToast('Strategy saved successfully', 'success');
            setHasUnsavedChanges(false); // Reset unsaved changes after successful save
            
            // Clear backtest results after successful save only if requested
            if (clearBacktestResults) {
              setShowBacktestResults(false);
              setBacktestResults(null); // Clear results completely
              setRawBacktestData(null);
            }

            // Get the strategy ID - either from the response or from the existing form data
            const strategyId = result.data?.id || formData.id;
            
            // Update the formData with the returned strategy ID if needed
            if (result.data && result.data.id) {
              setFormData(prev => ({ ...prev, id: result.data.id }));
            }
            
            // Only redirect to the strategy edit page if this is a new strategy creation
            if (strategyId && !isEdit) {
              router.push(`/strategy/${strategyId}`);
            }
            
            // Return the strategy data for use in other functions
            return result.data;
          } else {
            throw new Error(result.error || 'Failed to save strategy');
          }
        } else {
          throw new Error('No instruments selected');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error connecting to server';
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBacktest = async () => {
    setAttemptedSubmit(true);
    if (!isFormValid(formData, selectedInstruments)) {
      // If form is not valid, expand the first incomplete section to guide the user
      expandFirstIncompleteSection();
      return;
    }
    
    const formErrors = validateForm(formData, selectedInstruments);
    if (Object.keys(formErrors).length === 0) {
      try {
        setIsBacktesting(true);
        setShowBacktestResults(true);
        
        // Scroll to the backtest results section
        setTimeout(() => {
          if (backtestResultsRef.current) {
            backtestResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
        
        // First save the strategy if it's a new one or has unsaved changes
        let currentStrategyId = initialData?.id || formData.id || '';
        
        if (!currentStrategyId || hasUnsavedChanges) {
          // Save the strategy and get the updated ID, but don't clear backtest results
          const saveResponse = await handleSave(false); // Pass false to prevent clearing backtest results
          if (saveResponse?.id) {
            currentStrategyId = saveResponse.id;
          }
        }
        
        // Ensure we have a valid strategy ID
        if (!currentStrategyId) {
          throw new Error('Cannot backtest: No valid strategy ID found');
        }
        
        // Create SSE connection for backtest using POST data
        const formDataToSend = convertFormToApiData(formData);
        
        // First, send the POST request to initiate the backtest and handle SSE stream directly
        const response = await fetch(`/api/backtest/run?strategy_id=${currentStrategyId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSend),
        });

        if (!response.ok || !response.body) {
          throw new Error(`Failed to start backtest: ${response.statusText}`);
        }

        // Read and parse SSE events from the response stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let backtestData: BacktestData | null = null;
        let done = false;

        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            let eventBoundary;
            while ((eventBoundary = buffer.indexOf('\n\n')) !== -1) {
              const rawEvent = buffer.slice(0, eventBoundary);
              buffer = buffer.slice(eventBoundary + 2);
              // Parse SSE event
              const lines = rawEvent.split('\n');
              let eventType = '';
              let eventData = '';
              for (const line of lines) {
                if (line.startsWith('event:')) {
                  eventType = line.replace('event:', '').trim();
                } else if (line.startsWith('data:')) {
                  eventData += line.replace('data:', '').trim();
                }
              }
              if (eventType === 'results') {
                try {
                  const rawData = JSON.parse(eventData);
                  if (rawData && rawData.results) {
                    backtestData = {
                      message: rawData.message || 'Backtest completed',
                      strategy_id: rawData.strategy_id || '',
                      results: rawData.results.map((item: any) => ({
                        instrument_id: item.instrument_id,
                        instrument_master: item.instrument_master,
                        positions: item.positions || [],
                        metrics: item.metrics || {}
                      }))
                    };
                    setRawBacktestData(backtestData);
                    if (backtestData && backtestData.results) {
                      const validRuns = backtestData.results.filter(run => run.metrics && String(run.instrument_id) !== "0");
                      const transformedResults: BacktestResult = {
                        strategyId: backtestData.strategy_id || initialData?.id || '',
                        results: validRuns.map((run: BacktestRun) => {
                          const winningTrades = run.positions ? run.positions.filter(pos => pos.profit_loss_absolute > 0).length : 0;
                          const totalTrades = run.positions ? run.positions.length : run.metrics.total_trades;
                          const winRate = totalTrades > 0 ? winningTrades / totalTrades : 0;
                          const instrumentId = Number(run.instrument_id);
                          // Enhanced fallback logic: use selectedInstruments symbol if instrument_master is not available
                          const instrumentName = run.instrument_master?.instrument_name ||
                            selectedInstruments.find(inst => inst.instrument_id === instrumentId)?.symbol ||
                            selectedInstruments.find(inst => inst.exchange_security_id === instrumentId)?.symbol ||
                            `Instrument ${run.instrument_id}`;
                          
                          return {
                            instrumentId,
                            instrumentName,
                            totalTrades,
                            winningTrades,
                            losingTrades: totalTrades - winningTrades,
                            winRate,
                            profitFactor: run.metrics.profit_factor || 0,
                            totalPnL: run.metrics.annualized_return || run.metrics.total_return_pct,
                            maxDrawdown: run.metrics.max_drawdown,
                            sharpeRatio: run.metrics.sharpe_ratio
                          };
                        }),
                        aggregatedMetrics: {
                          instrumentId: 0,
                          instrumentName: 'Total',
                          totalTrades: validRuns.reduce((sum: number, run: BacktestRun) => sum + (run.positions ? run.positions.length : run.metrics.total_trades), 0),
                          winningTrades: validRuns.reduce((sum: number, run: BacktestRun) => {
                            if (run.positions) {
                              return sum + run.positions.filter(pos => pos.profit_loss_absolute > 0).length;
                            }
                            return sum;
                          }, 0),
                          losingTrades: validRuns.reduce((sum: number, run: BacktestRun) => {
                            if (run.positions) {
                              return sum + run.positions.filter(pos => pos.profit_loss_absolute <= 0).length;
                            }
                            return sum;
                          }, 0),
                          winRate: validRuns.length > 0 ? 
                            validRuns.reduce((sum: number, run: BacktestRun) => {
                              if (run.positions) {
                                const winningPositions = run.positions.filter(pos => pos.profit_loss_absolute > 0).length;
                                const winRate = run.positions.length > 0 ? winningPositions / run.positions.length : 0;
                                return sum + winRate;
                              }
                              return sum;
                            }, 0) / validRuns.length : 0,
                          profitFactor: validRuns.reduce((sum: number, run: BacktestRun, _: number, arr: BacktestRun[]) => sum + (run.metrics.profit_factor || 0) / arr.length, 0),
                          totalPnL: validRuns.reduce((sum: number, run: BacktestRun, _: number, arr: BacktestRun[]) => sum + (run.metrics.annualized_return || run.metrics.total_return_pct) / arr.length, 0),
                          maxDrawdown: validRuns.length > 0 ? Math.max(...validRuns.map((run: BacktestRun) => run.metrics.max_drawdown || 0)) : 0,
                          sharpeRatio: validRuns.reduce((sum: number, run: BacktestRun, _: number, arr: BacktestRun[]) => sum + (run.metrics.sharpe_ratio || 0) / arr.length, 0)
                        }
                      };
                      
                      // Console log the transformed results for debugging
                      console.log('Transformed Backtest Results:', transformedResults);
                      console.log('Individual Results:', transformedResults.results);
                      console.log('Aggregated Metrics:', transformedResults.aggregatedMetrics);
                      
                      setBacktestResults(transformedResults);
                      setShowBacktestResults(true);
                      
                      // Check deployment status for all instruments in the backtest results
                      const instrumentIds = transformedResults.results.map(r => r.instrumentId);
                      await checkDeploymentStatus(transformedResults.strategyId, instrumentIds);
                    }
                  }
                } catch (error) {
                  console.error('Error parsing backtest results:', error);
                  setIsBacktesting(false);
                  const errorMessage = 'Invalid backtest response format';
                  setErrors(prev => ({
                    ...prev,
                    submit: errorMessage
                  }));
                  showToast(errorMessage, 'error');
                }
              } else if (eventType === 'done') {
                setIsBacktesting(false);
                if (backtestData) {
                  showToast('Backtest completed successfully', 'success');
                } else {
                  const errorMessage = 'No backtest results received';
                  setErrors(prev => ({
                    ...prev,
                    submit: errorMessage
                  }));
                  showToast(errorMessage, 'error');
                }
              } else if (eventType === 'error') {
                setIsBacktesting(false);
                const errorMessage = 'Connection error during backtest';
                setErrors(prev => ({
                  ...prev,
                  submit: errorMessage
                }));
                showToast(errorMessage, 'error');
              }
            }
          }
        }
      } catch (error) {
        // Handle errors that occur during strategy saving or EventSource creation
        const errorMessage = error instanceof Error ? error.message : 'Error running backtest';
        setIsBacktesting(false);
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
        showToast(errorMessage, 'error');
      }
    }
  };

  const handleDeploy = async (instrumentId: number) => {
    try {
      const newSet = new Set(deployingInstruments);
      newSet.add(instrumentId);
      setDeployingInstruments(newSet);
      
      // Get the instrument name
      const instrumentName = backtestResults?.results.find(r => r.instrumentId === instrumentId)?.instrumentName || `Instrument ${instrumentId}`;
      
      // Create deployment using our deployment service
      await createDeployment({
        strategy_id: initialData?.id || '',
        instrument_id: instrumentId,
        name: `${formData.name} - ${instrumentName}`,
        description: formData.description,
        isActive: true
      });

      // Update deployment status for this instrument
      const newDeploymentStatuses = new Map(deploymentStatuses);
      newDeploymentStatuses.set(instrumentId, true);
      setDeploymentStatuses(newDeploymentStatuses);

      showSuccess(
        `Strategy deployed successfully for ${instrumentName}`,
        'Your strategy is now live and will execute trades based on your defined conditions.'
      );
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Error connecting to server'
      }));
      showToast('Error connecting to server', 'error');
    } finally {
      const newSet = new Set(deployingInstruments);
      newSet.delete(instrumentId);
      setDeployingInstruments(newSet);
    }
  };

  const handleDeployAll = async () => {
    if (!backtestResults) return;
    
    try {
      // Filter out instruments that are already deployed
      const instrumentsToDeployIds = backtestResults.results
        .filter(result => !deploymentStatuses.get(result.instrumentId))
        .map(result => result.instrumentId);
      
      if (instrumentsToDeployIds.length === 0) {
        showToast('All instruments are already deployed', 'info');
        return;
      }
      
      // Set only undeployed instruments as deploying
      setDeployingInstruments(new Set(instrumentsToDeployIds));
      
      const strategyId = initialData?.id || '';
      
      // Deploy each undeployed instrument individually
      const deploymentPromises = backtestResults.results
        .filter(result => !deploymentStatuses.get(result.instrumentId))
        .map(result => createDeployment({
          strategy_id: strategyId,
          instrument_id: result.instrumentId,
          name: `${formData.name} - ${result.instrumentName}`,
          description: formData.description,
          isActive: true
        }));
      
      await Promise.all(deploymentPromises);
      
      // Update deployment statuses for newly deployed instruments
      const newDeploymentStatuses = new Map(deploymentStatuses);
      instrumentsToDeployIds.forEach(instrumentId => {
        newDeploymentStatuses.set(instrumentId, true);
      });
      setDeploymentStatuses(newDeploymentStatuses);
      
      showSuccess(
        `${instrumentsToDeployIds.length} strategies deployed successfully`,
        'Your strategies are now live and will execute trades based on your defined conditions.'
      );
      
      // Redirect to deployments page after a short delay
      setTimeout(() => {
        router.push('/deployment');
      }, 1500);
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Error deploying strategies'
      }));
      showToast('Error deploying strategies', 'error');
    } finally {
      setDeployingInstruments(new Set());
    }
  };

  const checkDeploymentStatus = async (strategyId: string, instrumentIds: number[], retryCount = 0) => {
    const maxRetries = 2;
    
    try {
      if (!strategyId || instrumentIds.length === 0) return;
      
      const instrumentsParam = instrumentIds.join(',');
      const response = await fetch(`/api/deployment/strategy/${strategyId}/status?instruments=${instrumentsParam}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.instruments) {
        const statusMap = new Map<number, boolean>();
        data.data.instruments.forEach((item: any) => {
          statusMap.set(item.instrument_id, item.has_deployment);
        });
        setDeploymentStatuses(statusMap);
      } else {
        throw new Error('Invalid response format from deployment status API');
      }
    } catch (error) {
      console.error('Error checking deployment status:', error);
      
      // Retry logic
      if (retryCount < maxRetries) {
        console.log(`Retrying deployment status check... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          checkDeploymentStatus(strategyId, instrumentIds, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        // Show user-friendly error message only after all retries fail
        showToast('Unable to check deployment status. Please refresh to see latest status.', 'warning');
      }
    }
  };

  const refreshDeploymentStatus = async () => {
    if (!backtestResults || !initialData?.id) return;
    
    const instrumentIds = backtestResults.results.map(r => r.instrumentId);
    await checkDeploymentStatus(initialData.id, instrumentIds);
  };

  // Function to toggle positions display
  const togglePositions = (instrumentId: number) => {
    if (expandedInstrument === instrumentId) {
      setExpandedInstrument(null);
      setShowingPositions(false);
    } else {
      setExpandedInstrument(instrumentId);
      setShowingPositions(true);
    }
  };

  const fetchStrategy = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/strategy/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const strategyData = data.data;
        
        // First fetch the instrument details
        let instrumentsData: Instrument[] = [];
        if (strategyData.instruments && strategyData.instruments.length > 0) {
          instrumentsData = await fetchInstrumentsByIds(strategyData.instruments);
          setSelectedInstruments(instrumentsData);
        }
        
        const entryConditions = parseExpressions(strategyData.entry_expression);
        const exitConditions = parseExpressions(strategyData.exit_expression);
        
        const formData: FormData = {
          id: strategyData.id,
          name: strategyData.name,
          description: strategyData.description,
          instrumentType: strategyData.instrument_type || 'equity',
          buyOrSell: strategyData.position_type === 'LONG' ? 'buy' : 'sell',
          instruments: strategyData.instruments || [],
          candlestickType: strategyData.chart_type || 'CANDLESTICK',
          timeframe: strategyData.chart_timeframe,
          tradeType: strategyData.trade_type || 'MIS',
          maxAllocation: strategyData.max_allocation?.toString() || '',
          maxQuantity: strategyData.qty?.toString() || '',
          entryConditions,
          exitConditions,
          entryOptionLegs: strategyData.entry_option_legs || [],
          exitOptionLegs: strategyData.exit_option_legs || [],
          expirationStrategy: strategyData.expiration_strategy || 'CLOSE',
          stopLoss: strategyData.stop_loss?.toString() || '',
          stopLossType: strategyData.stop_loss_type || 'ABSOLUTE',
          targetProfit: strategyData.target_profit?.toString() || '',
          targetProfitType: strategyData.target_profit_type || 'ABSOLUTE',
          trailingStopLoss: strategyData.trailing_stop_loss?.toString() || '',
          trailingStopLossType: strategyData.trailing_stop_loss_type || 'ABSOLUTE',
          entryStartTime: strategyData.entry_start_time ? dayjs(strategyData.entry_start_time) : null,
          entryEndTime: strategyData.entry_end_time ? dayjs(strategyData.entry_end_time) : null,
          startDate: strategyData.start_date ? dayjs(strategyData.start_date) : null,
          endDate: strategyData.end_date ? dayjs(strategyData.end_date) : null,
          brickSize: strategyData.brick_size?.toString() || '',
          brokerage: strategyData.brokerage?.toString() || '20',
          slippage: strategyData.slippage?.toString() || '0.5',
        };
        
        setFormData(formData);
        // Reset unsaved changes when loading a strategy
        setHasUnsavedChanges(false);
      } else {
        throw new Error(data.error || 'Failed to fetch strategy');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center', 
        mb: 3,
        pl: 2,
        pt: 2
      }}>
        <Box sx={{ flex: 1 }}>
          {pageTitle && (
            <Typography variant="h4">
              {pageTitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              name="instrumentTypeRadio"
              value={formData.instrumentType === 'options' ? 'options' : 'equity'}
              onChange={(e) => handleChange('instrumentType')(e.target.value)}
            >
              <FormControlLabel value="equity" control={<Radio />} label="Equity / Futures" />
              <FormControlLabel value="options" control={<Radio />} label="Options" />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', mr: 2 }}>
          <Button 
            variant="text" 
            onClick={toggleExpandAll}
            size="small"
          >
            {isAllExpanded ? 'Collapse All' : 'Expand All'}
          </Button>
        </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {section.title}
              </Typography>
              {/* Show missing fields if any */}
              {!isSectionComplete(section.id, formData, selectedInstruments) && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <Typography variant="caption" color="error" sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Missing: {getMissingSectionFields(section.id, formData, selectedInstruments).join(', ')}
                  </Typography>
                </Box>
              )}
              <Tooltip 
                title={isSectionComplete(section.id, formData, selectedInstruments) 
                  
                  ? "Section is complete" 
                  : `Section is incomplete. Missing: ${getMissingSectionFields(section.id, formData, selectedInstruments).join(', ')}`}
                arrow
              >
                {isSectionComplete(section.id, formData, selectedInstruments) ? (
                  <CheckCircle color="success" sx={{ fontSize: 20 }} />
                ) : (
                  <Cancel color="error" sx={{ fontSize: 20 }} />
                )}
              </Tooltip>
            </Box>
                   </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            {section.component}
          </AccordionDetails>
               </Accordion>
      ))}
      
      <InstrumentSelector
        open={isInstrumentSelectorOpen}
        onClose={() => setInstrumentSelectorOpen(false)}
        onSelect={handleInstrumentSelect}
        selectedInstruments={selectedInstruments}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Tooltip title={!isFormValid(formData, selectedInstruments) ? "Please fill in all required fields to save" : ""} arrow>
          <span>
            <Button 
              variant="contained" 
              onClick={() => handleSave()}
              disabled={loading || (initialData && !hasUnsavedChanges) || !isFormValid(formData, selectedInstruments)}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </span>
        </Tooltip>
        <Tooltip title={
          !isFormValid(formData, selectedInstruments) ? "Please fill in all required fields to run backtest" :
          hasUnsavedChanges ? "Please save your changes before running backtest" : ""
        } arrow>
          <span>
            <Button 
              variant="contained" 
              onClick={handleBacktest}
              disabled={isBacktesting || hasUnsavedChanges || !isFormValid(formData, selectedInstruments)}
            >
              {isBacktesting ? <CircularProgress size={24} /> : 'Backtest'}
            </Button>
          </span>
        </Tooltip>
      </Box>

      {showBacktestResults && (
        <BacktestResultsDisplay
          backtestResults={backtestResults}
          rawBacktestData={rawBacktestData}
          isBacktesting={isBacktesting}
          selectedInstruments={selectedInstruments}
          deployingInstruments={deployingInstruments}
          expandedInstrument={expandedInstrument}
          showingPositions={showingPositions}
          deploymentStatuses={deploymentStatuses}
          timeframe={formData.timeframe}
          strategyId={initialData?.id || formData.id || backtestResults?.strategyId}
          onTogglePositions={togglePositions}
          onDeploy={handleDeploy}
          onDeployAll={handleDeployAll}
          onRefreshDeploymentStatus={refreshDeploymentStatus}
          backtestResultsRef={backtestResultsRef}
        />
      )}
    </Box>
  );
};