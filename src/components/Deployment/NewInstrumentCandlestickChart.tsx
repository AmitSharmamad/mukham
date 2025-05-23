import React, { useEffect, useRef, useState } from 'react';
import { useTheme, Box, Typography, CircularProgress, alpha, Button, Pagination } from '@mui/material';
import { Info } from '@mui/icons-material';
import { 
  createChart, 
  ColorType, 
  LineStyle, 
  IChartApi, 
  ISeriesApi,
  Time
} from 'lightweight-charts';
import { getInstrumentCandlesticks, OHLC } from '../../services/instrumentService';

interface InstrumentCandlestickChartProps {
  instrumentId: number | string;
  title?: string;
  subtitle?: string;
  height?: number;
  initialPageSize?: number;
}

/**
 * Component that displays a candlestick chart for a given instrument ID
 * Uses the new API format from /api/instrument/{id}
 */
const NewInstrumentCandlestickChart: React.FC<InstrumentCandlestickChartProps> = ({ 
  instrumentId,
  title = 'Price Chart',
  subtitle = 'Candlestick chart showing price movement',
  height = 400,
  initialPageSize = 100
}) => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candlestickData, setCandlestickData] = useState<OHLC[]>([]);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(initialPageSize);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Fetch instrument data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching data for instrument ID: ${instrumentId}, page: ${page}, pageSize: ${pageSize}`);
        const result = await getInstrumentCandlesticks(instrumentId, page, pageSize);
        console.log('Fetched result:', result);
        
        if (result.data.length === 0) {
          console.warn('No data returned from API');
        }
        
        setCandlestickData(result.data);
        setTotalPages(result.pagination.totalPages);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error fetching instrument data:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [instrumentId, page, pageSize]);

  // Initialize chart and add series
  useEffect(() => {
    if (!chartContainerRef.current || loading || !candlestickData.length) return;

    try {
      // Clear previous chart if exists
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }

      // Create chart based on example
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height,
        layout: {
          background: { 
            type: ColorType.Solid, 
            color: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff' 
          },
          textColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#333333',
        },
        grid: {
          vertLines: {
            color: theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.1) : '#e1e1e1',
          },
          horzLines: {
            color: theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.1) : '#e1e1e1',
          },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: theme.palette.divider,
        },
        rightPriceScale: {
          borderColor: theme.palette.divider,
        },
        crosshair: {
          vertLine: {
            width: 1,
            color: alpha(theme.palette.primary.main, 0.4),
            style: LineStyle.Dashed,
          },
          horzLine: {
            width: 1,
            color: alpha(theme.palette.primary.main, 0.4),
            style: LineStyle.Dashed,
          },
        },
      });

      chartRef.current = chart;
      
      // Create candlestick series - use type assertion to fix the TypeScript error
      const candlestickSeries = (chart as any).addCandlestickSeries({
        upColor: theme.palette.mode === 'dark' ? theme.palette.success.main : '#26a69a',
        downColor: theme.palette.mode === 'dark' ? theme.palette.error.main : '#ef5350',
        borderUpColor: theme.palette.mode === 'dark' ? theme.palette.success.main : '#26a69a',
        borderDownColor: theme.palette.mode === 'dark' ? theme.palette.error.main : '#ef5350',
        wickUpColor: theme.palette.mode === 'dark' ? theme.palette.success.main : '#26a69a',
        wickDownColor: theme.palette.mode === 'dark' ? theme.palette.error.main : '#ef5350',
      });
      
      seriesRef.current = candlestickSeries;

      // Format the data for candlestick chart
      const formattedData = candlestickData.map(item => {
        // Ensure time is properly formatted for the chart
        let timeValue: Time = item.time as Time;
        
        // Log problematic values for debugging
        if (!item.time || isNaN(Number(item.time))) {
          console.warn(`Invalid time value detected: ${item.time}, type: ${typeof item.time}`);
        }
        
        // Format the chart data entry
        return {
          time: timeValue,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close
        };
      });

      console.log('Formatted data for chart:', formattedData);

      // Set data
      candlestickSeries.setData(formattedData);
      
      // Fit content to make sure all data is visible
      chart.timeScale().fitContent();
      
      // Handle window resize
      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chart) {
          chart.remove();
        }
      };
    } catch (err) {
      console.error('Error creating chart:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown chart error';
      setError(`Failed to create chart: ${errorMessage}. Please try again.`);
    }
  }, [candlestickData, loading, theme, height]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading && !loadingMore) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height, padding: 2 }}>
        <Typography color="error" variant="h6" gutterBottom>Error Loading Chart</Typography>
        <Typography color="error" sx={{ textAlign: 'center', maxWidth: '80%' }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }} 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  console.log('Candlestick data:', candlestickData);

  if (!candlestickData.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height }}>
        <Typography variant="h6" gutterBottom>No Data Available</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: '80%' }}>
          No candlestick data is available for this instrument (ID: {instrumentId}).
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 2 }} 
          onClick={() => setPage(1)}
        >
          Reset Page
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <Info sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Box 
        ref={chartContainerRef} 
        sx={{ 
          height, 
          width: '100%', 
          '& .tv-lightweight-charts': {
            fontFamily: theme.typography.fontFamily,
          }
        }} 
      />
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            size="small"
          />
        </Box>
      )}
    </Box>
  );
};

export default NewInstrumentCandlestickChart;
