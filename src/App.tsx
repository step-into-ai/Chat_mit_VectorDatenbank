import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ChatPage } from './pages/ChatPage';
import { DatabasePage } from './pages/DatabasePage';
import { SettingsPage } from './pages/SettingsPage';
import { useColorMode } from './theme/ColorModeContext';

const queryClient = new QueryClient();

const navigationItems = [
  { label: 'Upload', icon: <CloudUploadOutlinedIcon />, path: '/' },
  { label: 'Chat', icon: <ChatOutlinedIcon />, path: '/chat' },
  { label: 'Settings', icon: <SettingsOutlinedIcon />, path: '/settings' }
];

const App: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { toggleColorMode } = useColorMode();

  const currentIndex = navigationItems.findIndex((item) => item.path === location.pathname);
  const navValue = currentIndex === -1 ? 0 : currentIndex;

  return (
    <QueryClientProvider client={queryClient}>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        sx={{
          backgroundColor: 'background.default',
          backgroundImage: (themeParam) =>
            themeParam.palette.mode === 'light'
              ? 'radial-gradient(circle at 0% -20%, rgba(41, 121, 255, 0.25), transparent 45%), radial-gradient(circle at 100% 0%, rgba(0, 194, 255, 0.16), transparent 40%)'
              : 'radial-gradient(circle at 0% -20%, rgba(41, 121, 255, 0.25), transparent 45%), radial-gradient(circle at 100% 0%, rgba(0, 194, 255, 0.32), transparent 45%)'
        }}
      >
        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{
            px: { xs: 2, md: 6 },
            py: { xs: 1, md: 1.5 },
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
            backgroundColor: (themeParam) =>
              themeParam.palette.mode === 'light'
                ? 'rgba(246, 249, 255, 0.88)'
                : 'rgba(10, 16, 32, 0.78)'
          }}
        >
          <Toolbar disableGutters sx={{ gap: { xs: 2, md: 4 }, minHeight: 64 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '14px',
                  background: (themeParam) =>
                    `linear-gradient(135deg, ${themeParam.palette.primary.main} 0%, ${themeParam.palette.secondary.main} 80%)`,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18
                }}
              >
                VC
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                  VectorChat Studio
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Webhook-first Vector Ops
                </Typography>
              </Box>
            </Stack>

            {isDesktop && (
              <Tabs
                value={navValue}
                onChange={(_, value) => navigate(navigationItems[value].path)}
                textColor="inherit"
                TabIndicatorProps={{ sx: { borderRadius: 999, height: 4, background: theme.palette.secondary.main } }}
                sx={{
                  ml: { md: 4 },
                  '.MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 999,
                    minHeight: 44,
                    px: 2.5
                  }
                }}
              >
                {navigationItems.map((item, index) => (
                  <Tab
                    key={item.path}
                    icon={item.icon}
                    iconPosition="start"
                    label={item.label}
                    disableRipple
                    sx={{
                      opacity: navValue === index ? 1 : 0.6,
                      '&.Mui-selected': {
                        backgroundColor: (themeParam) =>
                          themeParam.palette.mode === 'light'
                            ? 'rgba(41, 121, 255, 0.12)'
                            : 'rgba(41, 121, 255, 0.24)'
                      }
                    }}
                  />
                ))}
              </Tabs>
            )}

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 'auto' }}>
              <Chip
                icon={<BoltOutlinedIcon fontSize="small" />}
                label="Webhook Engine"
                color="secondary"
                variant="outlined"
                sx={{ display: { xs: 'none', md: 'inline-flex' }, fontWeight: 600 }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/chat')}
                sx={{ borderRadius: 999, fontWeight: 600, boxShadow: '0 12px 30px -18px rgba(41,121,255,0.8)' }}
              >
                Open Chat
              </Button>
              <IconButton color="primary" onClick={toggleColorMode} aria-label="Farbschema umschalten">
                <DarkModeOutlinedIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            pt: { xs: 12, md: 14 },
            pb: { xs: 12, md: 8 },
            px: { xs: 2.5, md: 6 }
          }}
        >
          <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <AppShell>
              <Routes>
                <Route path="/" element={<DatabasePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </AppShell>
          </Container>
        </Box>

        <Box
          component="footer"
          sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            py: 3,
            color: 'text.secondary'
          }}
        >
          <Typography variant="body2">VectorChat Studio (c) {new Date().getFullYear()} - gebaut fuer webhook-basierte Vector Workflows.</Typography>
        </Box>

        {!isDesktop && (
          <BottomNavigation
            showLabels
            value={navValue}
            onChange={(_, value) => navigate(navigationItems[value].path)}
            sx={{
              position: 'sticky',
              bottom: 0,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              '.MuiBottomNavigationAction-root': {
                fontWeight: 600
              }
            }}
          >
            {navigationItems.map((item) => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        )}
      </Box>
    </QueryClientProvider>
  );
};

export default App;
