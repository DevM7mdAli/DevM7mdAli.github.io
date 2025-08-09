import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// UI store: theme (light/dark) and language code
export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      lang: 'en',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'ui-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, lang: state.lang }),
    }
  )
);
