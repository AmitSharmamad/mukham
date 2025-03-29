import { Container, Typography, Button, List, ListItem, Box, Paper } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Define the type for a strategy
interface Strategy {
  id: string;
  name: string;
  description: string;
}

export default function StrategyList() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchStrategies() {
      try {
        const response = await axios.get('http://localhost:9090/strategy');
        if (response.data.result) {
          setStrategies(response.data.data);
        } else {
          console.error('Failed to fetch strategies');
        }
      } catch (error) {
        console.error('Error fetching strategies:', error);
      }
    }

    fetchStrategies();
  }, []);

  const handleStrategyClick = (strategy: Strategy) => {
    // Pass the strategy data to the builder page via state
    router.push({
      pathname: `/strategy/${strategy.id}`,
    }, undefined, { shallow: true });
    localStorage.setItem('selectedStrategy', JSON.stringify(strategy));
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">My Strategies</Typography>
        {strategies.length > 0 && (
          <Link href="/strategy/new" passHref style={{ textDecoration: 'none' }}>
            <Button variant="contained">
              Create Strategy
            </Button>
          </Link>
        )}
      </Box>

      {strategies.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Link href="/strategy/new" passHref style={{ textDecoration: 'none' }}>
            <Button variant="contained" size="large">
              Create Strategy
            </Button>
          </Link>
        </Box>
      ) : (
        <List sx={{ mt: 2 }}>
          {strategies.map((strat) => (
            <Paper
              key={strat.id}
              elevation={1}
              sx={{ mb: 2 }}
            >
              <ListItem 
                button 
                onClick={() => handleStrategyClick(strat)}
                sx={{ 
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Box>
                  <Typography color="text.primary" variant="h6">{strat.name}</Typography>
                  <Typography color="text.secondary" variant="body2">{strat.description}</Typography>
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
}
