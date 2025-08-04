import { Box, Container, Typography, Grid, Button, Chip, Stack, IconButton, useTheme as useMuiTheme, Tooltip } from '@mui/material';
import { Card } from '../components/Card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  BarChart as BarChartIcon,
  PlayCircle as PlayCircleIcon,
  Rocket as RocketLaunchIcon,
  Shield as ShieldCheckIcon,
  Lightbulb as LightBulbIcon,
  Memory as CpuChipIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const tradingTypes = [
  {
    title: 'Equity',
    description: 'Trade stocks with automated strategies. Perfect for momentum trading and day trading with advanced technical indicators.',
    icon: TrendingUpIcon,
    color: '#4CAF50'
  },
  {
    title: 'F&O',
    description: 'Futures & Options trading with high accuracy. Execute complex strategies with precision timing and risk management.',
    icon: BarChartIcon,
    color: '#FF9800'
  },
  {
    title: 'Commodities',
    description: 'Trade commodities like Gold, Silver, Crude Oil, and Natural Gas with sophisticated algorithmic strategies.',
    icon: ShieldCheckIcon,
    color: '#2196F3'
  }
];

const algoTradingBenefits = [
  {
    title: 'Lightning-fast execution',
    description: 'Execute trades in milliseconds, faster than human reflexes',
    color: '#4CAF50'
  },
  {
    title: 'Systematic strategy testing',
    description: 'Backtest strategies with years of historical data',
    color: '#2196F3'
  },
  {
    title: 'Consistent rule application',
    description: 'Never miss a trade or deviate from your strategy',
    color: '#FF9800'
  },
  {
    title: '24/7 market monitoring',
    description: 'Monitor markets round the clock without fatigue',
    color: '#9C27B0'
  },
  {
    title: 'Zero emotional bias',
    description: 'Remove fear and greed from trading decisions',
    color: '#F44336'
  },
  {
    title: 'Reduced human errors',
    description: 'Eliminate manual mistakes and calculation errors',
    color: '#FF5722'
  }
];

const optionsTradingBenefits = [
  {
    title: 'Conditional Based',
    description: 'Execute options strategies based on sophisticated market conditions and technical indicators',
    color: '#673AB7'
  },
  {
    title: 'Time Based',
    description: 'Automate options trading with precise time-based execution for optimal theta decay management',
    color: '#E91E63'
  }
];

