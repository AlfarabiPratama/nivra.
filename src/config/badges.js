/**
 * Badge Definitions for Nivra Gamification System
 *
 * Categories:
 * - streak: Consecutive days with activity
 * - tasks_completed: Total tasks completed
 * - habits_completed: Total habit check-ins
 * - journal_entries: Total journal entries
 * - level: User level milestones
 * - books_finished: Total books finished
 * - special: Special achievements
 */

export const BADGE_TYPES = {
  STREAK: "streak",
  TASKS: "tasks_completed",
  HABITS: "habits_completed",
  JOURNAL: "journal_entries",
  LEVEL: "level",
  BOOKS: "books_finished",
  SPECIAL: "special",
};

/**
 * Badge definitions array
 * Each badge has:
 * - id: unique identifier
 * - type: category of badge (from BADGE_TYPES)
 * - threshold: value needed to unlock
 * - title: display name
 * - description: explanation text
 * - emoji: visual icon
 * - tier: bronze/silver/gold for visual distinction
 */
export const BADGES = [
  // === STREAK BADGES ===
  {
    id: "streak_3",
    type: BADGE_TYPES.STREAK,
    threshold: 3,
    title: "Konsistensi I",
    description: "3 hari berturut-turut beraktivitas",
    emoji: "🔥",
    tier: "bronze",
  },
  {
    id: "streak_7",
    type: BADGE_TYPES.STREAK,
    threshold: 7,
    title: "Konsistensi II",
    description: "7 hari berturut-turut beraktivitas",
    emoji: "🔥",
    tier: "silver",
  },
  {
    id: "streak_14",
    type: BADGE_TYPES.STREAK,
    threshold: 14,
    title: "Konsistensi III",
    description: "14 hari berturut-turut beraktivitas",
    emoji: "🔥",
    tier: "gold",
  },
  {
    id: "streak_30",
    type: BADGE_TYPES.STREAK,
    threshold: 30,
    title: "Master Konsistensi",
    description: "30 hari tanpa putus",
    emoji: "🏆",
    tier: "gold",
  },

  // === TASK BADGES ===
  {
    id: "tasks_5",
    type: BADGE_TYPES.TASKS,
    threshold: 5,
    title: "Quest Beginner",
    description: "Selesaikan 5 tugas",
    emoji: "✅",
    tier: "bronze",
  },
  {
    id: "tasks_25",
    type: BADGE_TYPES.TASKS,
    threshold: 25,
    title: "Quest Apprentice",
    description: "Selesaikan 25 tugas",
    emoji: "✅",
    tier: "silver",
  },
  {
    id: "tasks_50",
    type: BADGE_TYPES.TASKS,
    threshold: 50,
    title: "Quest Master",
    description: "Selesaikan 50 tugas",
    emoji: "⭐",
    tier: "gold",
  },
  {
    id: "tasks_100",
    type: BADGE_TYPES.TASKS,
    threshold: 100,
    title: "Quest Legend",
    description: "Selesaikan 100 tugas",
    emoji: "🌟",
    tier: "gold",
  },

  // === HABIT BADGES ===
  {
    id: "habits_10",
    type: BADGE_TYPES.HABITS,
    threshold: 10,
    title: "Habit Builder",
    description: "Check-in kebiasaan 10 kali",
    emoji: "🌱",
    tier: "bronze",
  },
  {
    id: "habits_50",
    type: BADGE_TYPES.HABITS,
    threshold: 50,
    title: "Habit Enthusiast",
    description: "Check-in kebiasaan 50 kali",
    emoji: "🌿",
    tier: "silver",
  },
  {
    id: "habits_100",
    type: BADGE_TYPES.HABITS,
    threshold: 100,
    title: "Habit Master",
    description: "Check-in kebiasaan 100 kali",
    emoji: "🌳",
    tier: "gold",
  },

  // === JOURNAL BADGES ===
  {
    id: "journal_5",
    type: BADGE_TYPES.JOURNAL,
    threshold: 5,
    title: "Penulis Pemula",
    description: "Tulis 5 entri jurnal",
    emoji: "📝",
    tier: "bronze",
  },
  {
    id: "journal_20",
    type: BADGE_TYPES.JOURNAL,
    threshold: 20,
    title: "Penulis Aktif",
    description: "Tulis 20 entri jurnal",
    emoji: "📖",
    tier: "silver",
  },
  {
    id: "journal_50",
    type: BADGE_TYPES.JOURNAL,
    threshold: 50,
    title: "Penjelajah Jiwa",
    description: "Tulis 50 entri jurnal",
    emoji: "✨",
    tier: "gold",
  },

  // === LEVEL BADGES ===
  {
    id: "level_5",
    type: BADGE_TYPES.LEVEL,
    threshold: 5,
    title: "Rising Star",
    description: "Mencapai Level 5",
    emoji: "⭐",
    tier: "bronze",
  },
  {
    id: "level_10",
    type: BADGE_TYPES.LEVEL,
    threshold: 10,
    title: "Dedicated Soul",
    description: "Mencapai Level 10",
    emoji: "🌟",
    tier: "silver",
  },
  {
    id: "level_25",
    type: BADGE_TYPES.LEVEL,
    threshold: 25,
    title: "Sanctuary Guardian",
    description: "Mencapai Level 25",
    emoji: "👑",
    tier: "gold",
  },

  // === BOOKS BADGES ===
  {
    id: "books_1",
    type: BADGE_TYPES.BOOKS,
    threshold: 1,
    title: "First Read",
    description: "Selesaikan buku pertamamu",
    emoji: "📚",
    tier: "bronze",
  },
  {
    id: "books_5",
    type: BADGE_TYPES.BOOKS,
    threshold: 5,
    title: "Bookworm",
    description: "Selesaikan 5 buku",
    emoji: "📚",
    tier: "silver",
  },
  {
    id: "books_10",
    type: BADGE_TYPES.BOOKS,
    threshold: 10,
    title: "Scholar",
    description: "Selesaikan 10 buku",
    emoji: "🎓",
    tier: "gold",
  },

  // === SPECIAL BADGES ===
  {
    id: "first_task",
    type: BADGE_TYPES.SPECIAL,
    threshold: 1,
    title: "First Step",
    description: "Selesaikan tugas pertamamu",
    emoji: "🎯",
    tier: "bronze",
  },
  {
    id: "perfect_day",
    type: BADGE_TYPES.SPECIAL,
    threshold: 1,
    title: "Perfect Day",
    description: "Selesaikan semua kebiasaan dalam 1 hari",
    emoji: "💯",
    tier: "gold",
  },
];

/**
 * Get badge by ID
 */
export const getBadgeById = (id) => BADGES.find((b) => b.id === id);

/**
 * Get badges by type
 */
export const getBadgesByType = (type) => BADGES.filter((b) => b.type === type);

/**
 * Get tier color for badge
 */
export const getTierColor = (tier) => {
  switch (tier) {
    case "bronze":
      return "text-amber-600";
    case "silver":
      return "text-gray-400";
    case "gold":
      return "text-yellow-500";
    default:
      return "text-(--text-muted)";
  }
};

/**
 * Get tier background for badge
 */
export const getTierBg = (tier) => {
  switch (tier) {
    case "bronze":
      return "bg-amber-600/10 border-amber-600/30";
    case "silver":
      return "bg-gray-400/10 border-gray-400/30";
    case "gold":
      return "bg-yellow-500/10 border-yellow-500/30";
    default:
      return "bg-(--bg-color) border-(--border-color)";
  }
};
