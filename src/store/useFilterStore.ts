import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MediaType } from '@/types';
import { ActorOption } from '@/types/filters';
import { DEFAULT_MAX_RUNTIME } from '@/lib/constants';

interface FilterStore {
  selectedProviders: number[];
  selectedGenres: number[];
  mediaType: MediaType;
  maxRuntime: number;
  certification: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  selectedActors: ActorOption[];

  setProviders: (ids: number[]) => void;
  toggleProvider: (id: number) => void;
  toggleGenre: (id: number) => void;
  setMediaType: (type: MediaType) => void;
  setMaxRuntime: (minutes: number) => void;
  setCertification: (cert: string | null) => void;
  setYearFrom: (year: number | null) => void;
  setYearTo: (year: number | null) => void;
  addActor: (actor: ActorOption) => void;
  removeActor: (id: number) => void;
  reset: () => void;
}

const initialState = {
  selectedProviders: [] as number[],
  selectedGenres: [] as number[],
  mediaType: 'movie' as MediaType,
  maxRuntime: DEFAULT_MAX_RUNTIME,
  certification: null as string | null,
  yearFrom: null as number | null,
  yearTo: null as number | null,
  selectedActors: [] as ActorOption[],
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

      toggleGenre: (id) =>
        set((state) => ({
          selectedGenres: state.selectedGenres.includes(id)
            ? state.selectedGenres.filter((g) => g !== id)
            : [...state.selectedGenres, id],
        })),

      setMediaType: (type) =>
        set({
          mediaType: type,
          selectedGenres: [],
          selectedProviders: [],
          selectedActors: [],
        }),

      setMaxRuntime: (minutes) => set({ maxRuntime: minutes }),

      setCertification: (cert) => set({ certification: cert }),

      setYearFrom: (year) => set({ yearFrom: year }),

      setYearTo: (year) => set({ yearTo: year }),

      addActor: (actor) =>
        set((state) => {
          if (state.selectedActors.some((a) => a.id === actor.id)) return state;
          return { selectedActors: [...state.selectedActors, actor] };
        }),

      removeActor: (id) =>
        set((state) => ({
          selectedActors: state.selectedActors.filter((a) => a.id !== id),
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'watchpick-filters',
      version: 2,
    }
  )
);
