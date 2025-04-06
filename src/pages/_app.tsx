import type { AppProps } from 'next/app';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getTheme } from '../theme';
import MainLayout from '../components/MainLayout';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import '../styles/globals.css';

function AppContent({ Component, pageProps }: AppProps) {
  const { mode, color, toggleMode, setThemeColor } = useTheme();
  const theme = getTheme(mode, color);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout onToggleTheme={toggleMode} isDarkMode={mode === 'dark'} onChangeThemeColor={setThemeColor} currentTheme={color}>
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
