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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { strategy_id, instrument_id, is_active, name } = req.query;

  // Filter deployments based on query parameters
  let filteredDeployments = [...deployments];

  if (strategy_id && typeof strategy_id === 'string') {
    filteredDeployments = filteredDeployments.filter(d => d.strategy_id === strategy_id);
  }

  if (instrument_id && typeof instrument_id === 'string') {
    const instrumentIdNum = parseInt(instrument_id, 10);
    if (!isNaN(instrumentIdNum)) {
      filteredDeployments = filteredDeployments.filter(d => d.instrument_id === instrumentIdNum);
    }
  }

  if (is_active !== undefined) {
    const isActive = is_active === 'true';
    filteredDeployments = filteredDeployments.filter(d => d.isActive === isActive);
  }

  if (name && typeof name === 'string') {
    filteredDeployments = filteredDeployments.filter(d => 
      d.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return res.status(200).json(filteredDeployments);
}
