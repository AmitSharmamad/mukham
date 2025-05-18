import { Box, Typography, Grid } from '@mui/material';
import { StrategyForm } from '../../components/StrategyBuilder/StrategyForm';

export default function NewStrategy() {
  return (
    <Box>
      <StrategyForm pageTitle="Create New Strategy" />
    </Box>
  );
}