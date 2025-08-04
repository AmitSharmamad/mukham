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
  
  // Position type (buyOrSell) is only required for Equity strategies
  if (formData.instrumentType === 'equity' && !formData.buyOrSell) {
    newErrors.buyOrSell = 'Position type is required';
  }
  
  // Instrument selection validation depends on strategy type
  if (formData.instrumentType === 'options' && formData.strategyType === 'time-based') {
    // For F&O Time-based: Instruments are managed through option legs, not traditional selection
    // So we don't validate selectedInstruments here
  } else if (selectedInstruments.length === 0) {
    // For Equity and F&O Expression: Need at least one instrument selected
    newErrors.instruments = 'At least one instrument must be selected';
  }
  
  if (!formData.candlestickType) {
    newErrors.candlestickType = 'Candlestick type is required';
  }

  // Max allocation and quantity are only required for Equity strategies
  if (formData.instrumentType === 'equity') {
    if (!formData.maxAllocation || formData.maxAllocation === '' || parseFloat(formData.maxAllocation) <= 0) {
      newErrors.maxAllocation = 'Max Allocation is required and must be greater than 0';
    }

    if (!formData.maxQuantity || formData.maxQuantity === '' || parseFloat(formData.maxQuantity) <= 0) {
      newErrors.maxQuantity = 'Max Quantity is required and must be greater than 0';
    }
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
  } else if (isNaN(parseFloat(formData.stopLoss)) || parseFloat(formData.stopLoss) <= 0) {
    newErrors.stopLoss = 'Stop loss must be a positive number';
  }
  
  if (formData.targetProfit === '') {
    newErrors.targetProfit = 'Target profit is required';
  } else if (isNaN(parseFloat(formData.targetProfit)) || parseFloat(formData.targetProfit) <= 0) {
    newErrors.targetProfit = 'Target profit must be a positive number';
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

  // Validate brokerage and slippage
  if (formData.brokerage !== '' && (isNaN(parseInt(formData.brokerage)) || parseInt(formData.brokerage) < 0)) {
    newErrors.brokerage = 'Brokerage must be a positive integer';
  }
  
  if (formData.slippage !== '' && (isNaN(parseFloat(formData.slippage)) || parseFloat(formData.slippage) < 0)) {
    newErrors.slippage = 'Slippage must be a positive number';
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
  
  // Check positions completion based on strategy type - same logic as isSectionComplete
  let isPositionsSectionValid = false;
  if (formData.instrumentType === 'options' && formData.strategyType === 'expression') {
    // For F&O Expression: Only need instruments, chart settings, no max allocation/quantity
    isPositionsSectionValid = !!(
      formData.instrumentType &&
      selectedInstruments.length > 0 &&
      formData.candlestickType &&
      formData.timeframe &&
      formData.tradeType
    );
  } else if (formData.instrumentType === 'options' && formData.strategyType === 'time-based') {
    // For F&O Time-based: Instruments are managed through option legs, not traditional instrument selection
    // Just need basic chart settings
    isPositionsSectionValid = !!(
      formData.instrumentType &&
      formData.candlestickType &&
      formData.timeframe &&
      formData.tradeType
    );
  } else if (formData.instrumentType === 'equity') {
    // For Equity: Need all fields including position type and max allocation/quantity
    isPositionsSectionValid = !!(
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
  } else {
    // No instrument type selected yet
    isPositionsSectionValid = false;
  }
  
  const isEntrySectionValid = isOptionsType 
    ? (formData.entryOptionLegs.length > 0)
    : (formData.entryConditions.length > 0);
  
  const isExitSectionValid = !!(
    formData.stopLoss &&
    formData.stopLoss !== '' &&
    !isNaN(parseFloat(formData.stopLoss)) &&
    parseFloat(formData.stopLoss) > 0 &&
    formData.targetProfit &&
    formData.targetProfit !== '' &&
    !isNaN(parseFloat(formData.targetProfit)) &&
    parseFloat(formData.targetProfit) > 0
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
    
    case 'name-positions':
      // Check name completion
      const isNameComplete = !!formData.name.trim();
      
      // Check positions completion based on strategy type
      let isPositionsComplete = false;
      if (formData.instrumentType === 'options' && formData.strategyType === 'expression') {
        // For F&O Expression: Only need instruments, chart settings, no max allocation/quantity
        isPositionsComplete = (
          !!formData.instrumentType &&
          selectedInstruments.length > 0 &&
          !!formData.candlestickType &&
          !!formData.timeframe &&
          !!formData.tradeType
        );
      } else if (formData.instrumentType === 'options' && formData.strategyType === 'time-based') {
        // For F&O Time-based: Instruments are managed through option legs, not traditional instrument selection
        // Just need basic chart settings
        isPositionsComplete = (
          !!formData.instrumentType &&
          !!formData.candlestickType &&
          !!formData.timeframe &&
          !!formData.tradeType
        );
      } else if (formData.instrumentType === 'equity') {
        // For Equity: Need all fields including position type and max allocation/quantity
        isPositionsComplete = (
          !!formData.instrumentType &&
          !!formData.buyOrSell &&
          selectedInstruments.length > 0 &&
          !!formData.candlestickType &&
          !!formData.timeframe &&
          !!formData.tradeType &&
          !!formData.maxAllocation &&
          formData.maxAllocation !== '' &&
          parseFloat(formData.maxAllocation) > 0 &&
          !!formData.maxQuantity &&
          formData.maxQuantity !== '' &&
          parseFloat(formData.maxQuantity) > 0
        );
      } else {
        // No instrument type selected yet
        isPositionsComplete = false;
      }
      
      return isNameComplete && isPositionsComplete;
    
    case 'positions':
      // Check positions completion based on strategy type
      if (formData.instrumentType === 'options' && formData.strategyType === 'expression') {
        // For F&O Expression: Only need instruments, chart settings, no max allocation/quantity/buyOrSell
        return (
          !!formData.instrumentType &&
          selectedInstruments.length > 0 &&
          !!formData.candlestickType &&
          !!formData.timeframe &&
          !!formData.tradeType
        );
      } else if (formData.instrumentType === 'options' && formData.strategyType === 'time-based') {
        // For F&O Time-based: Instruments are managed through option legs, not traditional instrument selection
        // Just need basic chart settings
        return (
          !!formData.instrumentType &&
          !!formData.candlestickType &&
          !!formData.timeframe &&
          !!formData.tradeType
        );
      } else if (formData.instrumentType === 'equity') {
        // For Equity: Need all fields including position type and max allocation/quantity
        return (
          !!formData.instrumentType &&
          !!formData.buyOrSell &&
          selectedInstruments.length > 0 &&
          !!formData.candlestickType &&
          !!formData.timeframe &&
          !!formData.tradeType &&
          !!formData.maxAllocation &&
          formData.maxAllocation !== '' &&
          parseFloat(formData.maxAllocation) > 0 &&
          !!formData.maxQuantity &&
          formData.maxQuantity !== '' &&
          parseFloat(formData.maxQuantity) > 0
        );
      } else {
        // No instrument type selected yet
        return false;
      }
    
    case 'entry':
      return isOptionsType
        ? Array.isArray(formData.entryOptionLegs) && formData.entryOptionLegs.length > 0
        : Array.isArray(formData.entryConditions) && formData.entryConditions.length > 0;
    
    case 'exit':
      return (
        formData.stopLoss !== '' &&
        !isNaN(parseFloat(formData.stopLoss)) &&
        parseFloat(formData.stopLoss) > 0 &&
        formData.targetProfit !== '' &&
        !isNaN(parseFloat(formData.targetProfit)) &&
        parseFloat(formData.targetProfit) > 0
      );
    
    case 'backtest':
      return (
        !!formData.startDate &&
        !!formData.endDate &&
        (!formData.entryStartTime || !formData.entryEndTime || validateTimeRange(formData.entryStartTime, formData.entryEndTime)) &&
        validateDateRange(formData.startDate, formData.endDate) &&
        (formData.brokerage === '' || (!isNaN(parseInt(formData.brokerage)) && parseInt(formData.brokerage) >= 0)) &&
        (formData.slippage === '' || (!isNaN(parseFloat(formData.slippage)) && parseFloat(formData.slippage) >= 0))
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
      
      // Position type (buyOrSell) is only required for Equity
      if (formData.instrumentType === 'equity' && !formData.buyOrSell) missing.push('Position type');
      
      // Instrument selection validation depends on strategy type
      if (formData.instrumentType === 'options' && formData.strategyType === 'time-based') {
        // For F&O Time-based: Instruments are managed through option legs, not traditional selection
        // So we don't check selectedInstruments here
      } else if (selectedInstruments.length === 0) {
        // For Equity and F&O Expression: Need at least one instrument selected
        missing.push('Instruments');
      }
      
      if (!formData.candlestickType) missing.push('Candlestick Type');
      if (isRenkoType && !formData.brickSize) missing.push('Brick Size');
      if (!formData.timeframe) missing.push('Timeframe');
      if (!formData.tradeType) missing.push('Trade Type');
      
      // Max allocation and quantity are only required for Equity
      if (formData.instrumentType === 'equity') {
        if (!formData.maxAllocation) missing.push('Max Allocation');
        if (!formData.maxQuantity) missing.push('Max Quantity');
      }
      break;
    
    case 'entry':
      if (isOptionsType) {
        if (formData.entryOptionLegs.length === 0) missing.push('Option Legs');
      } else {
        if (formData.entryConditions.length === 0) missing.push('Entry Conditions');
      }
      break;
    
    case 'exit':
      if (formData.stopLoss === '' || isNaN(parseFloat(formData.stopLoss)) || parseFloat(formData.stopLoss) <= 0) missing.push('Stop Loss');
      if (formData.targetProfit === '' || isNaN(parseFloat(formData.targetProfit)) || parseFloat(formData.targetProfit) <= 0) missing.push('Target Profit');
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
