import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSyncEnabled } from "../config/firebaseConfig";
import {
  getCurrentUser,
  onAuthChange,
  handleRedirectResult,
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

      // Initialize sync (check if already signed in)
      initializeSync: async () => {
        if (!isSyncEnabled()) {
          console.log("ℹ️ Firebase sync is disabled");
          return;
        }

        try {
          // Check for redirect result first (for mobile Google sign-in)
          const redirectUser = await handleRedirectResult();
          if (redirectUser) {
            set({
              user: {
                uid: redirectUser.uid,
                email: redirectUser.email,
                isAnonymous: redirectUser.isAnonymous || false,
              },
              isAuthenticated: true,
            });
            console.log("✅ Logged in via redirect:", redirectUser.email);
            return;
          }

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
            console.log(
              "✅ Already authenticated:",
              currentUser.email || currentUser.uid
            );
          } else {
            // User not authenticated - they need to login via LoginView
            console.log("ℹ️ User not authenticated yet");
            set({ isAuthenticated: false, user: null });
          }
        } catch (error) {
          console.error("Initialize sync error:", error);
          set({ syncError: error.message });
        }
      },

      // Listen to auth changes
      subscribeToAuth: () => {
        if (!isSyncEnabled()) return () => {};

        console.log("👂 Subscribing to auth changes...");

        return onAuthChange((user) => {
          console.log(
            "🔔 Auth state changed:",
            user ? user.email || user.uid : "null"
          );

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
