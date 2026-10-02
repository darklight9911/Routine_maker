import { createTheme } from '@mui/material/styles';

export const cozyTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5B7065', // Cozy Sage
      light: '#7F9489',
      dark: '#3D5046',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#B87352', // Warm Terracotta Clay
      light: '#D49272',
      dark: '#8E5033',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9F7F2', // Warm Oatmeal / Cream
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E332F',
      secondary: '#6E756F',
    },
    divider: '#EBE6DE',
    info: {
      main: '#5B7A8C', // Dusty Blue
    },
    success: {
      main: '#628B65', // Meadow Green
    },
    warning: {
      main: '#C68B45', // Warm Amber
    },
    error: {
      main: '#C15C5C', // Soft Brick Red
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#2E332F',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#2E332F',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#2E332F',
    },
    subtitle1: {
      color: '#6E756F',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 18px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          },
        },
        contained: {
          backgroundColor: '#5B7065',
          '&:hover': {
            backgroundColor: '#4A5D53',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(46,51,47,0.04)',
          border: '1px solid #EBE6DE',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 4px rgba(46,51,47,0.04)',
          border: '1px solid #EBE6DE',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          border: '1px solid #EBE6DE',
          boxShadow: '0 12px 32px rgba(46,51,47,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});
