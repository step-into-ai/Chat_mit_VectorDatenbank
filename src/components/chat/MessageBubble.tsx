import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { ChatSourceReference } from '../../api/chat';

interface MessageBubbleProps {
  variant: 'user' | 'assistant';
  message: string;
  sources?: ChatSourceReference[];
  onSourceClick?: (source: ChatSourceReference) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ variant, message, sources, onSourceClick }) => {
  const isUser = variant === 'user';

  return (
    <Stack direction="row" spacing={2} justifyContent={isUser ? 'flex-end' : 'flex-start'}>
      {!isUser && <AutoAwesomeOutlinedIcon color="primary" />}
      <Paper
        elevation={0}
        sx={{
          px: 3,
          py: 2,
          borderRadius: 5,
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          border: isUser ? 'none' : '1px solid',
          borderColor: 'divider',
          maxWidth: { xs: '100%', md: '70%' }
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {isUser ? <PersonOutlineIcon fontSize="small" /> : <AutoAwesomeOutlinedIcon fontSize="small" color="primary" />}
            <Typography variant="overline">{isUser ? 'Du' : 'VectorChat'}</Typography>
          </Stack>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {message}
          </Typography>
          {sources && sources.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Quellen
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                {sources.map((source) => (
                  <Chip
                    key={source.sourceId}
                    icon={<ArticleOutlinedIcon />}
                    label={source.title}
                    onClick={() => onSourceClick?.(source)}
                    clickable
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};
