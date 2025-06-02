import React from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Grid,
  Chip
} from '@mui/material';
import { Refresh, Download } from '@mui/icons-material';
import { BacktestResult, Instrument } from '../../types/strategy';
import MetricsSection from './MetricsSection';

interface BacktestResultsDisplayProps {
  isBacktesting: boolean;
  backtestResults: BacktestResult | null;
  rawBacktestData: any;
  selectedInstruments: Instrument[];
  deployingInstruments: Set<number>;
  deploymentStatuses: Map<number, boolean>;
  expandedInstrument: number | null;
  showingPositions: boolean;
  backtestResultsRef: React.RefObject<HTMLDivElement | null>;
  timeframe?: string;
  strategyId?: string;
  onTogglePositions: (instrumentId: number) => void;
  onDeploy: (instrumentId: number) => void;
  onDeployAll: () => void;
  onRefreshDeploymentStatus: () => void;
}

export const BacktestResultsDisplay: React.FC<BacktestResultsDisplayProps> = ({
  isBacktesting,
  backtestResults,
  rawBacktestData,
  selectedInstruments,
  deployingInstruments,
  deploymentStatuses,
  expandedInstrument,
  showingPositions,
  backtestResultsRef,
  timeframe,
  strategyId,
  onTogglePositions,
  onDeploy,
  onDeployAll,
  onRefreshDeploymentStatus
}) => {
  // Function to handle Excel export
  const handleExportToExcel = async () => {
    if (!strategyId) {
      console.error('Strategy ID is required for export');
      return;
    }

    try {
      const response = await fetch(`/api/backtest/export/indicators?strategy_id=${strategyId}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the filename from the response header or use a default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'backtest_data.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  // Return loading animation if we're still backtesting
  if (isBacktesting) {
    return (
      <Box 
        ref={backtestResultsRef}
        sx={{ 
          mt: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 8
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6">Running Backtest...</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we simulate your strategy on historical data.
        </Typography>
      </Box>
    );
  }

  if (!backtestResults) return null;

  return (
    <Box ref={backtestResultsRef} sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Backtest Results</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleExportToExcel}
            disabled={!strategyId}
          >
            <Download />
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={onRefreshDeploymentStatus}
          >
            <Refresh />
          </Button>
        </Box>
      </Box>
      <TableContainer 
        component={Paper}
        sx={{ 
          animation: 'fadeIn 0.8s ease-in-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instrument</TableCell>
              <TableCell align="right">Total Trades</TableCell>
              <TableCell align="right">Win/Loss</TableCell>
              <TableCell align="right">Win Rate</TableCell>
              <TableCell align="right">Profit Factor</TableCell>
              <TableCell align="right">Total P&L</TableCell>
              <TableCell align="right">Max Drawdown</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell align="right"><strong>{backtestResults.aggregatedMetrics.totalTrades}</strong></TableCell>
              <TableCell align="right">
                <strong>
                  {backtestResults.aggregatedMetrics.winningTrades} / {backtestResults.aggregatedMetrics.losingTrades}
                </strong>
              </TableCell>
              <TableCell align="right"><strong>{(backtestResults.aggregatedMetrics.winRate * 100).toFixed(2)}%</strong></TableCell>
              <TableCell align="right"><strong>{backtestResults.aggregatedMetrics.profitFactor.toFixed(2)}</strong></TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  color: backtestResults.aggregatedMetrics.totalPnL >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}
              >
                {backtestResults.aggregatedMetrics.totalPnL.toFixed(2)}
              </TableCell>
              <TableCell align="right"><strong>{backtestResults.aggregatedMetrics.maxDrawdown.toFixed(2)}%</strong></TableCell>
              <TableCell align="center">
                {(() => {
                  const undeployedCount = backtestResults.results.filter(
                    result => !deploymentStatuses.get(result.instrumentId)
                  ).length;
                  
                  if (undeployedCount === 0) {
                    return (
                      <Chip
                        label="All Deployed"
                        color="success"
                        size="small"
                        variant="filled"
                      />
                    );
                  }
                  
                  return (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={onDeployAll}
                      disabled={deployingInstruments.size > 0}
                    >
                      {deployingInstruments.size > 0 ? (
                        <CircularProgress size={20} />
                      ) : `Deploy ${undeployedCount === backtestResults.results.length ? 'All' : undeployedCount}`}
                    </Button>
                  );
                })()}
              </TableCell>
            </TableRow>
            {backtestResults.results.map((result) => (
              <React.Fragment key={result.instrumentId}>
                <TableRow 
                  hover
                  onClick={() => onTogglePositions(result.instrumentId)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{result.instrumentName}</TableCell>
                  <TableCell align="right">{result.totalTrades}</TableCell>
                  <TableCell align="right">
                    {result.winningTrades} / {result.losingTrades}
                  </TableCell>
                  <TableCell align="right">{(result.winRate * 100).toFixed(2)}%</TableCell>
                  <TableCell align="right">{result.profitFactor.toFixed(2)}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: result.totalPnL >= 0 ? 'success.main' : 'error.main'
                    }}
                  >
                    {result.totalPnL.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{result.maxDrawdown.toFixed(2)}%</TableCell>
                  <TableCell align="center">
                    {deploymentStatuses.get(result.instrumentId) ? (
                      <Chip
                        label="Deployed"
                        color="success"
                        size="small"
                        variant="filled"
                      />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          onDeploy(result.instrumentId);
                        }}
                        disabled={deployingInstruments.has(result.instrumentId)}
                      >
                        {deployingInstruments.has(result.instrumentId) ? (
                          <CircularProgress size={20} />
                        ) : 'Deploy'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Add Metrics Section below the table */}
      <MetricsSection
        backtestResults={backtestResults}
        rawBacktestData={rawBacktestData}
        instruments={selectedInstruments}
        timeframe={timeframe}
      />
      
      {/* Performance Charts Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Win/Loss Ratio</Typography>
              <Box sx={{ 
                display: 'flex', 
                height: 40, 
                borderRadius: 1, 
                overflow: 'hidden', 
                mb: 1
              }}>
                <Box 
                  sx={{ 
                    width: `${(backtestResults.aggregatedMetrics.winRate || 0) * 100}%`, 
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  {backtestResults.aggregatedMetrics.winningTrades || 0}
                </Box>
                <Box 
                  sx={{ 
                    width: `${100 - ((backtestResults.aggregatedMetrics.winRate || 0) * 100)}%`, 
                    bgcolor: 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  {backtestResults.aggregatedMetrics.losingTrades || 0}
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Win Rate: {((backtestResults.aggregatedMetrics.winRate || 0) * 100).toFixed(2)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Key Statistics</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Trades:</Typography>
                  <Typography variant="body2">{backtestResults.aggregatedMetrics.totalTrades || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Profit Factor:</Typography>
                  <Typography variant="body2">{(backtestResults.aggregatedMetrics.profitFactor || 0).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Max Drawdown:</Typography>
                  <Typography variant="body2">{(backtestResults.aggregatedMetrics.maxDrawdown || 0).toFixed(2)}%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
