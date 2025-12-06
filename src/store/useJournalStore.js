import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSyncEnabled } from "../config/firebaseConfig";
import {
  syncDocToFirestore,
  deleteDocFromFirestore,
  subscribeToCollection,
} from "../services/firestoreService";
import { useSyncStore } from "./useSyncStore";

export const useJournalStore = create(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: false,
      syncUnsubscribe: null,

      // Initialize Firebase sync
      initializeSync: () => {
        if (!isSyncEnabled()) return;

        const user = useSyncStore.getState().user;
        if (!user) return;

        const unsubscribe = subscribeToCollection(
          user.uid,
          "journals",
          (data) => {
            set({ entries: data });
          }
        );

        set({ syncUnsubscribe: unsubscribe });
      },

      // Stop Firebase sync
      stopSync: () => {
        const { syncUnsubscribe } = get();
        if (syncUnsubscribe) {
          syncUnsubscribe();
          set({ syncUnsubscribe: null });
        }
      },

      addEntry: async (content, mood = null, tags = []) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 300));
        const newEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content,
          mood, // null or 1-5
          tags: tags || [], // array of tag strings
          createdAt: new Date().toISOString(),
        };
        set({ entries: [newEntry, ...get().entries], isLoading: false });

        // Sync to Firebase
        if (isSyncEnabled()) {
          const user = useSyncStore.getState().user;
          if (user) {
            syncDocToFirestore(user.uid, "journals", newEntry.id, newEntry);
          }
        }
      },

      deleteEntry: async (id) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 200));
        set({
          entries: get().entries.filter((entry) => entry.id !== id),
          isLoading: false,
        });

        // Delete from Firebase
        if (isSyncEnabled()) {
          const user = useSyncStore.getState().user;
          if (user) {
            deleteDocFromFirestore(user.uid, "journals", id);
          }
        }
      },

      getEntriesByDate: (date) => {
        const targetDate = new Date(date).toDateString();
        return get().entries.filter(
          (entry) => new Date(entry.createdAt).toDateString() === targetDate
        );
      },

      getRecentEntries: (count = 10) => {
        return get().entries.slice(0, count);
      },
    }),
    {
      name: "nivra-journal-storage",
    }
  )
);
