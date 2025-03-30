import { Box, Grid, Typography } from '@mui/material';
import { Card } from '../components/Card';

const docSections = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using the Algo Trading Platform',
    path: '/docs/getting-started',
  },
  {
    title: 'Building Strategies',
    description: 'Learn how to create and customize trading strategies',
    path: '/docs/building-strategies',
  },
  {
    title: 'Platform Features',
    description: 'Explore all features and capabilities of the platform',
    path: '/docs/features',
  },
  {
    title: 'Technical Indicators',
    description: 'Understanding technical indicators and their usage',
    path: '/docs/indicators',
  },
  {
    title: 'Backtesting',
    description: 'Learn how to backtest your strategies effectively',
    path: '/docs/backtesting',
  },
  {
    title: 'FAQs',
    description: 'Frequently asked questions and troubleshooting',
    path: '/docs/faqs',
  },
];

export default function Docs() {
  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Documentation
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Everything you need to know about using सूत्रम्
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {docSections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.path}>
            <Card
              component="a"
              href={section.path}
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                p: 3,
                textDecoration: 'none',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <Typography variant="h6" gutterBottom>
                {section.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {section.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
