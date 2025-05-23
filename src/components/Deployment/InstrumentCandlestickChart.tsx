import React, { useEffect, useRef, useState } from 'react';
import { useTheme, Box, Typography, CircularProgress, alpha } from '@mui/material';
import { Info } from '@mui/icons-material';
import { 
  createChart, 
  ColorType, 
  LineStyle, 
  IChartApi, 
  ISeriesApi,
  Time
} from 'lightweight-charts';
import { getInstrumentData, OHLC } from '../../services/instrumentService';

interface InstrumentCandlestickChartProps {
  instrumentId: number | string;
  title?: string;
  subtitle?: string;
  height?: number;
}

const InstrumentCandlestickChart: React.FC<InstrumentCandlestickChartProps> = ({ 
  instrumentId,
  title = 'Price Chart',
  subtitle = 'Candlestick chart showing price movement',
  height = 400
}) => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instrumentData, setInstrumentData] = useState<OHLC[]>([]);
  const [instrumentName, setInstrumentName] = useState<string>('');
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // Fetch instrument data
  useEffect(() => {
    const fetchInstrumentData = async () => {
      try {
        setLoading(true);
        const data = await getInstrumentData(instrumentId);
        console.log('Fetched instrument data:', data['data']);
        setInstrumentData(data['data'] || []);
        setInstrumentName(data.name || `Instrument ${instrumentId}`);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching instrument data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstrumentData();
  }, [instrumentId]);

  // Initialize chart and add series
  useEffect(() => {
    if (!chartContainerRef.current || loading || !instrumentData.length) return;

    try {
      // Clear previous chart if exists
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }

      // Create chart
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height,
        layout: {
          background: { type: ColorType.Solid, color: theme.palette.background.paper },
          textColor: theme.palette.text.primary,
        },
        grid: {
          vertLines: {
            color: alpha(theme.palette.divider, 0.1),
          },
          horzLines: {
            color: alpha(theme.palette.divider, 0.1),
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
        upColor: theme.palette.success.main,
        downColor: theme.palette.error.main,
        borderUpColor: theme.palette.success.main,
        borderDownColor: theme.palette.error.main,
        wickUpColor: theme.palette.success.main,
        wickDownColor: theme.palette.error.main,
      });
      
      seriesRef.current = candlestickSeries;

      // Format the data for candlestick chart
      const formattedData = instrumentData.map(item => ({
        time: item.time as Time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close
      }));

      // Set data
      candlestickSeries.setData(formattedData);
      
      // Fit content
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
      setError(err instanceof Error ? err.message : 'Failed to create chart');
    }
  }, [instrumentData, loading, theme, height]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  console.log('from here -> ', instrumentData.length);

  if (!instrumentData.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <Typography>No data available for this instrument</Typography>
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
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {instrumentName}
        </Typography>
      </Box>
    </Box>
  );
};

export default InstrumentCandlestickChart;
