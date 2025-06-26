import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  Timeline,
  Speed,
  Wifi,
  WifiOff,
  ErrorOutline
} from '@mui/icons-material';
import { DeploymentMetrics } from '../../services/deploymentService';

interface MetricsTilesProps {
  metrics: DeploymentMetrics | null;
  realtimeMetrics?: any;
  aggregatedMetrics?: any;
  connectionStatus: string;
  loading: boolean;
  compact?: boolean;
}

interface MetricTileProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactElement;
  color: 'success' | 'error' | 'warning' | 'info' | 'primary';
  loading?: boolean;
  isLive?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  progress?: number;
}

const MetricTile: React.FC<MetricTileProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  loading = false,
  isLive = false,
  trend,
  progress
}) => {
  const theme = useTheme();

  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case 'success': return theme.palette.success.main;
      case 'error': return theme.palette.error.main;
      case 'warning': return theme.palette.warning.main;
      case 'info': return theme.palette.info.main;
      case 'primary': return theme.palette.primary.main;
      default: return theme.palette.grey[500];
    }
  };

  const colorValue = getColorValue(color);

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(colorValue, 0.05)} 0%, ${alpha(colorValue, 0.02)} 100%)`,
        border: `1px solid ${alpha(colorValue, 0.1)}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
          <Box sx={{ color: colorValue }}>
            {icon}
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            {isLive && (
              <Tooltip title="Real-time data">
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.success.main,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 }
                    }
                  }}
                />
              </Tooltip>
            )}
            {trend && (
              <Box sx={{ color: trend === 'up' ? 'success.main' : 'error.main' }}>
                {trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
              </Box>
            )}
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" gutterBottom>
          {title}
        </Typography>

        {loading ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            <Typography variant="body2">Loading...</Typography>
          </Box>
        ) : (
          <Typography variant="h6" fontWeight="bold" sx={{ color: colorValue, mb: 0.5 }}>
            {value}
          </Typography>
        )}

        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}

        {progress !== undefined && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: alpha(colorValue, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: colorValue
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const MetricsTiles: React.FC<MetricsTilesProps> = ({
  metrics,
  realtimeMetrics,
  aggregatedMetrics,
  connectionStatus,
  loading,
  compact = false
}) => {
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return `₹${value.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi sx={{ color: 'success.main' }} />;
      case 'connecting':
        return <CircularProgress size={16} />;
      case 'disconnected':
        return <WifiOff sx={{ color: 'error.main' }} />;
      default:
        return <ErrorOutline sx={{ color: 'warning.main' }} />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'disconnected': return 'error';
      default: return 'warning';
    }
  };

  // Calculate metrics with real-time data priority - don't default to 0
  const displayMetrics = {
    totalPnL: realtimeMetrics 
      ? realtimeMetrics.pnl + realtimeMetrics.unrealizedPnl 
      : metrics?.totalPnL ?? null,
    realizedPnL: realtimeMetrics?.pnl ?? aggregatedMetrics?.realizedPnL ?? null,
    unrealizedPnL: realtimeMetrics?.unrealizedPnl ?? aggregatedMetrics?.unrealizedPnL ?? null,
    openPositions: realtimeMetrics?.openPositions ?? aggregatedMetrics?.openPositions ?? null,
    totalTrades: realtimeMetrics?.totalTrades ?? metrics?.totalTrades ?? null,
    winRate: metrics?.winRate ?? null,
    maxDrawdown: metrics?.maxDrawdown ?? null,
    sharpeRatio: metrics?.sharpeRatio ?? null
  };

  const gridSize = compact ? 6 : { xs: 12, sm: 6, md: 4, lg: 2 };
  const maxTiles = compact ? 4 : 6;

  const tiles = [
    {
      title: 'Total P&L',
      value: displayMetrics.totalPnL !== null ? formatCurrency(displayMetrics.totalPnL) : 'N/A',
      subtitle: realtimeMetrics && displayMetrics.realizedPnL !== null && displayMetrics.unrealizedPnL !== null 
        ? `R: ${formatCurrency(displayMetrics.realizedPnL)} | U: ${formatCurrency(displayMetrics.unrealizedPnL)}` 
        : undefined,
      icon: <AccountBalance />,
      color: displayMetrics.totalPnL !== null ? (displayMetrics.totalPnL >= 0 ? 'success' : 'error') : 'info',
      isLive: !!realtimeMetrics,
      trend: displayMetrics.totalPnL !== null ? (displayMetrics.totalPnL >= 0 ? 'up' : 'down') : 'neutral'
    },
    {
      title: 'Open Positions',
      value: displayMetrics.openPositions ?? 'N/A',
      icon: <ShowChart />,
      color: 'primary',
      isLive: !!realtimeMetrics
    },
    {
      title: 'Total Trades',
      value: displayMetrics.totalTrades ?? 'N/A',
      icon: <Timeline />,
      color: 'info',
      isLive: !!realtimeMetrics
    },
    {
      title: 'Win Rate',
      value: displayMetrics.winRate !== null ? formatPercentage(displayMetrics.winRate) : 'N/A',
      icon: <TrendingUp />,
      color: displayMetrics.winRate !== null 
        ? (displayMetrics.winRate >= 0.6 ? 'success' : displayMetrics.winRate >= 0.4 ? 'warning' : 'error')
        : 'info',
      progress: displayMetrics.winRate !== null ? displayMetrics.winRate * 100 : undefined
    },
    {
      title: 'Max Drawdown',
      value: displayMetrics.maxDrawdown !== null ? formatCurrency(Math.abs(displayMetrics.maxDrawdown)) : 'N/A',
      icon: <TrendingDown />,
      color: displayMetrics.maxDrawdown !== null 
        ? (Math.abs(displayMetrics.maxDrawdown) <= 1000 ? 'success' : Math.abs(displayMetrics.maxDrawdown) <= 5000 ? 'warning' : 'error')
        : 'info'
    }
  ].slice(0, maxTiles);

  return (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          Live Metrics
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {tiles.map((tile, index) => (
          <Grid item {...(typeof gridSize === 'object' ? gridSize : { xs: gridSize })} key={index}>
            <MetricTile
              title={tile.title}
              value={tile.value}
              subtitle={tile.subtitle}
              icon={tile.icon}
              color={tile.color as any}
              loading={loading}
              isLive={tile.isLive}
              trend={tile.trend as any}
              progress={tile.progress}
            />
          </Grid>
        ))}
      </Grid>

      {!compact && aggregatedMetrics && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Position Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">Total</Typography>
              <Typography variant="body2" fontWeight="medium">{aggregatedMetrics.totalPositions}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">Open</Typography>
              <Typography variant="body2" fontWeight="medium" color="primary.main">{aggregatedMetrics.openPositions}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">Winning</Typography>
              <Typography variant="body2" fontWeight="medium" color="success.main">{aggregatedMetrics.winningPositions}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" color="text.secondary">Losing</Typography>
              <Typography variant="body2" fontWeight="medium" color="error.main">{aggregatedMetrics.losingPositions}</Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default MetricsTiles;
