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
  Pagination,
} from '@mui/material';

interface Instrument {
  id: number;
  exchange: string;
  segment: string;
  symbol: string;
  instrument: string;
  instrument_id: number;
  instrument_name: string;
  start_date: string;
  expiry: string;
}

interface InstrumentSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (instruments: Instrument[]) => void;
  selectedInstruments: Instrument[];
}

const exchanges = ['NSE', 'BSE', 'MCX'];
const segments = ['EQ', 'F&O', 'FUT'];

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 20;

  // Load selected instruments when selectedInstruments prop changes
  useEffect(() => {
    setTempSelected(selectedInstruments);
  }, [selectedInstruments]);

  // Search functionality - only triggered when modal is open
  useEffect(() => {
    if (!open) {
      setInstruments([]);
      return;
    }

    let active = true;
    const fetchInstruments = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (selectedExchange) {
          queryParams.append('exchange', selectedExchange);
        }
        
        if (selectedSegment) {
          queryParams.append('segment', selectedSegment);
        }
        
        if (searchQuery) {
          queryParams.append('query', searchQuery);
        }

        const response = await fetch(`http://localhost:9090/stock?${queryParams.toString()}`);
        const responseData = await response.json();
        console.log('Response:', responseData); // Debug log

        if (active) {
          if (responseData.data) {
            setInstruments(responseData.data);
            setTotalPages(Math.ceil(responseData.total / limit) || 1);
          } else {
            setInstruments([]);
            setTotalPages(1);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error searching instruments:', error);
        if (active) {
          setInstruments([]);
          setTotalPages(1);
          setLoading(false);
        }
      }
    };

    if (searchQuery || selectedExchange || selectedSegment) {
      const debounceTimeout = setTimeout(fetchInstruments, 300);
      return () => {
        active = false;
        clearTimeout(debounceTimeout);
      };
    } else {
      fetchInstruments();
      return () => {
        active = false;
      };
    }
  }, [selectedExchange, selectedSegment, page, searchQuery, open, limit]);

  const handleClose = () => {
    setPage(1);
    setSearchQuery('');
    setInstruments([]);
    setSelectedExchange(null);
    setSelectedSegment(null);
    setTempSelected(selectedInstruments); // Reset to original selection
    onClose();
  };

  const handleSelect = () => {
    onSelect(tempSelected);
    handleClose();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Instruments</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                options={exchanges}
                value={selectedExchange}
                onChange={(_, newValue) => {
                  setSelectedExchange(newValue);
                  setSelectedSegment(null);
                  setPage(1);
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
                disablePortal
                options={segments}
                value={selectedSegment}
                onChange={(_, newValue) => {
                  setSelectedSegment(newValue);
                  setPage(1);
                }}
                disabled={!selectedExchange}
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
              <Autocomplete
                multiple
                options={instruments}
                loading={loading}
                getOptionLabel={(option) => `${option.symbol} - ${option.instrument_name}`}
                value={tempSelected}
                onChange={(_, newValue) => {
                  setTempSelected(newValue);
                }}
                onInputChange={(_, value) => {
                  setSearchQuery(value);
                  setPage(1);
                }}
                isOptionEqualToValue={(option, value) => option.instrument_id === value.instrument_id}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <strong>{option.symbol}</strong> - {option.instrument_name}
                    </Box>
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Box
                      component="span"
                      {...getTagProps({ index })}
                      key={option.instrument_id}
                    >
                      {option.symbol}
                    </Box>
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Search Instruments"
                    placeholder="Type to search"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {instruments.length > 0 && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
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