import React from 'react';
import { useTheme, Paper, Box, Typography } from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BacktestResult } from '../../types/strategy';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface CapitalProgression {
  capital_after: number;
  capital_before: number;
  capital_change: number;
  direction: string;
  entry_price: number;
  entry_time: string;
  exit_price: number;
  exit_reason: string;
  exit_time: string;
  net_profit_loss: number;
  position_id: string;
  position_index: number;
  position_size: number;
}

interface TradeChartProps {
  backtestResults: BacktestResult;
  capitalProgression?: CapitalProgression[];
}

interface TradePoint {
  x: number;
  y: number;
}

const TradeChart: React.FC<TradeChartProps> = ({ backtestResults, capitalProgression }) => {
  const theme = useTheme();
  
  // Create simple line chart data using capital_after values
  const createChartData = () => {
    if (!capitalProgression || capitalProgression.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Capital',
          data: [0],
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.main,
          tension: 0.1,
        }]
      };
    }

    // Create labels (trade numbers)
    const labels = ['Start', ...capitalProgression.map((_, index) => `Trade ${index + 1}`)];
    
    // Create data points starting with initial capital, then capital_after for each trade
    const data = [
      capitalProgression[0]?.capital_before || 0,
      ...capitalProgression.map(trade => trade.capital_after)
    ];

    return {
      labels,
      datasets: [{
        label: 'Portfolio Value',
        data,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    };
  };

  const chartData = createChartData();

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary,
        }
      },
      title: {
        display: true,
        text: 'Capital Progression',
        color: theme.palette.text.primary,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
        }
      },
      y: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          callback: function(value) {
            return `₹${Number(value).toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom color="text.primary">
        Trade Chart
      </Typography>
      
      <Box sx={{ height: 400, width: '100%' }}>
        <Line data={chartData} options={options} />
      </Box>
      
      {(!capitalProgression || capitalProgression.length === 0) && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          No backtest data available. Run a backtest to see the capital progression chart.
        </Typography>
      )}
    </Paper>
  );
};

export default TradeChart;