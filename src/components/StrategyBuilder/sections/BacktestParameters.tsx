import React from 'react';
import { Grid, Box, Typography, ButtonGroup, Button as MuiButton } from '@mui/material';
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
  readOnly?: boolean;
}

export const BacktestParameters: React.FC<BacktestParametersProps> = ({
  formData,
  errors,
  attemptedSubmit,
  onFieldChange,
  onDateChange,
  readOnly = false,
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
                onChange={readOnly ? () => {} : onDateChange('startDate')}
                disabled={readOnly}
                sx={{ width: '100%' }}
                maxDate={formData.endDate || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!(errors.startDate),
                    helperText: errors.startDate || undefined,
                    disabled: readOnly,
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
                onChange={readOnly ? () => {} : onDateChange('endDate')}
                disabled={readOnly}
                sx={{ width: '100%' }}
                minDate={formData.startDate || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!(errors.endDate),
                    helperText: errors.endDate || undefined,
                    disabled: readOnly,
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
                helperText={attemptedSubmit && errors.brokerage ? errors.brokerage : undefined}
                inputProps={{ min: 0, step: 0.01 }}
                disabled={readOnly}
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
                disabled={readOnly}
              />
            </Box>
          </Grid>
          {/* Trading Days Section - Only show for Equity strategies (hide for all F&O strategies) */}
          {formData.instrumentType !== 'options' && (
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Trading Days
                </Typography>
                <Box sx={{ minHeight: '56px', display: 'flex', alignItems: 'center' }}>
                  <ButtonGroup 
                    variant="outlined" 
                    size="medium" 
                    sx={{ 
                      flexWrap: 'wrap',
                      '& .MuiButton-root': {
                        minWidth: '48px',
                        height: '48px',
                        fontSize: '0.875rem',
                      }
                    }}
                  >
                    {[
                      { label: 'M', value: 'MON' },
                      { label: 'T', value: 'TUE' },
                      { label: 'W', value: 'WED' },
                      { label: 'T', value: 'THU' },
                      { label: 'F', value: 'FRI' }
                    ].map((day) => (
                      <MuiButton
                        key={day.value}
                        variant={formData.tradingDays.includes(day.value) ? 'contained' : 'outlined'}
                        onClick={() => {
                          if (!readOnly) {
                            const currentDays = formData.tradingDays;
                            const updatedDays = currentDays.includes(day.value)
                              ? currentDays.filter(d => d !== day.value)
                              : [...currentDays, day.value];
                            onFieldChange('tradingDays')(updatedDays);
                          }
                        }}
                        disabled={readOnly}
                      >
                        {day.label}
                      </MuiButton>
                    ))}
                  </ButtonGroup>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};
