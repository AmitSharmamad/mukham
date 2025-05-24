import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import InstrumentSelector from '../StrategyBuilder/InstrumentSelector';

// Simplified version for use in ScannerBuilder
export function SimpleInstrumentSelector({ selectedInstruments, onChange }) {
  const theme = useTheme();
  const [selectorOpen, setSelectorOpen] = useState(false);
  
  const handleOpenSelector = () => {
    setSelectorOpen(true);
  };
  
  const handleCloseSelector = () => {
    setSelectorOpen(false);
  };
  
  const handleSelect = (instruments) => {
    onChange(instruments);
  };
  
  const handleDelete = (instrumentToDelete) => {
    const newInstruments = selectedInstruments.filter(
      instrument => (instrument.exchange_security_id || instrument.id) !== 
                   (instrumentToDelete.exchange_security_id || instrumentToDelete.id)
    );
    onChange(newInstruments);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleOpenSelector}
          sx={{ mr: 2 }}
        >
          Add Instruments
        </Button>
        <Typography variant="body2" color="text.secondary">
          {selectedInstruments.length} instrument(s) selected
        </Typography>
      </Box>
      
      {selectedInstruments.length > 0 ? (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            background: theme.palette.background.paper,
          }}
        >
          {selectedInstruments.map((instrument) => (
            <Chip
              key={instrument.exchange_security_id || instrument.id}
              label={`${instrument.symbol} - ${instrument.exchange}`}
              onDelete={() => handleDelete(instrument)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No instruments selected. Click "Add Instruments" to select instruments for this scanner.
        </Typography>
      )}
      
      <InstrumentSelector
        open={selectorOpen}
        onClose={handleCloseSelector}
        onSelect={handleSelect}
        selectedInstruments={selectedInstruments}
      />
    </Box>
  );
}