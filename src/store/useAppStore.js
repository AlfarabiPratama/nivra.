import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSyncEnabled } from "../config/firebaseConfig";
import {
  syncUserProfile,
  subscribeToUserProfile,
} from "../services/firestoreService";
import { useSyncStore } from "./useSyncStore";
import {
  GARDEN_XP_STAGES,
  getGardenStageByXp,
  getLevelFromXp,
} from "../utils/xp";
import { achievementList, useAchievementStore } from "./useAchievementStore";

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
        gardenStage: "seed", // seed, sprout, sapling, flower, forest
        avatar: null, // base64 image atau URL
      },

      // Notifications preferences
      notifications: {
        pomodoroAlerts: false,
        taskAlerts: false,
        reminders: false,
      },
      reminderTime: "08:00",

      // Monk mode
      isMonkMode: false,
      monkModeView: null,

      // Firebase sync
      syncUnsubscribe: null,

      // Actions
      setCurrentView: (view) => set({ currentView: view }),

      addXP: (amount, toastStore = null, options = {}) => {
        const { source, stats = null, suppressAchievementCheck = false } =
          options;
        const oldUser = get().user;
        const oldLevel = oldUser.level;
        const oldStage = oldUser.gardenStage;

        const currentXP = Math.max(0, oldUser.xp + amount);
        const levelInfo = getLevelFromXp(currentXP);
        const newLevel = levelInfo.level;
        const gardenStage = getGardenStageByXp(currentXP);

        set({
          user: {
            ...oldUser,
            xp: currentXP,
            level: newLevel,
            gardenStage,
          },
        });

        if (toastStore) {
          if (newLevel > oldLevel) {
            const jump = newLevel - oldLevel;
            const levelText =
              jump > 1
                ? `naik ${jump} level ke level ${newLevel}!`
                : `naik ke level ${newLevel}!`;
            toastStore.addToast(levelText, "levelup");
          }

          if (gardenStage !== oldStage) {
            const stageNames = GARDEN_XP_STAGES.reduce((acc, stage) => {
              acc[stage.id] = stage.name;
              return acc;
            }, {});
            toastStore.addToast(
              `tamanmu tumbuh menjadi ${stageNames[gardenStage]}!`,
              "levelup"
            );
          }

          if (newLevel === oldLevel && gardenStage === oldStage) {
            const magnitude =
              amount >= 50
                ? "lompatan besar untuk tamanmu."
                : amount < 10
                  ? "langkah kecil yang berarti."
                  : "kemajuan mantap.";
            const sourceText = source ? ` dari ${source}` : "";
            toastStore.addToast(
              `+${amount} xp${sourceText} - ${magnitude}`,
              "xp"
            );
          }
        }

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

        if (!suppressAchievementCheck) {
          const achievementState = useAchievementStore.getState();
          const unlockStats = stats || {
            level: newLevel,
            xp: currentXP,
          };
          const newUnlocks = achievementState.checkAchievements(unlockStats);
          if (newUnlocks.length > 0) {
            const totalBonus = newUnlocks.reduce(
              (sum, id) => sum + (achievementList[id]?.xp || 0),
              0
            );
            if (totalBonus > 0) {
              get().addXP(totalBonus, toastStore, {
                source: "achievement",
                suppressAchievementCheck: true,
                stats: unlockStats,
              });
            }
            if (toastStore) {
              const label =
                newUnlocks.length === 1
                  ? "achievement baru dibuka!"
                  : `${newUnlocks.length} achievement terbuka!`;
              toastStore.addToast(label, "success");
            }
          }
        }
      },

      setUserName: (name) => {
        set({
          user: { ...get().user, name },
        });
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

        console.log("Initializing user profile sync...");

        const unsubscribe = subscribeToUserProfile(syncUser.uid, (data) => {
          const localUser = get().user;

          if (data && data.name) {
            console.log("User profile synced from Firebase:", data.name);
            set({
              user: {
                ...localUser,
                name: data.name,
                xp: data.xp !== undefined ? data.xp : localUser.xp,
                level: data.level !== undefined ? data.level : localUser.level,
                gardenStage: data.gardenStage || localUser.gardenStage,
                avatar:
                  data.avatar !== undefined ? data.avatar : localUser.avatar,
              },
            });
          } else if (localUser.name) {
            console.log("Pushing local profile to Firebase:", localUser.name);
            syncUserProfile({
              name: localUser.name,
              xp: localUser.xp,
              level: localUser.level,
              gardenStage: localUser.gardenStage,
              avatar: localUser.avatar,
            });
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
