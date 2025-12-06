import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSyncEnabled } from "../config/firebaseConfig";
import {
  getCurrentUser,
  onAuthChange,
  signInAnonymous,
} from "../services/authService";
import { checkSyncStatus } from "../services/firestoreService";

export const useSyncStore = create(
  persist(
    (set, get) => ({
      // Sync state
      isSyncing: false,
      lastSyncAt: null,
      syncError: null,
      user: null,
      isAuthenticated: false,

      // Sync settings
      autoSync: true,
      syncEnabled: isSyncEnabled(),

      // Initialize sync (auto sign-in)
      initializeSync: async () => {
        if (!isSyncEnabled()) {
          console.log("ℹ️ Firebase sync is disabled");
          return;
        }

        try {
          // Check if already signed in
          const currentUser = getCurrentUser();

          if (currentUser) {
            set({
              user: {
                uid: currentUser.uid,
                email: currentUser.email,
                isAnonymous: currentUser.isAnonymous,
              },
              isAuthenticated: true,
            });
            console.log("✅ Already authenticated:", currentUser.uid);
          } else {
            // Auto sign-in anonymously
            const user = await signInAnonymous();
            set({
              user: {
                uid: user.uid,
                email: user.email,
                isAnonymous: user.isAnonymous,
              },
              isAuthenticated: true,
            });
            console.log("✅ Auto signed in anonymously");
          }
        } catch (error) {
          console.error("Initialize sync error:", error);
          set({ syncError: error.message });
        }
      },

      // Listen to auth changes
      subscribeToAuth: () => {
        if (!isSyncEnabled()) return () => {};

        return onAuthChange((user) => {
          if (user) {
            set({
              user: {
                uid: user.uid,
                email: user.email,
                isAnonymous: user.isAnonymous,
              },
              isAuthenticated: true,
              syncError: null,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        });
      },

      // Set syncing status
      setSyncing: (isSyncing) => set({ isSyncing }),

      // Update last sync time
      updateLastSync: () => set({ lastSyncAt: new Date().toISOString() }),

      // Set sync error
      setSyncError: (error) => set({ syncError: error }),

      // Clear sync error
      clearSyncError: () => set({ syncError: null }),

      // Toggle auto sync
      toggleAutoSync: () => set({ autoSync: !get().autoSync }),

      // Get sync status
      getSyncStatus: () => {
        const state = get();
        const status = checkSyncStatus();

        return {
          ...status,
          isAuthenticated: state.isAuthenticated,
          lastSyncAt: state.lastSyncAt,
          isSyncing: state.isSyncing,
          syncError: state.syncError,
          autoSync: state.autoSync,
          syncEnabled: state.syncEnabled,
        };
      },
    }),
    {
      name: "sync-storage",
      partialize: (state) => ({
        autoSync: state.autoSync,
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
);
