import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  useTheme,
  alpha,
  Collapse,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp,
  TrendingDown,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { Position } from '../../services/deploymentService';
import { useToastContext } from '../../context/ToastContext';

interface PositionTableProps {
  positions: Position[];
  loading: boolean;
  onClosePosition?: (position: Position) => Promise<void>;
  selectedPositions: number[];
  onPositionSelect: (positionIds: number[]) => void;
  realtimeMetrics?: any;
  compact?: boolean;
}

type Order = 'asc' | 'desc';
type OrderBy = 'id' | 'entry_price' | 'quantity' | 'pnl' | 'entry_time' | 'exit_price' | 'exit_time' | 'status';

interface HeadCell {
  id: OrderBy;
  label: string;
  numeric: boolean;
  width?: string;
}

const headCells: HeadCell[] = [
  { id: 'id', numeric: true, label: 'Position ID', width: '100px' },
  { id: 'entry_price', numeric: true, label: 'Entry Price', width: '120px' },
  { id: 'quantity', numeric: true, label: 'Quantity', width: '100px' },
  { id: 'pnl', numeric: true, label: 'P&L', width: '120px' },
  { id: 'entry_time', numeric: false, label: 'Entry Time', width: '150px' },
  { id: 'exit_price', numeric: true, label: 'Exit Price', width: '120px' },
  { id: 'exit_time', numeric: false, label: 'Exit Time', width: '150px' },
  { id: 'status', numeric: false, label: 'Status', width: '100px' },
];

