import React from 'react';
import { Box, Typography } from '@mui/material';
import { IndicatorExpressionBuilder } from './IndicatorExpressionBuilder';
import { IndicatorExpression } from './utils/indicatorExpressionUtils';

interface EntryExpressionBuilderProps {
  value: IndicatorExpression[];
  onChange: (value: IndicatorExpression[]) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  readOnly?: boolean;
}

export const EntryExpressionBuilder: React.FC<EntryExpressionBuilderProps> = ({
  value,
  onChange,
  error,
  helperText,
  required = false,
  readOnly = false,
}) => {
  return (
    <Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Define entry conditions using technical indicators. Build complex conditions using logical operators to create sophisticated entry signals.
      </Typography>
      <IndicatorExpressionBuilder
        value={value}
        onChange={onChange}
        label="Expression"
        error={error}
        helperText={helperText}
        required={required}
        isOptional={false}
        readOnly={readOnly}
      />
    </Box>
  );
};

export default EntryExpressionBuilder;
