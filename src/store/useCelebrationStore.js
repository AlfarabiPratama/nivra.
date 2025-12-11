import { create } from "zustand";

/**
 * Celebration Store - Manage celebration animations
 */
export const useCelebrationStore = create((set) => ({
  // Confetti trigger
  showConfetti: false,
  confettiType: "full", // full, mini, emoji

  // Emoji for emoji burst
  celebrationEmoji: "🎉",

  // Trigger key to force re-render on consecutive triggers
  triggerKey: 0,

  // Trigger confetti celebration
  celebrate: (type = "full", emoji = "🎉") => {
    set((state) => ({
      showConfetti: true,
      confettiType: type,
      celebrationEmoji: emoji,
      triggerKey: state.triggerKey + 1,
    }));

    // Auto-hide after animation
    setTimeout(() => {
      set({ showConfetti: false });
    }, 2500);
  },

  // Quick celebration for task complete
  celebrateTask: () => {
    set((state) => ({
      showConfetti: true,
      confettiType: "full",
      celebrationEmoji: "✅",
      triggerKey: state.triggerKey + 1,
    }));

    setTimeout(() => {
      set({ showConfetti: false });
    }, 2500);
  },

  // Celebration for level up
  celebrateLevelUp: () => {
    set((state) => ({
      showConfetti: true,
      confettiType: "full",
      celebrationEmoji: "🌟",
      triggerKey: state.triggerKey + 1,
    }));

    setTimeout(() => {
      set({ showConfetti: false });
    }, 3000);
  },

  // Reset celebration
  reset: () => set({ showConfetti: false }),
}));
