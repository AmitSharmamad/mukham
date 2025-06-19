import apiClient from '../utils/api';

// Types
export interface InstrumentMaster {
  exchange_security_id: number;
  exchange: string;
  segment: string;
  symbol: string;
  name: string;
  start_date: string;
  expiry: string;
  exm_exch_id: number;
  smst_security_id: number;
  instrument_name: string;
  trading_symbol: string;
  lot_units: number;
  strike_price: number;
  option_type: string;
  tick_size: number;
  expiry_flag: string;
  exch_instrument_type: string;
  symbol_name: string;
}

export interface DeploymentMetricsData {
  id: string;
  deployment_id: string;
  metric_date: string;
  total_trades: number;
  win_trades: number;
  loss_trades: number;
  total_pnl: number;
  max_drawdown: number;
  win_rate: number;
  avg_win: number;
  avg_loss: number;
  metadata: {
    avg_win: number;
    avg_loss: number;
    win_rate: number;
    avg_win_size: number;
    max_drawdown: number;
    sharpe_ratio: number;
    total_trades: number;
    avg_loss_size: number;
    profit_factor: number;
    total_commission: number;
    total_return_pct: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  id: string;
  user_id?: string; // Optional for creation as it's typically set by the backend
  strategy_id: string;
  instrument_id: number;
  name: string;
  description: string;
  isActive: boolean; // Note: This is mapped from is_active in the API
  status?: 'waiting' | 'entered'; // Position status from the API
  createdAt: string; // Note: This is mapped from created_at in the API
  lastUpdatedAt?: string; // Note: This is mapped from updated_at in the API
  metrics?: DeploymentMetricsData;
  instrument_master?: InstrumentMaster;
}

export interface Position {
  id: number;
  deployment_id: string;
  instrument_id: number;
  quantity: number;
  entry_price: number;
  entry_time: string;
  exit_price?: number;
  exit_time?: string;
  pnl?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
  data?: any;
}

export interface ApiMetric {
  id: number;
  deployment_id: string;
  metric_date: string;
  total_trades: number;
  win_trades: number;
  loss_trades: number;
  total_pnl: number;
  max_drawdown: number;
  metadata: {
    status: string;
    initial_setup: boolean;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface DeploymentMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  totalPnL: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export interface DeploymentPositionLog {
  id: string;
  deployment_position_id: number;
  results: Record<string, any>;
  timestamp: string;
  created_at: string;
}

// Service functions
export const getDeployments = async (filters?: { 
  status?: 'waiting' | 'entered'
}): Promise<Deployment[]> => {
  try {
    let url = '/deployment';
    const queryParams = new URLSearchParams();
    
    if (filters?.status) {
      queryParams.append('status', filters.status);
    }
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await apiClient.get(url);
    
    // Handle the nested data structure in the response
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Map API response to our Deployment interface
      return response.data.data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        strategy_id: item.strategy_id,
        instrument_id: item.instrument_id,
        name: item.name,
        description: item.description,
        isActive: item.is_active,
        status: item.status,
        createdAt: item.created_at,
        lastUpdatedAt: item.updated_at,
        metrics: item.metrics,
        instrument_master: item.instrument_master
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching deployments:', error);
    throw error;
  }
};

export const getDeploymentsSearch = async (filters: { 
  status?: 'waiting' | 'entered'
}): Promise<Deployment[]> => {
  try {
    let url = '/deployment/search';
    const queryParams = new URLSearchParams();
    
    if (filters.status) {
      queryParams.append('status', filters.status);
    }
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await apiClient.get(url);
    
    // Handle the nested data structure in the response
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Map API response to our Deployment interface
      return response.data.data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        strategy_id: item.strategy_id,
        instrument_id: item.instrument_id,
        name: item.name,
        description: item.description,
        isActive: item.is_active,
        status: item.status,
        createdAt: item.created_at,
        lastUpdatedAt: item.updated_at,
        metrics: item.metrics,
        instrument_master: item.instrument_master
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching deployments:', error);
    throw error;
  }
};

export const getDeployment = async (id: string): Promise<Deployment | null> => {
  try {
    const response = await apiClient.get(`/deployment/${id}`);
    if (response.data && response.data.data) {
      const item = response.data.data;
      return {
        id: item.id,
        user_id: item.user_id,
        strategy_id: item.strategy_id,
        instrument_id: item.instrument_id,
        name: item.name,
        description: item.description,
        isActive: item.is_active,
        status: item.status,
        createdAt: item.created_at,
        lastUpdatedAt: item.updated_at,
        metrics: item.metrics,
        instrument_master: item.instrument_master
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching deployment:', error);
    throw error;
  }
};

export const createDeployment = async (deploymentData: Omit<Deployment, 'id' | 'createdAt'>): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post('/deployment', deploymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating deployment:', error);
    throw error;
  }
};

export const updateDeployment = async (id: string, deploymentData: Partial<Deployment>): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(`/deployment/${id}`, deploymentData);
    return response.data;
  } catch (error) {
    console.error('Error updating deployment:', error);
    throw error;
  }
};

export const deleteDeployment = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete(`/deployment/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting deployment:', error);
    throw error;
  }
};

export const getDeploymentPositions = async (deploymentId: string): Promise<Position[]> => {
  try {
    const response = await apiClient.get(`/deployment/${deploymentId}/positions`);
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching deployment positions:', error);
    throw error;
  }
};

export const getDeploymentMetrics = async (deploymentId: string): Promise<DeploymentMetrics | null> => {
  try {
    // Make an API call to fetch the metrics
    const response = await apiClient.get(`/deployment/${deploymentId}/metrics`);
    
    if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      const apiMetric: ApiMetric = response.data.data[0];
      
      // Convert API response to DeploymentMetrics format
      return {
        totalTrades: apiMetric.total_trades,
        winningTrades: apiMetric.win_trades,
        losingTrades: apiMetric.loss_trades,
        winRate: apiMetric.total_trades > 0 ? apiMetric.win_trades / apiMetric.total_trades : 0,
        profitFactor: apiMetric.loss_trades > 0 ? 1.5 : 0, // Default value as it's missing in the API
        totalPnL: apiMetric.total_pnl,
        maxDrawdown: apiMetric.max_drawdown,
        sharpeRatio: 1.2, // Default value as it's missing in the API
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching deployment metrics:', error);
    throw error;
  }
};

export const activateDeployment = async (deploymentId: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(`/deployment/${deploymentId}/activate`);
    return response.data;
  } catch (error) {
    console.error('Error activating deployment:', error);
    throw error;
  }
};

export const deactivateDeployment = async (deploymentId: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(`/deployment/${deploymentId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error('Error deactivating deployment:', error);
    throw error;
  }
};

export const stopAllDeployments = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post('/deployment/stop-all');
    return response.data;
  } catch (error) {
    console.error('Error stopping all deployments:', error);
    throw error;
  }
};

