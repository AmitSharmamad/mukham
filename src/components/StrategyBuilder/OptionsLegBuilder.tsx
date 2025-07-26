import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField,
  Tooltip,
  ButtonGroup,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { Select } from '../Select';

export interface OptionLeg {
  id: string;
  exchange: string;
  instrumentType: 'Index' | 'Stock';
  selectedInstrument?: any; // Selected instrument from the dropdown
  segment: 'Futures' | 'Options';
  // For both Futures and Options
  buySell: 'Buy' | 'Sell';
  expiry: 'Current' | 'Next';
  lots: string;
  // For Options only
  optionType?: 'CE' | 'PE';
  expiryType?: 'Weekly' | 'Monthly';
  strikeType?: string;
  // Legacy fields (keeping for backward compatibility)
  legType?: 'buy' | 'sell';
  strike?: string;
  quantity?: string;
}

export interface OptionsLegBuilderProps {
  value: OptionLeg[];
  onChange: (legs: OptionLeg[]) => void;
  label: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  isOptional?: boolean;
}

// Creates a unique ID for each leg
const createUniqueId = () => `leg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Exchange options
const exchangeOptions = [
  { value: 'NSE', label: 'NSE' },
  { value: 'BSE', label: 'BSE' },
  { value: 'MCX', label: 'MCX' },
];

// Strike type options for Options
const strikeTypeOptions = [
  { value: 'OTM20', label: 'OTM 20' },
  { value: 'OTM19', label: 'OTM 19' },
  { value: 'OTM18', label: 'OTM 18' },
  { value: 'OTM17', label: 'OTM 17' },
  { value: 'OTM16', label: 'OTM 16' },
  { value: 'OTM15', label: 'OTM 15' },
  { value: 'OTM14', label: 'OTM 14' },
  { value: 'OTM13', label: 'OTM 13' },
  { value: 'OTM12', label: 'OTM 12' },
  { value: 'OTM11', label: 'OTM 11' },
  { value: 'OTM10', label: 'OTM 10' },
  { value: 'OTM9', label: 'OTM 9' },
  { value: 'OTM8', label: 'OTM 8' },
  { value: 'OTM7', label: 'OTM 7' },
  { value: 'OTM6', label: 'OTM 6' },
  { value: 'OTM5', label: 'OTM 5' },
  { value: 'OTM4', label: 'OTM 4' },
  { value: 'OTM3', label: 'OTM 3' },
  { value: 'OTM2', label: 'OTM 2' },
  { value: 'OTM1', label: 'OTM 1' },
  { value: 'ATM', label: 'ATM' },
  { value: 'ITM1', label: 'ITM 1' },
  { value: 'ITM2', label: 'ITM 2' },
  { value: 'ITM3', label: 'ITM 3' },
  { value: 'ITM4', label: 'ITM 4' },
  { value: 'ITM5', label: 'ITM 5' },
  { value: 'ITM6', label: 'ITM 6' },
  { value: 'ITM7', label: 'ITM 7' },
  { value: 'ITM8', label: 'ITM 8' },
  { value: 'ITM9', label: 'ITM 9' },
  { value: 'ITM10', label: 'ITM 10' },
  { value: 'ITM11', label: 'ITM 11' },
  { value: 'ITM12', label: 'ITM 12' },
  { value: 'ITM13', label: 'ITM 13' },
  { value: 'ITM14', label: 'ITM 14' },
  { value: 'ITM15', label: 'ITM 15' },
  { value: 'ITM16', label: 'ITM 16' },
  { value: 'ITM17', label: 'ITM 17' },
  { value: 'ITM18', label: 'ITM 18' },
  { value: 'ITM19', label: 'ITM 19' },
  { value: 'ITM20', label: 'ITM 20' },
];

export const OptionsLegBuilder: React.FC<OptionsLegBuilderProps> = ({
  value = [],
  onChange,
  label,
  error = false,
  helperText,
  required = false,
  isOptional = false
}) => {
  // State for managing instrument search for each leg
  const [instrumentOptions, setInstrumentOptions] = useState<{[legId: string]: any[]}>({});
  const [loadingInstruments, setLoadingInstruments] = useState<{[legId: string]: boolean}>({});
  
  // Function to fetch instruments based on exchange and instrument type
  const fetchInstruments = useCallback(async (exchange: string, instrumentType: string, legId: string, searchQuery = '') => {
    setLoadingInstruments(prev => ({ ...prev, [legId]: true }));
    
    try {
      const queryParams = new URLSearchParams({
        exchange,
        instrumentType,
        page: '1',
        pageSize: '50',
      });
      
      if (searchQuery) {
        queryParams.append('query', searchQuery);
      }

      const response = await fetch(`/api/instrument-master?${queryParams.toString()}`);
      const responseData = await response.json();
      
      if (responseData.success && responseData.data && Array.isArray(responseData.data.data)) {
        const mappedInstruments = responseData.data.data.map((item: any) => ({
          exchange_security_id: item.exchange_security_id,
          exchange: item.exchange,
          segment: item.segment,
          symbol: item.tradingSymbol || item.symbol,
          instrument: item.name || item.tradingSymbol || item.symbol,
          instrument_id: item.instrumentToken || item.exchange_security_id,
          label: `${item.tradingSymbol || item.symbol} - ${item.exchange}`,
          value: item.exchange_security_id
        }));
        
        setInstrumentOptions(prev => ({ ...prev, [legId]: mappedInstruments }));
      } else {
        setInstrumentOptions(prev => ({ ...prev, [legId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching instruments:', error);
      setInstrumentOptions(prev => ({ ...prev, [legId]: [] }));
    } finally {
      setLoadingInstruments(prev => ({ ...prev, [legId]: false }));
    }
  }, []);

  const addLeg = () => {
    const newLeg: OptionLeg = {
      id: createUniqueId(),
      exchange: 'NSE',
      instrumentType: 'Index',
      segment: 'Futures',
      buySell: 'Buy',
      expiry: 'Current',
      lots: '1'
    };
    onChange([...value, newLeg]);
  };

  const removeLeg = (legId: string) => {
    onChange(value.filter(leg => leg.id !== legId));
  };

  const updateLeg = (legId: string, field: keyof OptionLeg, newValue: any) => {
    onChange(
      value.map(leg => {
        if (leg.id === legId) {
          const updatedLeg = { ...leg, [field]: newValue };
          
          // Reset options-specific fields when switching from Options to Futures
          if (field === 'segment' && newValue === 'Futures') {
            updatedLeg.optionType = undefined;
            updatedLeg.expiryType = undefined;
            updatedLeg.strikeType = undefined;
          }
          
          // Set default values for options-specific fields when switching to Options
          if (field === 'segment' && newValue === 'Options') {
            updatedLeg.optionType = 'CE';
            updatedLeg.expiryType = 'Weekly';
            updatedLeg.strikeType = 'ATM';
          }
          
          return updatedLeg;
        }
        return leg;
      })
    );
  };

  // Validate that all legs have required fields filled in
  const hasInvalidLegs = value.some(leg => 
    !leg.exchange || !leg.instrumentType || !leg.selectedInstrument || !leg.segment || !leg.buySell || !leg.expiry || !leg.lots ||
    (leg.segment === 'Options' && (!leg.optionType || !leg.expiryType || !leg.strikeType))
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" component="h3">
          {label}
          {required && !isOptional && <Typography component="span" color="error">*</Typography>}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={addLeg}
        >
          Add Legs
        </Button>
      </Box>

      {error && helperText && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
          {helperText}
        </Typography>
      )}

      {hasInvalidLegs && value.length > 0 && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
          All legs must have required fields filled in
        </Typography>
      )}

      {value.length === 0 ? (
        <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
          <Typography color="textSecondary" gutterBottom>
            No legs added. Click "Add Legs" to create a multi-leg strategy.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Build complex strategies with Futures and Options by adding multiple legs with different parameters.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {value.map((leg, index) => (
            <Grid item xs={12} key={leg.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Leg #{index + 1}
                    </Typography>
                    <IconButton onClick={() => removeLeg(leg.id)} aria-label="delete leg" size="small">
                      <Delete />
                    </IconButton>
                  </Box>
                  <Grid container spacing={2}>
                    {/* Row 1: Exchange, Instrument Type, and Add Instrument */}
                    <Grid item xs={12}>
                      <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '64px' }}>
                        {/* Exchange Dropdown */}
                        <Grid item xs={12} sm={4} md={2}>
                          <Select
                            fullWidth
                            label="Exchange"
                            options={exchangeOptions}
                            value={leg.exchange}
                            onChange={(value) => {
                              updateLeg(leg.id, 'exchange', value);
                              updateLeg(leg.id, 'selectedInstrument', null); // Reset instrument when exchange changes
                            }}
                            required
                            size="small"
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                height: '40px',
                                fontSize: '0.875rem'
                              }
                            }}
                          />
                        </Grid>

                        {/* Instrument Type Button Group */}
                        <Grid item xs={12} sm={4} md={2}>
                          <Box>
                            <ButtonGroup variant="outlined" size="small" fullWidth sx={{ height: '40px' }}>
                              <Button
                                variant={leg.instrumentType === 'Index' ? 'contained' : 'outlined'}
                                onClick={() => {
                                  updateLeg(leg.id, 'instrumentType', 'Index');
                                  updateLeg(leg.id, 'selectedInstrument', null); // Reset instrument when type changes
                                }}
                                sx={{ 
                                  height: '40px',
                                  fontSize: '0.75rem',
                                  minWidth: '50px',
                                  flex: 1
                                }}
                              >
                                Index
                              </Button>
                              <Button
                                variant={leg.instrumentType === 'Stock' ? 'contained' : 'outlined'}
                                onClick={() => {
                                  updateLeg(leg.id, 'instrumentType', 'Stock');
                                  updateLeg(leg.id, 'selectedInstrument', null); // Reset instrument when type changes
                                }}
                                sx={{ 
                                  height: '40px',
                                  fontSize: '0.75rem',
                                  minWidth: '50px',
                                  flex: 1
                                }}
                              >
                                Stock
                              </Button>
                            </ButtonGroup>
                          </Box>
                        </Grid>

                        {/* Add Instrument Dropdown */}
                        <Grid item xs={12} sm={4} md={2}>
                          <Autocomplete
                            fullWidth
                            size="small"
                            options={instrumentOptions[leg.id] || []}
                            value={leg.selectedInstrument || null}
                            onChange={(_, newValue) => updateLeg(leg.id, 'selectedInstrument', newValue)}
                            onOpen={() => {
                              if (leg.exchange && leg.instrumentType) {
                                fetchInstruments(leg.exchange, leg.instrumentType, leg.id);
                              }
                            }}
                            onInputChange={(_, newInputValue) => {
                              if (leg.exchange && leg.instrumentType && newInputValue.length > 2) {
                                fetchInstruments(leg.exchange, leg.instrumentType, leg.id, newInputValue);
                              }
                            }}
                            getOptionLabel={(option) => option?.label || ''}
                            isOptionEqualToValue={(option, value) => option?.value === value?.value}
                            loading={loadingInstruments[leg.id] || false}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Add Instrument"
                                variant="outlined"
                                size="small"
                                InputProps={{
                                  ...params.InputProps,
                                  sx: { 
                                    height: '40px',
                                    fontSize: '0.875rem'
                                  },
                                  endAdornment: (
                                    <>
                                      {loadingInstruments[leg.id] ? <CircularProgress color="inherit" size={16} /> : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                            disabled={!leg.exchange || !leg.instrumentType}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Row 2: Segment, Buy/Sell, and other configuration fields */}
                    <Grid item xs={12}>
                      <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '64px' }}>
                        {/* Segment Button Group */}
                        <Grid item xs={12} sm={6} md={1.5}>
                          <Box>
                            <ButtonGroup variant="outlined" size="small" fullWidth sx={{ height: '40px' }}>
                              <Button
                                variant={leg.segment === 'Futures' ? 'contained' : 'outlined'}
                                onClick={() => updateLeg(leg.id, 'segment', 'Futures')}
                                sx={{ 
                                  height: '40px',
                                  fontSize: '0.75rem',
                                  minWidth: '50px',
                                  flex: 1
                                }}
                              >
                                FUT
                              </Button>
                              <Button
                                variant={leg.segment === 'Options' ? 'contained' : 'outlined'}
                                onClick={() => updateLeg(leg.id, 'segment', 'Options')}
                                sx={{ 
                                  height: '40px',
                                  fontSize: '0.75rem',
                                  minWidth: '50px',
                                  flex: 1
                                }}
                              >
                                OPT
                              </Button>
                            </ButtonGroup>
                          </Box>
                        </Grid>

                        {/* CE/PE Button Group - Only show for Options */}
                        <Grid item xs={12} sm={6} md={1}>
                          {leg.segment === 'Options' ? (
                            <Box>
                              <ButtonGroup variant="outlined" size="small" fullWidth sx={{ height: '40px' }}>
                                <Button
                                  variant={leg.optionType === 'CE' ? 'contained' : 'outlined'}
                                  onClick={() => updateLeg(leg.id, 'optionType', 'CE')}
                                  sx={{ 
                                    height: '40px',
                                    fontSize: '0.75rem',
                                    minWidth: '35px',
                                    flex: 1
                                  }}
                                >
                                  CE
                                </Button>
                                <Button
                                  variant={leg.optionType === 'PE' ? 'contained' : 'outlined'}
                                  onClick={() => updateLeg(leg.id, 'optionType', 'PE')}
                                  sx={{ 
                                    height: '40px',
                                    fontSize: '0.75rem',
                                    minWidth: '35px',
                                    flex: 1
                                  }}
                                >
                                  PE
                                </Button>
                              </ButtonGroup>
                            </Box>
                          ) : (
                            <Box sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ height: '40px', width: '100%' }} />
                            </Box>
                          )}
                        </Grid>

                        {/* Buy/Sell Button Group */}
                        <Grid item xs={12} sm={6} md={1.5}>
                          <Box>
                            <ButtonGroup variant="outlined" size="small" fullWidth sx={{ height: '40px' }}>
                              <Button
                                variant={leg.buySell === 'Buy' ? 'contained' : 'outlined'}
                                onClick={() => updateLeg(leg.id, 'buySell', 'Buy')}
                                sx={{ 
                                  height: '40px',
                                  fontSize: '0.75rem',
                                  minWidth: '50px',
                                  flex: 1
                                }}
                              >
                                Buy
                              </Button>
                              <Button
                                variant={leg.buySell === 'Sell' ? 'contained' : 'outlined'}
                                onClick={() => updateLeg(leg.id, 'buySell', 'Sell')}
                                sx={{ 
                                  height: '40px',
                                  fontSize: '0.75rem',
                                  minWidth: '50px',
                                  flex: 1
                                }}
                              >
                                Sell
                              </Button>
                            </ButtonGroup>
                          </Box>
                        </Grid>

                        {/* Expiry Type Button Group - Only show for Options */}
                        <Grid item xs={12} sm={6} md={1.5}>
                          {leg.segment === 'Options' ? (
                            <Box>
                              <ButtonGroup variant="outlined" size="small" fullWidth sx={{ height: '40px' }}>
                                <Button
                                  variant={leg.expiryType === 'Weekly' ? 'contained' : 'outlined'}
                                  onClick={() => updateLeg(leg.id, 'expiryType', 'Weekly')}
                                  sx={{ 
                                    height: '40px',
                                    fontSize: '0.75rem',
                                    minWidth: '50px',
                                    flex: 1
                                  }}
                                >
                                  Weekly
                                </Button>
                                <Button
                                  variant={leg.expiryType === 'Monthly' ? 'contained' : 'outlined'}
                                  onClick={() => updateLeg(leg.id, 'expiryType', 'Monthly')}
                                  sx={{ 
                                    height: '40px',
                                    fontSize: '0.75rem',
                                    minWidth: '50px',
                                    flex: 1
                                  }}
                                >
                                  Monthly
                                </Button>
                              </ButtonGroup>
                            </Box>
                          ) : (
                            <Box sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ height: '40px', width: '100%' }} />
                            </Box>
                          )}
                        </Grid>

                        {/* Expiry Dropdown */}
                        <Grid item xs={12} sm={6} md={1.5}>
                          <Select
                            fullWidth
                            label="Expiry"
                            options={[
                              { value: 'Current', label: 'Current' },
                              { value: 'Next', label: 'Next' }
                            ]}
                            value={leg.expiry}
                            onChange={(value) => updateLeg(leg.id, 'expiry', value)}
                            size="small"
                            required
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                height: '40px',
                                fontSize: '0.875rem',
                                minHeight: '40px'
                              }
                            }}
                          />
                        </Grid>

                        {/* Strike Type Dropdown - Only show for Options */}
                        <Grid item xs={12} sm={6} md={2.5}>
                          {leg.segment === 'Options' ? (
                            <Select
                              fullWidth
                              label="Strike Type"
                              options={strikeTypeOptions}
                              value={leg.strikeType || 'ATM'}
                              onChange={(value) => updateLeg(leg.id, 'strikeType', value)}
                              size="small"
                              required
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                  },
                                },
                                variant: 'selectedMenu',
                                anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'left',
                                },
                                transformOrigin: {
                                  vertical: 'top',
                                  horizontal: 'left',
                                },
                              }}
                              sx={{ 
                                '& .MuiInputBase-root': { 
                                  height: '40px',
                                  fontSize: '0.875rem',
                                  minHeight: '40px'
                                }
                              }}
                            />
                          ) : (
                            <Box sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ height: '40px', width: '100%' }} />
                            </Box>
                          )}
                        </Grid>

                        {/* No. of Lots */}
                        <Grid item xs={12} sm={6} md={1.5}>
                          <TextField
                            fullWidth
                            label="No. of Lots"
                            type="number"
                            size="small"
                            value={leg.lots}
                            onChange={(e) => updateLeg(leg.id, 'lots', e.target.value)}
                            required
                            inputProps={{ min: 1 }}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                height: '40px',
                                fontSize: '0.875rem',
                                minHeight: '40px'
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '0.875rem'
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OptionsLegBuilder;
