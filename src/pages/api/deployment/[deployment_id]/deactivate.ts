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
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { deployment_id } = req.query;

  if (!deployment_id || typeof deployment_id !== 'string') {
    return res.status(400).json({ message: 'Invalid deployment ID' });
  }

  // Find the deployment with the given ID
  const deploymentIndex = deployments.findIndex(d => d.id === deployment_id);
  
  if (deploymentIndex === -1) {
    return res.status(404).json({ message: 'Deployment not found' });
  }

  // Deactivate the deployment
  const deployment = deployments[deploymentIndex];
  
  if (!deployment.isActive) {
    return res.status(400).json({ message: 'Deployment is already inactive' });
  }
  
  const updatedDeployment = {
    ...deployment,
    isActive: false,
    lastUpdatedAt: new Date().toISOString()
  };
  
  deployments[deploymentIndex] = updatedDeployment;
  
  return res.status(200).json(updatedDeployment);
}
