import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Current navigation state
      currentView: 'dashboard',
      
      // User profile
      user: {
        name: '',
        xp: 0,
        level: 1,
        gardenStage: 'seed', // seed, sprout, flower, forest
        avatar: null, // base64 image or URL
      },
      
      // Notifications preferences
      notifications: {
        pomodoroAlerts: false,
        taskAlerts: false,
        reminders: false,
      },
      reminderTime: '08:00',

      // Actions
      setCurrentView: (view) => set({ currentView: view }),
      
      addXP: (amount, toastStore = null) => {
        const oldLevel = get().user.level;
        const oldStage = get().user.gardenStage;
        const currentXP = get().user.xp + amount;
        const newLevel = Math.floor(currentXP / 100) + 1;
        
        // Determine garden stage based on XP
        let gardenStage = 'seed';
        if (currentXP >= 500) gardenStage = 'forest';
        else if (currentXP >= 250) gardenStage = 'flower';
        else if (currentXP >= 100) gardenStage = 'sprout';
        
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
            toastStore.addToast(`naik ke level ${newLevel}! 🌟`, 'levelup');
          }
          
          // Garden stage upgrade notification
          if (gardenStage !== oldStage) {
            const stageNames = {
              seed: 'benih',
              sprout: 'tunas',
              flower: 'bunga',
              forest: 'hutan'
            };
            toastStore.addToast(`tamanmu tumbuh menjadi ${stageNames[gardenStage]}! 🌱`, 'levelup');
          }
          
          // Regular XP notification
          if (newLevel === oldLevel && gardenStage === oldStage) {
            toastStore.addToast(`+${amount} xp`, 'xp');
          }
        }
      },
      
      setUserName: (name) => set({
        user: { ...get().user, name }
      }),
      
      setUserAvatar: (avatar) => set({
        user: { ...get().user, avatar }
      }),

      toggleNotification: (key) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: !state.notifications?.[key],
          },
        }));
      },

      setReminderTime: (time) => set({ reminderTime: time }),
    }),
    {
      name: 'nivra-app-storage',
    }
  )
);
