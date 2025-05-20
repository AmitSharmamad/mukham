import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Container,
  Paper
} from '@mui/material';
import { Positions } from './index';

const StrategyBuilder: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [strategyData, setStrategyData] = useState({
    name: '',
    description: '',
    positions: {
      positionType: 'Long',
      maxAllocation: '10000',
      entryPrice: '',
      stopLoss: '',
      targetPrice: '',
      orderType: 'Market'
    }
  });

  const steps = ['Strategy Details', 'Positions', 'Trade Rules', 'Review'];

  const handlePositionsChange = (positions: any) => {
    setStrategyData({
      ...strategyData,
      positions
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Build Your Strategy
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2, mb: 2 }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6">Strategy Details</Typography>
              {/* Strategy details form would go here */}
            </Box>
          )}

          {activeStep === 1 && (
            <Positions
              value={strategyData.positions}
              onChange={handlePositionsChange}
            />
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6">Trade Rules</Typography>
              {/* Trade rules form would go here */}
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6">Review</Typography>
              {/* Review component would go here */}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default StrategyBuilder;