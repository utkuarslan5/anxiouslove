import { create } from 'zustand';

interface EmotionPlotStore {
  imageData: string | null;
  setImageData: (imageData: string | null) => void;
}

const useEmotionPlotStore = create<EmotionPlotStore>((set) => ({
  imageData: null,
  setImageData: (imageData) => set({ imageData }),
}));

export default useEmotionPlotStore;