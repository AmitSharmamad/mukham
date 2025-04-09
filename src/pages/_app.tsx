import type { AppProps } from 'next/app';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getTheme } from '../theme';
import MainLayout from '../components/MainLayout';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

function AppContent({ Component, pageProps }: AppProps) {
  const { mode, color, toggleMode, setThemeColor } = useTheme();
  const theme = getTheme(mode, color);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MainLayout onToggleTheme={toggleMode} isDarkMode={mode === 'dark'} onChangeThemeColor={setThemeColor} currentTheme={color}>
          <Component {...pageProps} />
        </MainLayout>
      </LocalizationProvider>
    </MUIThemeProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent {...props} />
      </ThemeProvider>
    </AuthProvider>
  );
}
