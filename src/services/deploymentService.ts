import apiClient from '../utils/api';

// Types
export interface Deployment {
  id: string;
  strategy_id: string;
  instrument_id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  lastUpdatedAt?: string;
}

// Service functions
export const getDeployments = async (): Promise<Deployment[]> => {
  try {
    const response = await apiClient.get('/deployment');
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
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

export const createDeployment = async (deploymentData: Omit<Deployment, 'id' | 'createdAt'>): Promise<Deployment> => {
  try {
    const response = await apiClient.post('/deployment', deploymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating deployment:', error);
    throw error;
  }
};

export const updateDeployment = async (id: string, deploymentData: Partial<Deployment>): Promise<Deployment | undefined> => {
  try {
    const response = await apiClient.put(`/deployment/${id}`, deploymentData);
    return response.data;
  } catch (error) {
    console.error('Error updating deployment:', error);
    throw error;
  }
};

export const deleteDeployment = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/deployment/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting deployment:', error);
    throw error;
  }
};

export const activateDeployment = async (id: string): Promise<Deployment | undefined> => {
  try {
    const response = await apiClient.put(`/deployment/${id}/activate`);
    return response.data;
  } catch (error) {
    console.error('Error activating deployment:', error);
    throw error;
  }
};

export const deactivateDeployment = async (id: string): Promise<Deployment | undefined> => {
  try {
    const response = await apiClient.put(`/deployment/${id}/deactivate`);
    return response.data;
  } catch (error) {
    console.error('Error deactivating deployment:', error);
    throw error;
  }
};

export const stopAllDeployments = async (): Promise<boolean> => {
  try {
    await apiClient.post('/deployment/stop-all');
    return true;
  } catch (error) {
    console.error('Error stopping all deployments:', error);
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
  stopAllDeployments
};
