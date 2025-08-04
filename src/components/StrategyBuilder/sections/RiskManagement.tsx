import React from 'react';
import { Box, Grid } from '@mui/material';
import { IndicatorExpressionBuilder } from '../IndicatorExpressionBuilder';
import { TextField } from '../../TextField';
import { Select } from '../../Select';
import { PROFIT_LOSS_TYPES } from '../../../constants';
import { FormData } from '../../../types/strategyForm';

interface RiskManagementProps {
  formData: FormData;
  errors: any;
  attemptedSubmit: boolean;
  onFieldChange: (field: keyof FormData) => (value: any) => void;
  readOnly?: boolean;
}

export const RiskManagement: React.FC<RiskManagementProps> = ({
  formData,
  errors,
  attemptedSubmit,
  onFieldChange,
  readOnly = false,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Exit Expression Builder - Only for Equity */}
      {formData.instrumentType === 'equity' && (
        <Box sx={{ mb: 3 }}>
          <IndicatorExpressionBuilder
            value={formData.exitConditions}
            onChange={readOnly ? () => {} : onFieldChange('exitConditions')}
            label=""
            isOptional={true}
            readOnly={readOnly}
          />
        </Box>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="stop_loss"
              label="Stop Loss"
              type="number"
              value={formData.stopLoss}
              onChange={(e) => onFieldChange('stopLoss')(e.target.value)}
              required
              error={!!(attemptedSubmit && errors.stopLoss)}
              helperText={attemptedSubmit && errors.stopLoss ? errors.stopLoss : undefined}
              inputProps={{ min: 0 }}
              disabled={readOnly}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 3 }}>
            <Select
              fullWidth 
              id="stop_loss_type"
              label="Stop Loss Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.stopLossType}
              onChange={onFieldChange('stopLossType')}
              disabled={readOnly}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="target_profit"
              label="Target Profit"
              type="number"
              value={formData.targetProfit}
              onChange={(e) => onFieldChange('targetProfit')(e.target.value)}
              required
              error={!!(attemptedSubmit && errors.targetProfit)}
              helperText={attemptedSubmit && errors.targetProfit ? errors.targetProfit : undefined}
              inputProps={{ min: 0 }}
              disabled={readOnly}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 3 }}>
            <Select
              fullWidth
              id="target_profit_type"
              label="Target Profit Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.targetProfitType}
              onChange={onFieldChange('targetProfitType')}
              disabled={readOnly}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="trailing_stop_loss"
              label="Trailing Stop Loss"
              type="number"
              value={formData.trailingStopLoss}
              onChange={(e) => onFieldChange('trailingStopLoss')(e.target.value)}
              inputProps={{ min: 0 }}
              disabled={readOnly}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Select
              fullWidth
              id="trailing_stop_loss_type"
              label="Trailing Stop Loss Type"
              options={PROFIT_LOSS_TYPES}
              value={formData.trailingStopLossType}
              onChange={onFieldChange('trailingStopLossType')}
              disabled={readOnly}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
