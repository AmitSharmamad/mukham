import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { StrategyForm } from '../../components/StrategyBuilder/StrategyForm';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { checkPageAuth } from '../../utils/pageAuthUtils';

export default function NewStrategy() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      // Check authentication once when the page loads
      const isAuthed = await checkPageAuth(router);
      if (isAuthed) {
        setLoading(false);
      }
    };
    
    initPage();
  }, [router]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <StrategyForm pageTitle="Create New Strategy" />
    </Box>
  );
}