import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import React from 'react';
import { ChatSourceReference } from '../../api/chat';

interface SourcePreviewProps {
  open: boolean;
  onClose: () => void;
  source?: ChatSourceReference;
}

export const SourcePreview: React.FC<SourcePreviewProps> = ({ open, onClose, source }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      {source?.title ?? 'Quelle'}
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }} aria-label="schließen">
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {source?.chunkText ?? 'Keine Vorschau verfügbar.'}
      </Typography>
      {source?.url && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Original öffnen: <a href={source.url} target="_blank" rel="noreferrer">{source.url}</a>
        </Typography>
      )}
    </DialogContent>
  </Dialog>
);
