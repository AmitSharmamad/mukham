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

export const getDeployment = async (id: string): Promise<Deployment | undefined> => {
  try {
    const response = await apiClient.get(`/deployment/${id}`);
    return response.data;
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

export const activateDeployment = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(`/deployment/${id}/activate`);
    return response.data;
  } catch (error) {
    console.error('Error activating deployment:', error);
    throw error;
  }
};

export const deactivateDeployment = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.put(`/deployment/${id}/deactivate`);
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

export const getDeploymentPositions = async (deploymentId: string): Promise<Position[]> => {
  try {
    const response = await apiClient.get(`/deployments/${deploymentId}/positions`);
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching deployment positions:', error);
    throw error;
  }
};

export default {
  getDeployments,
  getDeployment,
  createDeployment,
  updateDeployment,
  deleteDeployment,
  activateDeployment,
  deactivateDeployment,
  stopAllDeployments,
  startAllDeployments,
  getDeploymentPositions
};
