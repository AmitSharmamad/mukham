import React from 'react';
import { Box, Grid, Typography, Chip, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { Button } from '../../Button';
import { TextField } from '../../TextField';
import { Select } from '../../Select';
import { TIMEFRAME_OPTIONS } from '../../../constants';
import { FormData, Instrument } from '../../../types/strategyForm';

interface NameProps {
  formData: FormData;
  selectedInstruments: Instrument[];
  errors: any;
  attemptedSubmit: boolean;
  onFieldChange: (field: keyof FormData) => (value: any) => void;
  onInstrumentSelectorOpen: () => void;
  onInstrumentDelete: (instrumentId: number) => void;
}

export const Name: React.FC<NameProps> = ({
  formData,
  selectedInstruments,
  errors,
  attemptedSubmit,
  onFieldChange,
  onInstrumentSelectorOpen,
  onInstrumentDelete,
}) => {
  const renderNameAndDescription = () => (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="name"
            label="Strategy Name"
            value={formData.name}
            onChange={(e) => onFieldChange('name')(e.target.value)}
            required
            error={!!(attemptedSubmit && errors.name)}
            helperText={attemptedSubmit && errors.name ? errors.name : undefined}
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
            onChange={(e) => onFieldChange('description')(e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderPositionsSection = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        justifyContent: 'center',
        minHeight: '56px'
      }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={onInstrumentSelectorOpen}
        >
          Add Instrument
        </Button>
        
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          {selectedInstruments.map((instrument) => (
            <Chip
              key={instrument.exchange_security_id}
              label={instrument.symbol}
              onDelete={() => onInstrumentDelete(instrument.exchange_security_id)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderPositionType = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: '56px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Position Type</FormLabel>
          <RadioGroup
            row
            name="position_type"
            id="position_type"
            value={formData.buyOrSell}
            onChange={(e) => onFieldChange('buyOrSell')(e.target.value)}
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
            onClick={onInstrumentSelectorOpen}
          >
            Add Instrument
          </Button>
          
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            {selectedInstruments.map((instrument) => (
              <Chip
                key={instrument.exchange_security_id}
                label={instrument.symbol}
                onDelete={() => onInstrumentDelete(instrument.exchange_security_id)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderChartSettings = () => (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
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
            onChange={onFieldChange('candlestickType')}
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
              onChange={(e) => onFieldChange('brickSize')(e.target.value)}
              required
              error={!!(attemptedSubmit && errors.brickSize)}
              helperText={attemptedSubmit && errors.brickSize ? errors.brickSize : undefined}
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
            onChange={onFieldChange('timeframe')}
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
            onChange={onFieldChange('tradeType')}
            required
          />
          {attemptedSubmit && errors.tradeType && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
              {errors.tradeType}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  const renderMaxAllocationAndQuantity = () => (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="max_allocation"
            label="Max Allocation (%)"
            type="number"
            value={formData.maxAllocation}
            onChange={(e) => onFieldChange('maxAllocation')(e.target.value)}
            required
            error={!!(attemptedSubmit && errors.maxAllocation)}
            helperText={attemptedSubmit && errors.maxAllocation ? errors.maxAllocation : undefined}
            inputProps={{ min: 0, max: 100 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="max_quantity"
            label="Max Quantity"
            type="number"
            value={formData.maxQuantity}
            onChange={(e) => onFieldChange('maxQuantity')(e.target.value)}
            required
            error={!!(attemptedSubmit && errors.maxQuantity)}
            helperText={attemptedSubmit && errors.maxQuantity ? errors.maxQuantity : undefined}
            inputProps={{ min: 1, step: 1 }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderContent = () => {
    // For F&O Expression: Remove Position Type, Max Allocation, and Max Quantity
    if (formData.instrumentType === 'options' && formData.strategyType === 'expression') {
      return (
        <Box>
          {renderNameAndDescription()}
          {renderPositionsSection()}
          {renderChartSettings()}
        </Box>
      );
    }

    // For F&O Time-based: Keep only Add Instrument, remove the rest
    if (formData.instrumentType === 'options' && formData.strategyType === 'time-based') {
      return (
        <Box>
          {renderNameAndDescription()}
          {renderPositionsSection()}
        </Box>
      );
    }

    // For Equity: Keep existing structure with Position Type
    return (
      <Box>
        {renderNameAndDescription()}
        {renderPositionType()}
        {renderChartSettings()}
        {renderMaxAllocationAndQuantity()}
      </Box>
    );
  };

  return renderContent();
};
