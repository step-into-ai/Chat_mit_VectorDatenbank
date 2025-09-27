import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { sendUploadPayload, UploadJobPayload } from '../../api/webhooks';

interface UploadFormProps {
  webhookUrl: string;
}

export const UploadForm: React.FC<UploadFormProps> = ({ webhookUrl }) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: UploadJobPayload) => {
      if (!webhookUrl) {
        throw new Error('Hinterlege zuerst einen Upload-Webhook in den Einstellungen.');
      }
      return sendUploadPayload(webhookUrl, payload);
    },
    onSuccess: () => {
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  });

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    setFiles(nextFiles);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!files.length) {
      return;
    }

    const base64Contents = await Promise.all(
      files.map(
        (file) =>
          new Promise<{ name: string; content: string; type: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                content: (reader.result as string).split(',')[1] ?? '',
                type: file.type || 'application/octet-stream'
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

    mutation.mutate({ files: base64Contents, metadata: { origin: 'vector-chat-studio' } });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="grid" gap={4}>
      <Stack spacing={2} alignItems="center">
        <Button
          variant="contained"
          size="large"
          startIcon={<CloudUploadOutlinedIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Dateien wählen
        </Button>
        <input
          ref={fileInputRef}
          hidden
          multiple
          type="file"
          accept=".pdf,.txt,.md,.csv,.json,.docx"
          onChange={handleFileSelection}
        />
        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
          <InfoOutlinedIcon fontSize="small" />
          <Typography variant="body2" textAlign="center">
            Wir verwandeln deine Dokumente in Base64 und senden sie direkt an deinen n8n-Flow.
          </Typography>
        </Stack>
      </Stack>

      {files.length > 0 ? (
        <Alert severity="info" variant="outlined">
          {files.length === 1
            ? `${files[0].name} ist bereit für den Upload.`
            : `${files.length} Dateien sind bereit für den Upload.`}
        </Alert>
      ) : (
        <Alert severity="warning" variant="outlined">
          Wähle zuerst Dateien aus, bevor du den Upload startest.
        </Alert>
      )}

      {files.length > 0 && (
        <List dense disablePadding>
          {files.map((file) => (
            <ListItem key={file.name} disableGutters>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleOutlineIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(1)} KB`}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Stack spacing={1} alignItems="center">
        <Button type="submit" variant="contained" size="large" disabled={mutation.isPending || !files.length}>
          {mutation.isPending ? 'Upload läuft ...' : 'Upload starten'}
        </Button>
        {mutation.isError && (
          <FormHelperText error>{(mutation.error as Error).message}</FormHelperText>
        )}
        {mutation.isSuccess && (
          <Alert severity="success" variant="outlined">
            Dateien wurden an deinen Flow übergeben. Du erhältst Updates direkt aus n8n.
          </Alert>
        )}
      </Stack>
    </Box>
  );
};
