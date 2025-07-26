import { useEffect, useState, useCallback } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';
import { BalanceUpdatedData, PositionsSummaryData, WebEvent } from '../types/websocket';

export interface PortfolioData {
  balance: BalanceUpdatedData | null;
  positionsSummary: PositionsSummaryData | null;
  lastUpdated: string | null;
}

export const usePortfolioWebSocket = () => {
  const { subscribe, unsubscribe, updatePageContext, connectionStatus, isConnected } = useWebSocketContext();
  
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    balance: null,
    positionsSummary: null,
    lastUpdated: null
  });

  // Set page context to portfolio when hook is used
  useEffect(() => {
    if (updatePageContext) {
      updatePageContext({
        page_type: 'portfolio',
        page_params: {}
      });
    }
  }, [updatePageContext]);

  // Event handlers
  const handleBalanceUpdate = useCallback((event: WebEvent) => {
    const data = event.data as BalanceUpdatedData;
    setPortfolioData(prev => ({
      ...prev,
      balance: data,
      lastUpdated: event.timestamp
    }));
  }, []);

  const handlePositionsSummaryUpdate = useCallback((event: WebEvent) => {
    const data = event.data as PositionsSummaryData;
    setPortfolioData(prev => ({
      ...prev,
      positionsSummary: data,
      lastUpdated: event.timestamp
    }));
  }, []);

  // Subscribe to portfolio events
  useEffect(() => {
    if (!subscribe || !unsubscribe) return;
    
    subscribe('portfolio.balance_updated', handleBalanceUpdate);
    subscribe('portfolio.positions_summary_updated', handlePositionsSummaryUpdate);

    return () => {
      unsubscribe('portfolio.balance_updated', handleBalanceUpdate);
      unsubscribe('portfolio.positions_summary_updated', handlePositionsSummaryUpdate);
    };
  }, [subscribe, unsubscribe, handleBalanceUpdate, handlePositionsSummaryUpdate]);

  const getTotalPnL = useCallback((): number => {
    if (!portfolioData.balance || !portfolioData.positionsSummary) return 0;
    return portfolioData.balance.realized_pnl + portfolioData.positionsSummary.total_unrealized_pnl;
  }, [portfolioData]);

  const getMarginUtilization = useCallback((): number => {
    if (!portfolioData.balance) return 0;
    const totalBalance = portfolioData.balance.total_balance;
    const usedMargin = portfolioData.balance.used_margin;
    return totalBalance > 0 ? (usedMargin / totalBalance) * 100 : 0;
  }, [portfolioData]);

  return {
    ...portfolioData,
    getTotalPnL,
    getMarginUtilization,
    connectionStatus,
    isConnected
  };
};
