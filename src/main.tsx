import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ColorModeProvider } from './theme/ColorModeContext';
import { themeBuilder } from './theme/themeBuilder';
import './styles/global.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ColorModeProvider>
      {({ theme }) => (
        <ThemeProvider theme={themeBuilder(theme)}>
          <CssBaseline />
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
      )}
    </ColorModeProvider>
  </React.StrictMode>
);
