import React from 'react';
import { Box } from '@mui/material';
import { IndicatorExpressionBuilder } from '../IndicatorExpressionBuilder';
import { EntryExpressionBuilder } from '../EntryExpressionBuilder';
import { IndicatorExpression } from '../utils/indicatorExpressionUtils';
import { FormData } from '../../../types/strategyForm';

interface ExpressionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData) => (value: any) => void;
  label?: string;
  isOptional?: boolean;
  readOnly?: boolean;
}

export const Expression: React.FC<ExpressionProps> = ({
  formData,
  onFieldChange,
  label = "Entry Conditions",
  isOptional = false,
  readOnly = false,
}) => {
  // For F&O Expression strategies, use EntryExpressionBuilder
  if (formData.instrumentType === 'options' && formData.strategyType === 'expression') {
    return (
      <Box sx={{ mb: 3 }}>
        <EntryExpressionBuilder
          value={formData.entryConditions}
          onChange={readOnly ? () => {} : onFieldChange('entryConditions')}
          readOnly={readOnly}
        />
      </Box>
    );
  }

  // For Equity strategies, use IndicatorExpressionBuilder
  return (
    <Box sx={{ mb: 3 }}>
      <IndicatorExpressionBuilder
        value={formData.entryConditions}
        onChange={readOnly ? () => {} : onFieldChange('entryConditions')}
        label={label}
        isOptional={isOptional}
        readOnly={readOnly}
      />
    </Box>
  );
};
