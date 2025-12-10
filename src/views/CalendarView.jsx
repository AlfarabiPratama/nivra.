import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  NotebookPen,
  ListChecks,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { AnimatedPage } from "../components/ui/AnimatedPage";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useTaskStore } from "../store/useTaskStore";
import { useHabitStore } from "../store/useHabitStore";
import { useJournalStore } from "../store/useJournalStore";
import { useToastStore } from "../store/useToastStore";

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const formatDateKey = (date) => new Date(date).toDateString();

const buildMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const startIndex = (firstDay.getDay() + 6) % 7; // make Monday first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startIndex; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  return cells;
};

export const CalendarView = () => {
  const [cursor, setCursor] = useState(new Date());
  const { tasks } = useTaskStore();
  const { habits, checkIns } = useHabitStore();
  const { entries } = useJournalStore();
  const { addTask } = useTaskStore();
  const { addToast } = useToastStore();
  const [quickTask, setQuickTask] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const monthLabel = cursor.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const monthDays = useMemo(
    () => buildMonthDays(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  const selectedDateKey = formatDateKey(cursor);

  const dayData = useMemo(() => {
    const map = new Map();

    tasks.forEach((task) => {
      const dateValue = task.dueDate || task.createdAt;
      if (!dateValue) return;
      const key = formatDateKey(dateValue);
      const entry = map.get(key) || { tasks: [], journals: [], habits: [] };
      entry.tasks.push(task);
      map.set(key, entry);
    });

    entries.forEach((entry) => {
      const key = formatDateKey(entry.createdAt);
      const existing = map.get(key) || { tasks: [], journals: [], habits: [] };
      existing.journals.push(entry);
      map.set(key, existing);
    });

    Object.keys(checkIns).forEach((habitId) => {
      const days = checkIns[habitId];
      Object.keys(days || {}).forEach((day) => {
        if (!days[day]) return;
        const existing = map.get(day) || {
          tasks: [],
          journals: [],
          habits: [],
        };
        const habit = habits.find((h) => h.id === habitId);
        existing.habits.push(habit ? habit.name : habitId);
        map.set(day, existing);
      });
    });

    return map;
  }, [tasks, entries, checkIns, habits]);

  const summary = dayData.get(selectedDateKey) || {
    tasks: [],
    journals: [],
    habits: [],
  };
  const filteredSummary = {
    tasks:
      activeFilter === "all" || activeFilter === "tasks" ? summary.tasks : [],
    journals:
      activeFilter === "all" || activeFilter === "journal"
        ? summary.journals
        : [],
    habits:
      activeFilter === "all" || activeFilter === "habits" ? summary.habits : [],
  };

  const handleQuickAdd = async () => {
    if (!quickTask.trim()) return;
    await addTask({
      text: quickTask.trim(),
      dueDate: cursor.toISOString().split("T")[0],
    });
    addToast("tugas ditambahkan ke tanggal ini", "success");
    setQuickTask("");
  };

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-(--accent)" size={24} />
            <div>
              <h2 className="text-3xl font-serif italic text-(--text-main)">
                kalender.
              </h2>
              <p className="font-mono text-xs text-(--text-muted)">
                sinkronkan tugas, jurnal, dan kebiasaan dalam satu tampilan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
                )
              }
              className="px-2"
            >
              <ChevronLeft size={16} />
            </Button>
            <Card className="px-4 py-2 font-mono text-sm text-(--text-main)">
              {monthLabel}
            </Card>
            <Button
              variant="ghost"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
                )
              }
              className="px-2"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </header>

        {/* Filters & Quick Add */}
        <Card>
          <div className="p-3 md:p-4 flex flex-col gap-3">
            {/* Filters - horizontally scrollable on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
              {["all", "tasks", "journal", "habits"].map((f) => (
                <Button
                  key={f}
                  variant={activeFilter === f ? "accent" : "ghost"}
                  className="px-3 py-1.5 text-xs whitespace-nowrap shrink-0"
                  onClick={() => setActiveFilter(f)}
                >
                  {f === "all" ? "[ ALL ]" : f.toUpperCase()}
                </Button>
              ))}
            </div>
            {/* Quick add input */}
            <div className="flex items-center gap-2">
              <input
                className="flex-1 px-3 py-2 font-mono text-xs bg-transparent border border-(--border-color) text-(--text-main) min-w-0"
                placeholder="tambah tugas cepat ke t"
                value={quickTask}
                onChange={(e) => setQuickTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleQuickAdd();
                }}
              />
              <Button
                variant="accent"
                onClick={handleQuickAdd}
                disabled={!quickTask.trim()}
                className="shrink-0"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {/* Day names header */}
          <div className="grid grid-cols-7 text-center border-b border-dashed border-(--border-color)">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-1 md:p-2 font-mono text-[9px] md:text-[11px] uppercase tracking-widest text-(--text-muted)"
              >
                {day}
              </div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-(--border-color)/40">
            {monthDays.map((date, idx) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-12 md:min-h-[90px] bg-(--card-color)"
                  />
                );
              }
              const key = formatDateKey(date);
              const day = date.getDate();
              const isToday = formatDateKey(new Date()) === key;
              const isSelected = selectedDateKey === key;
              const info = dayData.get(key);
              const hasTasks = info && info.tasks.length > 0;
              const hasJournals = info && info.journals.length > 0;
              const hasHabits = info && info.habits.length > 0;

              return (
                <button
                  key={key}
                  onClick={() => setCursor(date)}
                  className={`h-12 md:min-h-[90px] bg-(--card-color) p-1 md:p-2 text-left transition-colors relative overflow-hidden ${
                    isSelected
                      ? "ring-2 ring-(--accent) ring-inset"
                      : "border border-(--border-color)"
                  } ${isToday ? "bg-(--accent)/5" : ""}`}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[10px] md:text-xs ${
                        isToday
                          ? "text-(--accent) font-bold"
                          : "text-(--text-main)"
                      }`}
                    >
                      {day}
                    </span>
                    {/* Mobile: show dots for content */}
                    <div className="flex gap-0.5 md:hidden">
                      {hasTasks && (
                        <span className="w-1.5 h-1.5 rounded-full bg-(--accent)" />
                      )}
                      {hasJournals && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      )}
                      {hasHabits && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      )}
                    </div>
                  </div>

                  {/* Desktop: show detailed content */}
                  <div className="hidden md:block mt-1 space-y-0.5">
                    {info ? (
                      <>
                        {info.tasks.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-(--text-main) truncate">
                            <ListChecks
                              size={10}
                              className="text-(--accent) shrink-0"
                            />
                            <span className="truncate">
                              {info.tasks.length} tugas
                            </span>
                          </div>
                        )}
                        {info.journals.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-(--text-main) truncate">
                            <NotebookPen
                              size={10}
                              className="text-(--accent) shrink-0"
                            />
                            <span className="truncate">
                              {info.journals.length} jurnal
                            </span>
                          </div>
                        )}
                        {info.habits.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-(--text-main) truncate">
                            <CheckCircle2
                              size={10}
                              className="text-(--accent) shrink-0"
                            />
                            <span className="truncate">
                              {info.habits.length}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-[10px] text-(--text-muted)">—</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Summary Card */}
        <Card>
          <div className="p-3 md:p-4 space-y-3 md:space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] uppercase text-(--text-muted)">
                  ringkasan
                </p>
                <p className="font-serif text-base md:text-xl text-(--text-main)">
                  {new Date(selectedDateKey).toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 border border-(--border-color) font-mono text-[10px] text-(--text-muted)">
                  {summary.tasks.length} tugas
                </span>
                <span className="px-2 py-0.5 border border-(--border-color) font-mono text-[10px] text-(--text-muted)">
                  {summary.habits.length} habit
                </span>
                <span className="px-2 py-0.5 border border-(--border-color) font-mono text-[10px] text-(--text-muted)">
                  {summary.journals.length} jurnal
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border border-dashed border-(--border-color) p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <ListChecks size={14} className="text-(--accent)" />
                  <span className="font-mono text-xs text-(--text-main) uppercase">
                    tugas
                  </span>
                </div>
                {filteredSummary.tasks.length === 0 ? (
                  <p className="font-mono text-xs text-(--text-muted)">
                    tidak ada tugas hari ini.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {filteredSummary.tasks.slice(0, 5).map((task) => (
                      <li
                        key={task.id}
                        className="font-mono text-xs text-(--text-main)"
                      >
                        {task.completed ? "✓ " : ""}
                        {task.text}
                      </li>
                    ))}
                    {filteredSummary.tasks.length > 5 && (
                      <p className="font-mono text-[11px] text-(--text-muted)">
                        +{filteredSummary.tasks.length - 5} lainnya
                      </p>
                    )}
                  </ul>
                )}
              </div>

              <div className="border border-dashed border-(--border-color) p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-(--accent)" />
                  <span className="font-mono text-xs text-(--text-main) uppercase">
                    kebiasaan selesai
                  </span>
                </div>
                {filteredSummary.habits.length === 0 ? (
                  <p className="font-mono text-xs text-(--text-muted)">
                    belum ada check-in.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {filteredSummary.habits.map((habit, idx) => (
                      <li
                        key={`${habit}-${idx}`}
                        className="font-mono text-xs text-(--text-main)"
                      >
                        {habit}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border border-dashed border-(--border-color) p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <NotebookPen size={14} className="text-(--accent)" />
                  <span className="font-mono text-xs text-(--text-main) uppercase">
                    jurnal
                  </span>
                </div>
                {filteredSummary.journals.length === 0 ? (
                  <p className="font-mono text-xs text-(--text-muted)">
                    tidak ada entri.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {filteredSummary.journals.slice(0, 5).map((entry) => (
                      <li
                        key={entry.id}
                        className="font-mono text-xs text-(--text-main) line-clamp-2"
                      >
                        {entry.content}
                      </li>
                    ))}
                    {filteredSummary.journals.length > 5 && (
                      <p className="font-mono text-[11px] text-(--text-muted)">
                        +{filteredSummary.journals.length - 5} lainnya
                      </p>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};
