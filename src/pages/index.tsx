import { Box, Container, Typography, Grid, Button, Chip, Stack } from '@mui/material';
import { Card } from '../components/Card';
import Link from 'next/link';
import { 
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  BarChart as BarChartIcon,
  PlayCircle as PlayCircleIcon,
  Rocket as RocketLaunchIcon,
  Shield as ShieldCheckIcon,
  Lightbulb as LightBulbIcon,
  Memory as CpuChipIcon
} from '@mui/icons-material';

const tradingTypes = [
  {
    title: 'Equity Trading',
    description: 'Trade stocks and shares with automated strategies. Perfect for long-term investing and day trading with advanced technical indicators.',
    icon: TrendingUpIcon,
    color: '#4CAF50'
  },
  {
    title: 'Futures Trading',
    description: 'Leverage futures contracts for commodities, indices, and currencies. Benefit from high leverage and round-the-clock trading opportunities.',
    icon: BarChartIcon,
    color: '#FF9800'
  },
  {
    title: 'Options Trading',
    description: 'Execute complex options strategies with precision. From simple calls/puts to advanced spreads and combinations.',
    icon: ShieldCheckIcon,
    color: '#2196F3'
  }
];

const features = [
  {
    title: 'No Code Builder',
    description: 'Create sophisticated trading strategies without writing a single line of code. Use our intuitive drag-and-drop interface to build complex logic.',
    icon: CodeIcon,
    color: '#9C27B0'
  },
  {
    title: 'Backtesting',
    description: 'Test your strategies against years of historical data. Get detailed performance metrics and optimize your approach before going live.',
    icon: CpuChipIcon,
    color: '#FF5722'
  },
  {
    title: 'Paper Trading',
    description: 'Practice with virtual money in real market conditions. Perfect your strategy without any financial risk.',
    icon: LightBulbIcon,
    color: '#FFC107'
  },
  {
    title: 'Live Trading',
    description: 'Deploy your proven strategies to trade automatically in real-time. Monitor performance and adjust parameters on the fly.',
    icon: RocketLaunchIcon,
    color: '#4CAF50'
  }
];

export default function Index() {
  return (
    <Box>
      {/* Hero Section with Waitlist CTA */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box 
          sx={{ 
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            py: { xs: 8, md: 12 },
            px: { xs: 4, md: 6 },
            textAlign: 'center',
            color: 'white',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Chip 
              label="🚀 Join Early Access 🚀"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: '1rem',
                px: 2,
                py: 1
              }} 
            />
          </Box>
          
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4rem' }
            }}
          >
            सूत्रम् - Algo Trading
          </Typography>
          
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              fontWeight: 300,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Transform Your Trading with Intelligent Automation
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 6,
              opacity: 0.8,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Experience the future of trading with our cutting-edge algorithmic trading platform. 
            Build, test, and deploy sophisticated strategies across equity, futures, and options markets.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
            alignItems="center"
          >
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              href="/waitlist"
              sx={{ 
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                borderRadius: 3
              }}
            >
              Join Waitlist
            </Button>
            
            <Button 
              variant="outlined" 
              size="large" 
              component={Link} 
              href="/docs"
              sx={{ 
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                borderRadius: 3
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* What is Algo Trading Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                color: 'primary.main'
              }}
            >
              What is Algo Trading?
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              Algorithmic trading automates your trading decisions using sophisticated computer programs 
              and mathematical models. Instead of manually watching markets and executing trades, you define 
              specific rules that automatically trigger trades when conditions are met.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              This revolutionary approach eliminates emotional trading and provides:
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {[
                'Lightning-fast execution',
                'Systematic strategy testing',
                'Consistent rule application',
                '24/7 market monitoring',
                'Zero emotional bias',
                'Reduced human errors'
              ].map((benefit, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main' 
                      }} 
                    />
                    <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                      {benefit}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                height: 400,
                borderRadius: 4,
                background: (theme) => theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, #2a2a3e 30%, #3a3a5e 90%)' 
                  : 'linear-gradient(45deg, #f5f7fa 30%, #c3cfe2 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  opacity: 0.7,
                  textAlign: 'center',
                  px: 4
                }}
              >
                📊 Real-time Analytics
                <br />
                🤖 Automated Execution
                <br />
                📈 Smart Strategies
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Trading Types Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 6,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Trade Across All Markets
          </Typography>
          
          <Grid container spacing={4}>
            {tradingTypes.map((type, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    p: 4,
                    textAlign: 'center',
                    border: `2px solid ${type.color}20`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${type.color}30`,
                      border: `2px solid ${type.color}40`
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: `${type.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    <type.icon 
                      sx={{ 
                        fontSize: 40,
                        color: type.color
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: type.color
                    }}
                  >
                    {type.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {type.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Platform Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 6,
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          Powerful Features, Simple Interface
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  p: 4,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    borderColor: feature.color
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box 
                    sx={{ 
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      bgcolor: `${feature.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <feature.icon 
                      sx={{ 
                        fontSize: 24,
                        color: feature.color
                      }} 
                    />
                  </Box>
                  
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        color: feature.color
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 },
            px: { xs: 4, md: 6 },
            textAlign: 'center',
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Ready to Transform Your Trading?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              lineHeight: 1.6
            }}
          >
            Join thousands of traders who are already using सूत्रम् to automate their trading strategies. 
            Get early access to our revolutionary platform and start building your financial future today.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
            alignItems="center"
          >
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              href="/waitlist"
              sx={{ 
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                borderRadius: 3
              }}
            >
              🚀 Join Waitlist Now 🚀
            </Button>
            
            <Button 
              variant="outlined" 
              size="large" 
              component={Link} 
              href="/docs"
              sx={{ 
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                borderRadius: 3
              }}
            >
              📚 Documentation
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
