import type { NextApiRequest, NextApiResponse } from 'next';
import apiClient from '../../../../utils/api';

interface Position {
  id: number;
  deployment_id: string;
  instrument_id: number;
  quantity: number;
  entry_price: number;
  entry_time: string;
  exit_price?: number;
  exit_time?: string;
  exit_reason?: string;
  pnl?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { deployment_id } = req.query;

  if (!deployment_id || typeof deployment_id !== 'string') {
    return res.status(400).json({ message: 'Invalid deployment ID' });
  }

  try {
    // Get the deployment to verify it exists
    const deploymentResponse = await apiClient.get(`/deployment/${deployment_id}`);
    
    if (!deploymentResponse.data || !deploymentResponse.data.data) {
      return res.status(404).json({ message: 'Deployment not found' });
    }

    const deployment = deploymentResponse.data.data;

    // Get all open positions for this deployment
    const positionsResponse = await apiClient.get(`/deployment/${deployment_id}/positions`);
    
    let openPositions: Position[] = [];
    if (positionsResponse.data && positionsResponse.data.data && Array.isArray(positionsResponse.data.data)) {
      openPositions = positionsResponse.data.data.filter(
        (position: Position) => position.status === 'OPEN'
      );
    }

    // Close all open positions by calling the close endpoint for each
    const closedPositions: Position[] = [];
    let totalPnL = 0;

    for (const position of openPositions) {
      try {
        const closeResponse = await apiClient.put(`/deployment/positions/${position.id}/close`, {
          exit_reason: 'DEPLOYMENT_EXIT'
        });
        
        if (closeResponse.data && closeResponse.data.data) {
          closedPositions.push(closeResponse.data.data);
          // Calculate PnL if available
          if (closeResponse.data.data.pnl) {
            totalPnL += closeResponse.data.data.pnl;
          }
        }
      } catch (error) {
        console.error(`Error closing position ${position.id}:`, error);
        // Continue with other positions even if one fails
      }
    }

    // Deactivate the deployment
    await apiClient.put(`/deployment/${deployment_id}`, {
      is_active: false
    });

    // Get updated deployment data
    const updatedDeploymentResponse = await apiClient.get(`/deployment/${deployment_id}`);
    const updatedDeployment = updatedDeploymentResponse.data?.data || deployment;

    return res.status(200).json({
      success: true,
      message: `Deployment "${deployment.name}" exited successfully. ${closedPositions.length} position(s) closed.`,
      data: {
        deployment: {
          id: updatedDeployment.id,
          strategy_id: updatedDeployment.strategy_id,
          instrument_id: updatedDeployment.instrument_id,
          name: updatedDeployment.name,
          description: updatedDeployment.description,
          isActive: updatedDeployment.is_active,
          status: updatedDeployment.status,
          createdAt: updatedDeployment.created_at,
          lastUpdatedAt: updatedDeployment.updated_at
        },
        closed_positions: closedPositions,
        total_positions_closed: closedPositions.length,
        total_pnl: totalPnL.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error exiting deployment:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error while exiting deployment' 
    });
  }
}
