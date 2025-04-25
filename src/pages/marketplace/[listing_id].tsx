import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Paper, 
  Chip,
  Divider,
  Rating,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button } from '../../components/Button';

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
    description: 'A strategy that uses multiple momentum indicators to identify strong trends in the market. This strategy combines RSI, MACD, and Moving Average crossovers to generate high-probability trade signals. Best suited for trending markets across multiple timeframes.',
    price: 49.99,
    subscription_type: 'monthly',
    user_id: '1',
    sellerName: 'TrendTrader',
    sellerRating: 4.7,
    ratings: 4.5,
    reviews: 32,
    views: 1250,
    categoryIds: ['3', '8'],
    performance: {
      sharpe_ratio: 1.8,
      sortino_ratio: 2.4,
      total_return_pct: 32.5,
      annualized_return: 24.7,
      max_drawdown: 12.3,
      win_rate: 68.7,
      profit_factor: 2.1,
      backtest_period_days: 365
    },
    features: [
      'Advanced momentum detection algorithm',
      'Multi-timeframe analysis',
      'Automatic position sizing',
      'Risk management rules',
      'Email and SMS alerts'
    ],
    created_at: '2024-02-15T13:45:22Z',
    last_updated: '2024-04-01T09:20:45Z'
  },
  {
    id: '2',
    title: 'Classic Mean Reversion',
    description: 'Identifies overbought and oversold conditions to capitalize on price reversals',
    price: 99.00,
    subscription_type: 'one-time',
    user_id: '2',
    sellerName: 'ReversalPro',
    sellerRating: 4.2,
    ratings: 4.2,
    reviews: 18,
    views: 875,
    categoryIds: ['2'],
    performance: {
      sharpe_ratio: 1.5,
      sortino_ratio: 1.9,
      total_return_pct: 28.3,
      annualized_return: 18.7,
      max_drawdown: 15.8,
      win_rate: 62.1,
      profit_factor: 1.8,
      backtest_period_days: 730
    },
    features: [
      'Bollinger Bands mean reversion signals',
      'RSI and Stochastic oscillator filtering',
      'Dynamic stop loss calculation',
      'Automatic trade execution',
      'Daily performance reports'
    ],
    created_at: '2023-11-05T10:32:18Z',
    last_updated: '2024-03-12T14:15:33Z'
  },
  {
    id: '3',
    title: 'Volatility Breakout Detector',
    description: 'Takes advantage of high volatility periods to identify breakouts',
    price: 79.99,
    subscription_type: 'yearly',
    user_id: '3',
    sellerName: 'BreakoutMaster',
    sellerRating: 4.9,
    ratings: 4.8,
    reviews: 45,
    views: 2100,
    categoryIds: ['5', '6'],
    performance: {
      sharpe_ratio: 2.1,
      sortino_ratio: 2.7,
      total_return_pct: 41.2,
      annualized_return: 31.5,
      max_drawdown: 18.2,
      win_rate: 73.5,
      profit_factor: 2.4,
      backtest_period_days: 545
    },
    features: [
      'ATR-based volatility analysis',
      'Volume confirmation',
      'Multiple timeframe breakout confirmation',
      'Quick entry execution',
      'Trailing stop management'
    ],
    created_at: '2024-01-22T09:12:44Z',
    last_updated: '2024-04-15T11:30:21Z'
  }
];

// Mock reviews
const mockReviews = [
  {
    id: '1',
    listing_id: '1',
    user_id: 'u1',
    username: 'TradingPro88',
    rating: 5,
    comment: 'Excellent strategy, consistently profitable in trending markets. The alerts are very timely.',
    created_at: '2024-03-22T14:25:18Z'
  },
  {
    id: '2',
    listing_id: '1',
    user_id: 'u2',
    username: 'AlgoTrader247',
    rating: 4,
    comment: 'Good performance overall, but sometimes gives false signals in choppy markets. Still worth the price though.',
    created_at: '2024-03-15T09:12:45Z'
  },
  {
    id: '3',
    listing_id: '1',
    user_id: 'u3',
    username: 'InvestorElite',
    rating: 5,
    comment: 'One of the best strategies I\'ve used. Great risk/reward ratio and easy to implement.',
    created_at: '2024-02-28T16:40:22Z'
  }
];

