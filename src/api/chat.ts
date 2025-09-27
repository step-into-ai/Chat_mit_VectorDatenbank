export interface ChatMessagePayload {
  conversationId?: string;
  message: string;
}

export interface ChatResponse {
  id: string;
  answer: string;
  raw?: unknown;
}

const preferredKeys = ['answer', 'output', 'message', 'text', 'content', 'result'] as const;

type PreferredKey = (typeof preferredKeys)[number];

const extractAnswer = (payload: unknown): string => {
  if (payload == null) {
    return '';
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map(extractAnswer).filter(Boolean).join('\n');
  }

  if (typeof payload === 'object') {
    const record = payload as Record<string, unknown>;

    for (const key of preferredKeys) {
      if (Object.prototype.hasOwnProperty.call(record, key)) {
        const value = extractAnswer(record[key as PreferredKey]);
        if (value) {
          return value;
        }
      }
    }

    const values = Object.values(record).map(extractAnswer).filter(Boolean);
    if (values.length > 0) {
      return values.join('\n');
    }
  }

  return '';
};

export const sendChatMessage = async (webhookUrl: string, payload: ChatMessagePayload): Promise<ChatResponse> => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Chat Anfrage ist fehlgeschlagen.');
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const data = await response.json();

    if (typeof data === 'string') {
      return {
        id: crypto.randomUUID(),
        answer: data,
        raw: data
      };
    }

    const answer = extractAnswer(data);

    return {
      id: (data as { id?: string }).id ?? crypto.randomUUID(),
      answer: answer || JSON.stringify(data),
      raw: data
    };
  }

  const text = (await response.text()).trim();

  if (!text) {
    throw new Error('Die Antwort deines Agents war leer.');
  }

  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      const answer = extractAnswer(parsed);
      if (answer) {
        return {
          id: crypto.randomUUID(),
          answer,
          raw: parsed
        };
      }
      return {
        id: crypto.randomUUID(),
        answer: JSON.stringify(parsed),
        raw: parsed
      };
    } catch (error) {
      // Parsing fehlgeschlagen – Text unten zurückgeben
    }
  }

  return {
    id: crypto.randomUUID(),
    answer: text,
    raw: text
  };
};
