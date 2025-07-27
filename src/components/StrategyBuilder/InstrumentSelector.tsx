import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Drawer,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Paper,
  InputAdornment,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

interface Instrument {
  exchange_security_id: number;
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
  anchor?: 'left' | 'right'; // Optional prop to determine which side the drawer opens from
}

const exchanges = ['NSE', 'BSE', 'MCX'];
const instrumentTypes = [
  { label: 'Stock', value: 'Stock' },
  { label: 'Index', value: 'Index' }
];

const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  open,
  onClose,
  onSelect,
  selectedInstruments,
  anchor = 'right', // Default to right side
}) => {
  const [tempSelected, setTempSelected] = useState<Instrument[]>(Array.isArray(selectedInstruments) ? selectedInstruments : []);
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [selectedInstrumentType, setSelectedInstrumentType] = useState<{ label: string; value: string } | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 20;
  
  // Reference to the observer for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastInstrumentElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Load selected instruments when selectedInstruments prop changes
  useEffect(() => {
    setTempSelected(Array.isArray(selectedInstruments) ? selectedInstruments : []);
  }, [selectedInstruments]);

  // Search functionality - only triggered when modal is open
  useEffect(() => {
    // Reset state when search parameters change
    if (searchQuery || selectedExchange) {
      setInstruments([]);
      setPage(1);
      setHasMore(true);
    }
  }, [searchQuery, selectedExchange, selectedInstrumentType]);

  // Reset instrument type when exchange is not NSE or BSE
  useEffect(() => {
    if (selectedExchange && selectedExchange !== 'NSE' && selectedExchange !== 'BSE') {
      setSelectedInstrumentType(null);
    }
  }, [selectedExchange]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;
    const fetchInstruments = async () => {
      // Don't fetch if we're on page > 1 but already know there's no more data
      if (page > 1 && !hasMore) {
        return;
      }
      
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        
        if (selectedExchange) {
          queryParams.append('exchange', selectedExchange);
        }
        
        if (searchQuery) {
          queryParams.append('query', searchQuery);
        }

        if (selectedInstrumentType && (selectedExchange === 'NSE' || selectedExchange === 'BSE')) {
          queryParams.append('instrumentType', selectedInstrumentType.value);
        }

        const response = await fetch(`/api/instrument-master?${queryParams.toString()}`);
        const responseData = await response.json();
        console.log('Response:', responseData); // Debug log

        if (active) {
          if (responseData.success && responseData.data && Array.isArray(responseData.data.data)) {
            // Map the API response to match our Instrument interface
            const mappedInstruments = responseData.data.data.map((item: any) => ({
              exchange_security_id: item.exchange_security_id,
              exchange: item.exchange,
              segment: item.segment,
              symbol: item.tradingSymbol || item.symbol,
              instrument: item.name || item.tradingSymbol || item.symbol,
              instrument_id: item.instrumentToken || item.exchange_security_id,
              start_date: item.start_date || '',
              expiry: item.expiryDate || item.expiry || '',
              lotSize: item.lotSize,
              tickSize: item.tickSize
            }));

            // Append new data to existing data for infinite scroll
            if (page === 1) {
              setInstruments(mappedInstruments);
            } else {
              setInstruments(prev => [...prev, ...mappedInstruments]);
            }
            
            // Check if there's more data to load
            const totalPages = responseData.data.totalPages || 1;
            setHasMore(page < totalPages && mappedInstruments.length > 0);
          } else {
            if (page === 1) {
              setInstruments([]);
            }
            setHasMore(false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error searching instruments:', error);
        if (active) {
          if (page === 1) {
            setInstruments([]);
          }
          setHasMore(false);
          setLoading(false);
        }
      }
    };

    const debounceTimeout = setTimeout(fetchInstruments, 300);
    return () => {
      active = false;
      clearTimeout(debounceTimeout);
    };
  }, [selectedExchange, selectedInstrumentType, page, searchQuery, open, pageSize, hasMore]);

  const handleClose = () => {
    setPage(1);
    setSearchQuery('');
    setInstruments([]);
    setSelectedExchange(null);
    setSelectedInstrumentType(null);
    setHasMore(true);
    setTempSelected(Array.isArray(selectedInstruments) ? selectedInstruments : []); // Reset to original selection
    onClose();
  };

  const handleSelect = () => {
    onSelect(tempSelected);
    handleClose();
  };

  // Infinite scrolling is now handled by the observer

  return (
    <Drawer 
      anchor={anchor}
      open={open} 
      onClose={handleClose} 
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '600px', md: '750px' },
          maxWidth: '100%',
          padding: 3
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Select Instruments</Typography>
        <IconButton onClick={handleClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Selected instruments as chips */}
      {tempSelected.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tempSelected.map((instrument) => (
            <Chip
              key={instrument.exchange_security_id}
              label={`${instrument.symbol} - ${instrument.exchange}`}
              onDelete={() => {
                setTempSelected(tempSelected.filter(item => item.exchange_security_id !== instrument.exchange_security_id));
              }}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                options={exchanges}
                value={selectedExchange}
                onChange={(_, newValue) => {
                  setSelectedExchange(newValue);
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
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                options={instrumentTypes}
                value={selectedInstrumentType}
                onChange={(_, newValue) => {
                  setSelectedInstrumentType(newValue);
                  setPage(1);
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disabled={!selectedExchange || (selectedExchange !== 'NSE' && selectedExchange !== 'BSE')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Instrument Type"
                    placeholder="Select type"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button onClick={handleSelect} variant="contained" color="primary" size="large">
                Select {tempSelected.length > 0 ? `(${tempSelected.length})` : ''}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search instruments..."
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                value={searchQuery}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: loading ? (
                    <InputAdornment position="end">
                      <CircularProgress color="inherit" size={20} />
                    </InputAdornment>
                  ) : null
                }}
              />
              
              <Paper variant="outlined" sx={{ mt: 2, height: '500px', overflow: 'auto' }}>
                {instruments.length > 0 ? (
                  <List dense>
                    {instruments.map((instrument, index) => {
                      const labelId = `checkbox-list-label-${instrument.exchange_security_id}`;
                      const isSelected = tempSelected.some(item => item.exchange_security_id === instrument.exchange_security_id);
                      
                      // Add ref to the last element for infinite scrolling
                      const isLastElement = index === instruments.length - 1;
                      
                      return (
                        <ListItem 
                          ref={isLastElement ? lastInstrumentElementRef : null}
                          key={instrument.exchange_security_id}
                          dense
                          onClick={() => {
                            const newSelected = isSelected
                              ? tempSelected.filter(item => item.exchange_security_id !== instrument.exchange_security_id)
                              : [...tempSelected, instrument];
                            setTempSelected(newSelected);
                          }}
                          sx={{ 
                            '&:hover': { bgcolor: 'action.hover' },
                            bgcolor: isSelected ? 'action.selected' : 'transparent',
                          }}
                          button
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={isSelected}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText 
                            id={labelId}
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1" component="span">
                                  <strong>{instrument.symbol}</strong>
                                </Typography>
                                <Typography variant="body2" component="span" color="text.secondary">
                                  {instrument.exchange}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <>
                                {instrument.segment && <span>Segment: {instrument.segment} </span>}
                                {instrument.lotSize && <span>Lot: {instrument.lotSize} </span>}
                                {instrument.expiry && 
                                  <span>Expiry: {new Date(instrument.expiry).toLocaleDateString()} </span>
                                }
                              </>
                            }
                          />
                        </ListItem>
                      );
                    })}
                    {loading && (
                      <Box py={2} display="flex" justifyContent="center" width="100%">
                        <CircularProgress size={24} />
                      </Box>
                    )}
                  </List>
                ) : (
                  <Box p={3} display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography variant="body1" color="text.secondary">
                      {loading && page === 1 ? 'Loading instruments...' : 'No instruments found. Try adjusting your filters.'}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default InstrumentSelector;