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

  useEffect(() => {
    const fetchInstruments = async () => {
      if (!selectedExchange) {
        setInstruments([]);
        return;
      }

      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('exchange', selectedExchange);
        if (selectedSegment) queryParams.append('segment', selectedSegment);
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        if (searchQuery) queryParams.append('search', searchQuery);

        const response = await fetch(`http://localhost:9090/stock?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch instruments');
        
        const responseData = await response.json();
        console.log('API Response:', responseData); // Debug log
        
        setInstruments(responseData.data || []);
        setTotalPages(responseData.total_pages || 1);
      } catch (error) {
        console.error('Error fetching instruments:', error);
        setInstruments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, [selectedExchange, selectedSegment, page, searchQuery]);

  const handleClose = () => {
    setPage(1);
    setSearchQuery('');
    setTempSelected(selectedInstruments);
    setSelectedExchange(null);
    setSelectedSegment(null);
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
                  console.log('Selected Exchange:', newValue); // Debug log
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
              {loading ? (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    options={instruments}
                    getOptionLabel={(option) => `${option.symbol} - ${option.instrument_name}`}
                    value={tempSelected}
                    onChange={(_, newValue) => {
                      setTempSelected(newValue);
                    }}
                    onInputChange={(_, value) => {
                      setSearchQuery(value);
                      setPage(1);
                    }}
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
                      />
                    )}
                    disabled={!selectedExchange}
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
                </>
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