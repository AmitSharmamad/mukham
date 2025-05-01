import apiClient from '../utils/api';

// Types for marketplace data
export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Performance {
  sharpe_ratio: number;
  sortino_ratio?: number;
  total_return_pct: number;
  annualized_return?: number;
  max_drawdown?: number;
  win_rate: number;
  profit_factor?: number;
  backtest_period_days?: number;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  subscription_type: string;
  user_id: string;
  sellerName?: string;
  sellerRating?: number;
  ratings: number;
  reviews?: number;
  views: number;
  categoryIds: string[];
  performance: Performance;
  features?: string[];
  created_at?: string;
  last_updated?: string;
}

export interface Review {
  id: string;
  listing_id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  listing_id: string;
  status: string;
  subscription_type: string;
  price_paid: number;
  start_date: string;
  end_date?: string;
  renewal_date?: string;
}

export interface Transaction {
  id: string;
  subscription_id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export interface SellerAnalytics {
  total_earnings: number;
  active_subscriptions: number;
  total_listings: number;
  average_rating: number;
}

// Marketplace API Functions

// Listing APIs
export const getAllListings = async () => {
  const response = await apiClient.get('/marketplace/listings');
  return response.data;
};

export const getFilteredListings = async (
  category?: string,
  sort?: string,
  search?: string,
  signal?: AbortSignal
) => {
  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (sort) queryParams.append('sort', sort);
  if (search) queryParams.append('search', search);

  const response = await apiClient.get(`/marketplace/listings?${queryParams}`, { signal });
  return response.data;
};

export const getListingDetails = async (listingId: string) => {
  const response = await apiClient.get(`/marketplace/listings/${listingId}`);
  return response.data;
};

export const createListing = async (listingData: Partial<MarketplaceListing>) => {
  const response = await apiClient.post('/marketplace/listings', listingData);
  return response.data;
};

export const updateListing = async (
  listingId: string,
  listingData: Partial<MarketplaceListing>
) => {
  const response = await apiClient.put(`/marketplace/listings/${listingId}`, listingData);
  return response.data;
};

export const deleteListing = async (listingId: string) => {
  const response = await apiClient.delete(`/marketplace/listings/${listingId}`);
  return response.data;
};

// Categories APIs
export const getAllCategories = async (signal?: AbortSignal) => {
  const response = await apiClient.get('/marketplace/categories', { signal });
  return response.data;
};

// Performance Metrics APIs
export const updatePerformanceMetrics = async (
  listingId: string,
  performanceData: Partial<Performance>
) => {
  const response = await apiClient.put(`/marketplace/listings/${listingId}/performance`, performanceData);
  return response.data;
};

// Subscription APIs
export const purchaseStrategy = async (
  listingId: string,
  paymentMethod: string,
  paymentDetails: any
) => {
  const data = {
    listing_id: listingId,
    payment_method: paymentMethod,
    payment_details: paymentDetails,
  };

  const response = await apiClient.post('/marketplace/subscriptions', data);
  return response.data;
};

export const getUserSubscriptions = async (signal?: AbortSignal) => {
  const response = await apiClient.get('/marketplace/subscriptions/user', { signal });
  return response.data;
};

export const cancelSubscription = async (
  subscriptionId: string,
  reason?: string
) => {
  const data = {
    status: 'cancelled',
    cancellation_reason: reason,
  };

  const response = await apiClient.put(`/marketplace/subscriptions/${subscriptionId}`, data);
  return response.data;
};

// Review APIs
export const getListingReviews = async (listingId: string) => {
  const response = await apiClient.get(`/marketplace/listings/${listingId}/reviews`);
  return response.data;
};

export const submitReview = async (
  listingId: string,
  rating: number,
  comment: string
) => {
  const data = {
    rating,
    comment,
  };

  const response = await apiClient.post(`/marketplace/listings/${listingId}/reviews`, data);
  return response.data;
};

export const updateReview = async (
  reviewId: string,
  rating: number,
  comment: string
) => {
  const data = {
    rating,
    comment,
  };

  const response = await apiClient.put(`/marketplace/reviews/${reviewId}`, data);
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await apiClient.delete(`/marketplace/reviews/${reviewId}`);
  return response.data;
};

// Transaction APIs
export const getTransactionHistory = async () => {
  const response = await apiClient.get('/marketplace/transactions');
  return response.data;
};

export const getTransactionDetails = async (transactionId: string) => {
  const response = await apiClient.get(`/marketplace/transactions/${transactionId}`);
  return response.data;
};

// Seller APIs
export const getSellerAnalytics = async () => {
  const response = await apiClient.get('/marketplace/seller/analytics');
  return response.data;
};

export const getSellerListings = async (signal?: AbortSignal) => {
  const response = await apiClient.get('/marketplace/seller/listings', { signal });
  return response.data;
};