import { useEffect } from "react";
import { useSyncStore } from "../../store/useSyncStore";
import { useTaskStore } from "../../store/useTaskStore";
import { useBookStore } from "../../store/useBookStore";
import { useJournalStore } from "../../store/useJournalStore";
import { useHabitStore } from "../../store/useHabitStore";
import { useAppStore } from "../../store/useAppStore";

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
  const initUserProfileSync = useAppStore((state) => state.initializeSync);

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
      setTimeout(() => initUserProfileSync?.(), 50); // User profile first
      setTimeout(() => initTasksSync?.(), 100);
      setTimeout(() => initBooksSync?.(), 200);
      setTimeout(() => initJournalSync?.(), 300);
      setTimeout(() => initHabitsSync?.(), 400);
    }
  }, [
    isAuthenticated,
    initUserProfileSync,
    initTasksSync,
    initBooksSync,
    initJournalSync,
    initHabitsSync,
  ]);

  return <>{children}</>;
};
