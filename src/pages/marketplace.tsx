import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Tabs, 
  Tab, 
  TextField, 
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Card } from '../components/Card';
import { DashboardWidget } from '../components/DashboardWidget';
import { Button } from '../components/Button';

// Mock categories data
const categories = [
  { id: '1', name: 'Trend Following', description: 'Strategies that follow market trends' },
  { id: '2', name: 'Mean Reversion', description: 'Strategies that capitalize on price reversals' },
  { id: '3', name: 'Momentum', description: 'Strategies based on momentum indicators' },
  { id: '4', name: 'Arbitrage', description: 'Strategies that exploit price differences' },
  { id: '5', name: 'Breakout', description: 'Strategies that trade on price breakouts' },
  { id: '6', name: 'Volatility', description: 'Strategies that trade based on market volatility' },
  { id: '7', name: 'Options', description: 'Strategies focused on options trading' },
  { id: '8', name: 'Multi-Factor', description: 'Strategies using multiple factors for decisions' }
];

// Mock marketplace listings
const mockMarketplaceListings = [
  {
    id: '1',
    title: 'Advanced Momentum Strategy',
    description: 'A strategy that uses multiple momentum indicators to identify strong trends',
    price: 49.99,
    subscription_type: 'monthly',
    user_id: '1',
    ratings: 4.5,
    views: 1250,
    categoryIds: ['3', '8'],
    performance: {
      sharpe_ratio: 1.8,
      total_return_pct: 32.5,
      win_rate: 68.7,
    }
  },
  {
    id: '2',
    title: 'Classic Mean Reversion',
    description: 'Identifies overbought and oversold conditions to capitalize on price reversals',
    price: 99.00,
    subscription_type: 'one-time',
    user_id: '2',
    ratings: 4.2,
    views: 875,
    categoryIds: ['2'],
    performance: {
      sharpe_ratio: 1.5,
      total_return_pct: 28.3,
      win_rate: 62.1,
    }
  },
  {
    id: '3',
    title: 'Volatility Breakout Detector',
    description: 'Takes advantage of high volatility periods to identify breakouts',
    price: 79.99,
    subscription_type: 'yearly',
    user_id: '3',
    ratings: 4.8,
    views: 2100,
    categoryIds: ['5', '6'],
    performance: {
      sharpe_ratio: 2.1,
      total_return_pct: 41.2,
      win_rate: 73.5,
    }
  },
  {
    id: '4',
    title: 'Options Premium Collector',
    description: 'Consistently collects premium through strategic options selling',
    price: 129.99,
    subscription_type: 'monthly',
    user_id: '2',
    ratings: 4.1,
    views: 940,
    categoryIds: ['7'],
    performance: {
      sharpe_ratio: 1.2,
      total_return_pct: 22.8,
      win_rate: 85.3,
    }
  },
  {
    id: '5',
    title: 'Trend-Following ETF Rotator',
    description: 'Rotates between different ETFs based on trend strength indicators',
    price: 59.99,
    subscription_type: 'monthly',
    user_id: '4',
    ratings: 3.9,
    views: 720,
    categoryIds: ['1', '8'],
    performance: {
      sharpe_ratio: 1.6,
      total_return_pct: 31.7,
      win_rate: 65.9,
    }
  }
];

// Tab interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`marketplace-tabpanel-${index}`}
      aria-labelledby={`marketplace-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `marketplace-tab-${index}`,
    'aria-controls': `marketplace-tabpanel-${index}`,
  };
}

export default function Marketplace() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('popularity');
  const [filteredListings, setFilteredListings] = useState(mockMarketplaceListings);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value);
  };

  const handleViewDetails = (listingId: string) => {
    router.push(`/marketplace/${listingId}`);
  };

  // Apply filters and sorting
  useEffect(() => {
    let listings = [...mockMarketplaceListings];
    
    // Apply search filter
    if (searchQuery) {
      listings = listings.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      listings = listings.filter(item => item.categoryIds.includes(selectedCategory));
    }
    
    // Apply sorting
    switch(sortOrder) {
      case 'price_low':
        listings.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        listings.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        listings.sort((a, b) => b.ratings - a.ratings);
        break;
      case 'popularity':
      default:
        listings.sort((a, b) => b.views - a.views);
        break;
    }
    
    setFilteredListings(listings);
  }, [searchQuery, selectedCategory, sortOrder]);

  // Get category names for a listing
  const getCategoryNames = (categoryIds: string[]) => {
    return categoryIds.map(id => {
      const category = categories.find(cat => cat.id === id);
      return category ? category.name : '';
    }).filter(Boolean);
  };

  // Format subscription type for display
  const formatSubscriptionType = (type: string) => {
    switch(type) {
      case 'one-time':
        return 'One-time purchase';
      case 'monthly':
        return 'Monthly subscription';
      case 'yearly':
        return 'Annual subscription';
      default:
        return type;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Strategy Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and purchase algorithmic trading strategies from expert traders
        </Typography>
      </Box>

      {/* Summary widgets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget 
            title="Available Strategies" 
            value={mockMarketplaceListings.length.toString()}
            subtitle="Ready to deploy" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget 
            title="My Subscriptions" 
            value="0"
            subtitle="Active strategies" 
            href="/profile"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget 
            title="Trending" 
            value={mockMarketplaceListings[0]?.title || "No trending strategies"}
            subtitle={`${mockMarketplaceListings[0]?.views || 0} views`} 
          />
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="marketplace tabs">
          <Tab label="Browse Strategies" {...a11yProps(0)} />
          <Tab label="My Purchased Strategies" {...a11yProps(1)} />
          <Tab label="My Listed Strategies" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* Browse Strategies Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Filters section */}
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search strategies"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    label="Category"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value="">
                      <em>All Categories</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="sort-select-label">Sort by</InputLabel>
                  <Select
                    labelId="sort-select-label"
                    id="sort-select"
                    value={sortOrder}
                    label="Sort by"
                    onChange={handleSortChange}
                  >
                    <MenuItem value="popularity">Popularity</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Strategy listings */}
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <Grid item xs={12} md={6} key={listing.id}>
                <Card 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => `0 8px 16px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`
                    }
                  }}
                  onClick={() => handleViewDetails(listing.id)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {listing.title}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${listing.price}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {listing.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                    {getCategoryNames(listing.categoryIds).map((category, index) => (
                      <Chip key={index} label={category} size="small" />
                    ))}
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatSubscriptionType(listing.subscription_type)}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Sharpe
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {listing.performance.sharpe_ratio}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Return %
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {listing.performance.total_return_pct}%
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Win Rate
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {listing.performance.win_rate}%
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      ⭐ {listing.ratings} ({listing.views} views)
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleViewDetails(listing.id);
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6">
                  No strategies found matching your criteria
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your filters or search query
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* My Purchased Strategies Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6">
            You haven't purchased any strategies yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Browse the marketplace to find and subscribe to strategies
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setTabValue(0)}
          >
            Browse Strategies
          </Button>
        </Box>
      </TabPanel>

      {/* My Listed Strategies Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6">
            You haven't listed any strategies for sale
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Share your successful trading strategies with others and earn revenue
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            href="/strategy"
          >
            Manage My Strategies
          </Button>
        </Box>
      </TabPanel>
    </Container>
  );
}