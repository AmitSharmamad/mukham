import React from 'react';
import { Grid, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '../../TextField';
import { FormData } from '../../../types/strategyForm';
import { Dayjs } from 'dayjs';

interface BacktestParametersProps {
  formData: FormData;
  errors: any;
  attemptedSubmit: boolean;
  onFieldChange: (field: keyof FormData) => (value: any) => void;
  onDateChange: (field: 'startDate' | 'endDate') => (value: Dayjs | null) => void;
}

export const BacktestParameters: React.FC<BacktestParametersProps> = ({
  formData,
  errors,
  attemptedSubmit,
  onFieldChange,
  onDateChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={onDateChange('startDate')}
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
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={onDateChange('endDate')}
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
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Brokerage (Rs.)"
                type="number"
                value={formData.brokerage}
                onChange={(e) => onFieldChange('brokerage')(e.target.value)}
                required
                error={!!(attemptedSubmit && errors.brokerage)}
                helperText={errors.brokerage || 'Brokerage cost per trade in rupees'}
                inputProps={{ min: 0, step: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Slippage"
                type="number"
                value={formData.slippage}
                onChange={(e) => onFieldChange('slippage')(e.target.value)}
                required
                error={!!(attemptedSubmit && errors.slippage)}
                helperText={errors.slippage || 'Slippage as decimal (e.g., 0.1 for 0.1%)'}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Box>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};
