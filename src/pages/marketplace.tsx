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
  SelectChangeEvent,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Card } from '../components/Card';
import { DashboardWidget } from '../components/DashboardWidget';
import { Button } from '../components/Button';
import {
  getAllCategories,
  getFilteredListings,
  getUserSubscriptions,
  getSellerListings,
  Category,
  MarketplaceListing
} from '../services/marketplaceService';

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
      <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
        🛒 Coming Soon
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Marketplace features are under development
      </Typography>
    </Box>
  );
  
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('popularity');
  
  // API data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<any[]>([]);
  const [sellerListings, setSellerListings] = useState<MarketplaceListing[]>([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Load categories on component mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(controller.signal);
        if (isMounted) {
          setCategories(data);
        }
      } catch (err: any) {
        if (isMounted && err.name !== 'AbortError') {
          console.error("Error fetching categories:", err);
        }
      }
    };

    fetchCategories();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Load listings based on filters
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchListings = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      try {
        // Pass the abort signal to the API client
        const data = await getFilteredListings(
          selectedCategory,
          sortOrder,
          searchQuery,
          controller.signal
        );
        if (isMounted) {
          setListings(data);
        }
      } catch (err: any) {
        // Don't update state if the request was aborted or component unmounted
        if (isMounted && err.name !== 'AbortError') {
          console.error("Error fetching listings:", err);
          setError("Failed to load marketplace listings. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchListings();
    
    // Cleanup function to abort fetch on unmount or deps change
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchQuery, selectedCategory, sortOrder]);

  // Load user subscriptions and seller listings when tab changes
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    if (tabValue === 1) {
      // Load user's purchased strategies
      const fetchUserSubscriptions = async () => {
        if (!isMounted) return;
        
        setIsLoading(true);
        try {
          const data = await getUserSubscriptions(controller.signal);
          if (isMounted) {
            setUserSubscriptions(data);
          }
        } catch (err: any) {
          if (isMounted && err.name !== 'AbortError') {
            console.error("Error fetching user subscriptions:", err);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };
      fetchUserSubscriptions();
    } else if (tabValue === 2) {
      // Load user's listed strategies
      const fetchSellerListings = async () => {
        if (!isMounted) return;
        
        setIsLoading(true);
        try {
          const data = await getSellerListings(controller.signal);
          if (isMounted) {
            setSellerListings(data);
          }
        } catch (err: any) {
          if (isMounted && err.name !== 'AbortError') {
            console.error("Error fetching seller listings:", err);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };
      fetchSellerListings();
    }
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [tabValue]);

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
    <Box>
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
            value={(listings?.length || 0).toString()}
            subtitle="Ready to deploy" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget 
            title="My Subscriptions" 
            value={(userSubscriptions?.length || 0).toString()}
            subtitle="Active strategies" 
            href="/profile"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget 
            title="Trending" 
            value={listings?.length > 0 ? listings[0]?.title : "No trending strategies"}
            subtitle={`${listings?.length > 0 ? listings[0]?.views : 0} views`} 
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
                    {Array.isArray(categories) ? categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    )) : null}
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

          {/* Loading state */}
          {isLoading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Grid>
          ) : error ? (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          ) : listings?.length > 0 ? (
            // Display strategy listings
            listings.map((listing) => (
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
            // No results found
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
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : userSubscriptions?.length > 0 ? (
          <Grid container spacing={3}>
            {userSubscriptions.map((subscription) => (
              <Grid item xs={12} md={6} key={subscription.id}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6">{subscription.listing.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {formatSubscriptionType(subscription.subscription_type)} - 
                    {subscription.status === 'active' ? (
                      <Chip label="Active" color="success" size="small" sx={{ ml: 1 }} />
                    ) : (
                      <Chip label={subscription.status} color="default" size="small" sx={{ ml: 1 }} />
                    )}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleViewDetails(subscription.listing_id)}
                  >
                    View Strategy
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
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
        )}
      </TabPanel>

      {/* My Listed Strategies Tab */}
      <TabPanel value={tabValue} index={2}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : sellerListings?.length > 0 ? (
          <Grid container spacing={3}>
            {sellerListings.map((listing) => (
              <Grid item xs={12} md={6} key={listing.id}>
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{listing.title}</Typography>
                    <Typography variant="h6" color="primary">${listing.price}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {listing.views} views • {listing.ratings} ⭐
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => handleViewDetails(listing.id)}
                    >
                      View Listing
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => router.push(`/strategy/${listing.id}`)}
                    >
                      Edit Listing
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
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
        )}
      </TabPanel>
    </Box>
  );
}