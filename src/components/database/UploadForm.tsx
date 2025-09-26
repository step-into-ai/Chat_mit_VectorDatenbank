import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormHelperText,
  Grid,
  Slider,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { sendUploadPayload, UploadJobPayload } from '../../api/webhooks';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface UploadFormProps {
  webhookUrl: string;
  onJobCreated?: (jobId: string) => void;
}

interface UploadFormState {
  title: string;
  tags: string[];
  notes: string;
  shouldUpdate: boolean;
  updateTemperature: number;
}

const initialState: UploadFormState = {
  title: '',
  tags: [],
  notes: '',
  shouldUpdate: true,
  updateTemperature: 60
};

export const UploadForm: React.FC<UploadFormProps> = ({ webhookUrl, onJobCreated }) => {
  const [state, setState] = useState<UploadFormState>(initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: UploadJobPayload) => {
      if (!webhookUrl) {
        throw new Error('Bitte zuerst einen Ingestion Webhook in den Einstellungen speichern.');
      }
      return sendUploadPayload(webhookUrl, payload);
    }
  });

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim()) {
      event.preventDefault();
      const value = event.currentTarget.value.trim();
      setState((prev) => ({ ...prev, tags: Array.from(new Set([...prev.tags, value])) }));
      event.currentTarget.value = '';
    }
  };

  const handleRemoveTag = (tag: string) => {
    setState((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== tag) }));
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

    mutation.mutate(
      {
        files: base64Contents,
        metadata: {
          shouldUpdate: state.shouldUpdate,
          tags: state.tags,
          title: state.title || undefined,
          notes: state.notes || undefined,
          temperature: state.updateTemperature / 100
        }
      },
      {
        onSuccess: (data) => {
          onJobCreated?.(data.jobId);
          setFiles([]);
          setSelectedFile(null);
          fileInputRef.current && (fileInputRef.current.value = '');
        }
      }
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="grid" gap={4}>
      <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          size="large"
          startIcon={<CloudUploadOutlinedIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Dateien auswählen
        </Button>
        <input
          ref={fileInputRef}
          hidden
          multiple
          type="file"
          accept=".pdf,.txt,.md,.csv,.json,.docx"
          onChange={(event) => {
            const newFiles = Array.from(event.target.files ?? []);
            setFiles(newFiles);
            setSelectedFile(newFiles[0] ?? null);
          }}
        />
        <Tooltip title="Die Dateien werden als Base64 an deinen n8n Webhook gesendet.">
          <InfoOutlinedIcon color="disabled" />
        </Tooltip>
        <Button
          variant="outlined"
          startIcon={<AutoFixHighOutlinedIcon />}
          disabled={!selectedFile}
          onClick={() => setSelectedFile(files[0] ?? null)}
        >
          Vorschau
        </Button>
      </Stack>

      {files.length > 0 && (
        <Alert severity="info" variant="outlined">
          {files.length} Datei(en) vorbereitet. Mit dem Upload-Button wird sofort an n8n übertragen.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Titel"
            fullWidth
            value={state.title}
            onChange={(event) => setState((prev) => ({ ...prev, title: event.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Notizen" fullWidth value={state.notes} onChange={(event) => setState((prev) => ({ ...prev, notes: event.target.value }))} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Tags hinzufügen"
            placeholder="Tag eingeben und Enter drücken"
            fullWidth
            onKeyDown={handleTagKeyDown}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            {state.tags.map((tag) => (
              <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} color="primary" variant="outlined" />
            ))}
          </Stack>
        </Grid>
      </Grid>

      <Divider />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle1">Datenbank updaten</Typography>
            <Switch
              checked={state.shouldUpdate}
              onChange={(event) => setState((prev) => ({ ...prev, shouldUpdate: event.target.checked }))}
              inputProps={{ 'aria-label': 'Datenbank aktualisieren' }}
            />
          </Stack>
          <FormHelperText>
            Aktiviert steuert, ob die neue Ingestion deine Pinecone-Datenbank überschreibt oder ergänzt.
          </FormHelperText>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Embedding-Temperatur</Typography>
          <Slider
            color="secondary"
            value={state.updateTemperature}
            onChange={(_, value) =>
              setState((prev) => ({ ...prev, updateTemperature: Array.isArray(value) ? value[0] : value }))
            }
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: 'konservativ' },
              { value: 100, label: 'mutig' }
            ]}
          />
        </Grid>
      </Grid>

      <Box>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={mutation.isPending || !files.length}
        >
          {mutation.isPending ? 'Wird gesendet …' : 'Upload anstoßen'}
        </Button>
        {mutation.isError && (
          <FormHelperText error sx={{ mt: 1 }}>
            {(mutation.error as Error).message}
          </FormHelperText>
        )}
        {mutation.isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Upload gestartet! Job-ID: {mutation.data.jobId}
          </Alert>
        )}
      </Box>

      <DocumentPreviewModal open={Boolean(selectedFile)} file={selectedFile} onClose={() => setSelectedFile(null)} />
    </Box>
  );
};
