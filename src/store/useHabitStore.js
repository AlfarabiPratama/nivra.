import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHabitStore = create(
  persist(
    (set, get) => ({
      // Habit definitions
      habits: [
        {
          id: 'reading',
          name: 'Membaca',
          emoji: '📚',
          category: 'growth',
          targetDays: 7, // per week
        },
        {
          id: 'exercise',
          name: 'Olahraga',
          emoji: '💪',
          category: 'health',
          targetDays: 3,
        },
        {
          id: 'water',
          name: 'Minum Air 8 Gelas',
          emoji: '💧',
          category: 'health',
          targetDays: 7,
        },
        {
          id: 'journal',
          name: 'Journaling',
          emoji: '✍️',
          category: 'growth',
          targetDays: 7,
        },
        {
          id: 'meditation',
          name: 'Meditasi',
          emoji: '🧘',
          category: 'mindfulness',
          targetDays: 5,
        },
        {
          id: 'sleep',
          name: 'Tidur 8 Jam',
          emoji: '😴',
          category: 'health',
          targetDays: 7,
        },
      ],

      // Check-in records: { habitId: { date: true/false } }
      checkIns: {},

      // Actions
      toggleCheckIn: (habitId, date = new Date().toDateString()) => {
        set(state => {
          const habitChecks = state.checkIns[habitId] || {};
          const isChecked = habitChecks[date];
          
          return {
            checkIns: {
              ...state.checkIns,
              [habitId]: {
                ...habitChecks,
                [date]: !isChecked
              }
            }
          };
        });
      },

      isCheckedToday: (habitId) => {
        const today = new Date().toDateString();
        return get().checkIns[habitId]?.[today] || false;
      },

      getStreak: (habitId) => {
        const checks = get().checkIns[habitId] || {};
        let streak = 0;
        let currentDate = new Date();
        
        // Count consecutive days backwards from today
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
        const checks = get().checkIns[habitId] || {};
        let completed = 0;
        
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          if (checks[date.toDateString()]) {
            completed++;
          }
        }
        
        return Math.round((completed / days) * 100);
      },

      getLast7Days: (habitId) => {
        const checks = get().checkIns[habitId] || {};
        const days = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          days.push({
            date: date.toDateString(),
            day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
            checked: checks[date.toDateString()] || false
          });
        }
        
        return days;
      },

      addHabit: (habit) => {
        set(state => ({
          habits: [...state.habits, { ...habit, id: Date.now().toString() }]
        }));
      },

      removeHabit: (habitId) => {
        set(state => ({
          habits: state.habits.filter(h => h.id !== habitId),
          checkIns: Object.fromEntries(
            Object.entries(state.checkIns).filter(([id]) => id !== habitId)
          )
        }));
      },

      // Analytics
      getTodayProgress: () => {
        const { habits, isCheckedToday } = get();
        const total = habits.length;
        const completed = habits.filter(h => isCheckedToday(h.id)).length;
        return { completed, total, percentage: Math.round((completed / total) * 100) };
      },

      getWeeklyStats: () => {
        const { habits, getCompletionRate } = get();
        return habits.map(habit => ({
          ...habit,
          completionRate: getCompletionRate(habit.id, 7),
          streak: get().getStreak(habit.id)
        }));
      },
    }),
    {
      name: 'nivra-habits',
    }
  )
);
