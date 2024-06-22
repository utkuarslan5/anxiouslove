import { VoiceProviderProps } from "@humeai/voice-react";
import { create } from 'zustand';

interface ConfigStore {
  config: VoiceProviderProps | null;
  setConfig: (config: VoiceProviderProps) => void;
  clearConfig: () => void;
}

export const useConfigStore = create<ConfigStore>()((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
  clearConfig: () => set({ config: null }),
}));
