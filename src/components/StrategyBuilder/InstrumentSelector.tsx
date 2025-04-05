import React, { useState, useEffect } from 'react';
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
  CircularProgress,
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

const exchanges = ['NSE', 'BSE', 'MCX'];
const segments = ['EQ', 'FO', 'FUT'];

const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  open,
  onClose,
  onSelect,
  selectedInstruments,
}) => {
  const [tempSelected, setTempSelected] = useState<Instrument[]>(selectedInstruments);
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstruments = async () => {
      if (!selectedExchange && !selectedSegment) {
        setInstruments([]);
        return;
      }

      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedExchange) queryParams.append('exchange', selectedExchange);
        if (selectedSegment) queryParams.append('segment', selectedSegment);

        const response = await fetch(`http://localhost:9090/stock?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch instruments');
        
        const data = await response.json();
        setInstruments(data);
      } catch (error) {
        console.error('Error fetching instruments:', error);
        setInstruments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, [selectedExchange, selectedSegment]);

  const handleClose = () => {
    setTempSelected(selectedInstruments);
    setSelectedExchange(null);
    setSelectedSegment(null);
    onClose();
  };

  const handleSelect = () => {
    onSelect(tempSelected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Instruments</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                options={exchanges}
                value={selectedExchange}
                onChange={(_, newValue) => {
                  setSelectedExchange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Filter by Exchange"
                    placeholder="Select exchange"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={segments}
                value={selectedSegment}
                onChange={(_, newValue) => {
                  setSelectedSegment(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Filter by Segment"
                    placeholder="Select segment"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              {loading ? (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress />
                </Box>
              ) : (
                <Autocomplete
                  multiple
                  options={instruments}
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
              )}
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