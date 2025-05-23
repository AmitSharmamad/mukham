import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  useTheme
} from '@mui/material';
import { Position } from '../../services/deploymentService';

interface DeploymentPositionsProps {
  positions: Position[];
  loading: boolean;
}

const DeploymentPositions: React.FC<DeploymentPositionsProps> = ({ positions, loading }) => {
  const theme = useTheme();

  return (
    <Box p={2} bgcolor={theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}>
      <Typography variant="h6" gutterBottom>
        Positions
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      ) : positions.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
          <Table stickyHeader aria-label="positions table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Instrument</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Entry Price</TableCell>
                <TableCell>Entry Time</TableCell>
                <TableCell>Exit Price</TableCell>
                <TableCell>Exit Time</TableCell>
                <TableCell>PnL</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell>{position.id}</TableCell>
                  <TableCell>{position.instrument_id}</TableCell>
                  <TableCell>{position.quantity}</TableCell>
                  <TableCell>${position.entry_price.toFixed(2)}</TableCell>
                  <TableCell>{new Date(position.entry_time).toLocaleString()}</TableCell>
                  <TableCell>{position.exit_price ? `$${position.exit_price.toFixed(2)}` : '-'}</TableCell>
                  <TableCell>{position.exit_time ? new Date(position.exit_time).toLocaleString() : '-'}</TableCell>
                  <TableCell sx={{ 
                    color: position.pnl && position.pnl > 0 ? 'success.main' : position.pnl && position.pnl < 0 ? 'error.main' : 'text.primary'
                  }}>
                    {position.pnl ? `$${position.pnl.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={position.status} 
                      color={
                        position.status === 'OPEN' ? 'primary' : 
                        position.status === 'CLOSED' ? 'default' : 
                        'error'
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
          No positions for this deployment yet.
          <br/>
          Hang on tight, they will be here soon!
        </Typography>
      )}
    </Box>
  );
};

export default DeploymentPositions;
