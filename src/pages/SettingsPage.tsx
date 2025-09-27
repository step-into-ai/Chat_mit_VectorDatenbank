import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import HttpOutlinedIcon from '@mui/icons-material/HttpOutlined';
import { Button, Card, CardContent, CardHeader, Divider, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useColorMode } from '../theme/ColorModeContext';
import { useSettingsStore } from '../store/useSettingsStore';

export const SettingsPage: React.FC = () => {
  const { theme, toggleColorMode } = useColorMode();
  const ingestionWebhookUrl = useSettingsStore((state) => state.ingestionWebhookUrl);
  const chatWebhookUrl = useSettingsStore((state) => state.chatWebhookUrl);
  const setIngestionWebhookUrl = useSettingsStore((state) => state.setIngestionWebhookUrl);
  const setChatWebhookUrl = useSettingsStore((state) => state.setChatWebhookUrl);
  const reset = useSettingsStore((state) => state.reset);
  const [tempIngestion, setTempIngestion] = useState(ingestionWebhookUrl);
  const [tempChat, setTempChat] = useState(chatWebhookUrl);

  const handleSave = () => {
    setIngestionWebhookUrl(tempIngestion.trim());
    setChatWebhookUrl(tempChat.trim());
  };

  return (
    <Stack spacing={4} sx={{ height: '100%' }}>
      <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 600 }}>
          Einstellungen
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Webhooks und Theme verwalten
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
          Hinterlege die n8n Endpunkte deiner Wahl. Diese App speichert alles lokal im Browser und ruft keine externen Services auf.
        </Typography>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          avatar={<HttpOutlinedIcon color="primary" />}
          title="Webhook Ziel URLs"
          subheader="Definiere, wohin Uploads und Chat Nachrichten gesendet werden."
        />
        <Divider />
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Upload Webhook URL"
              placeholder="https://example.com/n8n-upload"
              value={tempIngestion}
              onChange={(event) => setTempIngestion(event.target.value)}
              fullWidth
            />
            <TextField
              label="Chat Webhook URL"
              placeholder="https://example.com/n8n-chat"
              value={tempChat}
              onChange={(event) => setTempChat(event.target.value)}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" onClick={handleSave} sx={{ minWidth: 160 }}>
                Speichern
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setTempIngestion('');
                  setTempChat('');
                  reset();
                }}
              >
                Zuruecksetzen
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Tipp: du kannst mehrere n8n Workflows ablegen, indem du die URLs hier schnell austauschst. Die Eingaben bleiben im lokalen Speicher erhalten.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          avatar={<DarkModeOutlinedIcon color="primary" />}
          title="Darstellung"
          subheader="Wechsle zwischen hellem und dunklem Theme."
        />
        <Divider />
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Aktuelles Theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </Typography>
            <Button variant="outlined" onClick={toggleColorMode} sx={{ minWidth: 160 }}>
              Theme wechseln
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
