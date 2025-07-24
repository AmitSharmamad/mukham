import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
  useTheme
} from '@mui/material';
import { IndicatorExpressionBuilder } from '../StrategyBuilder/IndicatorExpressionBuilder';
import InstrumentSelector from '../StrategyBuilder/InstrumentSelector';
import { SimpleInstrumentSelector } from './SimpleInstrumentSelector';
import { SimpleExpressionBuilder } from './SimpleExpressionBuilder';

interface ScannerBuilderProps {
  onSave: (scannerData: any) => void;
  onCancel: () => void;
  editMode?: boolean;
  initialData?: any;
}

const ScannerBuilder: React.FC<ScannerBuilderProps> = ({ 
  onSave, 
  onCancel, 
  editMode = false,
  initialData
}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [scannerData, setScannerData] = useState(initialData || {
    name: '',
    description: '',
    instruments: [],
    timeframe: '15 Minutes',
    conditions: [],
    isActive: false
  });

  // Steps for the scanner builder
  const steps = ['Basic Information', 'Instruments', 'Conditions'];

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleSave = () => {
    onSave(scannerData);
  };

  const handleInputChange = (field: string, value: any) => {
    setScannerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInstrumentsChange = (instruments: any[]) => {
    setScannerData(prev => ({
      ...prev,
      instruments
    }));
  };

  const handleConditionsChange = (conditions: any[]) => {
    setScannerData(prev => ({
      ...prev,
      conditions
    }));
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4,
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Typography variant="h5" gutterBottom>
        {editMode ? 'Edit Scanner' : 'Create New Scanner'}
      </Typography>
      
      <Stepper 
        activeStep={activeStep} 
        sx={{ 
          mb: 4, 
          mt: 3,
          '& .MuiStep-root': {
            '& .MuiStepLabel-root': {
              transition: 'all 0.3s ease-in-out',
            },
            '&.Mui-active': {
              '& .MuiStepLabel-root': {
                transform: 'scale(1.05)',
                '& .MuiStepLabel-label': {
                  fontWeight: 'bold',
                  color: 'primary.main',
                },
              },
              '& .MuiStepConnector-line': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
          },
          '& .MuiStepConnector-root': {
            '&.Mui-active .MuiStepConnector-line': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        }}
      >
        {steps.map((label, index) => {
          const isActive = activeStep === index;
          return (
            <Step key={label}>
              <StepLabel
                sx={{
                  ...(isActive && {
                    '& .MuiStepLabel-label': {
                      fontWeight: 'bold',
                      color: 'primary.main',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    },
                  }),
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Box>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Basic Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Scanner Name"
                  fullWidth
                  required
                  value={scannerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={scannerData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="timeframe-label">Timeframe</InputLabel>
                  <Select
                    labelId="timeframe-label"
                    value={scannerData.timeframe}
                    label="Timeframe"
                    onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  >
                    <MenuItem value="1 Minute">1 Minute</MenuItem>
                    <MenuItem value="3 Minutes">3 Minutes</MenuItem>
                    <MenuItem value="5 Minutes">5 Minutes</MenuItem>
                    <MenuItem value="10 Minutes">10 Minutes</MenuItem>
                    <MenuItem value="15 Minutes">15 Minutes</MenuItem>
                    <MenuItem value="30 Minutes">30 Minutes</MenuItem>
                    <MenuItem value="1 Hour">1 Hour</MenuItem>
                    <MenuItem value="1 Day">1 Day</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Select Instruments</Typography>
            <SimpleInstrumentSelector 
              selectedInstruments={scannerData.instruments}
              onChange={handleInstrumentsChange}
            />
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Scanner Conditions</Typography>
            <SimpleExpressionBuilder
              expressions={scannerData.conditions}
              onChange={handleConditionsChange}
            />
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box>
            <Button 
              color="secondary" 
              onClick={onCancel} 
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSave}
              >
                {editMode ? 'Update Scanner' : 'Create Scanner'}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ScannerBuilder;
