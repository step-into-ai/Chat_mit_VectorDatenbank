import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Box, Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';

interface ChatComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }
    onSend(message.trim());
    setMessage('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          multiline
          minRows={2}
          maxRows={6}
          label="Deine Frage"
          placeholder="Frag den VectorChat Agent …"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<SendOutlinedIcon />}
          disabled={disabled || !message.trim()}
        >
          Senden
        </Button>
      </Stack>
    </Box>
  );
};
