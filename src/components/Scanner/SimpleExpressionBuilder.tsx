import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { IndicatorExpressionBuilder } from '../StrategyBuilder/IndicatorExpressionBuilder';

// Simplified wrapper for the IndicatorExpressionBuilder
export function SimpleExpressionBuilder({ expressions, onChange }) {
  // We're creating a wrapper component that adapts the interface
  // of IndicatorExpressionBuilder to work with ScannerBuilder
  
  return (
    <Box sx={{ mb: 3 }}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Define the conditions for your scanner
        </Typography>
        
        <IndicatorExpressionBuilder 
          value={expressions}
          onChange={onChange}
          label="Scanner Conditions"
        />
      </Paper>
    </Box>
  );
}