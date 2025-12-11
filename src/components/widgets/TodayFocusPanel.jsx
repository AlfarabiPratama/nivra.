import { useMemo } from "react";
import { Card } from "../ui/Card";
import { useTaskStore } from "../../store/useTaskStore";
import { useBookStore } from "../../store/useBookStore";
import { useHabitStore } from "../../store/useHabitStore";
import { usePomodoroStore } from "../../store/usePomodoroStore";
import { useAppStore } from "../../store/useAppStore";
import {
  CheckSquare,
  BookOpen,
  Target,
  Timer,
  ChevronRight,
  Flame,
} from "lucide-react";
import clsx from "clsx";

/**
 * Today's Focus Panel - Overview aktivitas hari ini
 */
export const TodayFocusPanel = () => {
  const { tasks } = useTaskStore();
  const { books } = useBookStore();
  const { checkIns, habits } = useHabitStore();
  const { getTodaySessions } = usePomodoroStore();
  const { setCurrentView } = useAppStore();

  const today = new Date().toDateString();

  // Calculate today's stats
  const stats = useMemo(() => {
    // Safety checks for undefined arrays
    const taskList = tasks || [];
    const bookList = books || [];
    const habitList = habits || [];
    const checkInData = checkIns || {};

    // Tasks
    const todayTasks = taskList.filter((t) => !t.completed);
    const completedToday = taskList.filter(
      (t) => t.completed && new Date(t.completedAt).toDateString() === today
    );

    // Reading
    const currentBook = bookList.find((b) => b.status === "reading");

    // Habits
    const todayHabits = habitList.map((h) => ({
      ...h,
      checked: checkInData[h.id]?.[today] || false,
    }));
    const completedHabits = todayHabits.filter((h) => h.checked).length;

    // Pomodoro
    const todaySessions = getTodaySessions?.() || [];
    const pomodoroMinutes = todaySessions.reduce(
      (sum, s) => sum + (s.duration || 25),
      0
    );

    return {
      pendingTasks: todayTasks.length,
      completedTasks: completedToday.length,
      currentBook,
      completedHabits,
      totalHabits: habitList.length,
      pomodoroSessions: todaySessions.length,
      pomodoroMinutes,
    };
  }, [tasks, books, checkIns, habits, getTodaySessions, today]);

  const focusItems = [
    {
      id: "tasks",
      icon: CheckSquare,
      label: "Tugas",
      value:
        stats.pendingTasks > 0
          ? `${stats.pendingTasks} pending`
          : "Semua selesai! ✓",
      subtext:
        stats.completedTasks > 0
          ? `${stats.completedTasks} selesai hari ini`
          : null,
      color: stats.pendingTasks === 0 ? "text-green-500" : "text-(--accent)",
      view: "dashboard",
    },
    {
      id: "reading",
      icon: BookOpen,
      label: "Membaca",
      value: stats.currentBook?.title || "Belum ada buku aktif",
      subtext: stats.currentBook
        ? `Halaman ${stats.currentBook.progress || 0}`
        : "Mulai baca sekarang →",
      color: stats.currentBook ? "text-(--accent)" : "text-(--text-muted)",
      view: "reading",
    },
    {
      id: "habits",
      icon: Target,
      label: "Kebiasaan",
      value: `${stats.completedHabits}/${stats.totalHabits}`,
      subtext:
        stats.completedHabits === stats.totalHabits
          ? "Perfect! 🎉"
          : "Lanjutkan!",
      color:
        stats.completedHabits === stats.totalHabits
          ? "text-green-500"
          : "text-(--accent)",
      view: "habits",
    },
    {
      id: "pomodoro",
      icon: Timer,
      label: "Fokus",
      value:
        stats.pomodoroSessions > 0
          ? `${stats.pomodoroSessions} sesi`
          : "Belum ada sesi",
      subtext:
        stats.pomodoroMinutes > 0
          ? `${stats.pomodoroMinutes} menit fokus`
          : "Mulai pomodoro →",
      color:
        stats.pomodoroSessions > 0 ? "text-(--accent)" : "text-(--text-muted)",
      view: "pomodoro",
    },
  ];

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          <span className="font-mono text-xs uppercase tracking-widest text-(--text-muted)">
            Fokus Hari Ini
          </span>
        </div>
        <span className="font-mono text-[10px] text-(--text-muted)">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      {/* Focus Items */}
      <div className="space-y-2">
        {focusItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.view)}
            className="w-full flex items-center gap-3 p-2 hover:bg-(--bg-color) transition-colors group"
          >
            <item.icon size={16} className={item.color} />
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-(--text-muted)">
                  {item.label}
                </span>
                <ChevronRight
                  size={12}
                  className="text-(--text-muted) opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <p className={clsx("text-sm font-serif", item.color)}>
                {item.value}
              </p>
              {item.subtext && (
                <p className="text-[10px] font-mono text-(--text-muted)">
                  {item.subtext}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
