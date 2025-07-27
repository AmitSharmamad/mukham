import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
  useMediaQuery
} from '@mui/material';
import { Position, DeploymentMetrics } from '../../services/deploymentService';
import { useDeploymentEvents } from '../../hooks/useDeploymentEvents';
import { usePositionsUpdater } from '../../hooks/usePositionsUpdater';
import PositionTable from './PositionTable';
import MetricsTiles from './MetricsTiles';

interface PositionsMetricsDashboardProps {
  deploymentId: string;
  positions: Position[];
  metrics: DeploymentMetrics | null;
  loading: boolean;
  positionsLoading: boolean;
  onClosePosition?: (position: Position) => Promise<void>;
  onRefresh?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ height: '100%' }}>
      {value === index && children}
    </div>
  );
}

const PositionsMetricsDashboard: React.FC<PositionsMetricsDashboardProps> = ({
  deploymentId,
  positions,
  metrics,
  loading,
  positionsLoading,
  onClosePosition,
  onRefresh
}) => {
  const theme = useTheme();
  const { getDeploymentMetrics, connectionStatus, events } = useDeploymentEvents();
  const { 
    updatePositionFromEvent, 
    applyUpdatesToPositions, 
    clearAllUpdates,
    hasUpdates,
    getUpdatedPositionIds 
  } = usePositionsUpdater();
  
  const [tabValue, setTabValue] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [lastEventProcessed, setLastEventProcessed] = useState<string>('');
  
  // Apply real-time updates to positions
  const updatedPositions = useMemo(() => {
    return applyUpdatesToPositions(positions);
  }, [positions, applyUpdatesToPositions]);
  
  // Update last updated time when positions change
  useEffect(() => {
    setLastUpdated(new Date());
  }, [positions]);

  // Responsive breakpoints
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get real-time metrics
  const realtimeMetrics = getDeploymentMetrics(deploymentId);

  // Listen for real-time events that affect this deployment
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[0];
      
      // Avoid processing the same event twice
      if (latestEvent.timestamp === lastEventProcessed) {
        return;
      }
      
      // Check if this event is for our deployment and affects positions
      if (latestEvent.deployment_id === deploymentId) {
        const positionAffectingEvents = [
          'position_opened',
          'position_closed',
          'position_update',
          'stop_loss_triggered',
          'target_profit_triggered',
          'eod_square_off'
        ];
        
        if (positionAffectingEvents.includes(latestEvent.event_type)) {
          console.log('Applying selective update for event:', latestEvent.event_type, 'Position ID:', latestEvent.data.position_id);
          
          // Apply selective update instead of full refresh
          updatePositionFromEvent(latestEvent, updatedPositions);
          setLastEventProcessed(latestEvent.timestamp);
          setLastUpdated(new Date());
          
          // Only do a full refresh for position_opened events or if we can't find the position
          if (latestEvent.event_type === 'position_opened' && 
              !updatedPositions.find(p => p.id === latestEvent.data.position_id)) {
            console.log('New position detected, triggering full refresh');
            const refreshTimeout = setTimeout(() => {
              if (onRefresh) {
                onRefresh();
                clearAllUpdates(); // Clear updates after full refresh
              }
            }, 1000);
            
            return () => clearTimeout(refreshTimeout);
          }
        }
      }
    }
  }, [events, deploymentId, updatePositionFromEvent, updatedPositions, lastEventProcessed, onRefresh, clearAllUpdates]);

  // Auto-refresh positions data every 2 minutes when connected (reduced frequency due to selective updates)
  useEffect(() => {
    if (connectionStatus === 'connected' && onRefresh) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing positions data (background sync)...');
        onRefresh();
      }, 120000); // 2 minutes instead of 30 seconds

      return () => clearInterval(interval);
    }
  }, [connectionStatus, onRefresh]);

  // Categorize positions using updated data
  const openPositions = useMemo(() => 
    updatedPositions.filter(p => p.status === 'OPEN'), [updatedPositions]
  );
  
  const closedPositions = useMemo(() => 
    updatedPositions.filter(p => p.status === 'CLOSED'), [updatedPositions]
  );

  // Calculate aggregated metrics using updated positions
  const aggregatedMetrics = useMemo(() => {
    if (!updatedPositions.length) return null;
    
    const totalPnL = updatedPositions.reduce((sum, p) => sum + (p.pnl || 0), 0);
    const unrealizedPnL = realtimeMetrics?.unrealizedPnl || 0;
    
    return {
      totalPositions: updatedPositions.length,
      openPositions: openPositions.length,
      closedPositions: closedPositions.length,
      totalPnL: totalPnL + unrealizedPnL,
      realizedPnL: totalPnL,
      unrealizedPnL,
      winningPositions: updatedPositions.filter(p => (p.pnl || 0) > 0).length,
      losingPositions: updatedPositions.filter(p => (p.pnl || 0) < 0).length,
    };
  }, [updatedPositions, openPositions, closedPositions, realtimeMetrics]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Desktop Layout (Full-width table)
  if (isDesktop) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Sticky Metrics Header */}
        <MetricsTiles
          metrics={metrics}
          realtimeMetrics={realtimeMetrics}
          aggregatedMetrics={aggregatedMetrics}
          connectionStatus={connectionStatus}
          loading={loading}
        />

        {/* Main Content Area - Full Width Table */}
        <Box sx={{ flex: 1, mt: 2 }}>
          <PositionTable
            positions={updatedPositions}
            loading={positionsLoading}
            onClosePosition={onClosePosition}
            realtimeMetrics={realtimeMetrics}
          />
        </Box>
      </Box>
    );
  }

  // Tablet/Mobile Layout (Tabbed)
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Compact Metrics Header */}
      <MetricsTiles
        metrics={metrics}
        realtimeMetrics={realtimeMetrics}
        aggregatedMetrics={aggregatedMetrics}
        connectionStatus={connectionStatus}
        loading={loading}
        compact={isMobile}
      />

      {/* Tabbed Interface */}
      <Card sx={{ flex: 1, mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab 
              label={`Open (${openPositions.length})`} 
              sx={{ minHeight: 48 }}
            />
            <Tab 
              label={`All (${updatedPositions.length})`}
              sx={{ minHeight: 48 }}
            />
          </Tabs>
          
          {/* Last Updated Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
            <Chip
              size="small"
              label={connectionStatus === 'connected' ? 'Connected' : connectionStatus}
              color={connectionStatus === 'connected' ? 'success' : 
                     connectionStatus === 'connecting' ? 'warning' : 'error'}
              variant="outlined"
            />
          </Box>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <PositionTable
            positions={openPositions}
            loading={positionsLoading}
            onClosePosition={onClosePosition}
            realtimeMetrics={realtimeMetrics}
            compact={isMobile}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PositionTable
            positions={updatedPositions}
            loading={positionsLoading}
            onClosePosition={onClosePosition}
            realtimeMetrics={realtimeMetrics}
            compact={isMobile}
          />
        </TabPanel>
      </Card>
    </Box>
  );
};

export default PositionsMetricsDashboard;