export default function StrategyDetails() {
  const router = useRouter();
  const { listing_id } = router.query;
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  // Find the listing based on the ID from the URL
  const listing = mockMarketplaceListings.find(item => item.id === listing_id);
  
  // Get reviews for this listing
  const listingReviews = mockReviews.filter(review => review.listing_id === listing_id);

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleGoBack = () => {
    router.push('/marketplace');
  };

  const handleCheckoutOpen = () => {
    setCheckoutDialogOpen(true);
  };

  const handleCheckoutClose = () => {
    setCheckoutDialogOpen(false);
  };

  const handleCheckoutConfirm = () => {
    // Here you would process the purchase
    setCheckoutDialogOpen(false);
    // Show success message (in production, this would happen after successful API call)
    // For now, just redirect back to marketplace
    router.push('/marketplace');
  };

  const handleReviewDialogOpen = () => {
    setReviewDialogOpen(true);
  };

  const handleReviewDialogClose = () => {
    setReviewDialogOpen(false);
  };

  const handleReviewSubmit = () => {
    // Here you would submit the review to the API
    // For now just close the dialog
    setReviewDialogOpen(false);
    setReviewRating(null);
    setReviewComment('');
  };

  // If the listing isn't found or the page is still loading
  if (!listing) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h4">Loading strategy details...</Typography>
          {listing_id && <Typography>Looking for strategy ID: {listing_id}</Typography>}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 3 }}
      >
        Back to Marketplace
      </Button>

      <Grid container spacing={4}>
        {/* Main content - left side */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {listing.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={listing.ratings} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({listing.reviews} reviews)
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {listing.views} views
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 3 }}>
              {listing.categoryIds.map(id => {
                const category = categories.find(cat => cat.id === id);
                return category ? (
                  <Chip key={id} label={category.name} size="small" />
                ) : null;
              })}
            </Box>

            <Typography variant="body1" paragraph>
              {listing.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Performance metrics */}
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Sharpe Ratio
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.sharpe_ratio}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Sortino Ratio
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.sortino_ratio}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Return
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.total_return_pct}%
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Annual Return
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.annualized_return}%
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Max Drawdown
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.max_drawdown}%
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Win Rate
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.win_rate}%
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Profit Factor
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.profit_factor}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Backtest Period
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.backtest_period_days} days
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Features list */}
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <List>
              {listing.features.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Reviews section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Reviews ({listingReviews.length})
                </Typography>
                <Button variant="outlined" onClick={handleReviewDialogOpen}>
                  Write a Review
                </Button>
              </Box>
              
              {listingReviews.length > 0 ? (
                listingReviews.map(review => (
                  <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                        {review.username.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2">
                        {review.username}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} size="small" readOnly />
                    <Typography variant="body2" paragraph>
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(review.created_at)}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Alert severity="info">No reviews yet for this strategy.</Alert>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar - right side */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              ${listing.price}
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              {formatSubscriptionType(listing.subscription_type)}
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleCheckoutOpen}
              sx={{ mb: 2 }}
            >
              Purchase Strategy
            </Button>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Seller</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 1, width: 24, height: 24 }}>
                  {listing.sellerName.charAt(0)}
                </Avatar>
                <Typography variant="body2">
                  {listing.sellerName}
                </Typography>
                <Rating 
                  value={listing.sellerRating} 
                  precision={0.1} 
                  size="small" 
                  readOnly
                  sx={{ ml: 1 }} 
                />
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Last Updated</Typography>
              <Typography variant="body2">
                {formatDate(listing.last_updated)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2">Published</Typography>
              <Typography variant="body2">
                {formatDate(listing.created_at)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Purchase Dialog */}
      <Dialog open={checkoutDialogOpen} onClose={handleCheckoutClose}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to purchase:
          </DialogContentText>
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle1">{listing.title}</Typography>
            <Typography variant="h6" color="primary">
              ${listing.price} - {formatSubscriptionType(listing.subscription_type)}
            </Typography>
          </Box>
          <DialogContentText sx={{ mt: 2 }}>
            By proceeding, you agree to the terms of service and the license agreement for this strategy.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCheckoutClose} color="inherit">Cancel</Button>
          <Button onClick={handleCheckoutConfirm} variant="contained" color="primary">
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={handleReviewDialogClose}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Share your experience with this strategy to help other traders.
          </DialogContentText>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Typography component="legend">Your Rating:</Typography>
            <Rating
              name="strategy-rating"
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue);
              }}
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="review-comment"
            label="Your Review"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewDialogClose} color="inherit">Cancel</Button>
          <Button 
            onClick={handleReviewSubmit} 
            variant="contained" 
            color="primary"
            disabled={!reviewRating || reviewComment.length < 10}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}