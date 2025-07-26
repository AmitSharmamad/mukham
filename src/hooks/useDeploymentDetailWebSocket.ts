import { useEffect, useState, useCallback } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';
import { 
  PositionOpenedData, 
  PositionClosedData, 
  SignalDetectedData, 
  MetricsUpdatedData, 
  ChartUpdatedData, 
  LogEntryData,
  WebEvent 
} from '../types/websocket';

export interface DeploymentDetailData {
  positions: {
    opened: PositionOpenedData[];
    closed: PositionClosedData[];
  };
  signals: SignalDetectedData[];
  metrics: MetricsUpdatedData | null;
  chartData: ChartUpdatedData[];
  logs: LogEntryData[];
  lastUpdated: string | null;
}

export const useDeploymentDetailWebSocket = (deploymentId: string) => {
  const { subscribe, unsubscribe, updatePageContext, connectionStatus, isConnected } = useWebSocketContext();
  
  const [deploymentDetailData, setDeploymentDetailData] = useState<DeploymentDetailData>({
    positions: {
      opened: [],
      closed: []
    },
    signals: [],
    metrics: null,
    chartData: [],
    logs: [],
    lastUpdated: null
  });

  // Set page context to deployment_detail when hook is used
  useEffect(() => {
    if (updatePageContext) {
      updatePageContext({
        page_type: 'deployment_detail',
        page_params: { deployment_id: deploymentId }
      });
    }
  }, [updatePageContext, deploymentId]);

  // Event handlers
  const handlePositionOpened = useCallback((event: WebEvent) => {
    const data = event.data as PositionOpenedData;
    setDeploymentDetailData(prev => ({
      ...prev,
      positions: {
        ...prev.positions,
        opened: [data, ...prev.positions.opened.slice(0, 49)] // Keep last 50
      },
      lastUpdated: event.timestamp
    }));
  }, []);

  const handlePositionClosed = useCallback((event: WebEvent) => {
    const data = event.data as PositionClosedData;
    setDeploymentDetailData(prev => ({
      ...prev,
      positions: {
        ...prev.positions,
        closed: [data, ...prev.positions.closed.slice(0, 49)] // Keep last 50
      },
      lastUpdated: event.timestamp
    }));
  }, []);

  const handleSignalDetected = useCallback((event: WebEvent) => {
    const data = event.data as SignalDetectedData;
    setDeploymentDetailData(prev => ({
      ...prev,
      signals: [data, ...prev.signals.slice(0, 99)], // Keep last 100 signals
      lastUpdated: event.timestamp
    }));
  }, []);

  const handleMetricsUpdated = useCallback((event: WebEvent) => {
    const data = event.data as MetricsUpdatedData;
    setDeploymentDetailData(prev => ({
      ...prev,
      metrics: data,
      lastUpdated: event.timestamp
    }));
  }, []);

  const handleChartUpdated = useCallback((event: WebEvent) => {
    const data = event.data as ChartUpdatedData;
    setDeploymentDetailData(prev => ({
      ...prev,
      chartData: [data, ...prev.chartData.slice(0, 999)], // Keep last 1000 data points
      lastUpdated: event.timestamp
    }));
  }, []);

  const handleLogEntry = useCallback((event: WebEvent) => {
    const data = event.data as LogEntryData;
    setDeploymentDetailData(prev => ({
      ...prev,
      logs: [data, ...prev.logs.slice(0, 199)], // Keep last 200 logs
      lastUpdated: event.timestamp
    }));
  }, []);

  // Subscribe to deployment detail events
  useEffect(() => {
    if (!subscribe || !unsubscribe) return;
    
    subscribe('deployment_detail.position_opened', handlePositionOpened);
    subscribe('deployment_detail.position_closed', handlePositionClosed);
    subscribe('deployment_detail.signal_detected', handleSignalDetected);
    subscribe('deployment_detail.metrics_updated', handleMetricsUpdated);
    subscribe('deployment_detail.chart_updated', handleChartUpdated);
    subscribe('deployment_detail.log_entry', handleLogEntry);

    return () => {
      unsubscribe('deployment_detail.position_opened', handlePositionOpened);
      unsubscribe('deployment_detail.position_closed', handlePositionClosed);
      unsubscribe('deployment_detail.signal_detected', handleSignalDetected);
      unsubscribe('deployment_detail.metrics_updated', handleMetricsUpdated);
      unsubscribe('deployment_detail.chart_updated', handleChartUpdated);
      unsubscribe('deployment_detail.log_entry', handleLogEntry);
    };
  }, [
    subscribe, 
    unsubscribe, 
    handlePositionOpened, 
    handlePositionClosed, 
    handleSignalDetected, 
    handleMetricsUpdated, 
    handleChartUpdated, 
    handleLogEntry
  ]);

  const getOpenPositions = useCallback((): PositionOpenedData[] => {
    // Filter out positions that have been closed
    const closedPositionIds = new Set(deploymentDetailData.positions.closed.map(p => p.position_id));
    return deploymentDetailData.positions.opened.filter(p => !closedPositionIds.has(p.position_id));
  }, [deploymentDetailData.positions]);

  const getRecentSignals = useCallback((count = 10): SignalDetectedData[] => {
    return deploymentDetailData.signals.slice(0, count);
  }, [deploymentDetailData.signals]);

  const getRecentLogs = useCallback((level?: string, count = 50): LogEntryData[] => {
    let filteredLogs = deploymentDetailData.logs;
    if (level) {
      filteredLogs = deploymentDetailData.logs.filter(log => log.level === level);
    }
    return filteredLogs.slice(0, count);
  }, [deploymentDetailData.logs]);

  const clearData = useCallback(() => {
    setDeploymentDetailData({
      positions: { opened: [], closed: [] },
      signals: [],
      metrics: null,
      chartData: [],
      logs: [],
      lastUpdated: null
    });
  }, []);

  return {
    ...deploymentDetailData,
    getOpenPositions,
    getRecentSignals,
    getRecentLogs,
    clearData,
    connectionStatus,
    isConnected
  };
};
