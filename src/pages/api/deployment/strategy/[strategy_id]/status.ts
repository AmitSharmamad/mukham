import type { NextApiRequest, NextApiResponse } from 'next';

// Mock deployments data - same as in other deployment APIs
const deployments = [
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
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    strategy_id: 'strat-003',
    instrument_id: 789,
    name: 'MACD Crossover - RELIANCE',
    description: 'Strategy based on MACD crossover for RELIANCE',
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { strategy_id, instruments } = req.query;

  if (!strategy_id || typeof strategy_id !== 'string') {
    return res.status(400).json({ message: 'Invalid strategy ID' });
  }

  if (!instruments || typeof instruments !== 'string') {
    return res.status(400).json({ message: 'Instruments parameter is required' });
  }

  try {
    // Parse comma-separated instrument IDs
    const instrumentIds = instruments.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    
    if (instrumentIds.length === 0) {
      return res.status(400).json({ message: 'No valid instrument IDs provided' });
    }

    // Check deployment status for each instrument
    const instrumentStatuses = instrumentIds.map(instrumentId => {
      // Check if there's an active deployment for this strategy and instrument
      const hasDeployment = deployments.some(deployment => 
        deployment.strategy_id === strategy_id && 
        deployment.instrument_id === instrumentId &&
        deployment.isActive
      );

      return {
        instrument_id: instrumentId,
        has_deployment: hasDeployment
      };
    });

    const response = {
      data: {
        strategy_id,
        instruments: instrumentStatuses
      },
      success: true
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error checking deployment status:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      success: false 
    });
  }
}
