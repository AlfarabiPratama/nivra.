import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useJournalStore = create(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: false,
      
      addEntry: async (content, mood = null, tags = []) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        const newEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content,
          mood, // null or 1-5
          tags: tags || [], // array of tag strings
          createdAt: new Date().toISOString(),
        };
        set({ entries: [newEntry, ...get().entries], isLoading: false });
      },
      
      deleteEntry: async (id) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        set({
          entries: get().entries.filter((entry) => entry.id !== id),
          isLoading: false
        });
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
      name: 'nivra-journal-storage',
    }
  )
);
