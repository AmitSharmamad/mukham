import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { Card } from '../components/Card';
import Link from 'next/link';

const features = [
  {
    title: 'Strategy Builder',
    description: 'Build sophisticated trading strategies using our intuitive drag-and-drop interface. Combine multiple technical indicators and create custom entry/exit conditions.'
  },
  {
    title: 'Backtesting Engine',
    description: 'Test your strategies against historical data to validate their performance before deploying real money. Get detailed analytics and performance metrics.'
  },
  {
    title: 'Real-time Execution',
    description: 'Deploy your strategies to trade automatically in real-time. Monitor performance, get alerts, and adjust parameters on the fly.'
  },
  {
    title: 'Advanced Analytics',
    description: 'Track your trading performance with comprehensive reports and analytics. Monitor P&L, drawdown, Sharpe ratio, and other key metrics.'
  }
];

export default function Index() {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(45deg, #121212 30%, #1e1e1e 90%)' 
            : 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 4 
            }}
          >
            सूत्रम् - Professional Algo Trading Platform
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            color="text.secondary" 
            sx={{ mb: 6 }}
          >
            Empower your trading with data-driven strategies and automated execution
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            href="/strategy"
            sx={{ mr: 2 }}
          >
            Start Building Strategies
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            component={Link} 
            href="/docs"
          >
            Learn More
          </Button>
        </Container>
      </Box>

      {/* What is Algo Trading Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
          What is Algo Trading?
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              Algorithmic trading (algo trading) is the process of using computer programs and complex mathematical models to automate trading decisions. Instead of manually analyzing markets and executing trades, traders can define specific rules and conditions that, when met, automatically trigger trade entries and exits.
            </Typography>
            <Typography variant="body1" paragraph>
              This approach removes emotional bias from trading decisions and allows for:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>Faster execution of trades</li>
              <li>Systematic testing of trading ideas</li>
              <li>Consistent application of trading rules</li>
              <li>24/7 market monitoring</li>
              <li>Reduced human errors</li>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src="/algo-trading-illustration.png"
              alt="Algo Trading Illustration"
              sx={{ 
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Platform Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            Platform Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} key={feature.title}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Join thousands of traders who are already using सूत्रम् to automate their trading strategies.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            href="/strategy/new"
            sx={{ mt: 2 }}
          >
            Create Your First Strategy
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
