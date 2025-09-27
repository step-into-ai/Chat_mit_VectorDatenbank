import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Paper, Stack, Typography } from '@mui/material';
import React from 'react';

interface MessageBubbleProps {
  variant: 'user' | 'assistant';
  message: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ variant, message }) => {
  const isUser = variant === 'user';

  return (
    <Stack alignItems={isUser ? 'flex-end' : 'flex-start'}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: { xs: '100%', md: 680 },
          px: 3,
          py: 2.5,
          borderRadius: 4,
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          border: isUser ? 'none' : '1px solid',
          borderColor: isUser ? 'transparent' : 'divider',
          boxShadow: isUser ? '0 12px 30px -20px rgba(41,121,255,0.8)' : '0 8px 26px -22px rgba(15,23,42,0.55)'
        }}
      >
        <Stack spacing={1.25}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {isUser ? <PersonOutlineIcon fontSize="small" /> : <AutoAwesomeOutlinedIcon fontSize="small" color="primary" />}
            <Typography variant="overline" sx={{ letterSpacing: '0.08em' }}>
              {isUser ? 'Du' : 'Dein Agent'}
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {message}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};
