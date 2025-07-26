/**
 * Formats a number as currency with Indian Rupee symbol
 */
export const formatCurrency = (amount: number, decimals: number = 2): string => {
  if (amount === 0) return '₹0';
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(absAmount);
  
  return `${isNegative ? '-' : ''}₹${formatted}`;
};

/**
 * Formats a decimal as percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Formats a number with Indian number system (lakhs, crores)
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

/**
 * Formats a large number with units (K, L, Cr)
 */
export const formatCompactNumber = (num: number): string => {
  if (Math.abs(num) >= 10000000) { // 1 crore or more
    return `${(num / 10000000).toFixed(1)}Cr`;
  } else if (Math.abs(num) >= 100000) { // 1 lakh or more
    return `${(num / 100000).toFixed(1)}L`;
  } else if (Math.abs(num) >= 1000) { // 1 thousand or more
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Formats time duration in human readable format
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Formats relative time (e.g., "2 minutes ago")
 */
export const formatRelativeTime = (timestamp: string | Date): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} ago`;
};