const PositionTable: React.FC<PositionTableProps> = ({
  positions,
  loading,
  onClosePosition,
  selectedPositions,
  onPositionSelect,
  realtimeMetrics,
  compact = false
}) => {
  const theme = useTheme();
  const toast = useToastContext();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderBy>('entry_time');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    position: Position | null;
  }>({ open: false, position: null });
  const [closingPosition, setClosingPosition] = useState(false);

  const sortedPositions = useMemo(() => {
    return [...positions].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      if (orderBy === 'entry_time' || orderBy === 'exit_time') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (orderBy === 'pnl' || orderBy === 'exit_price') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [positions, order, orderBy]);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = positions.map(p => p.id);
      onPositionSelect(newSelected);
    } else {
      onPositionSelect([]);
    }
  };

  const handleSelectPosition = (id: number) => {
    const selectedIndex = selectedPositions.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedPositions, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedPositions.slice(1));
    } else if (selectedIndex === selectedPositions.length - 1) {
      newSelected = newSelected.concat(selectedPositions.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedPositions.slice(0, selectedIndex),
        selectedPositions.slice(selectedIndex + 1),
      );
    }

    onPositionSelect(newSelected);
  };

  const handleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleClosePosition = async (position: Position) => {
    if (!onClosePosition) return;

    setClosingPosition(true);
    try {
      await onClosePosition(position);
      setConfirmDialog({ open: false, position: null });
      toast.showSuccess(`Position ${position.id} closed successfully`);
    } catch (error) {
      console.error('Error closing position:', error);
      toast.showError('Failed to close position');
    } finally {
      setClosingPosition(false);
    }
  };

  const handleCopyPositionId = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    toast.showSuccess('Position ID copied to clipboard');
  };

  const formatPnL = (pnl: number | undefined) => {
    if (pnl === undefined) return 'N/A';
    const isPositive = pnl >= 0;
    return `${isPositive ? '+' : ''}₹${pnl.toFixed(2)}`;
  };

  const getPnLColor = (pnl: number | undefined) => {
    if (pnl === undefined) return 'text.secondary';
    return pnl >= 0 ? 'success.main' : 'error.main';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'success';
      case 'CLOSED': return 'default';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  // Add keyboard shortcuts support
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+A or Cmd+A - Select all positions
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        const allIds = positions.map(p => p.id);
        onPositionSelect(allIds);
      }
      
      // Delete key - Close selected open positions
      if (event.key === 'Delete' && selectedPositions.length > 0) {
        event.preventDefault();
        const openSelectedPositions = positions.filter(p => 
          selectedPositions.includes(p.id) && p.status === 'OPEN'
        );
        if (openSelectedPositions.length > 0) {
          // Trigger bulk close for the first position as demo
          if (onClosePosition) {
            setConfirmDialog({ open: true, position: openSelectedPositions[0] });
          }
        }
      }
      
      // Ctrl+E or Cmd+E - Export selected positions
      if ((event.ctrlKey || event.metaKey) && event.key === 'e' && selectedPositions.length > 0) {
        event.preventDefault();
        // Trigger export functionality
        handleExportSelected();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [positions, selectedPositions, onPositionSelect, onClosePosition]);

  const handleExportSelected = () => {
    const selectedData = positions.filter(p => selectedPositions.includes(p.id));
    const csvContent = [
      ['Position ID', 'Instrument ID', 'Quantity', 'Entry Price', 'Exit Price', 'P&L', 'Status', 'Entry Time', 'Exit Time'].join(','),
      ...selectedData.map(p => [
        p.id,
        p.instrument_id,
        p.quantity,
        p.entry_price,
        p.exit_price || '',
        p.pnl || 0,
        p.status,
        p.entry_time,
        p.exit_time || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `selected_positions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.showSuccess(`Exported ${selectedData.length} positions`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (positions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No positions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Positions will appear here when they are opened
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Mobile Card Layout
  if (compact) {
    return (
      <Box sx={{ p: 2 }}>
        {sortedPositions.map((position) => (
          <Card key={position.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Position #{position.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instrument: {position.instrument_id}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Chip
                    label={position.status}
                    color={getStatusColor(position.status) as any}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Quantity: {position.quantity}</Typography>
                <Typography variant="body2">Entry: ₹{position.entry_price.toFixed(2)}</Typography>
              </Box>
              
              {position.exit_price && (
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Exit Price:</Typography>
                  <Typography variant="body2">₹{position.exit_price.toFixed(2)}</Typography>
                </Box>
              )}
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color={getPnLColor(position.pnl)}
                >
                  {formatPnL(position.pnl)}
                </Typography>
                {position.status === 'OPEN' && onClosePosition && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => setConfirmDialog({ open: true, position })}
                  >
                    Close
                  </Button>
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Entry: {new Date(position.entry_time).toLocaleString()}
              </Typography>
              {position.exit_time && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Exit: {new Date(position.exit_time).toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Desktop Table Layout
  return (
    <Card>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedPositions.length > 0 && selectedPositions.length < positions.length}
                  checked={positions.length > 0 && selectedPositions.length === positions.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding="normal"
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{ 
                    fontWeight: 600,
                    width: headCell.width,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPositions.map((position) => {
              const isSelected = selectedPositions.indexOf(position.id) !== -1;
              const isExpanded = expandedRow === position.id;

              return (
                <React.Fragment key={position.id}>
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    selected={isSelected}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectPosition(position.id)}
                      />
                    </TableCell>
                    <TableCell 
                      align="right"
                      onClick={() => handleExpandRow(position.id)}
                    >
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                        <Typography variant="body2">#{position.id}</Typography>
                        <Tooltip title="Copy Position ID">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPositionId(position.id);
                            }}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ₹{position.entry_price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {position.quantity}
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                        {position.pnl !== undefined && (
                          position.pnl >= 0 ? <TrendingUp fontSize="small" color="success" /> : <TrendingDown fontSize="small" color="error" />
                        )}
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color={getPnLColor(position.pnl)}
                        >
                          {formatPnL(position.pnl)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(position.entry_time).toLocaleDateString()} {new Date(position.entry_time).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {position.exit_price ? `₹${position.exit_price.toFixed(2)}` : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {position.exit_time ? 
                          `${new Date(position.exit_time).toLocaleDateString()} ${new Date(position.exit_time).toLocaleTimeString()}` 
                          : '-'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={position.status}
                        color={getStatusColor(position.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        {position.status === 'OPEN' && onClosePosition && (
                          <Tooltip title="Close Position">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDialog({ open: true, position });
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title={isExpanded ? "Collapse" : "Expand Details"}>
                          <IconButton
                            size="small"
                            onClick={() => handleExpandRow(position.id)}
                          >
                            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expandable Row Details */}
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Position Details
                          </Typography>
                          <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Instrument ID
                              </Typography>
                              <Typography variant="body2">
                                {position.instrument_id}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Created At
                              </Typography>
                              <Typography variant="body2">
                                {new Date(position.created_at).toLocaleString()}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Updated At
                              </Typography>
                              <Typography variant="body2">
                                {new Date(position.updated_at).toLocaleString()}
                              </Typography>
                            </Box>
                          </Stack>
                          {position.metadata && Object.keys(position.metadata).length > 0 && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" gutterBottom>
                                Metadata
                              </Typography>
                              <Box
                                component="pre"
                                sx={{
                                  fontSize: '0.75rem',
                                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                                  p: 1,
                                  borderRadius: 1,
                                  overflow: 'auto',
                                  maxHeight: '200px'
                                }}
                              >
                                {JSON.stringify(position.metadata, null, 2)}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Close Position Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, position: null })}
      >
        <DialogTitle>Close Position</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to close position #{confirmDialog.position?.id}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, position: null })}
            disabled={closingPosition}
          >
            Cancel
          </Button>
          <Button
            onClick={() => confirmDialog.position && handleClosePosition(confirmDialog.position)}
            color="error"
            variant="contained"
            disabled={closingPosition}
          >
            {closingPosition ? 'Closing...' : 'Close Position'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PositionTable;
