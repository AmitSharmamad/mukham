import { Dayjs } from 'dayjs';
import { FormData, ValidationErrors, Instrument } from '../types/strategyForm';

/**
 * Validates that start time is before end time
 */
export const validateTimeRange = (startTime: Dayjs | null, endTime: Dayjs | null): boolean => {
  if (startTime && endTime && startTime.isAfter(endTime)) {
    return false;
  }
  return true;
};

/**
 * Validates that start date is before or equal to end date
 */
export const validateDateRange = (startDate: Dayjs | null, endDate: Dayjs | null): boolean => {
  if (startDate && endDate) {
    const start = startDate.startOf('day');
    const end = endDate.startOf('day');
    return !start.isAfter(end);
  }
  return true;
};

/**
 * Validates the entire form and returns validation errors
 */
export const validateForm = (formData: FormData, selectedInstruments: Instrument[]): ValidationErrors => {
  const newErrors: ValidationErrors = {};
  const isOptionsType = formData.instrumentType === 'options';
  const isRenkoType = formData.candlestickType === 'RENKO';
  
  // Name section validation
  if (!formData.name.trim()) {
    newErrors.name = 'Strategy name is required';
  }
  
  // Positions section validation
  if (!formData.instrumentType) {
    newErrors.instrumentType = 'Instrument type is required';
  }
  
  if (!formData.buyOrSell) {
    newErrors.buyOrSell = 'Position type is required';
  }
  
  if (selectedInstruments.length === 0) {
    newErrors.instruments = 'At least one instrument must be selected';
  }
  
  if (!formData.candlestickType) {
    newErrors.candlestickType = 'Candlestick type is required';
  }
  
  if (!formData.maxAllocation || formData.maxAllocation === '' || parseFloat(formData.maxAllocation) <= 0) {
    newErrors.maxAllocation = 'Max Allocation is required and must be greater than 0';
  }

  if (!formData.maxQuantity || formData.maxQuantity === '' || parseFloat(formData.maxQuantity) <= 0) {
    newErrors.maxQuantity = 'Max Quantity is required and must be greater than 0';
  }

  if (isRenkoType && (!formData.brickSize || formData.brickSize === '0')) {
    newErrors.brickSize = 'Brick size is required for Renko charts';
  }
  
  if (!formData.timeframe) {
    newErrors.timeframe = 'Timeframe is required';
  }
  
  if (!formData.tradeType) {
    newErrors.tradeType = 'Trade type is required';
  }
  
  // Entry section validation
  if (isOptionsType) {
    if (formData.entryOptionLegs.length === 0) {
      newErrors.entryOptionLegs = 'At least one entry option leg is required';
    }
  } else {
    if (formData.entryConditions.length === 0) {
      newErrors.entryConditions = 'At least one entry condition is required';
    }
  }
  
  // Exit section validation
  if (formData.stopLoss === '') {
    newErrors.stopLoss = 'Stop loss is required';
  }
  
  if (formData.targetProfit === '') {
    newErrors.targetProfit = 'Target profit is required';
  }
  
  // Backtest parameters validation
  if (!formData.startDate) {
    newErrors.startDate = 'Start date is required';
  }
  
  if (!formData.endDate) {
    newErrors.endDate = 'End date is required';
  }

  // Validate date range
  if (formData.startDate && formData.endDate) {
    if (!validateDateRange(formData.startDate, formData.endDate)) {
      newErrors.startDate = 'Start date cannot be after end date';
      newErrors.endDate = 'End date cannot be before start date';
    }
  }

  // Validate time range if both are provided
  if (formData.entryStartTime && formData.entryEndTime) {
    if (!validateTimeRange(formData.entryStartTime, formData.entryEndTime)) {
      newErrors.entryStartTime = 'Start time cannot be after end time';
      newErrors.entryEndTime = 'End time cannot be before start time';
    }
  }

  return newErrors;
};

/**
 * Checks if the form is valid (has all required fields filled)
 */
