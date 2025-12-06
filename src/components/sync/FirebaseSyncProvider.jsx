import { useEffect } from "react";
import { useSyncStore } from "../../store/useSyncStore";
import { useTaskStore } from "../../store/useTaskStore";
import { useBookStore } from "../../store/useBookStore";
import { useJournalStore } from "../../store/useJournalStore";
import { useHabitStore } from "../../store/useHabitStore";

/**
 * Firebase Sync Provider Component
 * Place this in App.jsx to initialize Firebase sync
 */
export const FirebaseSyncProvider = ({ children }) => {
  const { initializeSync, subscribeToAuth, isAuthenticated } = useSyncStore();
  const initTasksSync = useTaskStore((state) => state.initializeSync);
  const initBooksSync = useBookStore((state) => state.initializeSync);
  const initJournalSync = useJournalStore((state) => state.initializeSync);
  const initHabitsSync = useHabitStore((state) => state.initializeSync);

  useEffect(() => {
    // Initialize Firebase authentication
    initializeSync();

    // Subscribe to auth changes
    const unsubscribe = subscribeToAuth();

    return () => {
      unsubscribe();
    };
  }, [initializeSync, subscribeToAuth]);

  useEffect(() => {
    // Initialize sync for all stores when authenticated
    if (isAuthenticated) {
      console.log("🔄 Initializing sync for all stores...");

      // Initialize with small delays to avoid overwhelming Firestore
      setTimeout(() => initTasksSync?.(), 100);
      setTimeout(() => initBooksSync?.(), 200);
      setTimeout(() => initJournalSync?.(), 300);
      setTimeout(() => initHabitsSync?.(), 400);
    }
  }, [
    isAuthenticated,
    initTasksSync,
    initBooksSync,
    initJournalSync,
    initHabitsSync,
  ]);

  return <>{children}</>;
};
