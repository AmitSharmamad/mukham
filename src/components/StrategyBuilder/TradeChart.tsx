import React from 'react';
import { useTheme, Paper, Box, Typography, alpha } from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend,
  ScatterController,
  LineController,
  ChartOptions
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { BacktestResult } from '../../types/strategy';
import { Info } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ScatterController,
  LineController
);

interface TradeChartProps {
  backtestResults: BacktestResult;
}

interface TradePoint {
  x: number;
  y: number;
}

const TradeChart: React.FC<TradeChartProps> = ({ backtestResults }) => {
  const theme = useTheme();
  const metrics = backtestResults.aggregatedMetrics;
  
  // Generate simulated trade data based on aggregated metrics
  const generateTradeData = () => {
    const initialCapital = 100000; // Assuming an initial capital of 100,000
    const totalTrades = metrics.totalTrades;
    const winRate = metrics.winRate;
    const avgWinAmount = (metrics.totalPnL / 100) * initialCapital / metrics.winningTrades;
    const avgLossAmount = (metrics.totalPnL / 100) * initialCapital / metrics.losingTrades * -1;

    // Generate trade sequence based on win rate (deterministic for demo)
    const trades: boolean[] = [];
    let wins = 0;
    
    for (let i = 0; i < totalTrades; i++) {
      // Ensure the exact win rate by distributing wins evenly
      const shouldWin = wins / (i + 1) < winRate;
      trades.push(shouldWin);
      if (shouldWin) wins++;
    }

    // Calculate capital after each trade
    const capitalHistory: number[] = [initialCapital];
    const winPoints: TradePoint[] = [];
    const lossPoints: TradePoint[] = [];

    let currentCapital = initialCapital;
    
    trades.forEach((isWin, index) => {
      if (isWin) {
        currentCapital += avgWinAmount;
        winPoints.push({ x: index + 1, y: currentCapital });
      } else {
        currentCapital -= avgLossAmount;
        lossPoints.push({ x: index + 1, y: currentCapital });
      }
      capitalHistory.push(currentCapital);
    });

    return {
      capitalHistory,
      winPoints,
      lossPoints,
      labels: Array.from({ length: totalTrades + 1 }, (_, i) => i.toString())
    };
  };

  const tradeData = generateTradeData();

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString('en-US', { 
              style: 'currency', 
              currency: 'INR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Trade Number',
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
      },
      y: {
        title: {
          display: true,
          text: 'Capital (₹)',
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
          },
          callback: (value) => {
            return (value as number).toLocaleString('en-US', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }
        },
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
      },
    },
  };

  const data = {
    labels: tradeData.labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'Capital',
        data: tradeData.capitalHistory,
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
      {
        type: 'scatter' as const,
        label: 'Profitable Trades',
        data: tradeData.winPoints,
        backgroundColor: theme.palette.success.main,
        borderColor: alpha(theme.palette.success.main, 0.8),
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        type: 'scatter' as const,
        label: 'Loss Trades',
        data: tradeData.lossPoints,
        backgroundColor: theme.palette.error.main,
        borderColor: alpha(theme.palette.error.main, 0.8),
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        height: 400,
        mb: 4,
        transition: 'all 0.3s ease',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        '&:hover': {
          boxShadow: theme.shadows[4],
          borderColor: alpha(theme.palette.primary.main, 0.2),
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Trade Performance Chart</Typography>
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <Info sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            Capital progression across trades with profit/loss indicators
          </Typography>
        </Box>
      </Box>
      <Box sx={{ height: 'calc(100% - 40px)' }}>
        <Chart type="line" options={options} data={data} />
      </Box>
    </Paper>
  );
};

export default TradeChart;