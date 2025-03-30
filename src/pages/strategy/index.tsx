import { useState } from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

// This would come from an API in a real application
const mockStrategies = [
  {
    id: '1',
    name: 'EMA Crossover',
    description: 'A strategy based on EMA crossover signals',
    isActive: true,
  },
  {
    id: '2',
    name: 'RSI Reversal',
    description: 'RSI-based mean reversion strategy',
    isActive: false,
  },
];

export default function Strategy() {
  const router = useRouter();
  const theme = useTheme();
  const [strategies] = useState(mockStrategies);

  const handleCreateStrategy = () => {
    router.push('/strategy/new');
  };

  const handleStrategyClick = (id: string) => {
    router.push(`/strategy/${id}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Strategies</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateStrategy}
        >
          Create Strategy
        </Button>
      </Box>

      {strategies.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2
        }}>
          <Typography variant="h6" color="textSecondary">
            No strategies yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateStrategy}
          >
            Create Your First Strategy
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {strategies.map((strategy) => (
            <Grid item xs={12} sm={6} md={4} key={strategy.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => handleStrategyClick(strategy.id)}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {strategy.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {strategy.description}
                  </Typography>
                </Box>
                <Box sx={{ mt: 'auto' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: strategy.isActive ? theme.palette.success.main : theme.palette.error.main,
                    }}
                  >
                    {strategy.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
