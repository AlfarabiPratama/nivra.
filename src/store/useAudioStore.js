import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAudioStore = create(
  persist(
    (set, get) => ({
      // Settings
      soundEnabled: false,
      volume: 0.3,

      // Actions
      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),
      setVolume: (volume) => set({ volume }),

      // Play sound effect
      playSound: (type) => {
        const state = get();
        if (!state.soundEnabled) return;

        // In-memory audio using data URIs (very subtle beep sounds)
        const sounds = {
          taskComplete:
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj4+LJ",
          journalSave:
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj4+LJ",
          pageFlip:
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj4+LJ",
          typewriter:
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj4+LJ",
        };

        try {
          const audio = new Audio(sounds[type] || sounds.taskComplete);
          audio.volume = state.volume;
          audio.play().catch(() => {
            // Silently fail if autoplay is blocked
          });
        } catch {
          // Silently fail
        }
      },
    }),
    {
      name: "nivra-audio-storage",
    }
  )
);