const features = [
  {
    title: 'No Code Builder',
    description: 'Create sophisticated trading strategies without writing a single line of code. Use our intuitive interface to build complex logic.',
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
    description: 'Deploy your proven strategies to trade automatically in real-time.',
    icon: RocketLaunchIcon,
    color: '#4CAF50',
    comingSoon: true
  },
  {
    title: 'Scanners',
    description: 'Advanced market scanners to identify trading opportunities based on technical and fundamental criteria.',
    icon: BarChartIcon,
    color: '#2196F3',
    comingSoon: true
  },
  {
    title: 'Marketplace',
    description: 'Access a marketplace of proven strategies created by SEBI registered research analysts.',
    icon: ShieldCheckIcon,
    color: '#FF9800',
    comingSoon: true
  },
  {
    title: 'Community',
    description: 'Connect with fellow traders, share insights, and learn from experienced algorithmic trading professionals.',
    icon: PeopleIcon,
    color: '#673AB7',
    comingSoon: true
  }
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleOnHover = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export default function Index() {
  const muiTheme = useMuiTheme();
  const { mode, toggleMode } = useTheme();

  return (
    <>
      {/* Hero Section with Waitlist CTA */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Box 
              sx={{ 
                py: { xs: 8, md: 12 },
                px: { xs: 4, md: 6 },
                textAlign: 'center',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Floating background elements */}
              {/* Green circle moved to bottom left */}
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '10%',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'rgba(76, 175, 80, 0.1)',
                  zIndex: 1
                }}
              />
              {/* Red circle moved to top right */}
              <motion.div
                animate={{
                  y: [0, 15, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                style={{
                  position: 'absolute',
                  top: '10%',
                  right: '15%',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(244, 67, 54, 0.1)',
                  zIndex: 1
                }}
              />

              
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                {/* Promotional Offer Banner */}
                <motion.div variants={fadeInUp}>
                  <Chip
                    label="LIMITED TIME: 20% Flat Off for First 6 Months who sign up for Beta"
                    sx={{
                      mb: 4,
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                      fontWeight: 600,
                      py: 1,
                      px: { xs: 2, sm: 3 },
                      height: 'auto',
                      minHeight: 'auto',
                      bgcolor: 'warning.light',
                      color: 'warning.contrastText',
                      maxWidth: { xs: '100%', sm: 'none' },
                      '& .MuiChip-label': {
                        py: 1,
                        px: { xs: 1, sm: 2 },
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        lineHeight: 1.3,
                        wordBreak: 'break-word'
                      }
                    }}
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h1" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      color: 'text.primary'
                    }}
                  >
                    Sutram - Algo Trading 
                  </Typography>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    sx={{ 
                      mb: 4,
                      fontWeight: 300,
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                      color: 'text.secondary'
                    }}
                  >
                    Transform Your Trading with Intelligent Automation
                  </Typography>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 6,
                      maxWidth: '600px',
                      mx: 'auto',
                      lineHeight: 1.6,
                      color: 'text.secondary'
                    }}
                  >
                    Experience the future of trading with our cutting-edge algorithmic trading platform. 
                    Build, test, and deploy sophisticated strategies across equity, futures, and options markets.
                  </Typography>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={3} 
                    justifyContent="center"
                    alignItems="center"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                        Join Waitlist 🚀
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                    </motion.div>
                  </Stack>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Box>

      {/* Why Algo Trading Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
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
                Key Benefits
              </Typography>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Typography 
                variant="h6" 
                align="center"
                sx={{ 
                  mb: 6,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  color: 'text.secondary'
                }}
              >
                Algorithmic trading automates your trading decisions using sophisticated computer programs 
                and mathematical models. Instead of manually watching markets and executing trades, you define 
                specific rules that automatically trigger trades when conditions are met.
              </Typography>
            </motion.div>
            
            <Grid container spacing={4}>
              {algoTradingBenefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 3,
                        height: '100%',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: `${benefit.color}20`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 24px ${benefit.color}20`,
                          borderColor: `${benefit.color}40`
                        }
                      }}
                    >
                      <Chip
                        label={benefit.title}
                        sx={{
                          bgcolor: `${benefit.color}20`,
                          color: benefit.color,
                          fontWeight: 900,
                          mb: 2,
                          fontSize: '0.9rem',
                          px: 2,
                          py: 1,
                          minHeight: '36px',
                          height: 'auto',
                          '& .MuiChip-label': {
                            fontWeight: 900,
                            whiteSpace: 'normal',
                            textAlign: 'center',
                            lineHeight: 1.2,
                            padding: '4px 8px'
                          }
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '0.95rem',
                          color: 'text.secondary',
                          lineHeight: 1.5
                        }}
                      >
                        {benefit.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

      {/* Platform Features Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
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
                Unleash your potential with
              </Typography>
            </motion.div>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      sx={{ 
                        height: '100%',
                        p: 4,
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                          borderColor: feature.color
                        }
                      }}
                    >
                      {feature.comingSoon && (
                        <Chip
                          label="Coming Soon"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: 'warning.light',
                            color: 'warning.contrastText',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3
                          }}
                        >
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
                        </motion.div>
                        
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
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

      {/* Trading Types Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
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
                Multiple Segments
              </Typography>
            </motion.div>
            
            <Grid container spacing={4}>
              {tradingTypes.map((type, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover="hover"
                  >
                    <motion.div variants={scaleOnHover}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          p: 4,
                          textAlign: 'center',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                          border: '1px solid',
                          borderColor: `${type.color}20`,
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: '400px',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 20px 40px ${type.color}30`,
                            borderColor: `${type.color}40`
                          }
                        }}
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.5
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
                        </motion.div>
                        
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 'bold',
                            color: type.color,
                            fontSize: '1.5rem',
                            minHeight: '2em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                          }}
                        >
                          {type.title}
                        </Typography>
                        
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{ 
                            lineHeight: 1.6,
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {type.description}
                        </Typography>
                      </Card>
                    </motion.div>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

      {/* Trade your favourite Options Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
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
                Trade your favourite Options
              </Typography>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Typography 
                variant="h6" 
                align="center"
                sx={{ 
                  mb: 6,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  color: 'text.secondary'
                }}
              >
                Maximize your options trading potential with automated strategies designed for the options market. 
                Whether you're trading intraday or managing multi-day positions, our platform provides the tools 
                you need for sophisticated options trading.
              </Typography>
            </motion.div>
            
            <Grid container spacing={4}>
              {optionsTradingBenefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 4,
                        height: '100%',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: `${benefit.color}20`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 24px ${benefit.color}20`,
                          borderColor: `${benefit.color}40`
                        }
                      }}
                    >
                      <Chip
                        label={benefit.title}
                        sx={{
                          bgcolor: `${benefit.color}20`,
                          color: benefit.color,
                          fontWeight: 900,
                          mb: 2,
                          fontSize: '0.9rem',
                          px: 2,
                          py: 1,
                          minHeight: '36px',
                          height: 'auto',
                          '& .MuiChip-label': {
                            fontWeight: 900,
                            whiteSpace: 'normal',
                            textAlign: 'center',
                            lineHeight: 1.2,
                            padding: '4px 8px'
                          }
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '0.95rem',
                          color: 'text.secondary',
                          lineHeight: 1.5
                        }}
                      >
                        {benefit.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

      {/* Call to Action Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Box 
                sx={{ 
                  py: { xs: 8, md: 12 },
                  px: { xs: 4, md: 6 },
                  textAlign: 'center',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Animated background elements */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-20%',
                    width: '140%',
                    height: '140%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    zIndex: 1
                  }}
                />
                
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <motion.div variants={fadeInUp}>
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
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 4,
                        opacity: 0.9,
                        lineHeight: 1.6
                      }}
                    >
                      Get early access to our revolutionary platform and start building your financial future today.
                    </Typography>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={3} 
                      justifyContent="center"
                      alignItems="center"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        animate={{ 
                          boxShadow: [
                            "0 0 0 0 rgba(255,255,255,0.7)",
                            "0 0 0 10px rgba(255,255,255,0)",
                            "0 0 0 0 rgba(255,255,255,0)"
                          ]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
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
                          Join Waitlist Now 🚀
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                      </motion.div>
                    </Stack>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </motion.div>
        </Box>
    </>
  );
}
