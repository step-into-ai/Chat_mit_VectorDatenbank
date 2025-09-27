import { Box, Paper, useTheme } from '@mui/material';
import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: { xs: 3, md: 4 },
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        backdropFilter: 'blur(22px)',
        minHeight: { xs: '60vh', md: '65vh' },
        backgroundColor: (themeParam) =>
          themeParam.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.86)'
            : 'rgba(10, 18, 34, 0.88)',
        boxShadow: {
          xs: '0 18px 60px -50px rgba(41,121,255,0.7)',
          md: '0 60px 140px -110px rgba(41,121,255,0.9)'
        },
        transition: 'background-color 200ms ease, border-color 200ms ease'
      }}
    >
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          backgroundImage: (themeParam) =>
            themeParam.palette.mode === 'light'
              ? `linear-gradient(160deg, rgba(41, 121, 255, 0.08) 0%, rgba(0, 194, 255, 0.05) 35%, ${themeParam.palette.background.paper} 90%)`
              : `linear-gradient(160deg, rgba(41, 121, 255, 0.12) 0%, rgba(0, 194, 255, 0.08) 40%, ${themeParam.palette.background.paper} 95%)`
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: { xs: 3, md: 4 },
          border: '1px solid',
          borderColor: theme.palette.mode === 'light' ? 'rgba(41,121,255,0.16)' : 'rgba(41,121,255,0.32)'
        }}
      />
    </Paper>
  );
};
