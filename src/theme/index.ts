import { createTheme, ThemeOptions } from '@mui/material';

// Common theme properties
const commonProperties: ThemeOptions = {
  typography: {
    fontFamily: '"Ubuntu", sans-serif',
    h1: { fontWeight: 400, fontFamily: '"Ubuntu", sans-serif' },
    h2: { fontWeight: 400, fontFamily: '"Ubuntu", sans-serif' },
    h3: { fontWeight: 400, fontFamily: '"Ubuntu", sans-serif' },
    h4: { fontWeight: 300, fontFamily: '"Ubuntu", sans-serif' },
    h5: { fontWeight: 300, fontFamily: '"Ubuntu", sans-serif' },
    h6: { fontWeight: 300, fontFamily: '"Ubuntu", sans-serif' },
    button: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300 },
    body1: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300 },
    body2: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300 },
    caption: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300 },
    subtitle1: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300 },
    subtitle2: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          font-family: "Ubuntu", sans-serif;
          font-weight: 300;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 300,
          fontFamily: '"Ubuntu", sans-serif',
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Ubuntu", sans-serif',
          fontWeight: 300,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: '"Ubuntu", sans-serif',
          fontWeight: 300,
        },
      },
    },
  },
};

export const lightTheme: ThemeOptions = {
  ...commonProperties,
  palette: {
    mode: 'light',
    primary: {
      main: '#cf087c',
      light: '#e54a9e',
      dark: '#a8005f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#424242',
      light: '#6d6d6d',
      dark: '#1b1b1b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f7f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c2c2c',
      secondary: '#575757',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
};

export const darkTheme: ThemeOptions = {
  ...commonProperties,
  palette: {
    mode: 'dark',
    primary: {
      main: '#cf087c',
      light: '#e54a9e',
      dark: '#a8005f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
};

// Create and export the actual themes
export const light = createTheme(lightTheme);
export const dark = createTheme(darkTheme);
