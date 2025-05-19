import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { format } from 'date-fns';

interface ScanResultsProps {
  results: Array<{
    symbol: string;
    exchange: string;
    price: number;
    matchTime: string;
    [key: string]: any; // For additional properties
  }>;
  onClose: () => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({ results, onClose }) => {
  const theme = useTheme();
  
  if (!results || results.length === 0) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mt: 3, 
          mb: 3,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Scan Results</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body1" color="text.secondary">
          No matching results found.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mt: 3, 
        mb: 3,
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Scan Results</Typography>
          <Chip 
            label={`${results.length} matches`} 
            color="primary" 
            size="small" 
            sx={{ ml: 2 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table size="medium">
          <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Exchange</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { 
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer' 
                  }
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="medium">
                    {result.symbol}
                  </Typography>
                </TableCell>
                <TableCell>
                  {result.exchange}
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    fontFamily="monospace"
                  >
                    {result.price.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {format(new Date(result.matchTime), 'HH:mm:ss')}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <NavigateNextIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Typography variant="caption" color="text.secondary">
          Scan completed at {format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ScanResults;
