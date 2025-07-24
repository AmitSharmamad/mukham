import { Box, Typography, CircularProgress, Alert, Button, Chip, Stack, Grid } from '@mui/material';
import { StrategyForm } from '../../components/StrategyBuilder/StrategyForm';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import type { Strategy } from '../../types/strategy';
import dayjs from 'dayjs';
import { mapTimeframeToDisplay } from '../../constants';
import { checkPageAuth } from '../../utils/pageAuthUtils';

interface Instrument {
  exchange_security_id: number;
  exchange: string;
  segment: string;
  symbol: string;
  instrument: string;
  instrument_id: number;
  start_date: string;
  expiry: string;
}

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
  brickSize?: string;
  entryConditions: any;
  exitConditions: any;
  stopLoss: string;
  stopLossType: 'ABSOLUTE' | 'PERCENTAGE';
  targetProfit: string;
  targetProfitType: 'ABSOLUTE' | 'PERCENTAGE';
  trailingStopLoss: string;
  entryStartTime: string | null;
  entryEndTime: string | null;
  startDate: string;
  endDate: string;
  brokerage: string;
  slippage: string;
}

export default function EditStrategy() {
  const router = useRouter();
  const { strategy_id } = router.query;
  const [strategy, setStrategy] = useState<FormattedStrategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instrumentDetails, setInstrumentDetails] = useState<Instrument[]>([]);

  const fetchInstrumentDetails = useCallback(async (instrumentIds: number[]): Promise<void> => {
    try {
      const response = await fetch(`/api/instrument-master/by-exchange-security-ids?exchange_security_ids=${instrumentIds.join(',')}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        setInstrumentDetails(data.data);
      }
    } catch (err) {
      console.error('Error fetching instrument details:', err);
    }
  }, []);
  
  const fetchStrategy = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Cookies are automatically sent with the request
      const response = await fetch(`/api/strategy/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const strategyData = data.data;
        const isNullTime = (time: string) => !time || time === "0001-01-01T00:00:00Z" || time === "00:00:00";
        
        const formData: FormattedStrategy = {
          id: strategyData.id,
          name: strategyData.name,
          description: strategyData.description,
          buyOrSell: strategyData.position_type === 'LONG' ? 'buy' : 'sell',
          instruments: strategyData.instruments, // These are already the correct ids
          candlestickType: strategyData.chart_type || 'CANDLESTICK',
          timeframe: mapTimeframeToDisplay(strategyData.chart_timeframe),
          tradeType: strategyData.trade_type || 'MIS',
          maxAllocation: strategyData.max_allocation?.toString() || '',
          maxQuantity: strategyData.qty?.toString() || '',
          entryConditions: strategyData.entry_expression,
          exitConditions: strategyData.exit_expression,
          stopLoss: strategyData.stop_loss?.toString() || '',
          stopLossType: strategyData.stop_loss_type || 'ABSOLUTE',
          targetProfit: strategyData.target_profit?.toString() || '',
          targetProfitType: strategyData.target_profit_type || 'ABSOLUTE',
          trailingStopLoss: strategyData.trailing_stop_loss?.toString() || '',
          entryStartTime: isNullTime(strategyData.entry_start_time) ? null : strategyData.entry_start_time,
          entryEndTime: isNullTime(strategyData.entry_end_time) ? null : strategyData.entry_end_time,
          startDate: dayjs(strategyData.start_date).format('YYYY-MM-DD'),
          endDate: dayjs(strategyData.end_date).format('YYYY-MM-DD'),
          brickSize: strategyData.brick_size?.toString() || '',
          brokerage: strategyData.brokerage?.toString() || '20',
          slippage: strategyData.slippage?.toString() || '0.5',
        };
        
        setStrategy(formData);

        // Fetch instrument details if needed
        if (strategyData.instruments?.length > 0) {
          fetchInstrumentDetails(strategyData.instruments);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch strategy');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchInstrumentDetails]);

  useEffect(() => {
    // Only proceed when we have strategy_id and the page is mounted
    if (!strategy_id) return;
    
    const initPage = async () => {
      // Check authentication once when the page loads
      const isAuthed = await checkPageAuth(router);
      
      // If authenticated, fetch the strategy data
      if (isAuthed && strategy_id) {
        fetchStrategy(strategy_id as string);
      }
    };
    
    initPage();
  }, [strategy_id, router, fetchStrategy]);

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
      <Box sx={{ textAlign: 'center', py: 4 }}>
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
      <Box sx={{ textAlign: 'center', py: 4 }}>
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
    <Box>
      <StrategyForm initialData={strategy} initialInstruments={instrumentDetails} pageTitle={`Edit Strategy: ${strategy.name}`} />
    </Box>
  );
}
