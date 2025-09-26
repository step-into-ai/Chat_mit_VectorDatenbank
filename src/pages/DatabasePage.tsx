import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import { Box, Card, CardContent, CardHeader, Chip, Grid, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { UploadForm } from '../components/database/UploadForm';
import { UploadQueue } from '../components/database/UploadQueue';
import { useActiveProfile } from '../store/useSettingsStore';

export const DatabasePage: React.FC = () => {
  const activeProfile = useActiveProfile();
  const [jobIds, setJobIds] = useState<string[]>([]);

  const handleJobCreated = (jobId: string) => {
    setJobIds((prev) => Array.from(new Set([jobId, ...prev])).slice(0, 10));
  };

  return (
    <Stack spacing={4} id="database-section">
      <Stack spacing={1}>
        <Typography variant="h4">Datenquellen orchestrieren</Typography>
        <Typography variant="body1" color="text.secondary">
          Verbinde Dokumente, Notizen und PDFs mit wenigen Klicks. VectorChat Studio sendet alles automatisiert an deinen n8n Webhook und aktualisiert Pinecone.
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Upload & Steuerung"
              subheader={activeProfile?.ingestionUrl ? `Webhook: ${activeProfile.ingestionUrl}` : 'Lege zuerst einen Webhook an.'}
            />
            <CardContent>
              <UploadForm
                webhookUrl={activeProfile?.ingestionUrl ?? ''}
                key={activeProfile?.id ?? 'no-profile'}
                onJobCreated={handleJobCreated}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardHeader title="Pipeline Status" subheader="Verfolge laufende Jobs" />
            <CardContent>
              <UploadQueue statusUrl={activeProfile?.ingestionUrl} jobIds={jobIds} />
            </CardContent>
          </Card>
          <Box sx={{ mt: 3 }}>
            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <CardHeader
                avatar={<StorageOutlinedIcon color="primary" />}
                title="Pinecone Insights"
                subheader="Deine Vektordatenbank bleibt synchron"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Definiere Tags für feingranulare Suche und steuere mit dem Schieberegler, wie sensibel dein Index aktualisiert wird.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip icon={<AutoGraphOutlinedIcon />} label="Versionierung" color="primary" variant="outlined" />
                  <Chip icon={<ShieldOutlinedIcon />} label="DSGVO-konform" color="secondary" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};
