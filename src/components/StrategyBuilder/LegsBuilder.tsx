import React from 'react';
import { Box, Typography } from '@mui/material';
import { OptionsLegBuilder, OptionLeg } from './OptionsLegBuilder';

interface LegsBuilderProps {
  value: OptionLeg[];
  onChange: (value: OptionLeg[]) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export const LegsBuilder: React.FC<LegsBuilderProps> = ({
  value,
  onChange,
  error,
  helperText,
  required = false,
}) => {
  return (
    <Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Design your options strategy by adding one or more option legs. For complex strategies like spreads or 
        condors, add multiple legs with different strike prices and option types.
      </Typography>
      <OptionsLegBuilder
        value={value}
        onChange={onChange}
        label="Legs"
        error={error}
        helperText={helperText}
        required={required}
      />
    </Box>
  );
};

export default LegsBuilder;