export const isFormValid = (formData: FormData, selectedInstruments: Instrument[]): boolean => {
  const isOptionsType = formData.instrumentType === 'options';
  
  // Check each section's mandatory fields
  const isNameSectionValid = !!formData.name.trim();
  
  const isPositionsSectionValid = !!(
    formData.instrumentType &&
    formData.buyOrSell &&
    selectedInstruments.length > 0 &&
    formData.candlestickType &&
    formData.timeframe &&
    formData.tradeType &&
    formData.maxAllocation &&
    formData.maxAllocation !== '' &&
    parseFloat(formData.maxAllocation) > 0 &&
    formData.maxQuantity &&
    formData.maxQuantity !== '' &&
    parseFloat(formData.maxQuantity) > 0
  );
  
  const isEntrySectionValid = isOptionsType 
    ? (formData.entryOptionLegs.length > 0)
    : (formData.entryConditions.length > 0);
  
  const isExitSectionValid = !!(
    formData.stopLoss &&
    formData.targetProfit
  );
  
  const isBacktestSectionValid = !!(
    formData.startDate &&
    formData.endDate &&
    (!formData.entryStartTime || !formData.entryEndTime || validateTimeRange(formData.entryStartTime, formData.entryEndTime)) &&
    validateDateRange(formData.startDate, formData.endDate)
  );
  
  return isNameSectionValid && 
         isPositionsSectionValid && 
         isEntrySectionValid && 
         isExitSectionValid && 
         isBacktestSectionValid;
};

/**
 * Checks if a specific section is complete
 */
export const isSectionComplete = (sectionId: string, formData: FormData, selectedInstruments: Instrument[]): boolean => {
  const isOptionsType = formData.instrumentType === 'options';
  
  switch (sectionId) {
    case 'name':
      return !!formData.name.trim();
    
    case 'positions':
      return (
        !!formData.instrumentType &&
        !!formData.buyOrSell &&
        selectedInstruments.length > 0 &&
        !!formData.candlestickType &&
        !!formData.timeframe &&
        !!formData.tradeType &&
        !!formData.maxAllocation &&
        formData.maxAllocation !== '' &&
        parseFloat(formData.maxAllocation) > 0
      );
    
    case 'entry':
      return isOptionsType
        ? Array.isArray(formData.entryOptionLegs) && formData.entryOptionLegs.length > 0
        : Array.isArray(formData.entryConditions) && formData.entryConditions.length > 0;
    
    case 'exit':
      return (
        formData.stopLoss !== '' &&
        formData.targetProfit !== ''
      );
    
    case 'backtest':
      return (
        !!formData.startDate &&
        !!formData.endDate &&
        (!formData.entryStartTime || !formData.entryEndTime || validateTimeRange(formData.entryStartTime, formData.entryEndTime)) &&
        validateDateRange(formData.startDate, formData.endDate)
      );
    
    default:
      return false;
  }
};

/**
 * Gets missing fields for a specific section
 */
export const getMissingSectionFields = (sectionId: string, formData: FormData, selectedInstruments: Instrument[]): string[] => {
  const isOptionsType = formData.instrumentType === 'options';
  const isRenkoType = formData.candlestickType === 'RENKO';
  const missing: string[] = [];
  
  switch (sectionId) {
    case 'name':
      if (!formData.name.trim()) missing.push('Strategy Name');
      if (!formData.description.trim()) missing.push('Description');
      break;
    
    case 'positions':
      if (!formData.instrumentType) missing.push('Instrument Type');
      if (!formData.buyOrSell) missing.push('Position type');
      if (selectedInstruments.length === 0) missing.push('Instruments');
      if (!formData.candlestickType) missing.push('Candlestick Type');
      if (isRenkoType && !formData.brickSize) missing.push('Brick Size');
      if (!formData.timeframe) missing.push('Timeframe');
      if (!formData.tradeType) missing.push('Trade Type');
      if (!formData.maxAllocation) missing.push('Max Allocation');
      if (!formData.maxQuantity) missing.push('Max Quantity');
      break;
    
    case 'entry':
      if (isOptionsType) {
        if (formData.entryOptionLegs.length === 0) missing.push('Option Legs');
      } else {
        if (formData.entryConditions.length === 0) missing.push('Entry Conditions');
      }
      break;
    
    case 'exit':
      if (formData.stopLoss === '') missing.push('Stop Loss');
      if (formData.targetProfit === '') missing.push('Target Profit');
      break;
    
    case 'backtest':
      if (!formData.startDate) missing.push('Start Date');
      if (!formData.endDate) missing.push('End Date');
      if (formData.startDate && formData.endDate && !validateDateRange(formData.startDate, formData.endDate)) {
        missing.push('Valid Date Range');
      }
      if (formData.entryStartTime && formData.entryEndTime && !validateTimeRange(formData.entryStartTime, formData.entryEndTime)) {
        missing.push('Valid Time Range');
      }
      break;
  }
  
  return missing;
};
