import React from 'react';
import { Box, Grid } from '@mui/material';
import { Expression } from './Expression';
import { TradeDayAndTime } from './TradeDayAndTime';
import { EntryStartTime } from './EntryStartTime';
import { EntryEndTime } from './EntryEndTime';
import { LegsBuilder } from '../LegsBuilder';
import { OptionsLegBuilder } from '../OptionsLegBuilder';
import { FormData } from '../../../types/strategyForm';
import { Dayjs } from 'dayjs';

interface EntryProps {
  formData: FormData;
  errors: any;
  attemptedSubmit: boolean;
  onFieldChange: (field: keyof FormData) => (value: any) => void;
  onTimeChange: (field: 'entryStartTime' | 'entryEndTime') => (value: Dayjs | null) => void;
  onClearTime: (field: 'entryStartTime' | 'entryEndTime') => () => null;
}

export const Entry: React.FC<EntryProps> = ({
  formData,
  errors,
  attemptedSubmit,
  onFieldChange,
  onTimeChange,
  onClearTime,
}) => {
  // For F&O Expression: Add Entry Expression Builder and Legs Builder
  if (formData.instrumentType === 'options' && formData.strategyType === 'expression') {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Expression
            formData={formData}
            onFieldChange={onFieldChange}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <LegsBuilder
            value={formData.entryOptionLegs}
            onChange={onFieldChange('entryOptionLegs')}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TradeDayAndTime
            formData={formData}
            errors={errors}
            onFieldChange={onFieldChange}
            onTimeChange={onTimeChange}
            onClearTime={onClearTime}
          />
        </Box>
      </Box>
    );
  }

  // For F&O Time-based: Add Entry Time, Exit Time and Legs Builder
  if (formData.instrumentType === 'options' && formData.strategyType === 'time-based') {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={3}>
            <EntryStartTime
              formData={formData}
              errors={errors}
              onTimeChange={onTimeChange}
              onClearTime={onClearTime}
              label="Entry Time"
              required={true}
            />
            
            <EntryEndTime
              formData={formData}
              errors={errors}
              onTimeChange={onTimeChange}
              onClearTime={onClearTime}
              label="Exit Time"
              required={true}
            />
          </Grid>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <OptionsLegBuilder
            value={formData.entryOptionLegs}
            onChange={onFieldChange('entryOptionLegs')}
            label="Legs"
          />
        </Box>
      </Box>
    );
  }

  // For Equity: Keep original structure without Trade Day and Time subsection
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Expression
          formData={formData}
          onFieldChange={onFieldChange}
          label="Entry Conditions"
          isOptional={false}
        />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <EntryStartTime
            formData={formData}
            errors={errors}
            onTimeChange={onTimeChange}
            onClearTime={onClearTime}
          />
          
          <EntryEndTime
            formData={formData}
            errors={errors}
            onTimeChange={onTimeChange}
            onClearTime={onClearTime}
          />
        </Grid>
      </Box>
    </Box>
  );
};
