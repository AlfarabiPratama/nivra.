import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES } from '../constants';

// Theme Store
export const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      theme: THEMES.light,
      toggleTheme: () => set((state) => ({
        isDarkMode: !state.isDarkMode,
        theme: !state.isDarkMode ? THEMES.dark : THEMES.light
      })),
      setDarkMode: (isDark) => set({
        isDarkMode: isDark,
        theme: isDark ? THEMES.dark : THEMES.light
      })
    }),
    { name: 'nivra-theme' }
  )
);
