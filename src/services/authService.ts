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
    });
    
    // Verify response is a valid JSON object before accessing properties
    if (typeof response.data === 'object' && response.data !== null) {
      // Check if the response is a redirect to /home
      if (response.data.redirect && response.data.redirect === '/home') {
        return { redirect: '/home' };
      }
      
      return response.data;
    } else {
      throw new Error('Received invalid response format');
    }
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
