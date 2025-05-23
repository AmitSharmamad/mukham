import { DeploymentMetrics } from '../services/deploymentService';

/**
 * Aggregates metrics from multiple deployments
 * @param metricsArray Array of DeploymentMetrics objects
 * @returns Aggregated metrics
 */
export const aggregateMetrics = (metricsArray: (DeploymentMetrics | null)[]): DeploymentMetrics => {
  // Filter out null values
  const validMetrics = metricsArray.filter((m): m is DeploymentMetrics => m !== null);
  
  if (validMetrics.length === 0) {
    // Return default values if no valid metrics
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      profitFactor: 0,
      totalPnL: 0,
      maxDrawdown: 0,
      sharpeRatio: 0
    };
  }
  
  // Calculate total values
  const totalTrades = validMetrics.reduce((sum, m) => sum + m.totalTrades, 0);
  const winningTrades = validMetrics.reduce((sum, m) => sum + m.winningTrades, 0);
  const losingTrades = validMetrics.reduce((sum, m) => sum + m.losingTrades, 0);
  const totalPnL = validMetrics.reduce((sum, m) => sum + m.totalPnL, 0);
  
  // Calculate weighted average for ratios and percentages
  const totalTradeCount = validMetrics.reduce((sum, m) => sum + m.totalTrades, 0);
  const weightedMaxDrawdown = totalTradeCount > 0 
    ? validMetrics.reduce((sum, m) => sum + (m.maxDrawdown * m.totalTrades), 0) / totalTradeCount 
    : 0;
  
  const weightedSharpeRatio = totalTradeCount > 0 
    ? validMetrics.reduce((sum, m) => sum + (m.sharpeRatio * m.totalTrades), 0) / totalTradeCount 
    : 0;
  
  // Calculate win rate from aggregated trades
  const winRate = totalTrades > 0 ? winningTrades / totalTrades : 0;
  
  // Calculate profit factor as weighted average
  // In a real application, this would be calculated from raw profit/loss values
  const weightedProfitFactor = totalTradeCount > 0 
    ? validMetrics.reduce((sum, m) => sum + (m.profitFactor * m.totalTrades), 0) / totalTradeCount 
    : 0;
  
  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    profitFactor: weightedProfitFactor,
    totalPnL,
    maxDrawdown: weightedMaxDrawdown,
    sharpeRatio: weightedSharpeRatio
  };
};

/**
 * Formats a value as currency
 * @param value Number to format
 * @param currency Currency symbol
 * @returns Formatted string
 */
export const formatCurrency = (value: number, currency = '$'): string => {
  return `${currency}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Formats a value as percentage
 * @param value Number to format
 * @param decimals Number of decimal places
 * @returns Formatted string
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`;
};