export const startAllDeployments = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post('/deployment/start-all');
    return response.data;
  } catch (error) {
    console.error('Error starting all deployments:', error);
    throw error;
  }
};

export const closePosition = async (deploymentId: string, positionId: number): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(`/deployment/${deploymentId}/positions/${positionId}/close`);
    return response.data;
  } catch (error) {
    console.error('Error closing position:', error);
    throw error;
  }
};

export const exitDeployment = async (deploymentId: string): Promise<ApiResponse> => {
  try {
    // First, get all open positions for this deployment
    const positions = await getDeploymentPositions(deploymentId);
    const openPositions = positions.filter(position => position.status === 'OPEN');
    
    // Close all open positions
    if (openPositions.length > 0) {
      await Promise.all(
        openPositions.map(position => 
          closePosition(deploymentId, position.id)
        )
      );
    }
    
    // Then deactivate the deployment
    const response = await deactivateDeployment(deploymentId);
    
    return {
      success: true,
      message: `Deployment exited successfully. ${openPositions.length} positions closed.`,
      data: response.data
    };
  } catch (error) {
    console.error('Error exiting deployment:', error);
    throw error;
  }
};

export const getDeploymentPositionLogs = async (deploymentId: string, positionId: number): Promise<DeploymentPositionLog[]> => {
  try {
    const response = await apiClient.get(`/deployment/${deploymentId}/position/log`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching deployment position logs:', error);
    throw error;
  }
};

export default {
  getDeployments,
  getDeploymentsSearch,
  getDeployment,
  createDeployment,
  updateDeployment,
  deleteDeployment,
  getDeploymentPositions,
  getDeploymentMetrics,
  activateDeployment,
  deactivateDeployment,
  stopAllDeployments,
  startAllDeployments,
  closePosition,
  exitDeployment,
  getDeploymentPositionLogs
};
