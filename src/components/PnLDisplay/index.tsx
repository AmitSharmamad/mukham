import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getDeployments, getDeploymentMetrics } from '../../services/deploymentService';
import { aggregateMetrics } from '../../utils/metricsUtils';
import { formatCurrency } from '../../utils/metricsUtils';

interface PnLDisplayProps {
  size?: 'small' | 'medium' | 'large';
}

export default function PnLDisplay({ size = 'medium' }: PnLDisplayProps) {
  const theme = useTheme();
  const [totalPnL, setTotalPnL] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fontSize = size === 'small' ? '0.875rem' : size === 'large' ? '1.25rem' : '1rem';

  useEffect(() => {
    let isMounted = true;

    const fetchPnLData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch deployments to get active strategies
        const deployments = await getDeployments();
        const activeDeployments = deployments.filter(deployment => deployment.isActive);

        if (activeDeployments.length > 0) {
          // Fetch metrics for all active deployments
          const metricsPromises = activeDeployments.map(deployment => 
            getDeploymentMetrics(deployment.id)
          );

          const metricsResults = await Promise.all(metricsPromises);

          // Aggregate metrics across all deployments
          const aggregatedMetrics = aggregateMetrics(metricsResults);

          if (isMounted) {
            setTotalPnL(aggregatedMetrics.totalPnL);
          }
        } else {
          // No active deployments
          if (isMounted) {
            setTotalPnL(0);
          }
        }
      } catch (err) {
        console.error('Error fetching P&L data:', err);
        if (isMounted) {
          setError('Failed to load P&L');
          // Fallback to mock data for development
          setTotalPnL(12458.75);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPnLData();

    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(fetchPnLData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Determine color based on P&L value
  const getPnLColor = (value: number) => {
    if (value > 0) return theme.palette.success.main;
    if (value < 0) return theme.palette.error.main;
    return theme.palette.text.primary;
  };

  // Format P&L value
  const formatPnL = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `₹${(value / 1000000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    } else {
      return `₹${value.toFixed(2)}`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <CircularProgress size={16} />
      </Box>
    );
  }

  if (error || totalPnL === null) {
    return (
      <Tooltip title={error || 'P&L data unavailable'}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize 
            }}
          >
            P&L: --
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Total Portfolio P&L across all active strategies">
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize,
            mr: 0.5
          }}
        >
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: getPnLColor(totalPnL),
            fontWeight: 'bold',
            fontSize
          }}
        >
          {formatPnL(totalPnL)}
        </Typography>
      </Box>
    </Tooltip>
  );
}
