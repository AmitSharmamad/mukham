import axios from 'axios';
import { DashboardApiResponse } from '../types/dashboard';

export const dashboardService = {
  /**
   * Fetch dashboard statistics
   */
  getStatistics: async (): Promise<DashboardApiResponse> => {
    try {
      const response = await axios.get('/api/user/dashboard/statistics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  }
};
