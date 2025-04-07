import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { StrategyForm } from '../../components/StrategyBuilder/StrategyForm';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
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
  entryStartTime: string | null;
  entryEndTime: string | null;
  startDate: string;
  endDate: string;
}

export default function EditStrategy() {
  const router = useRouter();
  const { strategy_id } = router.query;
  const [strategy, setStrategy] = useState<FormattedStrategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (strategy_id) {
      fetchStrategy(strategy_id as string);
    }
  }, [strategy_id]);

  const fetchStrategy = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:9090/strategy/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.result) {
        const strategyData = data.data;
        const isNullTime = (time: string) => !time || time === "0001-01-01T00:00:00Z";
        
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
          entryConditions: strategyData.entry_expression,
          exitConditions: strategyData.exit_expression,
          stopLoss: strategyData.stop_loss?.toString() || '',
          stopLossType: strategyData.stop_loss_type || 'ABSOLUTE',
          targetProfit: strategyData.target_profit?.toString() || '',
          targetProfitType: strategyData.target_profit_type || 'ABSOLUTE',
          trailingStopLoss: strategyData.trailing_stop_loss?.toString() || '',
          initialCapital: strategyData.capital?.toString() || '',
          entryStartTime: isNullTime(strategyData.entry_start_time) ? null : dayjs(strategyData.entry_start_time).format('HH:mm'),
          entryEndTime: isNullTime(strategyData.entry_end_time) ? null : dayjs(strategyData.entry_end_time).format('HH:mm'),
          startDate: dayjs(strategyData.start_date).format('YYYY-MM-DD'),
          endDate: dayjs(strategyData.end_date).format('YYYY-MM-DD'),
        };
        
        setStrategy(formData);
      } else {
        throw new Error(data.error || 'Failed to fetch strategy');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/strategy');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleGoBack}>
          Back to Strategies
        </Button>
      </Box>
    );
  }

  if (!strategy) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Strategy not found
        </Alert>
        <Button variant="contained" onClick={handleGoBack}>
          Back to Strategies
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Strategy: {strategy.name}
      </Typography>
      <StrategyForm initialData={strategy} />
    </Box>
  );
}
