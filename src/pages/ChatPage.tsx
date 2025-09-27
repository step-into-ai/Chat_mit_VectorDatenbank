import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { Alert, Box, Card, CardContent, Divider, LinearProgress, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { ChatResponse, sendChatMessage } from '../api/chat';
import { ChatComposer } from '../components/chat/ChatComposer';
import { MessageBubble } from '../components/chat/MessageBubble';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSettingsStore } from '../store/useSettingsStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatPage: React.FC = () => {
  const chatWebhookUrl = useSettingsStore((state) => state.chatWebhookUrl);
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('vector-chat-history', []);

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      if (!chatWebhookUrl) {
        throw new Error('Bitte hinterlege zuerst einen Chat-Webhook in den Einstellungen.');
      }
      const response = await sendChatMessage(chatWebhookUrl, { message: prompt });
      return response satisfies ChatResponse ? response : (response as ChatResponse);
    },
    onSuccess: (response) => {
      const assistantMessage: ChatMessage = {
        id: response.id,
        role: 'assistant',
        content: response.answer
      };

      setMessages((prev) => [...prev, assistantMessage].slice(-50));
    }
  });

  const handleSend = (prompt: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt
    };

    setMessages((prev) => [...prev, userMessage].slice(-50));
    mutation.mutate(prompt);
  };

  const conversationEmpty = messages.length === 0;
  const composerDisabled = !chatWebhookUrl || mutation.isPending;

  return (
    <Stack spacing={5} sx={{ height: '100%' }} alignItems="center" textAlign="center">
      <Stack spacing={1.5} maxWidth={720} alignItems="center">
        <Typography variant="overline" color="primary" sx={{ fontWeight: 600 }}>
          Chat Workspace
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
          Chatte mit deinen Dokumenten
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stelle Fragen in Alltagssprache. Dein n8n-Agent zieht automatisch den passenden Kontext aus deiner Vector-Datenbank und liefert dir eine klare Antwort.
        </Typography>
      </Stack>

      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          border: '1px solid',
          borderColor: 'divider',
          width: '100%',
          maxWidth: 860,
          textAlign: 'left'
        }}
      >
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Box
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                width: 48,
                height: 48,
                borderRadius: '16px',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <QuestionAnswerOutlinedIcon />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Dein persönlicher Dokumenten-Chat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {chatWebhookUrl
                  ? 'Webhook verbunden – Antworten kommen direkt von deinem Agenten.'
                  : 'Aktiviere deinen Chat-Webhook in den Einstellungen, um Antworten zu erhalten.'}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>

        <Divider />

        <CardContent sx={{ minHeight: 320 }}>
          <Stack spacing={3}>
            {conversationEmpty && (
              <Alert severity="info" icon={<AutoAwesomeOutlinedIcon />}>
                Starte mit einer Frage wie „Was steht in meinem Projektplan?“ oder bitte um eine Zusammenfassung deiner neuesten Datei.
              </Alert>
            )}
            {messages.map((message) => (
              <MessageBubble key={message.id} variant={message.role} message={message.content} />
            ))}
            {mutation.isPending && <LinearProgress />}
          </Stack>
        </CardContent>

        <Divider />

        <CardContent>
          <ChatComposer onSend={handleSend} disabled={composerDisabled} />
          {mutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {(mutation.error as Error).message}
            </Alert>
          )}
          {!chatWebhookUrl && !mutation.isError && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Hinterlege deinen Chat-Webhook in den Einstellungen, um Antworten abzurufen.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};
