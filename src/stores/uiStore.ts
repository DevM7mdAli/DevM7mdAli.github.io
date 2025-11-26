import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark";
type Lang = "en" | "ar";

interface UIState {
  theme: Theme;
  lang: Lang;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLang: (lang: Lang) => void;
}

// UI store: theme (light/dark) and language code
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      lang: "en",
      setTheme: (theme: Theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setLang: (lang: Lang) => set({ lang }),
    }),
    {
      name: "ui-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, lang: state.lang }),
    },
  ),
);
