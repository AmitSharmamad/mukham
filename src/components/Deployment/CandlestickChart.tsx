import React, { useEffect, useRef, useState } from 'react';
import { useTheme, Box, Typography, CircularProgress, alpha } from '@mui/material';
import { Info } from '@mui/icons-material';
import { createChart, ColorType, LineStyle, LineSeries } from 'lightweight-charts';
import { DeploymentPositionLog, getDeploymentPositionLogs } from '../../services/deploymentService';

interface CandlestickChartProps {
  deploymentId: string;
  deploymentPositionId: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ deploymentId, deploymentPositionId }) => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartCreated, setChartCreated] = useState<boolean>(false);
  const [seriesColors, setSeriesColors] = useState<Record<string, string>>({});
  const [logs, setLogs] = useState<DeploymentPositionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<Record<string, any>>({});

  // Fetch logs data
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await getDeploymentPositionLogs(deploymentId, deploymentPositionId);
        setLogs(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchLogs();
  }, [deploymentId, deploymentPositionId]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = {};
        setChartCreated(false);
      }
    };
  }, []);

  // Initialize chart and add series
  useEffect(() => {
    if (!chartContainerRef.current || !logs.length || chartCreated) return;

    try {
      // Create chart
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
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
      
      // Get all unique indicators from logs
      const indicators = new Set<string>();
      logs.forEach(log => {
        Object.keys(log.results).forEach(key => indicators.add(key));
      });

      // Create series for each indicator
      const newSeriesColors: Record<string, string> = {};
      
      const colors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.info.main,
        theme.palette.warning.main
      ];
      
      Array.from(indicators).forEach((indicator, index) => {
        // Generate a color from theme palette for each indicator
        const color = colors[index % colors.length];
        newSeriesColors[indicator] = color;
        
        try {
          // Use the correct API for the chart library version
          const lineSeries = chart.addSeries(LineSeries);
          
          // Set series options after creation
          lineSeries.applyOptions({
            color: color,
            lineWidth: 2,
          });
          
          // Add data points
          const seriesData = logs
            .filter(log => log.results[indicator] !== undefined)
            .map(log => ({
              time: new Date(log.timestamp).getTime() / 1000,
              value: log.results[indicator]
            }));
          
          lineSeries.setData(seriesData as any);
          seriesRef.current[indicator] = lineSeries;
        } catch (err) {
          console.error(`Error creating series for ${indicator}:`, err);
        }
      });

      setSeriesColors(newSeriesColors);
      
      // Fit content
      chart.timeScale().fitContent();
      
      setChartCreated(true);

      // Handle window resize
      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (err) {
      console.error('Error creating chart:', err);
      setError(err instanceof Error ? err.message : 'Failed to create chart');
    }
  }, [logs, theme, chartCreated]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!logs.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography>No data available for this position</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Indicator Values Chart</Typography>
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <Info sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            Chart showing indicator values over time
          </Typography>
        </Box>
      </Box>
      <Box 
        ref={chartContainerRef} 
        sx={{ 
          height: 400, 
          width: '100%',
          '& .tv-lightweight-charts': {
            fontFamily: theme.typography.fontFamily,
          }
        }} 
      />
      {Object.keys(seriesColors).length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {Object.keys(seriesColors).map((indicator) => (
            <Box 
              key={indicator}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                px: 2,
                py: 0.5,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  mr: 1,
                  backgroundColor: seriesColors[indicator]
                }} 
              />
              <Typography variant="body2">{indicator}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CandlestickChart;
