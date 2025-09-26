import { Box, Grid, Paper, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box flexGrow={1} bgcolor="background.default">
      <Grid container justifyContent="center" sx={{ py: { xs: 2, md: 6 } }}>
        <Grid item xs={12} md={11} lg={10} xl={8}>
          <Paper
            elevation={isDesktop ? 8 : 0}
            sx={{
              borderRadius: { xs: 0, md: 4 },
              minHeight: '70vh',
              overflow: 'hidden',
              backdropFilter: 'blur(12px)',
              backgroundImage: (themeParam) =>
                isDesktop
                  ? `linear-gradient(140deg, ${themeParam.palette.primary.light}0d, ${themeParam.palette.background.paper})`
                  : 'none'
            }}
          >
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
