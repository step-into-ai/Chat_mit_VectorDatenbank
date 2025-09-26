import AutoAwesomeMotionOutlinedIcon from '@mui/icons-material/AutoAwesomeMotionOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { Alert, Card, CardContent, CardHeader, Divider, LinearProgress, Stack, Switch, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ChatResponse, ChatSourceReference, sendChatMessage } from '../api/chat';
import { ChatComposer } from '../components/chat/ChatComposer';
import { MessageBubble } from '../components/chat/MessageBubble';
import { SourcePreview } from '../components/chat/SourcePreview';
import { useActiveProfile } from '../store/useSettingsStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSourceReference[];
}

export const ChatPage: React.FC = () => {
  const activeProfile = useActiveProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedSource, setSelectedSource] = useState<ChatSourceReference | undefined>();
  const [showSources, setShowSources] = useState(true);

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      if (!activeProfile?.chatUrl) {
        throw new Error('Bitte hinterlege zuerst einen Chat Webhook in den Einstellungen.');
      }
      const response = await sendChatMessage(activeProfile.chatUrl, { message: prompt });
      return response satisfies ChatResponse ? response : (response as ChatResponse);
    },
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          id: response.id,
          role: 'assistant',
          content: response.answer,
          sources: response.sources
        }
      ]);
    }
  });

  const handleSend = (prompt: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: prompt
      }
    ]);
    mutation.mutate(prompt);
  };

  return (
    <Stack spacing={4} id="chat-section">
      <Stack spacing={1}>
        <Typography variant="h4">Chat mit Kontext</Typography>
        <Typography variant="body1" color="text.secondary">
          Frage deinen Agenten nach Erkenntnissen aus Pinecone. Wir zeigen die relevanten Dokumentstellen direkt mit an.
        </Typography>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <CardHeader
          title="Konversation"
          subheader={activeProfile?.chatUrl ? `Webhook: ${activeProfile.chatUrl}` : 'Verbinde zuerst einen Chat Webhook.'}
          action={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Quellen anzeigen</Typography>
              <Switch checked={showSources} onChange={(event) => setShowSources(event.target.checked)} />
            </Stack>
          }
        />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ minHeight: 320 }}>
            {messages.length === 0 && (
              <Alert severity="info" icon={<LightbulbOutlinedIcon />}>
                Tipp: Lass dir zusammenfassungen aus Pinecone geben oder frage nach konkreten Stellen.
              </Alert>
            )}
            {mutation.isPending && <LinearProgress />}
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                variant={message.role}
                message={message.content}
                sources={showSources ? message.sources : undefined}
                onSourceClick={setSelectedSource}
              />
            ))}
          </Stack>
        </CardContent>
        <Divider />
        <CardContent>
          <ChatComposer onSend={handleSend} disabled={mutation.isPending} />
          {mutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {(mutation.error as Error).message}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Alert
          icon={<AutoAwesomeMotionOutlinedIcon />}
          severity="success"
          variant="outlined"
          sx={{ flex: 1 }}
        >
          VectorChat merkt sich deine letzte Konversation und sendet automatisch die relevante History mit.
        </Alert>
        <Alert icon={<FlagOutlinedIcon />} severity="info" variant="outlined" sx={{ flex: 1 }}>
          Nutze Tags aus dem Datenbank Tab, um deine Antworten präziser zu machen.
        </Alert>
      </Stack>

      <SourcePreview open={Boolean(selectedSource)} source={selectedSource} onClose={() => setSelectedSource(undefined)} />
    </Stack>
  );
};
