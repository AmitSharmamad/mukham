import { Grid, Typography } from '@mui/material';
import { Card } from '../components/Card';

const navigationCards = [
  {
    title: 'Strategy',
    description: 'Create and manage your trading strategies',
    path: '/strategy',
  },
  {
    title: 'Reports',
    description: 'View your trading performance and analytics',
    path: '/reports',
  },
  {
    title: 'Documentation',
    description: 'Learn how to use the platform effectively',
    path: '/docs',
  },
];

export default function Home() {
  return (
    <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ minHeight: '70vh' }}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to सूत्रम्
        </Typography>
      </Grid>
      
      {navigationCards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.path}>
          <Card
            component="a"
            href={card.path}
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              {card.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {card.description}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
