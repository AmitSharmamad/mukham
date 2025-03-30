import { Box, Typography } from '@mui/material';
import { StrategyForm } from '../../components/StrategyBuilder/StrategyForm';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// This would come from an API in a real application
const mockStrategy = {
  id: '1',
  name: 'EMA Crossover',
  description: 'A strategy based on EMA crossover signals',
  buyOrSell: 'buy',
  instruments: [],
  candlestickType: 'Candlestick',
  timeframe: '5',
  tradeType: 'MIS',
  maxAllocation: '100000',
  maxQuantity: '10',
  entryConditions: [
    {
      indicator1: { name: 'EMA', config: { period: 5 } },
      operator: 'CrossesAbove',
      indicator2: { name: 'Number', config: { value: 21000 } },
    },
  ],
  exitConditions: [
    {
      indicator1: { name: 'EMA', config: { period: 5 } },
      operator: 'CrossesBelow',
      indicator2: { name: 'Number', config: { value: 20900 } },
    },
  ],
  stopLoss: '1',
  targetProfit: '2',
  trailingStopLoss: '0.5',
  initialCapital: '1000000',
  entryStartTime: '09:15',
  entryEndTime: '15:15',
  startDate: '2025-01-01',
  endDate: '2025-12-31',
};

export default function EditStrategy() {
  const router = useRouter();
  const { strategy_id } = router.query;
  const [strategy, setStrategy] = useState<any>(null);

  useEffect(() => {
    // In a real application, this would fetch from an API
    if (strategy_id) {
      setStrategy(mockStrategy);
    }
  }, [strategy_id]);

  if (!strategy) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading strategy...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Strategy: {strategy.name}
      </Typography>
      <StrategyForm initialData={strategy} />
    </Box>
  );
}
