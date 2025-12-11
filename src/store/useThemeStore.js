import { create } from "zustand";
import { persist } from "zustand/middleware";
import { THEMES } from "../constants";

// Predefined accent color palette
export const ACCENT_COLORS = [
  { id: "sage", name: "Sage", light: "#5c7c74", dark: "#7f9e96" }, // Default
  { id: "ocean", name: "Ocean", light: "#4a7c9b", dark: "#6ba3c9" },
  { id: "lavender", name: "Lavender", light: "#7c6c9a", dark: "#9e8cb8" },
  { id: "coral", name: "Coral", light: "#c27c6a", dark: "#d99a8a" },
  { id: "amber", name: "Amber", light: "#b8935a", dark: "#d4b07a" },
  { id: "rose", name: "Rose", light: "#a76b7a", dark: "#c98b9a" },
  { id: "mint", name: "Mint", light: "#5c9485", dark: "#7fb4a5" },
  { id: "slate", name: "Slate", light: "#6b7c8c", dark: "#8b9cac" },
];

// Theme Store
export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,
      theme: THEMES.light,
      accentColorId: "sage", // Default accent color

      toggleTheme: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
          theme: !state.isDarkMode ? THEMES.dark : THEMES.light,
        })),

      setDarkMode: (isDark) =>
        set({
          isDarkMode: isDark,
          theme: isDark ? THEMES.dark : THEMES.light,
        }),

      setAccentColor: (colorId) => {
        const color = ACCENT_COLORS.find((c) => c.id === colorId);
        if (color) {
          set({ accentColorId: colorId });
          // Apply accent color to CSS variables
          const isDark = get().isDarkMode;
          document.documentElement.style.setProperty(
            "--accent",
            isDark ? color.dark : color.light
          );
        }
      },

      // Get current accent color based on theme
      getAccentColor: () => {
        const state = get();
        const color =
          ACCENT_COLORS.find((c) => c.id === state.accentColorId) ||
          ACCENT_COLORS[0];
        return state.isDarkMode ? color.dark : color.light;
      },

      // Apply theme and accent color to document
      applyTheme: () => {
        const state = get();
        const color =
          ACCENT_COLORS.find((c) => c.id === state.accentColorId) ||
          ACCENT_COLORS[0];
        const accentValue = state.isDarkMode ? color.dark : color.light;
        document.documentElement.style.setProperty("--accent", accentValue);
      },
    }),
    { name: "nivra-theme" }
  )
);

// Initialize accent color on load
if (typeof window !== "undefined") {
  // Apply accent color after hydration
  setTimeout(() => {
    useThemeStore.getState().applyTheme();
  }, 0);

  // Also apply when store changes
  useThemeStore.subscribe((state) => {
    const color =
      ACCENT_COLORS.find((c) => c.id === state.accentColorId) ||
      ACCENT_COLORS[0];
    const accentValue = state.isDarkMode ? color.dark : color.light;
    document.documentElement.style.setProperty("--accent", accentValue);
  });
}
