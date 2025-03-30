import { Box, Typography, CircularProgress } from '@mui/material';
import { StrategyForm } from '../../components/StrategyBuilder/StrategyForm';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { Strategy } from '../../types/strategy';
import dayjs from 'dayjs';
import { mapTimeframeToDisplay } from '../../constants';

interface FormattedStrategy {
  id: string;
  name: string;
  description: string;
  buyOrSell: 'buy' | 'sell';
  instruments: number[];
  candlestickType: string;
  timeframe: string;
  tradeType: string;
  maxAllocation: string;
  maxQuantity: string;
  entryConditions: any;
  exitConditions: any;
  stopLoss: string;
  stopLossType: 'ABSOLUTE' | 'PERCENTAGE';
  targetProfit: string;
  targetProfitType: 'ABSOLUTE' | 'PERCENTAGE';
  trailingStopLoss: string;
  initialCapital: string;
  entryStartTime: string;
  entryEndTime: string;
  startDate: string;
  endDate: string;
}

export default function EditStrategy() {
  const router = useRouter();
  const { strategy_id } = router.query;
  const [strategy, setStrategy] = useState<FormattedStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (strategy_id) {
      fetchStrategy(strategy_id as string);
    }
  }, [strategy_id]);

  const fetchStrategy = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9090/strategy/${id}`);
      const data = await response.json();
      
      if (data.result) {
        const strategyData = data.data;
        
        // Transform API data to match form structure
        const formData: FormattedStrategy = {
          id: strategyData.id,
          name: strategyData.name,
          description: strategyData.description,
          buyOrSell: strategyData.position_type === 'LONG' ? 'buy' : 'sell',
          instruments: strategyData.instruments,
          candlestickType: strategyData.chart_type || 'CANDLESTICK',
          timeframe: mapTimeframeToDisplay(strategyData.chart_timeframe),
          tradeType: strategyData.trade_type || 'MIS',
          maxAllocation: strategyData.capital?.toString() || '',
          maxQuantity: strategyData.qty?.toString() || '',
          entryConditions: JSON.parse(strategyData.entry_expression),
          exitConditions: JSON.parse(strategyData.exit_expression),
          stopLoss: strategyData.stop_loss?.toString() || '',
          stopLossType: strategyData.stop_loss_type || 'ABSOLUTE',
          targetProfit: strategyData.target_profit?.toString() || '',
          targetProfitType: strategyData.target_profit_type || 'ABSOLUTE',
          trailingStopLoss: strategyData.trailing_stop_loss?.toString() || '',
          initialCapital: strategyData.capital?.toString() || '',
          entryStartTime: dayjs(strategyData.entry_start_time).format('HH:mm'),
          entryEndTime: dayjs(strategyData.entry_end_time).format('HH:mm'),
          startDate: dayjs(strategyData.start_date).format('YYYY-MM-DD'),
          endDate: dayjs(strategyData.end_date).format('YYYY-MM-DD'),
        };
        
        setStrategy(formData);
      } else {
        setError('Failed to fetch strategy');
      }
    } catch (err) {
      setError('Error connecting to the server');
    }
  };

  if (!strategy && !error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Strategy: {strategy?.name}
      </Typography>
      <StrategyForm initialData={strategy} />
    </Box>
  );
}
