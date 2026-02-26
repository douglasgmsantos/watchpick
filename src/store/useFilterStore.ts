import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MediaType } from '@/types';
import { DEFAULT_MAX_RUNTIME } from '@/lib/constants';

interface FilterStore {
  selectedProviders: number[];
  selectedGenre: number | null;
  mediaType: MediaType;
  maxRuntime: number;

  setProviders: (ids: number[]) => void;
  toggleProvider: (id: number) => void;
  setGenre: (id: number | null) => void;
  setMediaType: (type: MediaType) => void;
  setMaxRuntime: (minutes: number) => void;
  reset: () => void;
}

const initialState = {
  selectedProviders: [] as number[],
  selectedGenre: null as number | null,
  mediaType: 'movie' as MediaType,
  maxRuntime: DEFAULT_MAX_RUNTIME,
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      ...initialState,

      setProviders: (ids) => set({ selectedProviders: ids }),

      toggleProvider: (id) =>
        set((state) => ({
          selectedProviders: state.selectedProviders.includes(id)
            ? state.selectedProviders.filter((p) => p !== id)
            : [...state.selectedProviders, id],
        })),

      setGenre: (id) => set({ selectedGenre: id }),

      setMediaType: (type) =>
        set({ mediaType: type, selectedGenre: null, selectedProviders: [] }),

      setMaxRuntime: (minutes) => set({ maxRuntime: minutes }),

      reset: () => set(initialState),
    }),
    {
      name: 'watchpick-filters',
    }
  )
);
