import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, ThemeColor, themes } from '../theme';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  toggleMode: () => void;
  setThemeColor: (color: ThemeColor) => void;
  useSystemTheme: () => void;
  isUsingSystemTheme: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  color: 'default',
  toggleMode: () => {},
  setThemeColor: () => {},
  useSystemTheme: () => {},
  isUsingSystemTheme: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [color, setColor] = useState<ThemeColor>('default');
  const [isUsingSystemTheme, setIsUsingSystemTheme] = useState(true);

  // Function to get system theme preference
  const getSystemTheme = (): ThemeMode => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default fallback
  };

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    const savedColor = localStorage.getItem('themeColor') as ThemeColor;
    
    // Check if user has manually set a theme preference
    const hasManualPreference = savedMode !== null;
    setIsUsingSystemTheme(!hasManualPreference);
    
    // Use system theme if no saved preference, otherwise use saved preference
    const initialMode = savedMode || getSystemTheme();
    setMode(initialMode);
    setColor(savedColor && themes.includes(savedColor) ? savedColor : 'default');

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('themeMode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    setIsUsingSystemTheme(false);
    localStorage.setItem('themeMode', newMode);
  };

  const setThemeColor = (newColor: ThemeColor) => {
    setColor(newColor);
    localStorage.setItem('themeColor', newColor);
  };

  const useSystemTheme = () => {
    const systemTheme = getSystemTheme();
    setMode(systemTheme);
    setIsUsingSystemTheme(true);
    localStorage.removeItem('themeMode');
  };

  // Create values object to maintain consistent structure
  const value = {
    mode,
    color,
    toggleMode,
    setThemeColor,
    useSystemTheme,
    isUsingSystemTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {mounted ? children : 
        // Render an empty div with the same structure during SSR to prevent hydration issues
        <div style={{ visibility: 'hidden' }} />
      }
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};