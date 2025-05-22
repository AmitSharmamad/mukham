import type { NextApiRequest, NextApiResponse } from 'next';

// Use the same mock data as in index.ts
// In a real app, this would be in a database
// Mock deployments data (same as in index.ts)
let deployments = [
  {
    id: '1',
    strategy_id: 'strat-001',
    instrument_id: 123,
    name: 'Golden Cross - NIFTY',
    description: 'Strategy to detect golden cross on NIFTY',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString()
  },
  {
    id: '2',
    strategy_id: 'strat-002',
    instrument_id: 456,
    name: 'RSI Oversold - BANKNIFTY',
    description: 'Strategy to buy when RSI is oversold on BANKNIFTY',
    isActive: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    id: '3',
    strategy_id: 'strat-003',
    instrument_id: 789,
    name: 'MACD Crossover - RELIANCE',
    description: 'Strategy based on MACD crossover for RELIANCE',
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    lastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mock authorization check - in a real app you would check for a valid auth token
  // if (!req.headers.authorization) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  const { deployment_id } = req.query;

  if (!deployment_id || typeof deployment_id !== 'string') {
    return res.status(400).json({ message: 'Invalid deployment ID' });
  }

  // Find the deployment with the given ID
  const deploymentIndex = deployments.findIndex(d => d.id === deployment_id);
  
  if (deploymentIndex === -1) {
    return res.status(404).json({ message: 'Deployment not found' });
  }

  const deployment = deployments[deploymentIndex];

  switch (req.method) {
    case 'GET':
      // Return the deployment with the given ID
      return res.status(200).json(deployment);

    case 'PUT':
      // Update the deployment
      const { name, description } = req.body;
      
      const updatedDeployment = {
        ...deployment,
        name: name || deployment.name,
        description: description || deployment.description,
        lastUpdatedAt: new Date().toISOString()
      };
      
      deployments[deploymentIndex] = updatedDeployment;
      return res.status(200).json(updatedDeployment);

    case 'DELETE':
      // Delete the deployment
      deployments = deployments.filter(d => d.id !== deployment_id);
      return res.status(200).json({ message: 'Deployment deleted successfully' });

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
