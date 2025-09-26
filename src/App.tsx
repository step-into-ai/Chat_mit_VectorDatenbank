import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { IntroTour } from './components/onboarding/IntroTour';
import { ChatPage } from './pages/ChatPage';
import { DatabasePage } from './pages/DatabasePage';
import { SettingsPage } from './pages/SettingsPage';
import { useColorMode } from './theme/ColorModeContext';
import { useSettingsStore } from './store/useSettingsStore';

const queryClient = new QueryClient();

const navigationItems = [
  { label: 'Datenbank', icon: <CloudUploadOutlinedIcon />, path: '/' },
  { label: 'Chat', icon: <ChatOutlinedIcon />, path: '/chat' },
  { label: 'Einstellungen', icon: <SettingsOutlinedIcon />, path: '/settings' }
];

const App: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { toggleColorMode } = useColorMode();
  const tourVersion = useSettingsStore((state) => state.tourVersion);

  const currentIndex = navigationItems.findIndex((item) => item.path === location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              VectorChat Studio
            </Typography>
            <IconButton color="primary" onClick={toggleColorMode} aria-label="Farbschema umschalten">
              <DarkModeOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <AppShell>
          <IntroTour key={tourVersion} enabled />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<DatabasePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Container>
        </AppShell>
        {isMobile ? (
          <BottomNavigation
            showLabels
            value={currentIndex === -1 ? 0 : currentIndex}
            onChange={(_, value) => navigate(navigationItems[value].path)}
          >
            {navigationItems.map((item) => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        ) : (
          <Box component="footer" textAlign="center" py={3} color="text.secondary">
            <Typography variant="body2">Erstellt für eine nahtlose Datenbank-gestützte Konversationserfahrung.</Typography>
          </Box>
        )}
      </Box>
    </QueryClientProvider>
  );
};

export default App;
