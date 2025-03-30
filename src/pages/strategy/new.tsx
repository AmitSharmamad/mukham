import { Box, Typography } from '@mui/material';
import { StrategyForm } from '../../components/StrategyBuilder/StrategyForm';

export default function NewStrategy() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Strategy
      </Typography>
      <StrategyForm />
    </Box>
  );
}