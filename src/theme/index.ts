import { createTheme, ThemeOptions } from '@mui/material';

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'default' | 'ubuntu' | 'github' | 'dracula' | 'nord' | 'forest' | 'bull' | 'bear';

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

const themeColors = {
  default: {
    light: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
        contrastText: '#ffffff',
      },
    },
    dark: {
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
        contrastText: '#000000',
      },
      secondary: {
        main: '#ce93d8',
        light: '#f3e5f5',
        dark: '#ab47bc',
        contrastText: '#000000',
      },
    }
  },
  ubuntu: {
    light: {
      primary: {
        main: '#E95420',
        light: '#F07746',
        dark: '#C03F11',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#AEA79F',
        light: '#C4C4C4',
        dark: '#878787',
        contrastText: '#000000',
      },
    },
    dark: {
      primary: {
        main: '#E95420',
        light: '#F07746',
        dark: '#C03F11',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#AEA79F',
        light: '#C4C4C4',
        dark: '#878787',
        contrastText: '#000000',
      },
      background: {
        default: '#300A24',
        paper: '#2C001E',
      },
    }
  },
  github: {
    light: {
      primary: {
        main: '#2188ff',
        light: '#79b8ff',
        dark: '#0366d6',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6f42c1',
        light: '#8a63d2',
        dark: '#5a32a3',
        contrastText: '#ffffff',
      },
    },
    dark: {
      primary: {
        main: '#2188ff',
        light: '#79b8ff',
        dark: '#0366d6',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6f42c1',
        light: '#8a63d2',
        dark: '#5a32a3',
        contrastText: '#ffffff',
      },
      background: {
        default: '#0d1117',
        paper: '#161b22',
      },
    }
  },
  dracula: {
    light: {
      primary: {
        main: '#bd93f9',
        light: '#d8b9ff',
        dark: '#9580ff',
        contrastText: '#282a36',
      },
      secondary: {
        main: '#ff79c6',
        light: '#ff9cdb',
        dark: '#ff56b1',
        contrastText: '#282a36',
      },
    },
    dark: {
      primary: {
        main: '#bd93f9',
        light: '#d8b9ff',
        dark: '#9580ff',
        contrastText: '#282a36',
      },
      secondary: {
        main: '#ff79c6',
        light: '#ff9cdb',
        dark: '#ff56b1',
        contrastText: '#282a36',
      },
      background: {
        default: '#282a36',
        paper: '#44475a',
      },
    }
  },
  nord: {
    light: {
      primary: {
        main: '#5E81AC',
        light: '#81A1C1',
        dark: '#4C566A',
        contrastText: '#ECEFF4',
      },
      secondary: {
        main: '#88C0D0',
        light: '#8FBCBB',
        dark: '#5E81AC',
        contrastText: '#2E3440',
      },
    },
    dark: {
      primary: {
        main: '#88C0D0',
        light: '#8FBCBB',
        dark: '#5E81AC',
        contrastText: '#2E3440',
      },
      secondary: {
        main: '#81A1C1',
        light: '#5E81AC',
        dark: '#4C566A',
        contrastText: '#ECEFF4',
      },
      background: {
        default: '#2E3440',
        paper: '#3B4252',
      },
    }
  },
  forest: {
    light: {
      primary: {
        main: '#638C6D',
        light: '#E7FBB4',
        dark: '#4A6B52',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#DF6D2D',
        light: '#E88B55',
        dark: '#C84C05',
        contrastText: '#ffffff',
      },
    },
    dark: {
      primary: {
        main: '#638C6D',
        light: '#E7FBB4',
        dark: '#4A6B52',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#DF6D2D',
        light: '#E88B55',
        dark: '#C84C05',
        contrastText: '#ffffff',
      },
      background: {
        default: '#2C3B2E',
        paper: '#364839',
      },
    }
  },
  bull: {
    light: {
      primary: {
        main: '#00C805',
        light: '#92E399',
        dark: '#007F03',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#2E7D32',
        light: '#4CAF50',
        dark: '#1B5E20',
        contrastText: '#ffffff',
      },
      success: {
        main: '#00C805',
        light: '#92E399',
        dark: '#007F03',
      },
      error: {
        main: '#FF4D4D',
        light: '#FF8080',
        dark: '#CC0000',
      }
    },
    dark: {
      primary: {
        main: '#00C805',
        light: '#92E399',
        dark: '#007F03',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#2E7D32',
        light: '#4CAF50',
        dark: '#1B5E20',
        contrastText: '#ffffff',
      },
      success: {
        main: '#00C805',
        light: '#92E399',
        dark: '#007F03',
      },
      error: {
        main: '#FF4D4D',
        light: '#FF8080',
        dark: '#CC0000',
      },
      background: {
        default: '#0A1F0C',
        paper: '#122815',
      },
    }
  },
  bear: {
    light: {
      primary: {
        main: '#FF4D4D',
        light: '#FF8080',
        dark: '#CC0000',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#D32F2F',
        light: '#EF5350',
        dark: '#C62828',
        contrastText: '#ffffff',
      },
      success: {
        main: '#00C805',
        light: '#92E399',
        dark: '#007F03',
      },
      error: {
        main: '#FF4D4D',
        light: '#FF8080',
        dark: '#CC0000',
      }
    },
    dark: {
      primary: {
        main: '#FF4D4D',
        light: '#FF8080',
        dark: '#CC0000',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#D32F2F',
        light: '#EF5350',
        dark: '#C62828',
        contrastText: '#ffffff',
      },
      success: {
        main: '#00C805',
        light: '#92E399',
        dark: '#007F03',
      },
      error: {
        main: '#FF4D4D',
        light: '#FF8080',
        dark: '#CC0000',
      },
      background: {
        default: '#1F0A0A',
        paper: '#281212',
      },
    }
  }
};

export const getTheme = (mode: ThemeMode, color: ThemeColor) => {
  const baseTheme: ThemeOptions = {
    ...commonProperties,
    palette: {
      mode,
      ...(mode === 'light' ? {
        background: {
          default: '#f7f7f7',
          paper: '#ffffff',
        },
        text: {
          primary: '#2c2c2c',
          secondary: '#575757',
        },
      } : {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
        },
      }),
      ...themeColors[color][mode],
    },
  };

  return createTheme(baseTheme);
};

export const themes = Object.keys(themeColors) as ThemeColor[];
