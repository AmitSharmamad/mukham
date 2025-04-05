import { createTheme, ThemeOptions } from '@mui/material';

// Common theme properties
const commonProperties: ThemeOptions = {
  typography: {
    fontFamily: '"Ubuntu", sans-serif',
    htmlFontSize: 14, // Default is 16
    fontSize: 13, // Default is 14
    h1: { fontWeight: 400, fontFamily: '"Ubuntu", sans-serif', fontSize: '2.5rem' }, // Default is 2.75rem
    h2: { fontWeight: 400, fontFamily: '"Ubuntu", sans-serif', fontSize: '2rem' }, // Default is 2.25rem
    h3: { fontWeight: 400, fontFamily: '"Ubuntu", sans-serif', fontSize: '1.75rem' }, // Default is 2rem
    h4: { fontWeight: 300, fontFamily: '"Ubuntu", sans-serif', fontSize: '1.5rem' }, // Default is 1.75rem
    h5: { fontWeight: 300, fontFamily: '"Ubuntu", sans-serif', fontSize: '1.25rem' }, // Default is 1.5rem
    h6: { fontWeight: 300, fontFamily: '"Ubuntu", sans-serif', fontSize: '1rem' }, // Default is 1.25rem
    button: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300, fontSize: '0.875rem' }, // Default is 1rem
    body1: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300, fontSize: '0.875rem' }, // Default is 1rem
    body2: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300, fontSize: '0.8125rem' }, // Default is 0.875rem
    caption: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300, fontSize: '0.75rem' }, // Default is 0.8125rem
    subtitle1: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300, fontSize: '0.875rem' }, // Default is 1rem
    subtitle2: { fontFamily: '"Ubuntu", sans-serif', fontWeight: 300, fontSize: '0.8125rem' }, // Default is 0.875rem
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
