import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSyncEnabled } from "../config/firebaseConfig";
import {
  syncDocToFirestore,
  subscribeToCollection,
} from "../services/firestoreService";
import { useSyncStore } from "./useSyncStore";

// Frequency types
export const FREQUENCY_TYPES = {
  DAILY: "daily",
  INTERVAL: "interval", // Every X days
  WEEKLY: "weekly", // X times per week
  SPECIFIC_DAYS: "specific-days", // Specific days of week
};

// Day names for specific days selection
export const WEEKDAYS = [
  { id: 0, short: "Min", full: "Minggu" },
  { id: 1, short: "Sen", full: "Senin" },
  { id: 2, short: "Sel", full: "Selasa" },
  { id: 3, short: "Rab", full: "Rabu" },
  { id: 4, short: "Kam", full: "Kamis" },
  { id: 5, short: "Jum", full: "Jumat" },
  { id: 6, short: "Sab", full: "Sabtu" },
];

export const useHabitStore = create(
  persist(
    (set, get) => ({
      // Habit definitions with new frequency support
      habits: [
        {
          id: "reading",
          name: "Membaca",
          emoji: "📚",
          category: "growth",
          frequencyType: FREQUENCY_TYPES.DAILY,
          targetDays: 7, // per week (legacy support)
        },
        {
          id: "exercise",
          name: "Olahraga",
          emoji: "💪",
          category: "health",
          frequencyType: FREQUENCY_TYPES.INTERVAL,
          intervalDays: 2, // every 2 days
          targetDays: 3,
        },
        {
          id: "water",
          name: "Minum Air 8 Gelas",
          emoji: "💧",
          category: "health",
          frequencyType: FREQUENCY_TYPES.DAILY,
          targetDays: 7,
        },
        {
          id: "journal",
          name: "Journaling",
          emoji: "✍️",
          category: "growth",
          frequencyType: FREQUENCY_TYPES.DAILY,
          targetDays: 7,
        },
        {
          id: "meditation",
          name: "Meditasi",
          emoji: "🧘",
          category: "mindfulness",
          frequencyType: FREQUENCY_TYPES.SPECIFIC_DAYS,
          specificDays: [1, 3, 5], // Mon, Wed, Fri
          targetDays: 5,
        },
        {
          id: "sleep",
          name: "Tidur 8 Jam",
          emoji: "😴",
          category: "health",
          frequencyType: FREQUENCY_TYPES.DAILY,
          targetDays: 7,
        },
      ],

      // Check-in records: { habitId: { date: true/false } }
      checkIns: {},
      syncUnsubscribe: null,

      // Initialize Firebase sync
      initializeSync: () => {
        if (!isSyncEnabled()) return;

        const user = useSyncStore.getState().user;
        if (!user) return;

        const unsubscribe = subscribeToCollection(
          user.uid,
          "habits",
          (data) => {
            if (data.length > 0 && data[0].checkIns) {
              set({ checkIns: data[0].checkIns });
            }
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

      // Check if habit is due today based on frequency
      isHabitDueToday: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return false;

        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday

        // Legacy support - if no frequencyType, assume daily
        if (
          !habit.frequencyType ||
          habit.frequencyType === FREQUENCY_TYPES.DAILY
        ) {
          return true;
        }

        if (habit.frequencyType === FREQUENCY_TYPES.SPECIFIC_DAYS) {
          return habit.specificDays?.includes(dayOfWeek) || false;
        }

        if (habit.frequencyType === FREQUENCY_TYPES.INTERVAL) {
          const intervalDays = habit.intervalDays || 2;
          const checkIns = get().checkIns[habitId] || {};

          // Find last check-in date
          const checkInDates = Object.keys(checkIns)
            .filter((date) => checkIns[date])
            .map((date) => new Date(date))
            .sort((a, b) => b - a);

          if (checkInDates.length === 0) return true; // Never done, due today

          const lastCheckIn = checkInDates[0];
          const daysSinceLastCheckIn = Math.floor(
            (today - lastCheckIn) / (1000 * 60 * 60 * 24)
          );

          return daysSinceLastCheckIn >= intervalDays;
        }

        if (habit.frequencyType === FREQUENCY_TYPES.WEEKLY) {
          // For weekly, always show but track completion against target
          return true;
        }

        return true;
      },

      // Get next due date for a habit
      getNextDueDate: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (
          !habit.frequencyType ||
          habit.frequencyType === FREQUENCY_TYPES.DAILY
        ) {
          return today;
        }

        if (habit.frequencyType === FREQUENCY_TYPES.SPECIFIC_DAYS) {
          const days = habit.specificDays || [];
          const currentDay = today.getDay();

          // Find next scheduled day
          for (let i = 0; i <= 7; i++) {
            const checkDay = (currentDay + i) % 7;
            if (days.includes(checkDay)) {
              const nextDate = new Date(today);
              nextDate.setDate(today.getDate() + i);
              return nextDate;
            }
          }
        }

        if (habit.frequencyType === FREQUENCY_TYPES.INTERVAL) {
          const intervalDays = habit.intervalDays || 2;
          const checkIns = get().checkIns[habitId] || {};

          const checkInDates = Object.keys(checkIns)
            .filter((date) => checkIns[date])
            .map((date) => new Date(date))
            .sort((a, b) => b - a);

          if (checkInDates.length === 0) return today;

          const lastCheckIn = checkInDates[0];
          const nextDue = new Date(lastCheckIn);
          nextDue.setDate(lastCheckIn.getDate() + intervalDays);

          return nextDue > today ? nextDue : today;
        }

        return today;
      },

      // Get frequency description text
      getFrequencyText: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return "";

        if (
          !habit.frequencyType ||
          habit.frequencyType === FREQUENCY_TYPES.DAILY
        ) {
          return "Setiap hari";
        }

        if (habit.frequencyType === FREQUENCY_TYPES.INTERVAL) {
          return `Setiap ${habit.intervalDays || 2} hari`;
        }

        if (habit.frequencyType === FREQUENCY_TYPES.WEEKLY) {
          return `${habit.targetDays}x seminggu`;
        }

        if (habit.frequencyType === FREQUENCY_TYPES.SPECIFIC_DAYS) {
          const days = habit.specificDays || [];
          const dayNames = days
            .map((d) => WEEKDAYS.find((w) => w.id === d)?.short)
            .filter(Boolean);
          return dayNames.join(", ");
        }

        return "";
      },

      // Actions
      toggleCheckIn: (habitId, date = new Date().toDateString()) => {
        const habitChecks = get().checkIns[habitId] || {};
        const isChecked = habitChecks[date];

        const newCheckIns = {
          ...get().checkIns,
          [habitId]: {
            ...habitChecks,
            [date]: !isChecked,
          },
        };

        set({ checkIns: newCheckIns });

        // Sync to Firebase
        if (isSyncEnabled()) {
          const user = useSyncStore.getState().user;
          if (user) {
            syncDocToFirestore(user.uid, "habits", "checkIns", {
              checkIns: newCheckIns,
            });
          }
        }

        // Update badge progress when checking in (not unchecking)
        if (!isChecked) {
          // Lazy import to avoid circular dependency
          import("./useBadgeStore").then(({ useBadgeStore }) => {
            import("../config/badges").then(({ BADGE_TYPES }) => {
              useBadgeStore.getState().incrementProgress(BADGE_TYPES.HABITS);
            });
          });
        }
      },

      isCheckedToday: (habitId) => {
        const today = new Date().toDateString();
        return get().checkIns[habitId]?.[today] || false;
      },

      getStreak: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        const checks = get().checkIns[habitId] || {};
        let streak = 0;
        let currentDate = new Date();

        // For interval habits, calculate streak based on interval
        if (habit?.frequencyType === FREQUENCY_TYPES.INTERVAL) {
          const interval = habit.intervalDays || 2;
          let lastExpectedDate = new Date();

          while (true) {
            const dateStr = lastExpectedDate.toDateString();
            if (checks[dateStr]) {
              streak++;
              lastExpectedDate.setDate(lastExpectedDate.getDate() - interval);
            } else {
              // Allow some grace period
              const nextCheck = new Date(lastExpectedDate);
              nextCheck.setDate(nextCheck.getDate() - 1);
              if (checks[nextCheck.toDateString()]) {
                streak++;
                lastExpectedDate = nextCheck;
                lastExpectedDate.setDate(lastExpectedDate.getDate() - interval);
              } else {
                break;
              }
            }
          }
          return streak;
        }

        // For specific days, count consecutive scheduled days completed
        if (habit?.frequencyType === FREQUENCY_TYPES.SPECIFIC_DAYS) {
          const days = habit.specificDays || [];

          while (true) {
            const dateStr = currentDate.toDateString();
            const dayOfWeek = currentDate.getDay();

            // Only count days that are scheduled
            if (days.includes(dayOfWeek)) {
              if (checks[dateStr]) {
                streak++;
              } else if (
                streak > 0 ||
                currentDate.toDateString() !== new Date().toDateString()
              ) {
                break;
              }
            }
            currentDate.setDate(currentDate.getDate() - 1);

            // Safety limit
            if (streak > 365) break;
          }
          return streak;
        }

        // Default: count consecutive days backwards from today
        while (true) {
          const dateStr = currentDate.toDateString();
          if (checks[dateStr]) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }

        return streak;
      },

      getCompletionRate: (habitId, days = 7) => {
        const habit = get().habits.find((h) => h.id === habitId);
        const checks = get().checkIns[habitId] || {};
        let completed = 0;
        let expected = 0;

        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toDateString();
          const dayOfWeek = date.getDay();

          // Determine if this day was expected
          let isExpected = true;

          if (habit?.frequencyType === FREQUENCY_TYPES.SPECIFIC_DAYS) {
            isExpected = habit.specificDays?.includes(dayOfWeek) || false;
          }

          if (isExpected) {
            expected++;
            if (checks[dateStr]) {
              completed++;
            }
          }
        }

        return expected > 0 ? Math.round((completed / expected) * 100) : 0;
      },

      getLast7Days: (habitId) => {
        const checks = get().checkIns[habitId] || {};
        const habit = get().habits.find((h) => h.id === habitId);
        const days = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayOfWeek = date.getDay();

          // Check if this day was scheduled
          let isScheduled = true;
          if (habit?.frequencyType === FREQUENCY_TYPES.SPECIFIC_DAYS) {
            isScheduled = habit.specificDays?.includes(dayOfWeek) || false;
          }

          days.push({
            date: date.toDateString(),
            day: date.toLocaleDateString("id-ID", { weekday: "short" }),
            checked: checks[date.toDateString()] || false,
            isScheduled,
          });
        }

        return days;
      },

      addHabit: (habit) => {
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id: Date.now().toString(),
              frequencyType: habit.frequencyType || FREQUENCY_TYPES.DAILY,
            },
          ],
        }));
      },

      updateHabit: (habitId, updates) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, ...updates } : h
          ),
        }));
      },

      removeHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== habitId),
          checkIns: Object.fromEntries(
            Object.entries(state.checkIns).filter(([id]) => id !== habitId)
          ),
        }));
      },

      // Analytics
      getTodayProgress: () => {
        const { habits, isCheckedToday, isHabitDueToday } = get();
        const dueToday = habits.filter((h) => isHabitDueToday(h.id));
        const completed = dueToday.filter((h) => isCheckedToday(h.id)).length;
        return {
          completed,
          total: dueToday.length,
          percentage:
            dueToday.length > 0
              ? Math.round((completed / dueToday.length) * 100)
              : 0,
        };
      },

      getWeeklyStats: () => {
        const { habits, getCompletionRate } = get();
        return habits.map((habit) => ({
          ...habit,
          completionRate: getCompletionRate(habit.id, 7),
          streak: get().getStreak(habit.id),
        }));
      },
    }),
    {
      name: "nivra-habits",
    }
  )
);
