import { useAppStore } from './useAppStore';
import { useThemeStore } from './useThemeStore';
import { useTaskStore } from './useTaskStore';
import { useHabitStore } from './useHabitStore';
import { useJournalStore } from './useJournalStore';
import { useBookStore } from './useBookStore';
import { useFinanceStore } from './useFinanceStore';
import { usePomodoroStore } from './usePomodoroStore';
import { useAchievementStore } from './useAchievementStore';
import { useLayoutStore } from './useLayoutStore';
import { THEMES } from '../constants';

export const SCHEMA_VERSION = 1;

const deepClone = (value) => JSON.parse(JSON.stringify(value ?? null));

export const buildExportPayload = () => {
  const app = useAppStore.getState();
  const theme = useThemeStore.getState();
  const tasks = useTaskStore.getState();
  const habits = useHabitStore.getState();
  const journal = useJournalStore.getState();
  const books = useBookStore.getState();
  const finance = useFinanceStore.getState();
  const pomodoro = usePomodoroStore.getState();
  const achievements = useAchievementStore.getState();
  const layout = useLayoutStore.getState();

  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    app: {
      user: deepClone(app.user),
      notifications: deepClone(app.notifications),
    },
    theme: {
      isDarkMode: theme.isDarkMode,
    },
    tasks: {
      tasks: deepClone(tasks.tasks),
    },
    habits: {
      habits: deepClone(habits.habits),
      checkIns: deepClone(habits.checkIns),
    },
    journal: {
      entries: deepClone(journal.entries),
    },
    books: {
      books: deepClone(books.books),
      yearlyGoal: books.yearlyGoal,
    },
    finance: {
      transactions: deepClone(finance.transactions),
      budgets: deepClone(finance.budgets),
    },
    pomodoro: {
      completedSessions: deepClone(pomodoro.completedSessions),
      totalFocusTime: pomodoro.totalFocusTime,
      settings: deepClone(pomodoro.settings),
    },
    achievements: {
      unlockedAchievements: deepClone(achievements.unlockedAchievements),
    },
    layout: {
      widgetOrder: deepClone(layout.widgetOrder),
      hiddenWidgets: deepClone(layout.hiddenWidgets),
    },
  };
};

export const importData = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('File backup tidak valid');
  }

  const version = payload.schemaVersion ?? 0;
  if (version > SCHEMA_VERSION) {
    throw new Error('Versi backup lebih baru dari aplikasi ini');
  }

  const applied = [];

  if (payload.app) {
    if (payload.app.user) {
      useAppStore.setState((state) => ({ ...state, user: payload.app.user }));
      applied.push('profil');
    }
    if (payload.app.notifications) {
      useAppStore.setState((state) => ({ ...state, notifications: payload.app.notifications }));
      applied.push('notifikasi');
    }
  }

  if (payload.theme) {
    const isDark = Boolean(payload.theme.isDarkMode);
    useThemeStore.setState({
      isDarkMode: isDark,
      theme: isDark ? THEMES.dark : THEMES.light,
    });
    applied.push('tema');
  }

  if (payload.tasks?.tasks) {
    useTaskStore.setState((state) => ({ ...state, tasks: payload.tasks.tasks }));
    applied.push('tugas');
  }

  if (payload.habits) {
    useHabitStore.setState((state) => ({
      ...state,
      habits: payload.habits.habits || state.habits,
      checkIns: payload.habits.checkIns || {},
    }));
    applied.push('kebiasaan');
  }

  if (payload.journal?.entries) {
    useJournalStore.setState((state) => ({ ...state, entries: payload.journal.entries }));
    applied.push('jurnal');
  }

  if (payload.books) {
    useBookStore.setState((state) => ({
      ...state,
      books: payload.books.books || state.books,
      yearlyGoal: payload.books.yearlyGoal ?? state.yearlyGoal,
    }));
    applied.push('bacaan');
  }

  if (payload.finance) {
    useFinanceStore.setState((state) => ({
      ...state,
      transactions: payload.finance.transactions || state.transactions,
      budgets: payload.finance.budgets || state.budgets,
    }));
    applied.push('keuangan');
  }

  if (payload.pomodoro) {
    usePomodoroStore.setState((state) => ({
      ...state,
      completedSessions: payload.pomodoro.completedSessions || state.completedSessions,
      totalFocusTime: payload.pomodoro.totalFocusTime ?? state.totalFocusTime,
      settings: payload.pomodoro.settings || state.settings,
    }));
    applied.push('pomodoro');
  }

  if (payload.achievements?.unlockedAchievements) {
    useAchievementStore.setState((state) => ({
      ...state,
      unlockedAchievements: payload.achievements.unlockedAchievements,
      newlyUnlocked: [],
    }));
    applied.push('pencapaian');
  }

  if (payload.layout) {
    useLayoutStore.setState((state) => ({
      ...state,
      widgetOrder: payload.layout.widgetOrder || state.widgetOrder,
      hiddenWidgets: payload.layout.hiddenWidgets || state.hiddenWidgets,
    }));
    applied.push('layout dashboard');
  }

  return applied;
};
