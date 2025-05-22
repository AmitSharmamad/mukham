import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

// Mock deployments data
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

  switch (req.method) {
    case 'GET':
      // Return all deployments
      return res.status(200).json(deployments);

    case 'POST':
      // Create a new deployment
      const { strategy_id, instrument_id, name, description } = req.body;
      
      if (!strategy_id || !instrument_id || !name) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const newDeployment = {
        id: uuidv4(),
        strategy_id,
        instrument_id,
        name,
        description: description || '',
        isActive: true, // New deployments are active by default
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
      };
      
      deployments.push(newDeployment);
      return res.status(201).json(newDeployment);

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
