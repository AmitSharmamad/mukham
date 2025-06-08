import React, { useState, useMemo } from 'react';
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
import Select from '../Select';

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

interface BacktestData {
  message: string;
  results: {
    instrument_id: number;
    instrument_name: string;
    metrics: {
      capital_progression: CapitalProgression[];
    };
  }[];
  strategy_id?: string;
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

interface TradeChartProps {
  backtestResults: BacktestResult;
  rawBacktestData?: BacktestData | null;
  instruments?: Instrument[];
}

interface TradePoint {
  x: number;
  y: number;
}

const TradeChart: React.FC<TradeChartProps> = ({ backtestResults, rawBacktestData, instruments = [] }) => {
  const theme = useTheme();
  
  // Helper function to get instrument name by ID
  const getInstrumentName = (instrumentId: number): string => {
    const instrument = instruments.find(inst => inst.exchange_security_id === Number(instrumentId));
    if (instrument) {
      // Use symbol as primary name, fallback to instrument name
      return instrument.symbol;
    }
    return `Instrument ${instrumentId}`;
  };
  
  // Extract available instruments from raw backtest data
  const availableInstruments = useMemo(() => {
    if (!rawBacktestData?.results) return [];
    
    return rawBacktestData.results.map(result => ({
      value: result.instrument_id,
      label: getInstrumentName(result.instrument_id)
    }));
  }, [rawBacktestData, instruments]);

  // State for selected instrument (default to first instrument or 'all')
  const [selectedInstrument, setSelectedInstrument] = useState<string | number>(() => {
    if (availableInstruments.length > 0) {
      return availableInstruments[0].value;
    }
    return 'all';
  });

  // Update selected instrument when available instruments change
  React.useEffect(() => {
    if (availableInstruments.length > 0 && selectedInstrument === 'all') {
      setSelectedInstrument(availableInstruments[0].value);
    }
  }, [availableInstruments]);

  // Get capital progression for selected instrument
  const getCapitalProgression = useMemo(() => {
    if (!rawBacktestData?.results) return [];
    
    if (selectedInstrument === 'all') {
      // Combine all instruments' capital progression
      const allProgression: CapitalProgression[] = [];
      rawBacktestData.results.forEach(result => {
        if (result.metrics?.capital_progression) {
          allProgression.push(...result.metrics.capital_progression);
        }
      });
      // Sort by position_index to maintain chronological order
      return allProgression.sort((a, b) => a.position_index - b.position_index);
    } else {
      // Get progression for specific instrument
      const instrumentResult = rawBacktestData.results.find(
        result => result.instrument_id === selectedInstrument
      );
      return instrumentResult?.metrics?.capital_progression || [];
    }
  }, [rawBacktestData, selectedInstrument]);

  // Create dropdown options including "All Instruments"
  const dropdownOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All Instruments' }];
    return [...options, ...availableInstruments];
  }, [availableInstruments]);
  
  // Create simple line chart data using capital_after values
  const createChartData = () => {
    const capitalProgression = getCapitalProgression;
    
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
        label: 'P/L Value',
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
        display: false,
      },
      title: {
        display: true,
        text: 'Profit/Loss Over Trade',
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="text.primary">
          Trade Chart
        </Typography>
        
        {/* Instrument Filter Dropdown */}
        {dropdownOptions.length > 1 && (
          <Box sx={{ minWidth: 200 }}>
            <Select
              label="Filter by Instrument"
              options={dropdownOptions}
              value={selectedInstrument}
              onChange={setSelectedInstrument}
              size="small"
            />
          </Box>
        )}
      </Box>
      
      <Box sx={{ height: 400, width: '100%' }}>
        <Line data={chartData} options={options} />
      </Box>
      
      {getCapitalProgression.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          No backtest data available for the selected instrument. Run a backtest to see the capital progression chart.
        </Typography>
      )}
    </Paper>
  );
};

export default TradeChart;