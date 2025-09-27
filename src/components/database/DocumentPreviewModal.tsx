import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import React, { useState } from 'react';

interface DocumentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  file?: File | null;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ open, onClose, file }) => {
  const [tab, setTab] = useState<'details' | 'content'>('details');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Vorschau
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }} aria-label="schliessen">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="Dokument Vorschau Tabs" sx={{ px: 3 }}>
        <Tab value="details" label="Details" />
        <Tab value="content" label="Inhalt" disabled={!file} />
      </Tabs>
      <DialogContent>
        {!file ? (
          <Typography variant="body2" color="text.secondary">
            Waehle ein Dokument aus, um eine Vorschau anzuzeigen.
          </Typography>
        ) : tab === 'details' ? (
          <Box display="grid" gap={1}>
            <Typography variant="subtitle1">Dateiname: {file.name}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Typ: {file.type || 'Unbekannt'}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Groesse: {(file.size / 1024).toFixed(1)} kB
            </Typography>
          </Box>
        ) : file.type.startsWith('text/') ? (
          <Box sx={{ maxHeight: 420, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            <TextPreview file={file} />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Eine Vorschau fuer diesen Dateityp wird nicht unterstuetzt.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

const TextPreview: React.FC<{ file: File }> = ({ file }) => {
  const [content, setContent] = useState<string>('');

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => setContent(reader.result as string);
    reader.readAsText(file);
    return () => reader.abort();
  }, [file]);

  return <Typography variant="body2">{content.slice(0, 10000)}</Typography>;
};
