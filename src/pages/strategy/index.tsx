import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, CircularProgress, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import type { Strategy } from '../../types/strategy';

export default function StrategyList() {
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStrategies();
  }, []);

  useEffect(() => {
    // Filter strategies based on search query
    const filtered = strategies.filter(strategy => 
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (strategy.description && strategy.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredStrategies(filtered);
  }, [searchQuery, strategies]);

  const fetchStrategies = async () => {
    try {
      const response = await fetch('http://localhost:9090/strategy');
      const data = await response.json();
      
      if (data.result) {
        setStrategies(data.data);
        setFilteredStrategies(data.data);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
      <Box display="flex" alignItems="center" gap={3} mb={4}>
        <Typography variant="h4">Strategies</Typography>
        {strategies.length > 0 && (
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search strategies..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: '300px',
              backgroundColor: 'background.paper',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        )}
        <Box flexGrow={1} />
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
      ) : filteredStrategies.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" gutterBottom>No matching strategies found</Typography>
          <Typography color="textSecondary">Try adjusting your search query</Typography>
        </Box>
      ) : (
        <Box display="grid" gap={3} gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))">
          {filteredStrategies.map((strategy) => (
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
