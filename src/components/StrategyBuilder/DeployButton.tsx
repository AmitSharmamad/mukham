import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { createDeployment, ApiResponse } from '../../services/deploymentService';
import { useToast } from '../../hooks';

interface DeployButtonProps {
  strategyId: string;
  instrumentId: number;
  instrumentName: string;
  strategyName: string;
  strategyDescription?: string;
}

const DeployButton: React.FC<DeployButtonProps> = ({
  strategyId,
  instrumentId,
  instrumentName,
  strategyName,
  strategyDescription = ''
}) => {
  const router = useRouter();
  const [deploying, setDeploying] = useState(false);
  const { showToast } = useToast();

  const handleDeploy = async () => {
    try {
      setDeploying(true);
      
      // Create a deployment
      const response = await createDeployment({
        strategy_id: strategyId,
        instrument_id: instrumentId,
        name: strategyName,
        description: strategyDescription,
        isActive: true
      });
      
      // Show success message from API response
      showToast(response.message || `Strategy deployed successfully: ${strategyName}`, 'success');
      
      // Navigate to the deployments page after a short delay
      setTimeout(() => {
        router.push('/deployment');
      }, 1500);
    } catch (error: any) {
      console.error('Error deploying strategy:', error);
      // Show error message from API response if available
      showToast(
        error.response?.data?.message || 'Failed to deploy strategy. Please try again.',
        'error'
      );
    } finally {
      setDeploying(false);
    }
  };

  return (
    <Button
      variant="contained"
      size="small"
      onClick={handleDeploy}
      disabled={deploying}
    >
      {deploying ? <CircularProgress size={20} /> : 'Deploy'}
    </Button>
  );
};

export default DeployButton;
