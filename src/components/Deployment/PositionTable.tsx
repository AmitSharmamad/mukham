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
  TablePagination,
  Paper,
  Chip,
  Typography,
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
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { Position } from '../../services/deploymentService';
import { useToastContext } from '../../context/ToastContext';
import { formatDate, formatDateOnly, formatTimeOnly } from '../../utils/deploymentUtils';

interface PositionTableProps {
  positions: Position[];
  loading: boolean;
  onClosePosition?: (position: Position) => Promise<void>;
  realtimeMetrics?: any;
  compact?: boolean;
}

type Order = 'asc' | 'desc';
type OrderBy = 'id' | 'entry_price' | 'quantity' | 'pnl' | 'entry_time' | 'exit_price' | 'exit_time' | 'exit_reason' | 'status';

interface HeadCell {
  id: OrderBy;
  label: string;
  numeric: boolean;
  width?: string;
}

const headCells: HeadCell[] = [
  { id: 'entry_price', numeric: true, label: 'Entry Price', width: '120px' },
  { id: 'quantity', numeric: true, label: 'Quantity', width: '100px' },
  { id: 'entry_time', numeric: false, label: 'Entry Time', width: '150px' },
  { id: 'exit_price', numeric: true, label: 'Exit Price', width: '120px' },
  { id: 'exit_time', numeric: false, label: 'Exit Time', width: '150px' },
  { id: 'exit_reason', numeric: false, label: 'Exit Reason', width: '120px' },
  { id: 'status', numeric: false, label: 'Status', width: '100px' },
  { id: 'pnl', numeric: true, label: 'P&L', width: '120px' },
];

const PositionTable: React.FC<PositionTableProps> = ({
  positions,
  loading,
  onClosePosition,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

      if (orderBy === 'exit_reason') {
        aValue = aValue || '';
        bValue = bValue || '';
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [positions, order, orderBy]);

  // Get paginated positions for table display
  const paginatedPositions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedPositions.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedPositions, page, rowsPerPage]);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    // Reset to first page when sorting changes
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setExpandedRow(null); // Close any expanded rows when changing pages
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setExpandedRow(null); // Close any expanded rows when changing page size
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

  const formatPnL = (pnl: number | undefined) => {
    if (pnl === undefined) return 'N/A';
    return `₹${pnl.toFixed(2)}`;
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

  const formatExitReason = (exitReason: string | undefined) => {
    if (!exitReason) return '-';
    return exitReason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getExitReasonColor = (exitReason: string | undefined) => {
    if (!exitReason) return 'default';
    switch (exitReason.toUpperCase()) {
      case 'TARGET':
      case 'TARGET_PROFIT':
      case 'TAKE_PROFIT':
        return 'success';
      case 'STOP_LOSS':
      case 'STOP':
        return 'error';
      case 'TRAILING_STOP':
      case 'TRAILING_STOP_LOSS':
        return 'warning';
      case 'USER_REQUESTED':
      case 'MANUAL':
        return 'info';
      default:
        return 'default';
    }
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
      <Box>
        <Box sx={{ p: 2 }}>
          {paginatedPositions.map((position) => (
            <Card key={position.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Instrument: {position.instrument_id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {position.status}
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
                  Entry: {formatDate(position.entry_time)}
                </Typography>
                {position.exit_time && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Exit: {formatDate(position.exit_time)}
                  </Typography>
                )}
                {position.exit_reason && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Exit Reason: {formatExitReason(position.exit_reason)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
        
        {/* Pagination for mobile */}
        <TablePagination
          component="div"
          count={positions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Positions per page:"
        />
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
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPositions.map((position) => {
              const isExpanded = expandedRow === position.id;

              return (
                <React.Fragment key={position.id}>
                  <TableRow
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <TableCell 
                      align="right"
                      onClick={() => handleExpandRow(position.id)}
                    >
                      ₹{position.entry_price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {position.quantity}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(position.entry_time)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {position.exit_price ? `₹${position.exit_price.toFixed(2)}` : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {position.exit_time ? formatDate(position.exit_time) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatExitReason(position.exit_reason)}
                        color={getExitReasonColor(position.exit_reason) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={position.status}
                        color={getStatusColor(position.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color={getPnLColor(position.pnl)}
                      >
                        {formatPnL(position.pnl)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expandable Row Details */}
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
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
                            {position.exit_reason && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Exit Reason
                                </Typography>
                                <Typography variant="body2">
                                  {formatExitReason(position.exit_reason)}
                                </Typography>
                              </Box>
                            )}
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Created At
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(position.created_at)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Updated At
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(position.updated_at)}
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

      {/* Pagination */}
      <TablePagination
        component="div"
        count={positions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Positions per page:"
      />

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
