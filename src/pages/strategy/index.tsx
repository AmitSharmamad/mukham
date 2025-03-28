import { Container, Typography, Button, List, ListItem } from '@mui/material';
import Link from 'next/link';

export default function StrategyList() {
  // Demo strategies (update with real data)
  const strategies = [{ id: '1', name: 'Strategy 1' }];
  
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4">Strategy List</Typography>
      {strategies.length > 0 ? (
        <Link href="/strategy/new" passHref style={{ textDecoration: 'none' }}>
          <Button variant="contained" sx={{ float: 'right' }}>
            Create Strategy
          </Button>
        </Link>
      ) : (
        <Link href="/strategy/new" passHref style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
          <Button variant="contained" sx={{ margin: 'auto' }}>
            Create Strategy
          </Button>
        </Link>
      )}
      <List>
        {strategies.map((strat) => (
          <Link key={strat.id} href={`/strategy/${strat.id}`} passHref style={{ textDecoration: 'none' }}>
            <ListItem button>
              {strat.name}
            </ListItem>
          </Link>
        ))}
      </List>
    </Container>
  );
}
