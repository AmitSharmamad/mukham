import { useEffect } from 'react';
import { Box, Grid, Typography, Container, Paper, alpha, useTheme } from '@mui/material';
import { Card } from '../components/Card';
import { useRouter } from 'next/router';
import { 
  MenuBook, 
  TrendingUp, 
  ShowChart, 
  AssessmentOutlined, 
  Code 
} from '@mui/icons-material';

const docSections = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using the Algo Trading Platform',
    path: '/docs/getting-started/introduction',
    icon: MenuBook,
    color: '#4caf50'
  },
  {
    title: 'Strategy',
    description: 'Learn how to create and customize trading strategies',
    path: '/docs/strategy/overview',
    icon: TrendingUp,
    color: '#2196f3'
  },
  {
    title: 'Indicators',
    description: 'Understanding technical indicators and their usage',
    path: '/docs/indicators/overview',
    icon: ShowChart,
    color: '#ff9800'
  },
  {
    title: 'Reports',
    description: 'Explore reports and performance analytics',
    path: '/docs/reports/overview',
    icon: AssessmentOutlined,
    color: '#9c27b0'
  },
  {
    title: 'Advanced',
    description: 'Advanced topics and best practices',
    path: '/docs/advanced/api-reference',
    icon: Code,
    color: '#f44336'
  },
];

export default function Docs() {
  const router = useRouter();
  const theme = useTheme();
  
  // Redirect to Introduction page if user lands on /docs
  useEffect(() => {
    // router.push('/docs/getting-started/introduction');
  }, [router]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 4, md: 6 }, 
          mb: 6, 
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: theme.palette.mode === 'dark'
            ? `linear-gradient(45deg, ${alpha(theme.palette.primary.dark, 0.8)}, ${alpha(theme.palette.primary.main, 0.4)})`
            : `linear-gradient(45deg, ${alpha(theme.palette.primary.light, 0.8)}, ${alpha(theme.palette.primary.main, 0.4)})`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 20% 20%, rgba(41, 41, 41, 0.3) 0%, rgba(0, 0, 0, 0) 50%)'
              : 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%)',
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary.contrastText,
              textAlign: 'center',
            }}
          >
            Documentation
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.9) : alpha(theme.palette.primary.contrastText, 0.9),
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            Everything you need to know about using Sutram - Your algo trading companion
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {docSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={section.path}>
              <Card
                component="a"
                href={section.path}
                sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease-in-out',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 10px 20px rgba(0,0,0,0.3)' 
                      : '0 10px 30px rgba(0,0,0,0.1)',
                    borderColor: alpha(section.color, 0.4),
                    '& .section-icon': {
                      backgroundColor: alpha(section.color, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                      color: section.color,
                      transform: 'scale(1.1)',
                    }
                  }
                }}
              >
                <Box 
                  className="section-icon"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    backgroundColor: alpha(section.color, theme.palette.mode === 'dark' ? 0.15 : 0.08),
                    color: alpha(section.color, theme.palette.mode === 'dark' ? 0.9 : 0.8),
                    mb: 3,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <IconComponent fontSize="large" />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 1.5,
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark, 
                  }}
                >
                  {section.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    lineHeight: 1.6
                  }}
                >
                  {section.description}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
