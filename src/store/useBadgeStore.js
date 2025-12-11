import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BADGES, BADGE_TYPES, getBadgeById } from "../config/badges";

/**
 * Badge Store - Manages user's badge/achievement progress
 *
 * Tracks:
 * - Unlocked badges
 * - Progress counters for each badge type
 * - Pending badge notifications (queue)
 */
export const useBadgeStore = create(
  persist(
    (set, get) => ({
      // === STATE ===

      // IDs of unlocked badges
      unlockedBadges: [],

      // Progress counters
      progress: {
        currentStreak: 0,
        longestStreak: 0,
        tasksCompleted: 0,
        habitsCompleted: 0,
        journalEntries: 0,
        booksFinished: 0,
        perfectDays: 0, // Days where all habits completed
      },

      // Queue of newly unlocked badges to show
      pendingBadges: [],

      // Last activity date for streak calculation
      lastActivityDate: null,

      // === ACTIONS ===

      /**
       * Update progress counter and check for new badges
       * @param {string} type - Progress type (from BADGE_TYPES)
       * @param {number} amount - Amount to add (default 1)
       */
      incrementProgress: (type, amount = 1) => {
        const { progress, checkAndUnlockBadges } = get();

        const newProgress = { ...progress };

        switch (type) {
          case BADGE_TYPES.STREAK:
            newProgress.currentStreak += amount;
            if (newProgress.currentStreak > newProgress.longestStreak) {
              newProgress.longestStreak = newProgress.currentStreak;
            }
            break;
          case BADGE_TYPES.TASKS:
            newProgress.tasksCompleted += amount;
            break;
          case BADGE_TYPES.HABITS:
            newProgress.habitsCompleted += amount;
            break;
          case BADGE_TYPES.JOURNAL:
            newProgress.journalEntries += amount;
            break;
          case BADGE_TYPES.BOOKS:
            newProgress.booksFinished += amount;
            break;
          case BADGE_TYPES.SPECIAL:
            if (amount === "perfect_day") {
              newProgress.perfectDays += 1;
            }
            break;
          default:
            break;
        }

        set({ progress: newProgress });

        // Check for new badges after progress update
        setTimeout(() => checkAndUnlockBadges(), 100);
      },

      /**
       * Set streak value directly (used by streak calculator)
       */
      setStreak: (currentStreak) => {
        const { progress, checkAndUnlockBadges } = get();

        const newProgress = {
          ...progress,
          currentStreak,
          longestStreak: Math.max(currentStreak, progress.longestStreak),
        };

        set({ progress: newProgress });
        checkAndUnlockBadges();
      },

      /**
       * Set user level (for level badges)
       */
      setLevel: (level) => {
        const { checkAndUnlockBadges } = get();
        set({ userLevel: level });
        checkAndUnlockBadges();
      },

      /**
       * Check all badges and unlock any that are newly eligible
       */
      checkAndUnlockBadges: () => {
        const { progress, unlockedBadges, userLevel = 1 } = get();
        const newlyUnlocked = [];

        BADGES.forEach((badge) => {
          // Skip if already unlocked
          if (unlockedBadges.includes(badge.id)) return;

          let isEligible = false;

          switch (badge.type) {
            case BADGE_TYPES.STREAK:
              isEligible = progress.currentStreak >= badge.threshold;
              break;
            case BADGE_TYPES.TASKS:
              isEligible = progress.tasksCompleted >= badge.threshold;
              break;
            case BADGE_TYPES.HABITS:
              isEligible = progress.habitsCompleted >= badge.threshold;
              break;
            case BADGE_TYPES.JOURNAL:
              isEligible = progress.journalEntries >= badge.threshold;
              break;
            case BADGE_TYPES.LEVEL:
              isEligible = userLevel >= badge.threshold;
              break;
            case BADGE_TYPES.BOOKS:
              isEligible = progress.booksFinished >= badge.threshold;
              break;
            case BADGE_TYPES.SPECIAL:
              // Special badges have custom logic
              if (badge.id === "first_task" && progress.tasksCompleted >= 1) {
                isEligible = true;
              }
              if (badge.id === "perfect_day" && progress.perfectDays >= 1) {
                isEligible = true;
              }
              break;
            default:
              break;
          }

          if (isEligible) {
            newlyUnlocked.push(badge.id);
          }
        });

        if (newlyUnlocked.length > 0) {
          set({
            unlockedBadges: [...unlockedBadges, ...newlyUnlocked],
            pendingBadges: [...get().pendingBadges, ...newlyUnlocked],
          });

          console.log("🏅 New badges unlocked:", newlyUnlocked);
        }
      },

      /**
       * Get next pending badge to show (and remove from queue)
       */
      popPendingBadge: () => {
        const { pendingBadges } = get();
        if (pendingBadges.length === 0) return null;

        const [next, ...rest] = pendingBadges;
        set({ pendingBadges: rest });

        return getBadgeById(next);
      },

      /**
       * Clear all pending badges (dismiss all)
       */
      clearPendingBadges: () => {
        set({ pendingBadges: [] });
      },

      /**
       * Check if a specific badge is unlocked
       */
      isBadgeUnlocked: (badgeId) => {
        return get().unlockedBadges.includes(badgeId);
      },

      /**
       * Get progress percentage for a specific badge
       */
      getBadgeProgress: (badgeId) => {
        const { progress, userLevel = 1 } = get();
        const badge = getBadgeById(badgeId);
        if (!badge) return 0;

        let current = 0;

        switch (badge.type) {
          case BADGE_TYPES.STREAK:
            current = progress.currentStreak;
            break;
          case BADGE_TYPES.TASKS:
            current = progress.tasksCompleted;
            break;
          case BADGE_TYPES.HABITS:
            current = progress.habitsCompleted;
            break;
          case BADGE_TYPES.JOURNAL:
            current = progress.journalEntries;
            break;
          case BADGE_TYPES.LEVEL:
            current = userLevel;
            break;
          case BADGE_TYPES.BOOKS:
            current = progress.booksFinished;
            break;
          default:
            break;
        }

        return Math.min(100, Math.round((current / badge.threshold) * 100));
      },

      /**
       * Sync progress from external stores
       * Call this on app init to ensure badge progress matches actual data
       */
      syncProgressFromStores: ({
        tasksCompleted,
        habitsCompleted,
        journalEntries,
        booksFinished,
        streak,
        level,
      }) => {
        const { checkAndUnlockBadges } = get();

        set({
          progress: {
            ...get().progress,
            tasksCompleted: tasksCompleted ?? get().progress.tasksCompleted,
            habitsCompleted: habitsCompleted ?? get().progress.habitsCompleted,
            journalEntries: journalEntries ?? get().progress.journalEntries,
            booksFinished: booksFinished ?? get().progress.booksFinished,
            currentStreak: streak ?? get().progress.currentStreak,
          },
          userLevel: level ?? get().userLevel,
        });

        checkAndUnlockBadges();
      },

      /**
       * Get all unlocked badges as full objects
       */
      getUnlockedBadges: () => {
        return get()
          .unlockedBadges.map((id) => getBadgeById(id))
          .filter(Boolean);
      },

      /**
       * Get count of unlocked badges
       */
      getUnlockedCount: () => {
        return get().unlockedBadges.length;
      },

      /**
       * Get total badge count
       */
      getTotalBadgeCount: () => {
        return BADGES.length;
      },
    }),
    {
      name: "nivra-badges",
      version: 1,
    }
  )
);
