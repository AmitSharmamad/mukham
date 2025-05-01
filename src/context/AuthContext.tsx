import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Router from 'next/router';
import { UserData, checkAuth } from '../utils/authUtils';
import apiClient from '../utils/api';
import { loginWithCredentials, LoginError } from '../services/authService';

interface LoginCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserData | null;
  loading: boolean;
  login: (token: string) => void;
  loginWithUsernamePassword: (credentials: LoginCredentials) => Promise<{success: boolean, redirect?: string, error?: LoginError}>;
  logout: () => void;
  checkUserAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Function to check user authentication status
  const checkUserAuth = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const userData = await checkAuth();
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
        setLoading(false);
        return true;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
      return false;
    }
  };

  // Mark component as mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Track if an auth check is already in progress
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);

  // Check auth on initial load
  useEffect(() => {
    // Skip during SSR
    if (!mounted) return;
    
    // Skip if we're already checking
    if (authCheckInProgress) return;
    
    // Check if we're in the browser before trying to access localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      // Create a flag to prevent multiple simultaneous auth checks
      setAuthCheckInProgress(true);
      
      if (token) {
        // Always check auth status on every page
        checkUserAuth().finally(() => {
          setAuthCheckInProgress(false);
        });
      } else {
        // No token, just mark as not loading
        setLoading(false);
        setAuthCheckInProgress(false);
      }
    }
  }, [mounted, authCheckInProgress]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    checkUserAuth(); // Update user data after login
  };

  const loginWithUsernamePassword = async (credentials: LoginCredentials): Promise<{success: boolean, redirect?: string, error?: LoginError}> => {
    try {
      const response = await loginWithCredentials(credentials);
      
      // Safely check if response is a valid object
      if (response && typeof response === 'object') {
        // Handle redirect response
        if ('redirect' in response && typeof response.redirect === 'string') {
          return { success: true, redirect: response.redirect };
        }
        
        // Handle normal response with token
        if ('token' in response && typeof response.token === 'string') {
          login(response.token);
          return { success: true };
        }
      }
      
      return { success: false, error: { message: 'Invalid login response' } };
    } catch (error) {
      console.error('Username/password login failed:', error);
      return { 
        success: false, 
        error: error as LoginError || { message: 'An unexpected error occurred' } 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    Router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      loading, 
      login,
      loginWithUsernamePassword,
      logout, 
      checkUserAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}