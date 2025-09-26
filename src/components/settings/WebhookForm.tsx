import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { WebhookProfile, useSettingsStore } from '../../store/useSettingsStore';

interface WebhookFormProps {
  profile: WebhookProfile;
}

export const WebhookForm: React.FC<WebhookFormProps> = ({ profile }) => {
  const updateProfile = useSettingsStore((state) => state.updateProfile);
  const deleteProfile = useSettingsStore((state) => state.deleteProfile);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);

  const hasChanges =
    localProfile.name !== profile.name ||
    localProfile.description !== profile.description ||
    localProfile.ingestionUrl !== profile.ingestionUrl ||
    localProfile.chatUrl !== profile.chatUrl;

  const handleSave = () => {
    updateProfile(profile.id, localProfile);
    setEditing(false);
  };

  const handleDelete = () => {
    deleteProfile(profile.id);
    setConfirmOpen(false);
  };

  return (
    <Box p={3} borderRadius={3} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h6">{profile.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.description || 'Keine Beschreibung hinterlegt'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Profil bearbeiten">
            <IconButton onClick={() => setEditing(true)}>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Profil entfernen">
            <IconButton color="error" onClick={() => setConfirmOpen(true)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkOutlinedIcon fontSize="small" /> Ingestion Webhook:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile.ingestionUrl || 'Noch nicht gesetzt'}
        </Typography>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkOutlinedIcon fontSize="small" /> Chat Webhook:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile.chatUrl || 'Noch nicht gesetzt'}
        </Typography>
      </Stack>

      <Dialog open={editing} onClose={() => setEditing(false)} fullWidth maxWidth="sm">
        <DialogTitle>Webhook Profil bearbeiten</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Profilname"
              value={localProfile.name}
              onChange={(event) => setLocalProfile((prev) => ({ ...prev, name: event.target.value }))}
            />
            <TextField
              label="Beschreibung"
              value={localProfile.description ?? ''}
              onChange={(event) => setLocalProfile((prev) => ({ ...prev, description: event.target.value }))}
            />
            <TextField
              label="Ingestion Webhook URL"
              value={localProfile.ingestionUrl}
              onChange={(event) => setLocalProfile((prev) => ({ ...prev, ingestionUrl: event.target.value }))}
              placeholder="https://..."
            />
            <TextField
              label="Chat Webhook URL"
              value={localProfile.chatUrl}
              onChange={(event) => setLocalProfile((prev) => ({ ...prev, chatUrl: event.target.value }))}
              placeholder="https://..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(false)}>Abbrechen</Button>
          <Button startIcon={<SaveOutlinedIcon />} onClick={handleSave} disabled={!hasChanges} variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Profil löschen?</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Dieses Profil wird dauerhaft entfernt. Du kannst es später jederzeit neu anlegen.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Abbrechen</Button>
          <Button color="error" onClick={handleDelete} startIcon={<DeleteOutlineIcon />}>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
