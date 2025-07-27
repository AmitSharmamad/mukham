import React from 'react';
import { Box, Grid, Typography, ButtonGroup, Button as MuiButton } from '@mui/material';
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
  readOnly?: boolean;
}

export const Entry: React.FC<EntryProps> = ({
  formData,
  errors,
  attemptedSubmit,
  onFieldChange,
  onTimeChange,
  onClearTime,
  readOnly = false,
}) => {
  // For F&O Expression: Add Entry Expression Builder and Legs Builder
  if (formData.instrumentType === 'options' && formData.strategyType === 'expression') {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Expression
            formData={formData}
            onFieldChange={onFieldChange}
            label=""
            readOnly={readOnly}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <LegsBuilder
            value={formData.entryOptionLegs}
            onChange={readOnly ? () => {} : onFieldChange('entryOptionLegs')}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TradeDayAndTime
            formData={formData}
            errors={errors}
            onFieldChange={onFieldChange}
            onTimeChange={onTimeChange}
            onClearTime={onClearTime}
            readOnly={readOnly}
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
              readOnly={readOnly}
            />
            
            <EntryEndTime
              formData={formData}
              errors={errors}
              onTimeChange={onTimeChange}
              onClearTime={onClearTime}
              label="Exit Time"
              required={true}
              readOnly={readOnly}
            />
          </Grid>
        </Box>

        {/* Trading Days Section for Time-based Strategies */}
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
        
        <Box sx={{ mb: 3 }}>
          <OptionsLegBuilder
            value={formData.entryOptionLegs}
            onChange={readOnly ? () => {} : onFieldChange('entryOptionLegs')}
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
          label=""
          isOptional={false}
          readOnly={readOnly}
        />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <EntryStartTime
            formData={formData}
            errors={errors}
            onTimeChange={onTimeChange}
            onClearTime={onClearTime}
            readOnly={readOnly}
          />
          
          <EntryEndTime
            formData={formData}
            errors={errors}
            onTimeChange={onTimeChange}
            onClearTime={onClearTime}
            readOnly={readOnly}
          />
        </Grid>
      </Box>
    </Box>
  );
};
