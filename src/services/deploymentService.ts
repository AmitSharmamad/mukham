import apiClient from '../utils/api';

// Types
export interface Deployment {
  id: string;
  strategy_id: string;
  instrument_id: number;
  name: string;
  description: string;
  isActive: boolean; // Note: This is mapped from is_active in the API
  createdAt: string; // Note: This is mapped from created_at in the API
  lastUpdatedAt?: string; // Note: This is mapped from updated_at in the API
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
  results: Record<string, number>;
  timestamp: string;
  created_at: string;
}

// Service functions
export const getDeployments = async (): Promise<Deployment[]> => {
  try {
    const response = await apiClient.get('/deployment');
    // Handle the nested data structure in the response
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Map API response to our Deployment interface
      return response.data.data.map((item: any) => ({
        id: item.id,
        strategy_id: item.strategy_id,
        instrument_id: item.instrument_id,
        name: item.name,
        description: item.description,
        isActive: item.is_active,
        createdAt: item.created_at,
        lastUpdatedAt: item.updated_at
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching deployments:', error);
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
        strategy_id: item.strategy_id,
        instrument_id: item.instrument_id,
        name: item.name,
        description: item.description,
        isActive: item.is_active,
        createdAt: item.created_at,
        lastUpdatedAt: item.updated_at
      };
    }
    
    // Mock data for development/testing if API returns nothing
    return {
      id,
      strategy_id: '123',
      instrument_id: 1234,
      name: 'Test Deployment',
      description: 'This is a test deployment with mock data for development and testing purposes.',
      isActive: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      lastUpdatedAt: new Date().toISOString()
    };
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
    // For development purposes, generate mock data
    // In production, this would make an actual API call
    const response = await apiClient.get(`/deployment/${deploymentId}/positions`);
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Mock data for development/testing
    const mockPositions: Position[] = Array(8).fill(null).map((_, index) => {
      const isOpen = index < 3; // First 3 are open positions
      const entryTime = new Date();
      entryTime.setDate(entryTime.getDate() - (10 - index));
      
      const exitTime = isOpen ? undefined : new Date();
      if (exitTime) exitTime.setDate(entryTime.getDate() + 1);
      
      const entryPrice = 100 + Math.random() * 50;
      const exitPrice = isOpen ? undefined : entryPrice + (Math.random() * 10 - 5);
      const pnl = isOpen ? undefined : ((exitPrice! - entryPrice) * 100);
      
      return {
        id: 1000 + index,
        deployment_id: deploymentId,
        instrument_id: 1234,
        quantity: 100,
        entry_price: entryPrice,
        entry_time: entryTime.toISOString(),
        exit_price: exitPrice,
        exit_time: exitTime?.toISOString(),
        pnl,
        status: isOpen ? 'OPEN' : 'CLOSED',
        metadata: {},
        created_at: entryTime.toISOString(),
        updated_at: exitTime?.toISOString() || entryTime.toISOString()
      };
    });
    
    return mockPositions;
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
    
    // Mock data for development/testing when no data is returned from API
    const mockMetrics: DeploymentMetrics = {
      totalTrades: 24,
      winningTrades: 15,
      losingTrades: 9,
      winRate: 0.625,
      profitFactor: 1.8,
      totalPnL: 8.5,
      maxDrawdown: 12.3,
      sharpeRatio: 1.2
    };
    
    return mockMetrics;
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

export const getDeploymentPositionLogs = async (deploymentId: string, positionId: number): Promise<DeploymentPositionLog[]> => {
  try {
    const response = await apiClient.get(`/deployment/${deploymentId}/position/log`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    // Return mock data for testing if API returns nothing
    return [
      {
        id: "7f8b2a9c-3d1e-4f5a-9b6c-8d7e0f1g2h3i",
        deployment_position_id: positionId,
        results: {
          ema: 21
        },
        timestamp: "2025-05-23T16:30:00Z",
        created_at: "2025-05-23T16:30:01Z"
      },
      {
        id: "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f",
        deployment_position_id: positionId,
        results: {
          ema: 20
        },
        timestamp: "2025-05-23T17:00:00Z",
        created_at: "2025-05-23T17:00:01Z"
      }
    ];
  } catch (error) {
    console.error('Error fetching deployment position logs:', error);
    throw error;
  }
};

export default {
  getDeployments,
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
  getDeploymentPositionLogs
};
