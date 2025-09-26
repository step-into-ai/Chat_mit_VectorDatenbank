export interface UploadJobPayload {
  files: Array<{ name: string; content: string; type: string }>;
  metadata: {
    shouldUpdate: boolean;
    tags?: string[];
    title?: string;
    notes?: string;
    temperature?: number;
  };
}

export interface UploadResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed';
  message?: string;
}

export interface IngestionStatusResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  updatedAt: string;
  error?: string;
}

export const sendUploadPayload = async (webhookUrl: string, payload: UploadJobPayload): Promise<UploadResponse> => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Upload konnte nicht ausgelöst werden.');
  }

  return response.json();
};

export const fetchIngestionStatus = async (
  statusUrl: string
): Promise<IngestionStatusResponse | IngestionStatusResponse[]> => {
  const response = await fetch(statusUrl);
  if (!response.ok) {
    throw new Error('Status konnte nicht geladen werden.');
  }
  return response.json();
};
