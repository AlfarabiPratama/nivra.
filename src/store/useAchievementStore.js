import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Achievement definitions
export const achievementList = {
  // Reading Achievements
  firstBook: {
    id: 'firstBook',
    title: 'Pembaca Pemula',
    description: 'Selesaikan buku pertamamu',
    emoji: '📖',
    category: 'reading',
    requirement: (stats) => stats.booksFinished >= 1,
    xp: 50,
  },
  bookworm: {
    id: 'bookworm',
    title: 'Kutu Buku',
    description: 'Selesaikan 5 buku',
    emoji: '📚',
    category: 'reading',
    requirement: (stats) => stats.booksFinished >= 5,
    xp: 100,
  },
  speedReader: {
    id: 'speedReader',
    title: 'Pembaca Cepat',
    description: 'Selesaikan buku dalam 7 hari',
    emoji: '⚡',
    category: 'reading',
    requirement: (stats) => stats.fastestBookDays <= 7,
    xp: 75,
  },
  
  // Task Achievements
  taskMaster: {
    id: 'taskMaster',
    title: 'Master Tugas',
    description: 'Selesaikan 50 tugas',
    emoji: '✅',
    category: 'tasks',
    requirement: (stats) => stats.tasksCompleted >= 50,
    xp: 100,
  },
  productive: {
    id: 'productive',
    title: 'Produktif',
    description: 'Selesaikan 10 tugas dalam sehari',
    emoji: '🔥',
    category: 'tasks',
    requirement: (stats) => stats.maxTasksInDay >= 10,
    xp: 75,
  },
  consistent: {
    id: 'consistent',
    title: 'Konsisten',
    description: 'Selesaikan tugas 7 hari berturut-turut',
    emoji: '📅',
    category: 'tasks',
    requirement: (stats) => stats.taskStreak >= 7,
    xp: 100,
  },
  
  // Journal Achievements
  reflection: {
    id: 'reflection',
    title: 'Reflektif',
    description: 'Tulis 10 entri jurnal',
    emoji: '✍️',
    category: 'journal',
    requirement: (stats) => stats.journalEntries >= 10,
    xp: 50,
  },
  storyteller: {
    id: 'storyteller',
    title: 'Pencerita',
    description: 'Tulis 50 entri jurnal',
    emoji: '📝',
    category: 'journal',
    requirement: (stats) => stats.journalEntries >= 50,
    xp: 150,
  },
  mindful: {
    id: 'mindful',
    title: 'Mindful',
    description: 'Tulis jurnal 7 hari berturut-turut',
    emoji: '🧘',
    category: 'journal',
    requirement: (stats) => stats.journalStreak >= 7,
    xp: 100,
  },
  
  // XP & Level Achievements
  levelUp5: {
    id: 'levelUp5',
    title: 'Pertumbuhan Awal',
    description: 'Capai level 5',
    emoji: '🌱',
    category: 'level',
    requirement: (stats) => stats.level >= 5,
    xp: 50,
  },
  levelUp10: {
    id: 'levelUp10',
    title: 'Dedikasi',
    description: 'Capai level 10',
    emoji: '🌿',
    category: 'level',
    requirement: (stats) => stats.level >= 10,
    xp: 100,
  },
  levelUp20: {
    id: 'levelUp20',
    title: 'Master Zen',
    description: 'Capai level 20',
    emoji: '🌳',
    category: 'level',
    requirement: (stats) => stats.level >= 20,
    xp: 200,
  },
  
  // Special Achievements
  earlyBird: {
    id: 'earlyBird',
    title: 'Early Bird',
    description: 'Selesaikan tugas sebelum jam 8 pagi',
    emoji: '🐦',
    category: 'special',
    requirement: (stats) => stats.hasEarlyMorningTask,
    xp: 50,
  },
  nightOwl: {
    id: 'nightOwl',
    title: 'Night Owl',
    description: 'Selesaikan tugas setelah jam 10 malam',
    emoji: '🦉',
    category: 'special',
    requirement: (stats) => stats.hasLateNightTask,
    xp: 50,
  },
  perfectWeek: {
    id: 'perfectWeek',
    title: 'Minggu Sempurna',
    description: 'Aktif setiap hari selama seminggu',
    emoji: '⭐',
    category: 'special',
    requirement: (stats) => stats.perfectWeek,
    xp: 150,
  },
};

export const useAchievementStore = create(
  persist(
    (set, get) => ({
      unlockedAchievements: [],
      newlyUnlocked: [],
      
      // Check and unlock achievements
      checkAchievements: (stats) => {
        const { unlockedAchievements } = get();
        const newUnlocks = [];
        
        Object.values(achievementList).forEach(achievement => {
          if (!unlockedAchievements.includes(achievement.id) && achievement.requirement(stats)) {
            newUnlocks.push(achievement.id);
          }
        });
        
        if (newUnlocks.length > 0) {
          set({ 
            unlockedAchievements: [...unlockedAchievements, ...newUnlocks],
            newlyUnlocked: newUnlocks
          });
        }
        
        return newUnlocks;
      },
      
      // Clear newly unlocked (after showing notification)
      clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
      
      // Get all achievements as array
      getAllAchievements: () => Object.values(achievementList),
      
      // Get achievement progress
      getProgress: () => {
        const total = Object.keys(achievementList).length;
        const unlocked = get().unlockedAchievements.length;
        return { unlocked, total, percentage: Math.round((unlocked / total) * 100) };
      },
      
      // Get achievements by category
      getByCategory: (category) => {
        const { unlockedAchievements } = get();
        return Object.values(achievementList)
          .filter(a => a.category === category)
          .map(a => ({
            ...a,
            unlocked: unlockedAchievements.includes(a.id)
          }));
      },

      // Get achievement progress (current/target)
      getAchievementProgress: (achievementId, stats) => {
        const achievement = achievementList[achievementId];
        if (!achievement) return { current: 0, target: 0, percentage: 0 };

        let current = 0;
        let target = 0;

        // Extract target from achievement definition
        switch (achievementId) {
          case 'firstBook':
            current = stats.booksFinished || 0;
            target = 1;
            break;
          case 'bookworm':
            current = stats.booksFinished || 0;
            target = 5;
            break;
          case 'taskMaster':
            current = stats.tasksCompleted || 0;
            target = 50;
            break;
          case 'productive':
            current = stats.maxTasksInDay || 0;
            target = 10;
            break;
          case 'consistent':
            current = stats.taskStreak || 0;
            target = 7;
            break;
          case 'reflection':
            current = stats.journalEntries || 0;
            target = 10;
            break;
          case 'storyteller':
            current = stats.journalEntries || 0;
            target = 50;
            break;
          case 'mindful':
            current = stats.journalStreak || 0;
            target = 7;
            break;
          case 'levelUp5':
            current = stats.level || 0;
            target = 5;
            break;
          case 'levelUp10':
            current = stats.level || 0;
            target = 10;
            break;
          case 'levelUp20':
            current = stats.level || 0;
            target = 20;
            break;
          default:
            return { current: 0, target: 1, percentage: 0 };
        }

        const percentage = Math.min(Math.round((current / target) * 100), 100);
        return { current, target, percentage };
      },
    }),
    { name: 'nivra-achievements' }
  )
);
