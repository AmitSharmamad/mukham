import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { CheckCircle as CheckIcon, Star as StarIcon } from '@mui/icons-material';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started with basic features',
    features: [
      'Up to 3 strategies',
      'Basic backtesting',
      'Community support',
      'Email notifications',
      'Basic charts'
    ],
    cta: 'Get Started'
  },
  {
    name: 'Pro',
    price: '₹29',
    period: 'month',
    description: 'Ideal for serious traders and small teams',
    features: [
      'Unlimited strategies',
      'Advanced backtesting',
      'Priority support',
      'Real-time alerts',
      'Advanced charts',
      'API access',
      'Custom indicators'
    ],
    popular: true,
    cta: 'Start Pro Trial'
  },
  {
    name: 'Advanced',
    price: '₹99',
    period: 'month',
    description: 'For professional traders and growing teams',
    features: [
      'Everything in Pro',
      'Multi-account management',
      'Advanced analytics',
      'Custom integrations',
      'White-label options',
      'Dedicated support',
      'Risk management tools',
      'Portfolio optimization'
    ],
    cta: 'Choose Advanced'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'Tailored solutions for large organizations',
    features: [
      'Everything in Advanced',
      'Custom development',
      'On-premise deployment',
      'SLA guarantees',
      'Training & onboarding',
      'Unlimited users',
      'Advanced security',
      'Compliance support'
    ],
    cta: 'Contact Sales'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Pricing() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" component="h1" sx={{ fontSize: '2rem', fontWeight: 500 }}>
        📧 Please contact support@sutram.co
      </Typography>
    </Box>
  );
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 400,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, #fff 30%, #ccc 90%)'
                  : 'linear-gradient(45deg, #333 30%, #666 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Choose Your Plan
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              Select the perfect plan for your trading needs. Upgrade or downgrade at any time.
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} sm={6} lg={3} key={plan.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    elevation={plan.popular ? 8 : 2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      border: plan.popular 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : 'none',
                      transform: plan.popular && !isMobile ? 'scale(1.05)' : 'none',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: plan.popular && !isMobile 
                          ? 'scale(1.08)' 
                          : 'translateY(-4px)',
                        boxShadow: theme.shadows[12]
                      }
                    }}
                  >
                    {plan.popular && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 1
                        }}
                      >
                        <Chip
                          icon={<StarIcon />}
                          label="Most Popular"
                          color="primary"
                          variant="filled"
                          sx={{
                            fontWeight: 'bold',
                            px: 2
                          }}
                        />
                      </Box>
                    )}

                    <Box sx={{ p: 3, textAlign: 'center', flexGrow: 1 }}>
                      <Typography variant="h4" component="h3" gutterBottom>
                        {plan.name}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h3"
                          component="span"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {plan.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                          sx={{ ml: 1 }}
                        >
                          /{plan.period}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3, minHeight: 40 }}
                      >
                        {plan.description}
                      </Typography>

                      <List dense sx={{ mb: 3 }}>
                        {plan.features.map((feature, featureIndex) => (
                          <ListItem key={featureIndex} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckIcon 
                                color="primary" 
                                sx={{ fontSize: 20 }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{
                                variant: 'body2',
                                color: 'text.primary'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Box sx={{ p: 3, pt: 0 }}>
                      <Button
                        variant={plan.popular ? 'contained' : 'outlined'}
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: '1rem'
                        }}
                      >
                        {plan.cta}
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box textAlign="center" mt={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              All plans include a 14-day free trial. No credit card required.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Questions? <Button variant="text" size="small">Contact our sales team</Button>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
