import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import type { Strategy } from '../../types/strategy';

export default function StrategyList() {
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const response = await fetch('http://localhost:9090/strategy');
      const data = await response.json();
      
      if (data.result) {
        setStrategies(data.data);
      } else {
        setError('Failed to fetch strategies');
      }
    } catch (err) {
      setError('Error connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStrategy = () => {
    router.push('/strategy/new');
  };

  const handleStrategyClick = (id: string) => {
    router.push(`/strategy/${id}`);
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
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Strategies</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateStrategy}>
          Create Strategy
        </Button>
      </Box>

      {strategies.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" gutterBottom>No strategies found</Typography>
          <Button variant="contained" color="primary" onClick={handleCreateStrategy}>
            Create Your First Strategy
          </Button>
        </Box>
      ) : (
        <Box display="grid" gap={3} gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))">
          {strategies.map((strategy) => (
            <Card 
              key={strategy.id} 
              onClick={() => handleStrategyClick(strategy.id)}
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>{strategy.name}</Typography>
                <Typography color="textSecondary" noWrap>{strategy.description}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Position: {strategy.position_type}
                </Typography>
                <Typography variant="body2">
                  Created: {new Date(strategy.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
