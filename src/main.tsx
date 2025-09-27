import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { ColorModeProvider } from './theme/ColorModeContext';
import { themeBuilder } from './theme/themeBuilder';
import './styles/global.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

const AppRouter = ({ children }: { children: React.ReactNode }) => {
  if (import.meta.env.MODE === 'production') {
    return <HashRouter>{children}</HashRouter>;
  }

  return <BrowserRouter>{children}</BrowserRouter>;
};

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ColorModeProvider>
      {({ theme }) => (
        <ThemeProvider theme={themeBuilder(theme)}>
          <CssBaseline />
          <AppRouter>
            <App />
          </AppRouter>
        </ThemeProvider>
      )}
    </ColorModeProvider>
  </React.StrictMode>
);
