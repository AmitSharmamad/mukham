import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper
} from '@mui/material';

interface PositionsProps {
  value: any;
  onChange: (value: any) => void;
}

const Positions: React.FC<PositionsProps> = ({ value, onChange }) => {
  const handleChange = (field: string, newValue: any) => {
    onChange({
      ...value,
      [field]: newValue
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Positions
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="position-type-label">Position Type</InputLabel>
            <Select
              labelId="position-type-label"
              id="position-type"
              value={value?.positionType || ""}
              label="Position Type"
              onChange={(e) => handleChange('positionType', e.target.value)}
            >
              <MenuItem value="Long">Long</MenuItem>
              <MenuItem value="Short">Short</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Max Allocation (in rupees)"
            type="number"
            value={value?.maxAllocation || ""}
            onChange={(e) => handleChange('maxAllocation', e.target.value)}
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            value={value?.entryPrice || ""}
            onChange={(e) => handleChange('entryPrice', e.target.value)}
            label="Entry Price"
            InputProps={{
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            value={value?.stopLoss || ""}
            onChange={(e) => handleChange('stopLoss', e.target.value)}
            label="Stop Loss"
            InputProps={{
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            value={value?.targetPrice || ""}
            onChange={(e) => handleChange('targetPrice', e.target.value)}
            label="Target Price"
            InputProps={{
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="order-type-label">Order Type</InputLabel>
            <Select
              labelId="order-type-label"
              id="order-type"
              value={value?.orderType || ""}
              label="Order Type"
              onChange={(e) => handleChange('orderType', e.target.value)}
            >
              <MenuItem value="Market">Market</MenuItem>
              <MenuItem value="Limit">Limit</MenuItem>
              <MenuItem value="Stop">Stop</MenuItem>
              <MenuItem value="StopLimit">Stop Limit</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Positions;