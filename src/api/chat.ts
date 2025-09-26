export interface ChatMessagePayload {
  conversationId?: string;
  message: string;
}

export interface ChatSourceReference {
  sourceId: string;
  title: string;
  chunkText: string;
  url?: string;
}

export interface ChatResponse {
  id: string;
  answer: string;
  sources?: ChatSourceReference[];
}

export const sendChatMessage = async (webhookUrl: string, payload: ChatMessagePayload): Promise<ChatResponse> => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Chat Anfrage ist fehlgeschlagen.');
  }

  return response.json();
};
