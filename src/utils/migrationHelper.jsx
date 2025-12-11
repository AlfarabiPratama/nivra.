/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import {
  syncCollectionToFirestore,
  syncUserProfile,
} from "../services/firestoreService";
import { Button } from "../components/ui/Button";
import { useTaskStore } from "../store/useTaskStore";
import { useBookStore } from "../store/useBookStore";
import { useJournalStore } from "../store/useJournalStore";
import { useHabitStore } from "../store/useHabitStore";
import { useAppStore } from "../store/useAppStore";
import { useSyncStore } from "../store/useSyncStore";

/**
 * Migrate all existing LocalStorage data to Firestore
 * Run this once after setting up Firebase
 */
export const migrateToFirebase = async () => {
  const syncState = useSyncStore.getState();

  if (!syncState.isAuthenticated) {
    throw new Error("Please authenticate first before migrating");
  }

  console.log("🔄 Starting migration to Firebase...");

  try {
    // Get all data from stores
    const tasks = useTaskStore.getState().tasks;
    const books = useBookStore.getState().books;
    const journals = useJournalStore.getState().entries;
    const habits = useHabitStore.getState().habits;
    const userData = useAppStore.getState().user;

    // Sync each collection
    const results = {
      tasks: 0,
      books: 0,
      journals: 0,
      habits: 0,
    };

    if (tasks.length > 0) {
      await syncCollectionToFirestore("tasks", tasks);
      results.tasks = tasks.length;
      console.log(`✅ Migrated ${tasks.length} tasks`);
    }

    if (books.length > 0) {
      await syncCollectionToFirestore("books", books);
      results.books = books.length;
      console.log(`✅ Migrated ${books.length} books`);
    }

    if (journals.length > 0) {
      await syncCollectionToFirestore("journals", journals);
      results.journals = journals.length;
      console.log(`✅ Migrated ${journals.length} journal entries`);
    }

    if (habits.length > 0) {
      await syncCollectionToFirestore("habits", habits);
      results.habits = habits.length;
      console.log(`✅ Migrated ${habits.length} habits`);
    }

    // Sync user profile
    if (userData) {
      await syncUserProfile(userData);
      console.log(`✅ Migrated user profile`);
    }

    console.log("✅ Migration completed successfully!", results);

    return {
      success: true,
      results,
      totalItems: Object.values(results).reduce((a, b) => a + b, 0),
    };
  } catch (error) {
    console.error("❌ Migration failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check if migration is needed
 */
export const checkMigrationStatus = () => {
  const tasks = useTaskStore.getState().tasks;
  const books = useBookStore.getState().books;
  const journals = useJournalStore.getState().entries;
  const habits = useHabitStore.getState().habits;

  const hasLocalData =
    tasks.length > 0 ||
    books.length > 0 ||
    journals.length > 0 ||
    habits.length > 0;

  const syncState = useSyncStore.getState();
  const canMigrate = syncState.isAuthenticated && hasLocalData;

  return {
    hasLocalData,
    canMigrate,
    itemCount: {
      tasks: tasks.length,
      books: books.length,
      journals: journals.length,
      habits: habits.length,
    },
  };
};

/**
 * Create a migration button component (for Settings page)
 */
export const MigrationButton = ({ onSuccess, onError }) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const { hasLocalData, canMigrate, itemCount } = checkMigrationStatus();

  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      const result = await migrateToFirebase();
      setMigrationStatus(result);
      if (result.success && onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      setMigrationStatus({ success: false, error: error.message });
      if (onError) {
        onError(error);
      }
    } finally {
      setIsMigrating(false);
    }
  };

  if (!hasLocalData) {
    return (
      <div className="p-4 border border-(--border-color) bg-(--card-color)">
        <p className="font-mono text-xs text-(--text-muted)">
          No local data to migrate.
        </p>
      </div>
    );
  }

  if (!canMigrate) {
    return (
      <div className="p-4 border border-(--border-color) bg-(--card-color)">
        <p className="font-mono text-xs text-(--text-muted)">
          Please sign in first to enable migration.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 border border-(--border-color) bg-(--card-color)">
      <div>
        <p className="font-mono text-xs text-(--text-main) mb-2">
          Ready to migrate local data to Firebase:
        </p>
        <ul className="font-mono text-xs text-(--text-muted) space-y-1 ml-4">
          {itemCount.tasks > 0 && <li>• {itemCount.tasks} tasks</li>}
          {itemCount.books > 0 && <li>• {itemCount.books} books</li>}
          {itemCount.journals > 0 && (
            <li>• {itemCount.journals} journal entries</li>
          )}
          {itemCount.habits > 0 && <li>• {itemCount.habits} habits</li>}
        </ul>
      </div>

      <Button
        variant="accent"
        onClick={handleMigrate}
        disabled={isMigrating}
        className="w-full"
      >
        {isMigrating ? "Migrating..." : "Migrate to Cloud"}
      </Button>

      {migrationStatus && (
        <div
          className={`p-3 border ${
            migrationStatus.success
              ? "border-green-500/30 bg-green-500/5"
              : "border-red-500/30 bg-red-500/5"
          }`}
        >
          <p
            className={`font-mono text-xs ${
              migrationStatus.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {migrationStatus.success
              ? `✅ Migration successful! ${migrationStatus.totalItems} items synced.`
              : `❌ Migration failed: ${migrationStatus.error}`}
          </p>
        </div>
      )}
    </div>
  );
};
