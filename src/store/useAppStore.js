import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSyncEnabled } from "../config/firebaseConfig";
import {
  syncUserProfile,
  subscribeToUserProfile,
} from "../services/firestoreService";
import { useSyncStore } from "./useSyncStore";

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Current navigation state
      currentView: "dashboard",

      // User profile
      user: {
        name: "",
        xp: 0,
        level: 1,
        gardenStage: "seed", // seed, sprout, flower, forest
        avatar: null, // base64 image or URL
      },

      // Notifications preferences
      notifications: {
        pomodoroAlerts: false,
        taskAlerts: false,
        reminders: false,
      },
      reminderTime: "08:00",

      // Firebase sync
      syncUnsubscribe: null,

      // Actions
      setCurrentView: (view) => set({ currentView: view }),

      addXP: (amount, toastStore = null) => {
        const oldLevel = get().user.level;
        const oldStage = get().user.gardenStage;
        const currentXP = get().user.xp + amount;
        const newLevel = Math.floor(currentXP / 100) + 1;

        // Determine garden stage based on XP
        let gardenStage = "seed";
        if (currentXP >= 500) gardenStage = "forest";
        else if (currentXP >= 250) gardenStage = "flower";
        else if (currentXP >= 100) gardenStage = "sprout";

        set({
          user: {
            ...get().user,
            xp: currentXP,
            level: newLevel,
            gardenStage,
          },
        });

        // Trigger notifications if toastStore provided
        if (toastStore) {
          // Level up notification
          if (newLevel > oldLevel) {
            toastStore.addToast(`naik ke level ${newLevel}! 🌟`, "levelup");
          }

          // Garden stage upgrade notification
          if (gardenStage !== oldStage) {
            const stageNames = {
              seed: "benih",
              sprout: "tunas",
              flower: "bunga",
              forest: "hutan",
            };
            toastStore.addToast(
              `tamanmu tumbuh menjadi ${stageNames[gardenStage]}! 🌱`,
              "levelup"
            );
          }

          // Regular XP notification
          if (newLevel === oldLevel && gardenStage === oldStage) {
            toastStore.addToast(`+${amount} xp`, "xp");
          }
        }

        // Sync to Firebase
        if (isSyncEnabled()) {
          const syncUser = useSyncStore.getState().user;
          if (syncUser) {
            const userData = get().user;
            syncUserProfile({
              name: userData.name,
              xp: userData.xp,
              level: userData.level,
              gardenStage: userData.gardenStage,
              avatar: userData.avatar,
            });
          }
        }
      },

      setUserName: (name) => {
        set({
          user: { ...get().user, name },
        });
        // Sync to Firebase
        if (isSyncEnabled()) {
          const syncUser = useSyncStore.getState().user;
          if (syncUser) {
            const userData = get().user;
            syncUserProfile({
              name: userData.name,
              xp: userData.xp,
              level: userData.level,
              gardenStage: userData.gardenStage,
              avatar: userData.avatar,
            });
          }
        }
      },

      setUserAvatar: (avatar) => {
        set({
          user: { ...get().user, avatar },
        });
        // Sync to Firebase
        if (isSyncEnabled()) {
          const syncUser = useSyncStore.getState().user;
          if (syncUser) {
            const userData = get().user;
            syncUserProfile({
              name: userData.name,
              xp: userData.xp,
              level: userData.level,
              gardenStage: userData.gardenStage,
              avatar: userData.avatar,
            });
          }
        }
      },

      toggleNotification: (key) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: !state.notifications?.[key],
          },
        }));
      },

      setReminderTime: (time) => set({ reminderTime: time }),

      // Monk Mode actions
      enableMonkMode: (view) =>
        set({ isMonkMode: true, monkModeView: view || get().currentView }),
      disableMonkMode: () => set({ isMonkMode: false, monkModeView: null }),
      toggleMonkMode: () => {
        const state = get();
        if (state.isMonkMode) {
          state.disableMonkMode();
        } else {
          state.enableMonkMode();
        }
      },

      // Firebase Sync
      initializeSync: () => {
        if (!isSyncEnabled()) return;

        const syncUser = useSyncStore.getState().user;
        if (!syncUser) return;

        console.log("🔄 Initializing user profile sync...");

        const unsubscribe = subscribeToUserProfile(syncUser.uid, (data) => {
          if (data && data.name) {
            set({
              user: {
                ...get().user,
                name: data.name || get().user.name,
                xp: data.xp !== undefined ? data.xp : get().user.xp,
                level: data.level !== undefined ? data.level : get().user.level,
                gardenStage: data.gardenStage || get().user.gardenStage,
                avatar:
                  data.avatar !== undefined ? data.avatar : get().user.avatar,
              },
            });
            console.log("📥 User profile synced from Firebase");
          }
        });

        set({ syncUnsubscribe: unsubscribe });
      },

      stopSync: () => {
        const { syncUnsubscribe } = get();
        if (syncUnsubscribe) {
          syncUnsubscribe();
          set({ syncUnsubscribe: null });
        }
      },
    }),
    {
      name: "nivra-app-storage",
    }
  )
);
