import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_BOOKS } from "../constants";
import { isSyncEnabled } from "../config/firebaseConfig";
import {
  syncDocToFirestore,
  deleteDocFromFirestore,
  subscribeToCollection,
} from "../services/firestoreService";
import { useSyncStore } from "./useSyncStore";

// Book Store
export const useBookStore = create(
  persist(
    (set, get) => ({
      books: INITIAL_BOOKS,
      isLoading: false,
      yearlyGoal: 12, // Default 12 books per year
      syncUnsubscribe: null,

      // Initialize Firebase sync
      initializeSync: () => {
        if (!isSyncEnabled()) return;

        const user = useSyncStore.getState().user;
        if (!user) return;

        const unsubscribe = subscribeToCollection(user.uid, "books", (data) => {
          set({ books: data });
        });

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

      addBook: async (book) => {
        set({ isLoading: true });
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 300));
        const newBook = {
          ...book,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: "reading",
          progress: 0,
          total: 100,
          color: "#8da399",
          startedDate: new Date().toISOString(),
          progressHistory: [],
          notes: [],
          quotes: [],
        };
        set((state) => ({
          books: [newBook, ...state.books],
          isLoading: false,
        }));

        // Sync to Firebase
        if (isSyncEnabled()) {
          const user = useSyncStore.getState().user;
          if (user) {
            syncDocToFirestore(user.uid, "books", newBook.id, newBook);
          }
        }
      },

      updateBook: async (id, updates) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 200));
        let updatedBook = null;
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id === id) {
              updatedBook = { ...b, ...updates };

              // Track progress history if progress changed
              if (
                updates.progress !== undefined &&
                updates.progress !== b.progress
              ) {
                const progressHistory = b.progressHistory || [];
                updatedBook.progressHistory = [
                  ...progressHistory,
                  {
                    date: new Date().toISOString(),
                    progress: updates.progress,
                    total: b.total,
                  },
                ];
              }

              return updatedBook;
            }
            return b;
          }),
          isLoading: false,
        }));

        // Sync to Firebase
        if (updatedBook && isSyncEnabled()) {
          const user = useSyncStore.getState().user;
          if (user) {
            syncDocToFirestore(user.uid, "books", updatedBook.id, updatedBook);
          }
        }
      },

      deleteBook: async (id) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
          books: state.books.filter((b) => b.id !== id),
          isLoading: false,
        }));

        // Delete from Firebase
        if (isSyncEnabled()) {
          const user = useSyncStore.getState().user;
          if (user) {
            deleteDocFromFirestore(user.uid, "books", id);
          }
        }
      },

      getFinishedCount: () => {
        const state = useBookStore.getState();
        return state.books.filter((b) => b.status === "finished").length;
      },

      setYearlyGoal: (goal) => {
        set({ yearlyGoal: parseInt(goal) });
      },

      addNote: (bookId, noteText) => {
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id === bookId) {
              const notes = b.notes || [];
              return {
                ...b,
                notes: [
                  ...notes,
                  {
                    id: `${Date.now()}-${Math.random()
                      .toString(36)
                      .substr(2, 9)}`,
                    text: noteText,
                    page: b.progress,
                    createdAt: new Date().toISOString(),
                  },
                ],
              };
            }
            return b;
          }),
        }));
      },

      addQuote: (bookId, quoteText) => {
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id === bookId) {
              const quotes = b.quotes || [];
              return {
                ...b,
                quotes: [
                  ...quotes,
                  {
                    id: `${Date.now()}-${Math.random()
                      .toString(36)
                      .substr(2, 9)}`,
                    text: quoteText,
                    page: b.progress,
                    createdAt: new Date().toISOString(),
                  },
                ],
              };
            }
            return b;
          }),
        }));
      },

      deleteNote: (bookId, noteId) => {
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id === bookId) {
              return {
                ...b,
                notes: (b.notes || []).filter((n) => n.id !== noteId),
              };
            }
            return b;
          }),
        }));
      },

      deleteQuote: (bookId, quoteId) => {
        set((state) => ({
          books: state.books.map((b) => {
            if (b.id === bookId) {
              return {
                ...b,
                quotes: (b.quotes || []).filter((q) => q.id !== quoteId),
              };
            }
            return b;
          }),
        }));
      },

      getYearlyProgress: () => {
        const { books, yearlyGoal } = get();
        const currentYear = new Date().getFullYear();

        const booksFinishedThisYear = books.filter((b) => {
          if (b.status !== "finished" || !b.finishedDate) return false;
          const finishedYear = new Date(b.finishedDate).getFullYear();
          return finishedYear === currentYear;
        });

        const monthsPassed = new Date().getMonth() + 1;
        const averagePerMonth = booksFinishedThisYear.length / monthsPassed;
        const projectedTotal = Math.round(averagePerMonth * 12);
        const onTrack = projectedTotal >= yearlyGoal;

        return {
          finished: booksFinishedThisYear.length,
          goal: yearlyGoal,
          percentage: Math.min(
            (booksFinishedThisYear.length / yearlyGoal) * 100,
            100
          ),
          remaining: Math.max(yearlyGoal - booksFinishedThisYear.length, 0),
          averagePerMonth: averagePerMonth.toFixed(1),
          projectedTotal,
          onTrack,
        };
      },
    }),
    { name: "nivra-books" }
  )
);
