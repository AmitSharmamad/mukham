import React from 'react';
import { Grid, Box } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { FormData } from '../../../types/strategyForm';

interface EntryEndTimeProps {
  formData: FormData;
  errors: any;
  onTimeChange: (field: 'entryStartTime' | 'entryEndTime') => (value: Dayjs | null) => void;
  onClearTime: (field: 'entryStartTime' | 'entryEndTime') => () => null;
  label?: string;
  required?: boolean;
}

export const EntryEndTime: React.FC<EntryEndTimeProps> = ({
  formData,
  errors,
  onTimeChange,
  onClearTime,
  label = "Entry End Time", 
  required = false,
}) => {
  return (
    <Grid item xs={12} md={6}>
      <Box sx={{ mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label={label}
            value={formData.entryEndTime}
            onChange={onTimeChange('entryEndTime')}
            sx={{ width: '100%' }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.entryEndTime,
                helperText: errors.entryEndTime,
                required,
              },
              field: {
                clearable: true,
                onClear: onClearTime('entryEndTime'),
              }
            }}
          />
        </LocalizationProvider>
      </Box>
    </Grid>
  );
};
