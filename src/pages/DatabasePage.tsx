import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import React from 'react';
import { UploadForm } from '../components/database/UploadForm';
import { useSettingsStore } from '../store/useSettingsStore';

export const DatabasePage: React.FC = () => {
  const ingestionWebhookUrl = useSettingsStore((state) => state.ingestionWebhookUrl);

  return (
    <Stack spacing={5} sx={{ height: '100%' }} alignItems="center" textAlign="center">
      <Stack spacing={1.5} maxWidth={720} alignItems="center">
        <Typography variant="overline" color="primary" sx={{ fontWeight: 600 }}>
          Dokument-Flow
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
          Lade Inhalte hoch und füttere deinen Wissensspeicher
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ziehe PDFs, Notizen oder CSVs einfach hier hinein. Wir schicken alles an deinen vorbereiteten n8n-Webhook und machen die Daten sofort für deinen Chat nutzbar.
        </Typography>
      </Stack>

      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          border: '1px solid',
          borderColor: 'divider',
          width: '100%',
          maxWidth: 720
        }}
      >
        <CardHeader
          avatar={<InsertDriveFileOutlinedIcon color="primary" />}
          title="Dokumente hochladen"
          subheader={
            ingestionWebhookUrl
              ? 'Upload bereit – dein Webhook ist verbunden.'
              : 'Hinterlege deinen Upload-Webhook in den Einstellungen.'
          }
          sx={{ textAlign: 'left' }}
        />
        <CardContent>
          <UploadForm webhookUrl={ingestionWebhookUrl} />
        </CardContent>
      </Card>

      <Stack spacing={1.5} maxWidth={640} color="text.secondary">
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          So funktioniert es
        </Typography>
        <Typography variant="body2">
          1. Dateien auswählen {'>'} 2. Upload starten {'>'} 3. Dein n8n-Flow legt die Embeddings in deiner Vector Engine ab.
        </Typography>
      </Stack>
    </Stack>
  );
};
