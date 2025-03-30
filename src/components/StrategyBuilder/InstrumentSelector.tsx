import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  Button,
  Box,
} from '@mui/material';

interface Instrument {
  id: number;
  name: string;
}

interface InstrumentSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (instruments: Instrument[]) => void;
  selectedInstruments: Instrument[];
}

// Mock data - replace with actual API call in production
const mockInstruments: Instrument[] = [
  { id: 1, name: 'RELIANCE' },
  { id: 2, name: 'TCS' },
  { id: 3, name: 'HDFC BANK' },
  { id: 4, name: 'INFOSYS' },
  { id: 5, name: 'ICICI BANK' },
];

const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  open,
  onClose,
  onSelect,
  selectedInstruments,
}) => {
  const [tempSelected, setTempSelected] = useState<Instrument[]>(selectedInstruments);

  const handleClose = () => {
    setTempSelected(selectedInstruments);
    onClose();
  };

  const handleSelect = () => {
    onSelect(tempSelected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Instruments</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Autocomplete
            multiple
            options={mockInstruments}
            getOptionLabel={(option) => option.name}
            value={tempSelected}
            onChange={(_, newValue) => {
              setTempSelected(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Search Instruments"
                placeholder="Type to search"
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
        <Button onClick={handleSelect} variant="contained" color="primary">
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstrumentSelector;