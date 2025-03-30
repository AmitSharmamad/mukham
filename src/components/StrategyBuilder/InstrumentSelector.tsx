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
  Grid,
} from '@mui/material';

interface Instrument {
  id: number;
  name: string;
  exchange: string;
  segment: string;
}

interface InstrumentSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (instruments: Instrument[]) => void;
  selectedInstruments: Instrument[];
}

// Mock data - replace with actual API call in production
const mockInstruments: Instrument[] = [
  { id: 1, name: 'RELIANCE', exchange: 'NSE', segment: 'EQ' },
  { id: 2, name: 'TCS', exchange: 'NSE', segment: 'EQ' },
  { id: 3, name: 'HDFC BANK', exchange: 'NSE', segment: 'EQ' },
  { id: 4, name: 'INFOSYS', exchange: 'BSE', segment: 'EQ' },
  { id: 5, name: 'ICICI BANK', exchange: 'BSE', segment: 'EQ' },
  { id: 6, name: 'NIFTY', exchange: 'NSE', segment: 'FO' },
  { id: 7, name: 'BANKNIFTY', exchange: 'NSE', segment: 'FO' },
  { id: 8, name: 'GOLD', exchange: 'MCX', segment: 'FUT' },
  { id: 9, name: 'SILVER', exchange: 'MCX', segment: 'FUT' },
  { id: 10, name: 'CRUDEOIL', exchange: 'MCX', segment: 'FUT' },
  { id: 11, name: 'COPPER', exchange: 'MCX', segment: 'FUT' },
];

const exchanges = Array.from(new Set(mockInstruments.map(i => i.exchange)));
const segments = Array.from(new Set(mockInstruments.map(i => i.segment)));

const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  open,
  onClose,
  onSelect,
  selectedInstruments,
}) => {
  const [tempSelected, setTempSelected] = useState<Instrument[]>(selectedInstruments);
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const handleClose = () => {
    setTempSelected(selectedInstruments);
    setSelectedExchanges([]);
    setSelectedSegments([]);
    onClose();
  };

  const handleSelect = () => {
    onSelect(tempSelected);
    onClose();
  };

  const filteredInstruments = mockInstruments.filter(instrument => {
    const exchangeMatch = selectedExchanges.length === 0 || selectedExchanges.includes(instrument.exchange);
    const segmentMatch = selectedSegments.length === 0 || selectedSegments.includes(instrument.segment);
    return exchangeMatch && segmentMatch;
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Instruments</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                multiple
                options={exchanges}
                value={selectedExchanges}
                onChange={(_, newValue) => {
                  setSelectedExchanges(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Filter by Exchange"
                    placeholder="Select exchanges"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                multiple
                options={segments}
                value={selectedSegments}
                onChange={(_, newValue) => {
                  setSelectedSegments(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Filter by Segment"
                    placeholder="Select segments"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={filteredInstruments}
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
            </Grid>
          </Grid>
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