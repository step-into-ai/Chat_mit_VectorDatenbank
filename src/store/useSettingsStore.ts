import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  ingestionWebhookUrl: string;
  chatWebhookUrl: string;
  setIngestionWebhookUrl: (url: string) => void;
  setChatWebhookUrl: (url: string) => void;
  reset: () => void;
}

const defaultState = {
  ingestionWebhookUrl: '',
  chatWebhookUrl: ''
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultState,
      setIngestionWebhookUrl: (url) => set({ ingestionWebhookUrl: url }),
      setChatWebhookUrl: (url) => set({ chatWebhookUrl: url }),
      reset: () => set(defaultState)
    }),
    {
      name: 'vectorchat:settings'
    }
  )
);
