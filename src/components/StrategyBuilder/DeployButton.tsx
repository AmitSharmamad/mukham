import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { createDeployment } from '../../services/deploymentService';
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
      const deploymentName = `${strategyName} - ${instrumentName}`;
      const deployment = await createDeployment({
        strategy_id: strategyId,
        instrument_id: instrumentId,
        name: deploymentName,
        description: strategyDescription,
        isActive: true
      });
      
      showToast(`Strategy deployed successfully: ${deploymentName}`, 'success');
      
      // Navigate to the deployments page after a short delay
      setTimeout(() => {
        router.push('/deployment');
      }, 1500);
    } catch (error) {
      console.error('Error deploying strategy:', error);
      showToast('Failed to deploy strategy. Please try again.', 'error');
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
