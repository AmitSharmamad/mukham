import { createTheme, ThemeOptions } from '@mui/material';

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'default' | 'ubuntu' | 'github' | 'dracula' | 'nord' | 'forest' | 'bull' | 'bear' | 'cyan' | 'purple';

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
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        html, body, #__next {
          height: 100%;
          overflow: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar, #__next::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .MuiDrawer-paper::-webkit-scrollbar {
          display: none;
        }
        .MuiDrawer-paper {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .MuiModal-root::-webkit-scrollbar {
          display: none;
        }
        .MuiModal-root {
          scrollbar-width: none;
          -ms-overflow-style: none;
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
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          backgroundImage: 'none',
          transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color']),
          ...(theme.palette.mode === 'dark' && {
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
          }),
          ...(theme.palette.mode === 'light' && {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.05)',
            backgroundColor: theme.palette.background.paper,
          }),
        }),
        elevation0: {
          boxShadow: 'none',
        },
        elevation1: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' && {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
          }),
        }),
        elevation2: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' && {
            boxShadow: '0 3px 5px rgba(0, 0, 0, 0.5)',
          }),
        }),
        elevation3: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' && {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
          }),
        }),
        elevation4: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' && {
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.7)',
          }),
        }),
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
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...(theme.palette.mode === 'light' && {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }),
        }),
      },
    },
  },
};

const themeColors = {
  default: {
    light: {
      primary: {
        main: '#42a5f5',
        light: '#90caf9',
        dark: '#1976d2',
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
  },
  cyan: {
    light: {
      primary: {
        main: '#38C3F3',
        light: '#70D3F7',
        dark: '#1AA0D3',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0A5378',
        light: '#1870A0',
        dark: '#063A54',
        contrastText: '#ffffff',
      },
    },
    dark: {
      primary: {
        main: '#38C3F3',
        light: '#70D3F7',
        dark: '#1AA0D3',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0A5378',
        light: '#1870A0',
        dark: '#063A54',
        contrastText: '#ffffff',
      },
      background: {
        default: '#0A1D29',
        paper: '#0F2936',
      },
    }
  },
  purple: {
    light: {
      primary: {
        main: '#9747FF',
        light: '#B57BFF',
        dark: '#7A33DE',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#613CA0',
        light: '#7F53C8',
        dark: '#492C79',
        contrastText: '#ffffff',
      },
    },
    dark: {
      primary: {
        main: '#9747FF',
        light: '#B57BFF',
        dark: '#7A33DE',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#613CA0',
        light: '#7F53C8',
        dark: '#492C79',
        contrastText: '#ffffff',
      },
      background: {
        default: '#1A0E2C',
        paper: '#231640',
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
      } : {      background: {
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
