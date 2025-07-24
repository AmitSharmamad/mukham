import React from 'react';
import { Box, Grid, Typography, ButtonGroup, Button as MuiButton } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { FormData } from '../../../types/strategyForm';

interface TradeDayAndTimeProps {
  formData: FormData;
  errors: any;
  onFieldChange: (field: keyof FormData) => (value: any) => void;
  onTimeChange: (field: 'entryStartTime' | 'entryEndTime') => (value: Dayjs | null) => void;
  onClearTime: (field: 'entryStartTime' | 'entryEndTime') => () => null;
}

export const TradeDayAndTime: React.FC<TradeDayAndTimeProps> = ({
  formData,
  errors,
  onFieldChange,
  onTimeChange,
  onClearTime,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Trade Day and Time
      </Typography>
      
      <Grid container spacing={3}>
        {/* Day of Week */}
        <Grid item xs={12} md={4}>
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
                    const currentDays = formData.tradingDays;
                    const updatedDays = currentDays.includes(day.value)
                      ? currentDays.filter(d => d !== day.value)
                      : [...currentDays, day.value];
                    onFieldChange('tradingDays')(updatedDays);
                  }}
                >
                  {day.label}
                </MuiButton>
              ))}
            </ButtonGroup>
          </Box>
        </Grid>

        {/* Entry Start Time */}
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Entry Start Time"
              value={formData.entryStartTime}
              onChange={onTimeChange('entryStartTime')}
              sx={{ width: '100%' }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.entryStartTime,
                  helperText: errors.entryStartTime,
                },
                field: {
                  clearable: true,
                  onClear: onClearTime('entryStartTime'),
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Entry End Time */}
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Entry End Time"
              value={formData.entryEndTime}
              onChange={onTimeChange('entryEndTime')}
              sx={{ width: '100%' }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.entryEndTime,
                  helperText: errors.entryEndTime,
                },
                field: {
                  clearable: true,
                  onClear: onClearTime('entryEndTime'),
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Box>
  );
};
