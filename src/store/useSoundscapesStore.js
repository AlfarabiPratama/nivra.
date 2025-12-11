import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSoundscapesStore = create(
  persist(
    (set, get) => ({
      isPlaying: false,
      showPopup: true, // Toggle for floating popup visibility

      // Toggle popup visibility (for Settings)
      togglePopup: () => set((state) => ({ showPopup: !state.showPopup })),

      // Initial tracks configuration with placeholder online audio
      // In a real app, these would be local files or reliable CDN links
      tracks: [
        {
          id: "rain",
          name: "Hujan",
          icon: "CloudRain",
          volume: 0.5,
          isActive: false,
          // Placeholder: White noise / Rain sound
          src: "/sounds/Rain.mp3",
        },
        {
          id: "coffee",
          name: "Kafe",
          icon: "Coffee",
          volume: 0.4,
          isActive: false,
          // Placeholder: Coffee shop ambience
          src: "/sounds/Lo-Fi.mp3",
        },
        {
          id: "nature",
          name: "Hutan",
          icon: "Trees",
          volume: 0.3,
          isActive: false,
          // Placeholder: Forest ambience
          src: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3",
        },
        {
          id: "fire",
          name: "Api Unggun",
          icon: "Flame",
          volume: 0.4,
          isActive: false,
          // Placeholder: Fire crackling
          src: "https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackling-loop-1097.mp3",
        },
      ],

      // Audio Elements Reference (not persisted)
      audioElements: {},

      togglePlay: () => {
        const { isPlaying, audioElements, tracks } = get();

        console.log("🎵 togglePlay called:", {
          isPlaying,
          audioElements,
          tracks,
        });

        if (isPlaying) {
          // Pause all
          Object.values(audioElements).forEach((audio) => audio.pause());
          set({ isPlaying: false });
        } else {
          // Play active tracks
          tracks.forEach((track) => {
            if (track.isActive && audioElements[track.id]) {
              console.log(`▶️ Attempting to play ${track.name}...`);
              audioElements[track.id]
                .play()
                .then(() => console.log(`✅ ${track.name} playing`))
                .catch((e) => console.error(`❌ ${track.name} failed:`, e));
            }
          });
          set({ isPlaying: true });
        }
      },

      toggleTrack: (trackId) => {
        const { tracks, audioElements, isPlaying } = get();
        const newTracks = tracks.map((t) =>
          t.id === trackId ? { ...t, isActive: !t.isActive } : t
        );

        const track = newTracks.find((t) => t.id === trackId);
        const audioElement = audioElements[trackId];

        if (audioElement) {
          if (track.isActive) {
            // Auto-start playback when activating a track
            console.log(`▶️ Activating ${track.name}, attempting to play...`);
            audioElement
              .play()
              .then(() => {
                console.log(`✅ ${track.name} playing`);
                // Also set isPlaying to true so UI shows playing state
                if (!isPlaying) set({ isPlaying: true });
              })
              .catch((e) => console.error(`❌ ${track.name} failed:`, e));
          } else {
            audioElement.pause();
          }
        }

        set({ tracks: newTracks });
      },

      setTrackVolume: (trackId, volume) => {
        const { tracks, audioElements } = get();

        // Update state
        const newTracks = tracks.map((t) =>
          t.id === trackId ? { ...t, volume } : t
        );
        set({ tracks: newTracks });

        // Update actual audio element volume
        if (audioElements[trackId]) {
          audioElements[trackId].volume = volume;
        }
      },

      // Register audio element ref
      registerAudio: (trackId, element) => {
        if (!element) return;
        const { tracks, audioElements } = get();

        // Prevent infinite loop: don't update if element already registered
        if (audioElements[trackId] === element) return;

        const track = tracks.find((t) => t.id === trackId);

        if (track) {
          element.volume = track.volume;
          element.loop = true;
          console.log(`🔊 Registered audio: ${track.name}`, {
            element,
            volume: element.volume,
            src: element.src,
          });
          set((state) => ({
            audioElements: { ...state.audioElements, [trackId]: element },
          }));
        }
      },
    }),
    {
      name: "nivra-soundscapes",
      partialize: (state) => ({
        // Only persist volume and isActive, NOT src (so code changes take effect)
        trackSettings: state.tracks.map((t) => ({
          id: t.id,
          volume: t.volume,
          isActive: t.isActive,
        })),
        isPlaying: false, // Always start paused
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        // Merge persisted settings back into tracks
        tracks: currentState.tracks.map((track) => {
          const saved = persistedState?.trackSettings?.find(
            (s) => s.id === track.id
          );
          return saved
            ? { ...track, volume: saved.volume, isActive: saved.isActive }
            : track;
        }),
      }),
    }
  )
);
