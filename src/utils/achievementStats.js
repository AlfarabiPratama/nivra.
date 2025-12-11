import { useAppStore } from "../store/useAppStore";
import { useTaskStore } from "../store/useTaskStore";
import { useBookStore } from "../store/useBookStore";
import { useJournalStore } from "../store/useJournalStore";

const getTasksMetrics = () => {
  const tasks = useTaskStore.getState().tasks || [];
  const completedTasks = tasks.filter((t) => t.completed);

  const countsByDay = completedTasks.reduce((acc, task) => {
    if (!task.completedAt) return acc;
    const dateStr = new Date(task.completedAt).toDateString();
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  const maxTasksInDay = Object.values(countsByDay).reduce(
    (max, val) => Math.max(max, val),
    0
  );

  const hasEarlyMorningTask = completedTasks.some((t) => {
    if (!t.completedAt) return false;
    const hour = new Date(t.completedAt).getHours();
    return hour < 8;
  });

  const hasLateNightTask = completedTasks.some((t) => {
    if (!t.completedAt) return false;
    const hour = new Date(t.completedAt).getHours();
    return hour >= 22;
  });

  return {
    tasksCompleted: completedTasks.length,
    maxTasksInDay,
    hasEarlyMorningTask,
    hasLateNightTask,
  };
};

const getJournalMetrics = () => {
  const entries = useJournalStore.getState().entries || [];
  const total = entries.length;

  // simple streak calculation based on entry.date
  const dates = entries
    .map((e) => (e.date ? new Date(e.date) : null))
    .filter(Boolean)
    .map((d) => new Date(d.toDateString()))
    .sort((a, b) => b - a);

  let streak = 0;
  let cursor = new Date(new Date().toDateString());

  dates.forEach((d) => {
    if (d.getTime() === cursor.getTime()) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (d < cursor) {
      return;
    }
  });

  return {
    journalEntries: total,
    journalStreak: streak,
  };
};

const getBookMetrics = () => {
  const books = useBookStore.getState().books || [];
  const booksFinished = books.filter((b) => b.status === "finished").length;
  return { booksFinished };
};

export const buildAchievementStats = () => {
  const user = useAppStore.getState().user || { level: 1, xp: 0 };

  return {
    level: user.level,
    xp: user.xp,
    ...getTasksMetrics(),
    ...getJournalMetrics(),
    ...getBookMetrics(),
  };
};
