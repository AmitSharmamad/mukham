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
  start_date: string;
  expiry: string;
  name?: string;
  instrumentToken?: number;
  tradingSymbol?: string;
  lotSize?: number;
  tickSize?: number;
  expiryDate?: string;
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
  const [tempSelected, setTempSelected] = useState<Instrument[]>(Array.isArray(selectedInstruments) ? selectedInstruments : []);
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 20;

  // Load selected instruments when selectedInstruments prop changes
  useEffect(() => {
    setTempSelected(Array.isArray(selectedInstruments) ? selectedInstruments : []);
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
          pageSize: pageSize.toString(),
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

        const response = await fetch(`/api/instrument-master?${queryParams.toString()}`);
        const responseData = await response.json();
        console.log('Response:', responseData); // Debug log

        if (active) {
          if (responseData.success && responseData.data && Array.isArray(responseData.data.data)) {
            // Map the API response to match our Instrument interface
            const mappedInstruments = responseData.data.data.map((item: any) => ({
              id: item.instrumentToken || item.id,
              exchange: item.exchange,
              segment: item.segment,
              symbol: item.tradingSymbol || item.symbol,
              instrument: item.name || item.tradingSymbol || item.symbol,
              instrument_id: item.instrumentToken || item.id,
              start_date: item.start_date || '',
              expiry: item.expiryDate || item.expiry || '',
              lotSize: item.lotSize,
              tickSize: item.tickSize
            }));
            setInstruments(mappedInstruments);
            setTotalPages(responseData.data.totalPages || 1);
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
  }, [selectedExchange, selectedSegment, page, searchQuery, open, pageSize]);

  const handleClose = () => {
    setPage(1);
    setSearchQuery('');
    setInstruments([]);
    setSelectedExchange(null);
    setSelectedSegment(null);
    setTempSelected(Array.isArray(selectedInstruments) ? selectedInstruments : []); // Reset to original selection
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
                options={Array.isArray(instruments) ? instruments : []}
                loading={loading}
                getOptionLabel={(option) => `${option.symbol} - ${option.exchange}`}
                value={Array.isArray(tempSelected) ? tempSelected : []}
                onChange={(_, newValue) => {
                  setTempSelected(newValue);
                }}
                onInputChange={(_, value) => {
                  setSearchQuery(value);
                  setPage(1);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <strong>{option.symbol}</strong> - {option.exchange}
                      {option.lotSize && ` (Lot: ${option.lotSize})`}
                      {option.expiry && ` (Expiry: ${new Date(option.expiry).toLocaleDateString()})`}
                    </Box>
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Box
                      component="span"
                      {...getTagProps({ index })}
                      key={option.id}
                    >
                      {option.symbol} - {option.exchange}
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