import React, { useState, useMemo } from 'react';
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
import PositionTable from './PositionTable';
import MetricsTiles from './MetricsTiles';
import QuickActions from './QuickActions';

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
  const { getDeploymentMetrics, connectionStatus } = useDeploymentEvents();
  const [tabValue, setTabValue] = useState(0);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  
  // Responsive breakpoints
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get real-time metrics
  const realtimeMetrics = getDeploymentMetrics(deploymentId);

  // Categorize positions
  const openPositions = useMemo(() => 
    positions.filter(p => p.status === 'OPEN'), [positions]
  );
  
  const closedPositions = useMemo(() => 
    positions.filter(p => p.status === 'CLOSED'), [positions]
  );

  // Calculate aggregated metrics
  const aggregatedMetrics = useMemo(() => {
    if (!positions.length) return null;
    
    const totalPnL = positions.reduce((sum, p) => sum + (p.pnl || 0), 0);
    const unrealizedPnL = realtimeMetrics?.unrealizedPnl || 0;
    
    return {
      totalPositions: positions.length,
      openPositions: openPositions.length,
      closedPositions: closedPositions.length,
      totalPnL: totalPnL + unrealizedPnL,
      realizedPnL: totalPnL,
      unrealizedPnL,
      winningPositions: positions.filter(p => (p.pnl || 0) > 0).length,
      losingPositions: positions.filter(p => (p.pnl || 0) < 0).length,
    };
  }, [positions, openPositions, closedPositions, realtimeMetrics]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePositionSelect = (positionIds: number[]) => {
    setSelectedPositions(positionIds);
  };

  const handleBulkClose = async () => {
    if (!onClosePosition) return;
    
    const positionsToClose = positions.filter(p => selectedPositions.includes(p.id));
    
    for (const position of positionsToClose) {
      try {
        await onClosePosition(position);
      } catch (error) {
        console.error(`Failed to close position ${position.id}:`, error);
      }
    }
    
    setSelectedPositions([]);
  };

  // Desktop Layout (Split-screen)
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

        {/* Main Content Area */}
        <Box sx={{ display: 'flex', flex: 1, gap: 2, mt: 2 }}>
          {/* Positions Table - 70% */}
          <Box sx={{ flex: '0 0 70%' }}>
            <PositionTable
              positions={positions}
              loading={positionsLoading}
              onClosePosition={onClosePosition}
              selectedPositions={selectedPositions}
              onPositionSelect={handlePositionSelect}
              realtimeMetrics={realtimeMetrics}
            />
          </Box>

          {/* Quick Actions Sidebar - 30% */}
          <Box sx={{ flex: '0 0 30%' }}>
            <QuickActions
              selectedPositions={selectedPositions}
              onBulkClose={handleBulkClose}
              onRefresh={onRefresh}
              positions={positions.filter(p => selectedPositions.includes(p.id))}
              connectionStatus={connectionStatus}
            />
          </Box>
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
              label={`All (${positions.length})`}
              sx={{ minHeight: 48 }}
            />
            <Tab 
              label="Actions"
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <PositionTable
            positions={openPositions}
            loading={positionsLoading}
            onClosePosition={onClosePosition}
            selectedPositions={selectedPositions}
            onPositionSelect={handlePositionSelect}
            realtimeMetrics={realtimeMetrics}
            compact={isMobile}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PositionTable
            positions={positions}
            loading={positionsLoading}
            onClosePosition={onClosePosition}
            selectedPositions={selectedPositions}
            onPositionSelect={handlePositionSelect}
            realtimeMetrics={realtimeMetrics}
            compact={isMobile}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <QuickActions
              selectedPositions={selectedPositions}
              onBulkClose={handleBulkClose}
              onRefresh={onRefresh}
              positions={positions.filter(p => selectedPositions.includes(p.id))}
              connectionStatus={connectionStatus}
              compact={isMobile}
            />
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default PositionsMetricsDashboard;
