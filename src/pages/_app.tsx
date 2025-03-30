import type { AppProps } from 'next/app';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { light, dark } from '../theme';
import MainLayout from '../components/MainLayout';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import '../styles/globals.css';

function AppContent({ Component, pageProps }: AppProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <MUIThemeProvider theme={isDarkMode ? dark : light}>
      <CssBaseline />
      <MainLayout onToggleTheme={toggleTheme} isDarkMode={isDarkMode}>
        <Component {...pageProps} />
      </MainLayout>
    </MUIThemeProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <ThemeProvider>
      <AppContent {...props} />
    </ThemeProvider>
  );
}
