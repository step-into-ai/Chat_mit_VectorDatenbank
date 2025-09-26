import { PaletteMode, ThemeOptions, createTheme } from '@mui/material';

const baseOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 18
  }
};

export const themeBuilder = (mode: PaletteMode) =>
  createTheme({
    ...baseOptions,
    palette: {
      mode,
      primary: {
        light: '#6fb7ff',
        main: '#2979ff',
        dark: '#004ecb'
      },
      secondary: {
        main: '#00c2ff'
      },
      background: {
        default: mode === 'light' ? '#f6f9ff' : '#0b1120',
        paper: mode === 'light' ? '#ffffff' : '#101932'
      }
    }
  });
