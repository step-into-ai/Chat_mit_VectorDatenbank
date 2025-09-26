import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const AddProfileDialog: React.FC = () => {
  const addProfile = useSettingsStore((state) => state.addProfile);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Neues Profil');
  const [description, setDescription] = useState('');
  const [ingestionUrl, setIngestionUrl] = useState('');
  const [chatUrl, setChatUrl] = useState('');

  const handleSave = () => {
    addProfile({ name, description, ingestionUrl, chatUrl });
    setOpen(false);
    setName('Neues Profil');
    setDescription('');
    setIngestionUrl('');
    setChatUrl('');
  };

  return (
    <>
      <Button startIcon={<AddOutlinedIcon />} variant="outlined" onClick={() => setOpen(true)}>
        Profil hinzufügen
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Neues Webhook Profil</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Profilname" value={name} onChange={(event) => setName(event.target.value)} autoFocus />
            <TextField label="Beschreibung" value={description} onChange={(event) => setDescription(event.target.value)} />
            <TextField
              label="Ingestion Webhook URL"
              value={ingestionUrl}
              onChange={(event) => setIngestionUrl(event.target.value)}
              placeholder="https://..."
            />
            <TextField label="Chat Webhook URL" value={chatUrl} onChange={(event) => setChatUrl(event.target.value)} placeholder="https://..." />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button startIcon={<SaveOutlinedIcon />} variant="contained" onClick={handleSave} disabled={!name.trim()}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
