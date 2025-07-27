import type { AppProps } from 'next/app';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getTheme } from '../theme';
import MainLayout from '../components/MainLayout';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { DeploymentProvider } from '../context/DeploymentContext';
import { TourProvider } from '../context/TourContext';
import AuthGuard from '../components/AuthGuard';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import '../styles/globals.css';

function AppContent({ Component, pageProps }: AppProps) {
  const { mode, color, toggleMode, setThemeColor } = useTheme();
  const theme = getTheme(mode, color);
  const [mounted, setMounted] = useState(false);

  // When the component mounts, mark it as ready to render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function (err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  // During SSR and initial client render, use a basic theme
  if (!mounted) {
    // Return a minimal version for SSR without components that use browser APIs
    return (
      <MUIThemeProvider theme={getTheme('dark', 'default')}>
        <CssBaseline />
        <div style={{ visibility: 'hidden' }} />
      </MUIThemeProvider>
    );
  }

  return (
    <MUIThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MainLayout onToggleTheme={toggleMode} isDarkMode={mode === 'dark'} onChangeThemeColor={setThemeColor} currentTheme={color}>
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        </MainLayout>
      </LocalizationProvider>
    </MUIThemeProvider>
  );
}

function MyApp(props: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <DeploymentProvider>
            <TourProvider>
              <AppContent {...props} />
            </TourProvider>
          </DeploymentProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Add explicit type annotation for getInitialProps
MyApp.getInitialProps = async ({ Component, ctx }: {
  Component: any;
  ctx: any;
}) => {
  let pageProps = {};
  
  try {
    // Call the page's getInitialProps if it has one
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
  } catch (error) {
    console.error('Error in getInitialProps:', error);
    // Return empty props in case of error
  }
  
  return { pageProps };
};

export default MyApp;
