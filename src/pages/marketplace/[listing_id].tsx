import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
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
  TextField as MuiTextField,
  CircularProgress,
  Paper as MuiPaper
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, Paper } from '../../components';
import {
  getListingDetails,
  getListingReviews,
  submitReview,
  purchaseStrategy,
  getAllCategories,
  MarketplaceListing,
  Review,
  Category
} from '../../services/marketplaceService';

export default function StrategyDetails() {
  const router = useRouter();
  const { listing_id } = router.query;
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  
  // API data states
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);

  // Load listing details and reviews
  useEffect(() => {
    if (!listing_id) return;

    const fetchListingData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch listing details
        const listingData = await getListingDetails(listing_id as string);
        setListing(listingData);

        // Fetch categories
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        
        // Fetch reviews
        const reviewsData = await getListingReviews(listing_id as string);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching listing data:", err);
        setError("Failed to load strategy details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingData();
  }, [listing_id]);

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

  const handleCheckoutConfirm = async () => {
    if (!listing || !listing_id) return;
    
    setIsSubmitting(true);
    try {
      // Process purchase using API
      await purchaseStrategy(
        listing_id as string, 
        'credit_card', 
        { card_token: 'tok_visa' } // In a real app, you'd collect payment details
      );
      
      setPurchaseSuccess(true);
      setTimeout(() => {
        setCheckoutDialogOpen(false);
        // Redirect back to marketplace or to user's purchased strategies
        router.push('/marketplace?tab=1');
      }, 2000);
    } catch (err) {
      console.error("Error processing purchase:", err);
      setError("Failed to process purchase. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewDialogOpen = () => {
    setReviewDialogOpen(true);
  };

  const handleReviewDialogClose = () => {
    setReviewDialogOpen(false);
    setReviewRating(null);
    setReviewComment('');
  };

  const handleReviewSubmit = async () => {
    if (!listing_id || !reviewRating || reviewComment.length < 10) return;
    
    setIsSubmitting(true);
    try {
      // Submit review using API
      await submitReview(
        listing_id as string,
        reviewRating,
        reviewComment
      );
      
      // Refresh reviews
      const updatedReviews = await getListingReviews(listing_id as string);
      setReviews(updatedReviews);
      
      // Close dialog
      setReviewDialogOpen(false);
      setReviewRating(null);
      setReviewComment('');
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get category names for the listing
  const getCategoryChips = () => {
    if (!listing || !categories.length) return null;
    
    return listing.categoryIds.map(id => {
      const category = categories.find(cat => cat.id === id);
      return category ? (
        <Chip key={id} label={category.name} size="small" />
      ) : null;
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading strategy details...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "Strategy details not found."}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Back to Marketplace
          </Button>
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
                ({listing.reviews || 0} reviews)
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {listing.views} views
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 3 }}>
              {getCategoryChips()}
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
              {listing.performance.sortino_ratio && (
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Sortino Ratio
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {listing.performance.sortino_ratio}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Return
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.total_return_pct}%
                </Typography>
              </Grid>
              {listing.performance.annualized_return && (
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Annual Return
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {listing.performance.annualized_return}%
                  </Typography>
                </Grid>
              )}
              {listing.performance.max_drawdown && (
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Max Drawdown
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {listing.performance.max_drawdown}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Win Rate
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {listing.performance.win_rate}%
                </Typography>
              </Grid>
              {listing.performance.profit_factor && (
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Profit Factor
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {listing.performance.profit_factor}
                  </Typography>
                </Grid>
              )}
              {listing.performance.backtest_period_days && (
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Backtest Period
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {listing.performance.backtest_period_days} days
                  </Typography>
                </Grid>
              )}
            </Grid>

            {listing.features && listing.features.length > 0 && (
              <>
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
              </>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Reviews section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Reviews ({reviews.length})
                </Typography>
                <Button variant="outlined" onClick={handleReviewDialogOpen}>
                  Write a Review
                </Button>
              </Box>
              
              {reviews.length > 0 ? (
                reviews.map(review => (
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
            
            {listing.sellerName && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Seller</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 1, width: 24, height: 24 }}>
                    {listing.sellerName.charAt(0)}
                  </Avatar>
                  <Typography variant="body2">
                    {listing.sellerName}
                  </Typography>
                  {listing.sellerRating && (
                    <Rating 
                      value={listing.sellerRating} 
                      precision={0.1} 
                      size="small" 
                      readOnly
                      sx={{ ml: 1 }} 
                    />
                  )}
                </Box>
              </Box>
            )}
            
            {listing.last_updated && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Last Updated</Typography>
                <Typography variant="body2">
                  {formatDate(listing.last_updated)}
                </Typography>
              </Box>
            )}
            
            {listing.created_at && (
              <Box>
                <Typography variant="subtitle2">Published</Typography>
                <Typography variant="body2">
                  {formatDate(listing.created_at)}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Purchase Dialog */}
      <Dialog open={checkoutDialogOpen} onClose={handleCheckoutClose}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          {purchaseSuccess ? (
            <Alert severity="success" sx={{ my: 2 }}>
              Purchase successful! Redirecting to your subscriptions...
            </Alert>
          ) : (
            <>
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCheckoutClose} color="inherit" disabled={isSubmitting || purchaseSuccess}>
            Cancel
          </Button>
          <Button 
            onClick={handleCheckoutConfirm} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting || purchaseSuccess}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Confirm Purchase'}
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
          <MuiTextField
            autoFocus
            margin="dense"
            id="review-comment"
            label="Your Review"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={reviewComment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReviewComment(e.target.value)}
            error={reviewComment.length > 0 && reviewComment.length < 10}
            helperText={reviewComment.length > 0 && reviewComment.length < 10 
              ? "Review must be at least 10 characters" 
              : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewDialogClose} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleReviewSubmit} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting || !reviewRating || reviewComment.length < 10}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}