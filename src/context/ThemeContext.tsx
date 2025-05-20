import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, ThemeColor, themes } from '../theme';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  toggleMode: () => void;
  setThemeColor: (color: ThemeColor) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  color: 'default',
  toggleMode: () => {},
  setThemeColor: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [color, setColor] = useState<ThemeColor>('default');

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    const savedColor = localStorage.getItem('themeColor') as ThemeColor;
    
    setMode(savedMode || 'dark');
    setColor(savedColor && themes.includes(savedColor) ? savedColor : 'default');
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const setThemeColor = (newColor: ThemeColor) => {
    setColor(newColor);
    localStorage.setItem('themeColor', newColor);
  };

  // Create values object to maintain consistent structure
  const value = {
    mode,
    color,
    toggleMode,
    setThemeColor
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