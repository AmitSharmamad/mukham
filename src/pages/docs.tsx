import { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Card } from '../components/Card';
import { useRouter } from 'next/router';

const docSections = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using the Algo Trading Platform',
    path: '/docs/getting-started/introduction',
  },
  {
    title: 'Strategy',
    description: 'Learn how to create and customize trading strategies',
    path: '/docs/strategy/overview',
  },
  {
    title: 'Indicators',
    description: 'Understanding technical indicators and their usage',
    path: '/docs/indicators/overview',
  },
  {
    title: 'Reports',
    description: 'Explore reports and performance analytics',
    path: '/docs/reports/overview',
  },
  {
    title: 'Advanced',
    description: 'Advanced topics and best practices',
    path: '/docs/advanced/api-reference',
  },
];

export default function Docs() {
  const router = useRouter();
  
  // Redirect to Introduction page if user lands on /docs
  useEffect(() => {
    router.push('/docs/getting-started/introduction');
  }, [router]);

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
