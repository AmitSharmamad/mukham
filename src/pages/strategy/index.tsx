import { Container, Typography, Button, List, ListItem, Box, Paper } from '@mui/material';
import Link from 'next/link';

export default function StrategyList() {
  // Demo strategies (update with real data)
  const strategies = [{ id: '1', name: 'Strategy 1' }];
  
  return (
    <Container sx={{ marginTop: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Strategy List</Typography>
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
              <Link href={`/strategy/${strat.id}`} passHref style={{ textDecoration: 'none' }}>
                <ListItem 
                  button 
                  sx={{ 
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <Typography color="text.primary">{strat.name}</Typography>
                </ListItem>
              </Link>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
}
