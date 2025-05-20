import React, { useState } from 'react';
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
  Tooltip
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { Select } from '../Select';
import { PROFIT_LOSS_TYPES } from '../../constants';

export interface OptionLeg {
  id: string;
  legType: 'buy' | 'sell';
  optionType: 'call' | 'put';
  strike: string;
  expiry: string;
  quantity: string;
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

export const OptionsLegBuilder: React.FC<OptionsLegBuilderProps> = ({
  value = [],
  onChange,
  label,
  error = false,
  helperText,
  required = false,
  isOptional = false
}) => {
  const addLeg = () => {
    const newLeg: OptionLeg = {
      id: createUniqueId(),
      legType: 'buy',
      optionType: 'call',
      strike: '',
      expiry: '',
      quantity: '1'
    };
    onChange([...value, newLeg]);
  };

  const removeLeg = (legId: string) => {
    onChange(value.filter(leg => leg.id !== legId));
  };

  const updateLeg = (legId: string, field: keyof OptionLeg, newValue: any) => {
    onChange(
      value.map(leg => 
        leg.id === legId 
          ? { ...leg, [field]: newValue } 
          : leg
      )
    );
  };

  // Validate that all legs have required fields filled in
  const hasInvalidLegs = value.some(leg => 
    !leg.strike || !leg.expiry || !leg.quantity
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
          Add Leg
        </Button>
      </Box>

      {error && helperText && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
          {helperText}
        </Typography>
      )}

      {hasInvalidLegs && value.length > 0 && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
          All option legs must have Strike Price, Expiry Date, and Quantity filled in
        </Typography>
      )}

      {value.length === 0 ? (
        <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
          <Typography color="textSecondary" gutterBottom>
            No option legs added. Click "Add Leg" to create a multi-leg options strategy.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Build complex options strategies like Covered Calls, Bull Spreads, Bear Spreads, 
            Butterflies, Iron Condors, and more by adding multiple legs with different option types and directions.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {value.map(leg => (
            <Grid item xs={12} key={leg.id}>
              <Card variant="outlined">
                <CardHeader
                  title={`${leg.legType.toUpperCase()} ${leg.optionType.toUpperCase()} Option`}
                  action={
                    <IconButton onClick={() => removeLeg(leg.id)} aria-label="delete leg">
                      <Delete />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Leg Type</FormLabel>
                        <RadioGroup
                          row
                          value={leg.legType}
                          onChange={(e) => updateLeg(leg.id, 'legType', e.target.value)}
                        >
                          <FormControlLabel value="buy" control={<Radio />} label="Buy" />
                          <FormControlLabel value="sell" control={<Radio />} label="Sell" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Option Type</FormLabel>
                        <RadioGroup
                          row
                          value={leg.optionType}
                          onChange={(e) => updateLeg(leg.id, 'optionType', e.target.value)}
                        >
                          <FormControlLabel value="call" control={<Radio />} label="Call" />
                          <FormControlLabel value="put" control={<Radio />} label="Put" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Strike Price"
                        type="number"
                        value={leg.strike}
                        onChange={(e) => updateLeg(leg.id, 'strike', e.target.value)}
                        required
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={leg.expiry}
                        onChange={(e) => updateLeg(leg.id, 'expiry', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={leg.quantity}
                        onChange={(e) => updateLeg(leg.id, 'quantity', e.target.value)}
                        required
                        inputProps={{ min: 1 }}
                      />
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
