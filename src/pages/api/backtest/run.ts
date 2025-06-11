import { NextApiRequest, NextApiResponse } from 'next';

interface BacktestPosition {
  id: string;
  entry_price_order: number;
  entry_time_order: string;
  exit_price_order: number;
  exit_time_order: string;
  profit_loss_absolute: number;
  profit_loss_percentage: number;
  position_size: number;
  direction: 'LONG' | 'SHORT';
  exit_reason: string;
}

interface BacktestMetrics {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  profit_factor: number;
  total_return_pct: number;
  annualized_return: number;
  max_drawdown: number;
  sharpe_ratio: number;
  capital_progression: Array<{
    capital_after: number;
    capital_before: number;
    capital_change: number;
    direction: string;
    entry_price: number;
    entry_time: string;
    exit_price: number;
    exit_reason: string;
    exit_time: string;
    net_profit_loss: number;
    position_id: string;
    position_index: number;
    position_size: number;
  }>;
}

interface BacktestRun {
  instrument_id: number;
  instrument_master: {
    instrument_name: string;
  };
  positions: BacktestPosition[];
  metrics: BacktestMetrics;
}

// Generate mock backtest data
function generateMockBacktestData(strategyId: string): any {
  const instruments = [
    { id: 1, name: 'NIFTY50', symbol: 'NIFTY 50' },
    { id: 2, name: 'BANKNIFTY', symbol: 'BANK NIFTY' }
  ];

  const results: BacktestRun[] = instruments.map((instrument, index) => {
    const totalTrades = 25 + Math.floor(Math.random() * 20); // 25-45 trades
    const winRate = 0.6 + Math.random() * 0.2; // 60-80% win rate
    const winningTrades = Math.floor(totalTrades * winRate);
    const losingTrades = totalTrades - winningTrades;

    const positions: BacktestPosition[] = [];
    const capitalProgression: any[] = [];
    let currentCapital = 100000; // Initial capital

    for (let i = 0; i < totalTrades; i++) {
      const isWin = i < winningTrades;
      const profitLoss = isWin 
        ? 500 + Math.random() * 1500  // Win: 500-2000
        : -(200 + Math.random() * 800); // Loss: -200 to -1000

      const entryPrice = 15000 + Math.random() * 5000; // Random entry price
      const exitPrice = entryPrice + (profitLoss / 100); // Approximate exit price
      const entryTime = new Date(Date.now() - (totalTrades - i) * 24 * 60 * 60 * 1000).toISOString();
      const exitTime = new Date(new Date(entryTime).getTime() + 2 * 60 * 60 * 1000).toISOString();

      const position: BacktestPosition = {
        id: `pos_${i + 1}`,
        entry_price_order: entryPrice,
        entry_time_order: entryTime,
        exit_price_order: exitPrice,
        exit_time_order: exitTime,
        profit_loss_absolute: profitLoss,
        profit_loss_percentage: (profitLoss / (entryPrice * 100)) * 100,
        position_size: 100,
        direction: 'LONG',
        exit_reason: isWin ? 'TARGET' : 'STOP_LOSS'
      };

      positions.push(position);

      // Add to capital progression
      const capitalBefore = currentCapital;
      currentCapital += profitLoss;
      
      capitalProgression.push({
        capital_after: currentCapital,
        capital_before: capitalBefore,
        capital_change: profitLoss,
        direction: 'LONG',
        entry_price: entryPrice,
        entry_time: entryTime,
        exit_price: exitPrice,
        exit_reason: position.exit_reason,
        exit_time: exitTime,
        net_profit_loss: profitLoss,
        position_id: position.id,
        position_index: i,
        position_size: 100
      });
    }

    const totalPnL = positions.reduce((sum, pos) => sum + pos.profit_loss_absolute, 0);
    const totalReturnPct = (totalPnL / 100000) * 100; // Percentage return
    // Calculate annualized return (assuming 1 year period for mock data)
    const annualizedReturn = totalReturnPct; // For mock data, assume the backtest period is 1 year

    const metrics: BacktestMetrics = {
      total_trades: totalTrades,
      winning_trades: winningTrades,
      losing_trades: losingTrades,
      win_rate: winRate,
      profit_factor: Math.abs(positions.filter(p => p.profit_loss_absolute > 0).reduce((sum, p) => sum + p.profit_loss_absolute, 0)) / 
                     Math.abs(positions.filter(p => p.profit_loss_absolute < 0).reduce((sum, p) => sum + p.profit_loss_absolute, 0)),
      total_return_pct: totalReturnPct,
      annualized_return: annualizedReturn,
      max_drawdown: -5.2 - Math.random() * 10, // -5% to -15%
      sharpe_ratio: 1.5 + Math.random() * 1.0, // 1.5 to 2.5
      capital_progression: capitalProgression
    };

    return {
      instrument_id: instrument.id,
      instrument_master: {
        instrument_name: instrument.name
      },
      positions,
      metrics
    };
  });

  return {
    message: 'Backtest completed successfully',
    strategy_id: strategyId,
    results
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { strategy_id } = req.query;
  
  if (!strategy_id) {
    return res.status(400).json({ error: 'Strategy ID is required' });
  }

  try {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Generate mock data
    const backtestData = generateMockBacktestData(strategy_id as string);

    // Send progress events
    res.write('event: progress\n');
    res.write('data: {"message": "Initializing backtest...", "progress": 10}\n\n');

    await new Promise(resolve => setTimeout(resolve, 500));

    res.write('event: progress\n');
    res.write('data: {"message": "Processing strategy conditions...", "progress": 30}\n\n');

    await new Promise(resolve => setTimeout(resolve, 500));

    res.write('event: progress\n');
    res.write('data: {"message": "Calculating trades...", "progress": 60}\n\n');

    await new Promise(resolve => setTimeout(resolve, 500));

    res.write('event: progress\n');
    res.write('data: {"message": "Generating metrics...", "progress": 90}\n\n');

    await new Promise(resolve => setTimeout(resolve, 500));

    // Send final results
    res.write('event: results\n');
    res.write(`data: ${JSON.stringify(backtestData)}\n\n`);

    res.write('event: complete\n');
    res.write('data: {"message": "Backtest completed successfully"}\n\n');

    res.end();
  } catch (error) {
    console.error('Backtest error:', error);
    res.write('event: error\n');
    res.write(`data: {"error": "Backtest failed: ${error}"}\n\n`);
    res.end();
  }
}
