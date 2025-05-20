import axios from 'axios';

interface LoginCredentials {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    // Add any other user properties returned by the API
  };
}

interface RedirectResponse {
  redirect: string;
}

// Service to handle username/password login
export interface LoginError {
  message: string;
  field?: string;
}

export const loginWithCredentials = async (credentials: LoginCredentials): Promise<LoginResponse | { redirect: string }> => {
  try {
    // Note: This login endpoint is at the root level, not under /api
    const response = await axios.post('/api/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't automatically follow redirects
      maxRedirects: 0,
      validateStatus: (status) => {
        // Consider both 200 OK and 3xx redirects as success
        return (status >= 200 && status < 300) || (status >= 300 && status < 400);
      },
    });
    
    // Handle redirect responses (3xx status codes)
    if (response.status >= 300 && response.status < 400) {
      const redirectUrl = response.headers.location || '/home';
      return { redirect: redirectUrl };
    }
    
    // For successful responses (2xx), even without data, assume success and redirect to home
    if (response.status >= 200 && response.status < 300) {
      // If we have valid data, return it
      if (typeof response.data === 'object' && response.data !== null) {
        return response.data;
      }
      // Otherwise assume implicit success and redirect to home
      return { redirect: '/home' };
    }
    
    // Fallback for unexpected response status
    return { redirect: '/home' };
  } catch (error: any) {
    console.error('Login failed:', error);
    
    // Handle specific API error responses
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400 && data.message) {
        // Format validation errors
        throw {
          message: data.message,
          field: data.field
        } as LoginError;
      }
      
      if (status === 401) {
        throw {
          message: 'Invalid username or password'
        } as LoginError;
      }
      
      if (status === 404) {
        throw {
          message: 'User not found'
        } as LoginError;
      }
    }
    
    // Generic error handling
    throw {
      message: 'An unexpected error occurred. Please try again later.'
    } as LoginError;
  }
};

// Check if the user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Get token from localStorage (only in browser)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }

    if (!token) {
      return false;
    }
    
    const response = await axios.get('/api/user/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      validateStatus: (status) => {
        // Consider only 200 as success, handle 401 in catch block
        return status === 200;
      },
    });
    
    return response.status === 200;
  } catch (error: any) {
    // If we got a 401 Unauthorized, clear the token
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
    
    return false;
  }
};

// Get the current user data
export const getCurrentUser = async () => {
  try {
    // Check if we're authenticated
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return null;
    }
    
    // Get token from localStorage (only in browser)
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }

    if (!token) {
      return null;
    }
    
    const response = await axios.get('/api/user/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      validateStatus: (status) => {
        // Consider only 200 as success, handle 401 in catch block
        return status === 200;
      },
    });
    
    if (response.status === 200) {
      return response.data;
    }
    
    return null;
  } catch (error: any) {
    // If we got a 401 Unauthorized, clear the token
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
    
    return null;
  }
};

// Logout the user
export const logout = async (): Promise<void> => {
  try {
    // Remove token from local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    
    // Call logout API endpoint if available
    try {
      await axios.post('/api/logout');
    } catch (error) {
      console.log('No server-side logout endpoint available');
    }
    
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Run a simple check if the API server is up (for development)
export const checkAPIServer = async (): Promise<boolean> => {
  try {
    // Optional simple health check endpoint
    const response = await axios.get('/api/health', {
      timeout: 5000, // 5 second timeout
      validateStatus: (status) => status === 200
    });
    return response.status === 200;
  } catch (error) {
    console.error('API server health check failed:', error);
    return false;
  }
};
