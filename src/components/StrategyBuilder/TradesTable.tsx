import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Collapse,
  SelectChangeEvent,
  useTheme,
  Grid,
  TextField,
  InputAdornment,
  Button,
  TableSortLabel,
  Pagination,
  Stack
} from '@mui/material';

interface BacktestPosition {
  id: string | number;
  entry_price_order: number;
  entry_time_order: string;
  exit_price_order: number;
  exit_time_order: string;
  exit_reason: string;
  profit_loss_absolute: number;
  position_size: number;
}

interface Instrument {
  exchange_security_id: number;
  exchange: string;
  segment: string;
  symbol: string;
  instrument: string;
  instrument_id: number;
  start_date: string;
  expiry: string;
}

interface BacktestRun {
  instrument_id: string | number;
  positions: BacktestPosition[] | null;
  exchange?: string;
  instrument_master?: {
    instrument_name: string;
  };
}

interface TradesTableProps {
  backtestData: {
    results: BacktestRun[];
  };
  instruments: Instrument[];
  isVisible: boolean;
  timeframe?: string;
}

const TradesTable: React.FC<TradesTableProps> = ({ backtestData, instruments, isVisible, timeframe }) => {
  const theme = useTheme();
  const [selectedInstrument, setSelectedInstrument] = useState<string>('all');
  const [selectedExitReason, setSelectedExitReason] = useState<string>('all');
  const [profitLossFilter, setProfitLossFilter] = useState<string>('all');
  const [minPnL, setMinPnL] = useState<string>('');
  const [maxPnL, setMaxPnL] = useState<string>('');

  // Sorting state
  const [sortBy, setSortBy] = useState<'entryTime' | 'exitTime' | 'profitLoss' | 'positionSize'>('entryTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  // Create instrument options for the dropdown
  const instrumentOptions = useMemo(() => {
    const availableInstruments = backtestData.results
      .filter(run => run.positions && run.positions.length > 0)
      .map(run => {
        const instrumentId = Number(run.instrument_id);
        // Enhanced fallback logic: use instruments prop symbol if instrument_master is not available
        const instrumentName = run.instrument_master?.instrument_name ||
          instruments.find(inst => inst.instrument_id === instrumentId)?.symbol ||
          instruments.find(inst => inst.exchange_security_id === instrumentId)?.symbol ||
          `Instrument ${run.instrument_id}`;
        return {
          id: instrumentId,
          name: instrumentName,
          symbol: instrumentName
        };
      });

    return [
      { id: 'all', name: 'All Instruments', symbol: 'All' },
      ...availableInstruments
    ];
  }, [backtestData.results, instruments]);

  // Create exit reason options for the dropdown
  const exitReasonOptions = useMemo(() => {
    const allPositions = backtestData.results
      .filter(run => run.positions && run.positions.length > 0)
      .flatMap(run => run.positions!);
    
    const uniqueExitReasons = Array.from(new Set(allPositions.map(pos => pos.exit_reason).filter(Boolean)));
    
    return [
      { value: 'all', label: 'All Exit Reasons' },
      ...uniqueExitReasons.map(reason => ({ value: reason, label: reason }))
    ];
  }, [backtestData.results]);

  // Filter positions based on all selected filters
  const filteredPositions = useMemo(() => {
    let positions: any[] = [];

    if (selectedInstrument === 'all') {
      // Return all positions from all instruments
      positions = backtestData.results
        .filter(run => run.positions && run.positions.length > 0)
        .flatMap(run => {
          const instrumentId = Number(run.instrument_id);
          // Enhanced fallback logic: use instruments prop symbol if instrument_master is not available
          const instrumentName = run.instrument_master?.instrument_name ||
            instruments.find(inst => inst.instrument_id === instrumentId)?.symbol ||
            instruments.find(inst => inst.exchange_security_id === instrumentId)?.symbol ||
            `Instrument ${run.instrument_id}`;
          return run.positions!.map(position => ({
            ...position,
            instrumentName,
            instrumentId
          }));
        });
    } else {
      // Return positions for selected instrument only
      const selectedRun = backtestData.results.find(
        run => Number(run.instrument_id) === Number(selectedInstrument)
      );
      
      if (selectedRun && selectedRun.positions) {
        const instrumentId = Number(selectedRun.instrument_id);
        // Enhanced fallback logic: use instruments prop symbol if instrument_master is not available
        const instrumentName = selectedRun.instrument_master?.instrument_name ||
          instruments.find(inst => inst.instrument_id === instrumentId)?.symbol ||
          instruments.find(inst => inst.exchange_security_id === instrumentId)?.symbol ||
          `Instrument ${selectedRun.instrument_id}`;
        
        positions = selectedRun.positions.map(position => ({
          ...position,
          instrumentName,
          instrumentId
        }));
      }
    }

    // Apply exit reason filter
    if (selectedExitReason !== 'all') {
      positions = positions.filter(pos => pos.exit_reason === selectedExitReason);
    }

    // Apply profit/loss filter
    if (profitLossFilter !== 'all') {
      switch (profitLossFilter) {
        case 'profitable':
          positions = positions.filter(pos => pos.profit_loss_absolute > 0);
          break;
        case 'loss':
          positions = positions.filter(pos => pos.profit_loss_absolute < 0);
          break;
      }
    }

    // Apply numeric range filter for P&L
    if (minPnL !== '' || maxPnL !== '') {
      positions = positions.filter(pos => {
        const pnl = pos.profit_loss_absolute;
        const min = minPnL === '' ? -Infinity : parseFloat(minPnL);
        const max = maxPnL === '' ? Infinity : parseFloat(maxPnL);
        return pnl >= min && pnl <= max;
      });
    }

    // Apply sorting
    positions.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'entryTime':
          comparison = new Date(a.entry_time_order).getTime() - new Date(b.entry_time_order).getTime();
          break;
        case 'exitTime':
          comparison = new Date(a.exit_time_order).getTime() - new Date(b.exit_time_order).getTime();
          break;
        case 'profitLoss':
          comparison = a.profit_loss_absolute - b.profit_loss_absolute;
          break;
        case 'positionSize':
          comparison = a.position_size - b.position_size;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return positions;
  }, [selectedInstrument, selectedExitReason, profitLossFilter, minPnL, maxPnL, sortBy, sortOrder, backtestData.results, instruments]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPositions = filteredPositions.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedInstrument, selectedExitReason, profitLossFilter, minPnL, maxPnL]);

  const handleInstrumentChange = (event: SelectChangeEvent<string>) => {
    setSelectedInstrument(event.target.value);
  };

  const handleExitReasonChange = (event: SelectChangeEvent<string>) => {
    setSelectedExitReason(event.target.value);
  };

  const handleProfitLossFilterChange = (event: SelectChangeEvent<string>) => {
    setProfitLossFilter(event.target.value);
  };

  const handleMinPnLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinPnL(event.target.value);
  };

  const handleMaxPnLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPnL(event.target.value);
  };

  const handleClearAllFilters = () => {
    setSelectedInstrument('all');
    setSelectedExitReason('all');
    setProfitLossFilter('all');
    setMinPnL('');
    setMaxPnL('');
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handleSort = (column: 'entryTime' | 'exitTime' | 'profitLoss' | 'positionSize') => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // For 1-day timeframe, show only date without time
      if (timeframe === '1d') {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        });
      }
      
      // For other timeframes, show full date and time
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return (Math.floor(price * 100) / 100).toFixed(2);
  };

  const formatPnL = (pnl: number) => {
    return (Math.floor(pnl * 100) / 100).toFixed(2);
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return theme.palette.success.main;
    if (pnl < 0) return theme.palette.error.main;
    return theme.palette.text.primary;
  };

  if (!isVisible) {
    return null;
  }

  // Check if there's any data at all
  const hasAnyData = backtestData.results.some(run => run.positions && run.positions.length > 0);

  return (
    <Collapse in={isVisible} timeout="auto" unmountOnExit>
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          Trade Details
        </Typography>

        {/* Filter Controls */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
            {(selectedInstrument !== 'all' || selectedExitReason !== 'all' || profitLossFilter !== 'all' || minPnL !== '' || maxPnL !== '') && (
              <Button 
                variant="text" 
                color="primary" 
                onClick={handleClearAllFilters}
                size="small"
              >
                Clear All Filters
              </Button>
            )}
          </Box>
          <Grid container spacing={2} alignItems="center">
            {/* Instrument Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Instrument</InputLabel>
                <Select
                  value={selectedInstrument}
                  label="Instrument"
                  onChange={handleInstrumentChange}
                >
                  {instrumentOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Exit Reason Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Exit Reason</InputLabel>
                <Select
                  value={selectedExitReason}
                  label="Exit Reason"
                  onChange={handleExitReasonChange}
                >
                  {exitReasonOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Profit/Loss Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>P&L Filter</InputLabel>
                <Select
                  value={profitLossFilter}
                  label="P&L Filter"
                  onChange={handleProfitLossFilterChange}
                >
                  <MenuItem value="all">All Trades</MenuItem>
                  <MenuItem value="profitable">Profitable</MenuItem>
                  <MenuItem value="loss">Loss-making</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* P&L Range Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Min P&L"
                  type="number"
                  value={minPnL}
                  onChange={handleMinPnLChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  label="Max P&L"
                  type="number"
                  value={maxPnL}
                  onChange={handleMaxPnLChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* No Data Scenarios */}
        {!hasAnyData ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Trade Data Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No trades were executed during the backtest period. This could be due to:
            </Typography>
            <Box component="ul" sx={{ mt: 2, textAlign: 'left', display: 'inline-block' }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Strategy conditions were not met
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Insufficient market data for the selected period
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Entry conditions were too restrictive
              </Typography>
            </Box>
          </Paper>
        ) : filteredPositions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Trades Match Current Filters
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Try adjusting your filter criteria to see more results:
            </Typography>
            <Box component="ul" sx={{ mt: 2, mb: 3, textAlign: 'left', display: 'inline-block' }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Select "All Instruments" to see trades from all symbols
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Choose "All Exit Reasons" to include all exit types
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Set P&L Filter to "All Trades" to include all profit/loss ranges
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Clear the Min/Max P&L range filters
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleClearAllFilters}
              sx={{ mt: 1 }}
            >
              Clear All Filters
            </Button>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    S. No.
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Instrument
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Entry Price
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortBy === 'entryTime'}
                    direction={sortBy === 'entryTime' ? sortOrder : 'asc'}
                    onClick={() => handleSort('entryTime')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      Entry Time
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Exit Price
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortBy === 'exitTime'}
                    direction={sortBy === 'exitTime' ? sortOrder : 'asc'}
                    onClick={() => handleSort('exitTime')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      Exit Time
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Exit Reason
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortBy === 'positionSize'}
                    direction={sortBy === 'positionSize' ? sortOrder : 'asc'}
                    onClick={() => handleSort('positionSize')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      Position Size
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortBy === 'profitLoss'}
                    direction={sortBy === 'profitLoss' ? sortOrder : 'asc'}
                    onClick={() => handleSort('profitLoss')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      Profit/Loss
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPositions.map((position, index) => (
                <TableRow 
                  key={`${position.instrumentId}-${position.id}-${index}`}
                  hover
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      backgroundColor: theme.palette.action.hover 
                    } 
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {startIndex + index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={position.instrumentName}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      ₹{formatPrice(position.entry_price_order)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {formatDateTime(position.entry_time_order)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      ₹{formatPrice(position.exit_price_order)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {formatDateTime(position.exit_time_order)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={position.exit_reason || 'N/A'} 
                      size="small"
                      color={
                        position.exit_reason === 'TARGET' ? 'success' :
                        position.exit_reason === 'STOP_LOSS' ? 'error' :
                        'default'
                      }
                      sx={{ fontSize: '0.7rem', height: '24px' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {position.position_size.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      sx={{ color: getPnLColor(position.profit_loss_absolute) }}
                    >
                      ₹{formatPnL(position.profit_loss_absolute)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Table info and pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPositions.length)} of {filteredPositions.length} trade{filteredPositions.length !== 1 ? 's' : ''}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Page P&L: 
                <Typography 
                  component="span" 
                  fontWeight="bold"
                  sx={{ 
                    ml: 1,
                    color: getPnLColor(
                      paginatedPositions.reduce((sum, pos) => sum + pos.profit_loss_absolute, 0)
                    )
                  }}
                >
                  ₹{formatPnL(paginatedPositions.reduce((sum, pos) => sum + pos.profit_loss_absolute, 0))}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total P&L: 
                <Typography 
                  component="span" 
                  fontWeight="bold"
                  sx={{ 
                    ml: 1,
                    color: getPnLColor(
                      filteredPositions.reduce((sum, pos) => sum + pos.profit_loss_absolute, 0)
                    )
                  }}
                >
                  ₹{formatPnL(filteredPositions.reduce((sum, pos) => sum + pos.profit_loss_absolute, 0))}
                </Typography>
              </Typography>
            </Box>
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </Box>
          )}
        </Box>
          </>
        )}
      </Box>
    </Collapse>
  );
};

export default TradesTable;
