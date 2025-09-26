import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Alert, Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { fetchIngestionStatus, IngestionStatusResponse } from '../../api/webhooks';

interface UploadQueueProps {
  statusUrl?: string;
  jobIds: string[];
}

const REFRESH_INTERVAL = 15_000;

export const UploadQueue: React.FC<UploadQueueProps> = ({ statusUrl, jobIds }) => {
  const shouldFetch = Boolean(statusUrl && jobIds.length);

  const query = useQuery<IngestionStatusResponse[]>({
    queryKey: ['ingestion-status', statusUrl, jobIds],
    enabled: shouldFetch,
    queryFn: async () => {
      if (!statusUrl) {
        return [];
      }
      const response = await fetchIngestionStatus(statusUrl);
      return Array.isArray(response) ? response : [response];
    },
    refetchInterval: shouldFetch ? REFRESH_INTERVAL : false
  });

  if (!statusUrl || !jobIds.length) {
    return (
      <Alert severity="info" variant="outlined">
        Starte einen Upload, um hier den Fortschritt deiner Ingestion Jobs zu verfolgen.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h6">Ingestion Status</Typography>
        <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => query.refetch()} disabled={query.isFetching}>
          Aktualisieren
        </Button>
      </Stack>

      {query.isLoading && <LinearProgress />}

      {query.isError && (
        <Alert severity="error" variant="outlined">
          {(query.error as Error).message}
        </Alert>
      )}

      {query.data?.map((item) => (
        <Box key={item.jobId} p={2} borderRadius={3} bgcolor="background.paper" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1">Job {item.jobId}</Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {item.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Zuletzt aktualisiert: {new Date(item.updatedAt).toLocaleTimeString()}
              </Typography>
            </Box>
            <Box flex={1} minWidth={200}>
              <LinearProgress variant="determinate" value={item.progress} sx={{ height: 12, borderRadius: 12 }} />
              {item.error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Fehler: {item.error}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      ))}

      {!query.data?.length && !query.isLoading && (
        <Alert severity="info" variant="outlined">
          Es liegen noch keine Statusinformationen vor. Prüfe in einigen Minuten erneut.
        </Alert>
      )}
    </Stack>
  );
};
