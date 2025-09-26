import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WebhookProfile {
  id: string;
  name: string;
  description?: string;
  ingestionUrl: string;
  chatUrl: string;
}

interface SettingsState {
  profiles: WebhookProfile[];
  activeProfileId: string | null;
  addProfile: (profile: Omit<WebhookProfile, 'id'>) => void;
  updateProfile: (id: string, profile: Partial<Omit<WebhookProfile, 'id'>>) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  tourVersion: number;
  restartTour: () => void;
}

const defaultProfile: WebhookProfile = {
  id: 'default',
  name: 'Standard Profil',
  description: 'Standard Webhooks',
  ingestionUrl: '',
  chatUrl: ''
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      profiles: [defaultProfile],
      activeProfileId: defaultProfile.id,
      tourVersion: 0,
      addProfile: (profile) =>
        set((state) => ({
          profiles: [...state.profiles, { ...profile, id: crypto.randomUUID() }]
        })),
      updateProfile: (id, profile) =>
        set((state) => ({
          profiles: state.profiles.map((item) => (item.id === id ? { ...item, ...profile } : item))
        })),
      deleteProfile: (id) =>
        set((state) => {
          const nextProfiles = state.profiles.filter((item) => item.id !== id);
          const nextActive = state.activeProfileId === id ? nextProfiles[0]?.id ?? null : state.activeProfileId;
          return {
            profiles: nextProfiles.length ? nextProfiles : [defaultProfile],
            activeProfileId: nextProfiles.length ? nextActive : defaultProfile.id
          };
        }),
      setActiveProfile: (id) => set({ activeProfileId: id }),
      restartTour: () =>
        set((state) => ({
          tourVersion: state.tourVersion + 1
        }))
    }),
    {
      name: 'vectorchat:settings'
    }
  )
);

export const useActiveProfile = () => {
  const { profiles, activeProfileId } = useSettingsStore();
  return profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0] ?? null;
};
