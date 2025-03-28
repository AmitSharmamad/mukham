import { useRouter } from 'next/router';
import { Container, Typography } from '@mui/material';

export default function StrategyDetail() {
  const router = useRouter();
  const { strategy_id } = router.query;

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4">Strategy Builder - {strategy_id}</Typography>
      {/* ...existing form logic for editing strategy... */}
    </Container>
  );
}
