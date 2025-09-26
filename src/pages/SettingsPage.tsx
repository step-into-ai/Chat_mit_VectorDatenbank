import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Alert, Button, Card, CardContent, CardHeader, Divider, MenuItem, Select, Stack, Switch, Typography } from '@mui/material';
import React from 'react';
import { AddProfileDialog } from '../components/settings/AddProfileDialog';
import { WebhookForm } from '../components/settings/WebhookForm';
import { useColorMode } from '../theme/ColorModeContext';
import { useSettingsStore } from '../store/useSettingsStore';

export const SettingsPage: React.FC = () => {
  const { theme, toggleColorMode } = useColorMode();
  const profiles = useSettingsStore((state) => state.profiles);
  const activeProfileId = useSettingsStore((state) => state.activeProfileId);
  const setActiveProfile = useSettingsStore((state) => state.setActiveProfile);
  const restartTour = useSettingsStore((state) => state.restartTour);

  return (
    <Stack spacing={4} id="settings-section">
      <Stack spacing={1}>
        <Typography variant="h4">Einstellungen</Typography>
        <Typography variant="body1" color="text.secondary">
          Verwalte deine Webhooks, passe das Erscheinungsbild an und starte die Onboarding-Tour erneut.
        </Typography>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Webhook Profile"
          action={<AddProfileDialog />}
          subheader="Speichere unterschiedliche n8n Flows für Test- und Produktionsumgebungen."
        />
        <Divider />
        <CardContent>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Typography variant="subtitle1">Aktives Profil</Typography>
              <Select
                value={activeProfileId ?? ''}
                onChange={(event) => setActiveProfile(event.target.value)}
                size="small"
                sx={{ minWidth: 220 }}
              >
                {profiles.map((profile) => (
                  <MenuItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack spacing={3}>
              {profiles.map((profile) => (
                <WebhookForm key={profile.id} profile={profile} />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Alert icon={<TuneOutlinedIcon />} severity="info" variant="outlined" sx={{ flex: 1 }}>
          Nutze mehrere Profile, um Entwicklungs- und Produktionsdaten zu trennen.
        </Alert>
        <Alert icon={<PlayCircleOutlineIcon />} severity="success" variant="outlined" sx={{ flex: 1 }}>
          Teste deine Webhooks direkt in n8n und aktualisiere das Profil mit einem Klick.
        </Alert>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader title="Personalisierung" />
        <Divider />
        <CardContent>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesomeOutlinedIcon fontSize="small" /> Modernes Dark Theme
              </Typography>
              <Switch checked={theme === 'dark'} onChange={toggleColorMode} />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlayCircleOutlineIcon fontSize="small" /> Onboarding Tour
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.localStorage.removeItem('vectorchat:onboarding-completed');
                  }
                  restartTour();
                }}
              >
                Tour neu starten
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
