import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AnimatedPage } from "../components/ui/AnimatedPage";
import { EmptyState } from "../components/ui/EmptyState";
import { TaskAnalytics } from "../components/widgets/TaskAnalytics";
import { PomodoroSummary } from "../components/widgets/PomodoroSummary";
import { WeeklyReview } from "../components/widgets/WeeklyReview";
import { WeeklyInsights } from "../components/widgets/WeeklyInsights";
import { useAppStore } from "../store/useAppStore";
import { useTaskStore } from "../store/useTaskStore";
import { useBookStore } from "../store/useBookStore";
import { useToastStore } from "../store/useToastStore";
import { useLayoutStore } from "../store/useLayoutStore";
import {
  CheckCircle2,
  Circle,
  Plus,
  X,
  BookOpen,
  BookText,
} from "lucide-react";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { useAudioStore } from "../store/useAudioStore";

const priorityConfig = {
  high: { color: "text-red-500", label: "!!!", emoji: "🔴" },
  medium: { color: "text-yellow-500", label: "!!", emoji: "🟡" },
  low: { color: "text-green-500", label: "!", emoji: "🟢" },
};

export const Dashboard = () => {
  console.log("🎯 Dashboard component executing!");

  const { user, addXP } = useAppStore();
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const { books } = useBookStore();
  const { addToast } = useToastStore();
  const { playSound } = useAudioStore();
  const { widgetOrder, hiddenWidgets, setWidgetOrder } = useLayoutStore();
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedToday = tasks.filter((t) => {
    if (!t.completed) return false;
    const today = new Date().toDateString();
    return new Date(t.completedAt).toDateString() === today;
  });

  const xpProgress = user.xp % 100;
  const readingBooks = books.filter((b) => b.status === "reading").length;
  const finishedBooks = books.filter((b) => b.status === "finished").length;

  // Calculate average progress
  const readingBooksWithProgress = books.filter(
    (b) => b.status === "reading" && b.progress && b.total
  );
  const avgProgress =
    readingBooksWithProgress.length > 0
      ? Math.round(
          readingBooksWithProgress.reduce(
            (sum, book) => sum + (book.progress / book.total) * 100,
            0
          ) / readingBooksWithProgress.length
        )
      : 0;

  const mergedWidgetOrder = useMemo(() => {
    const required = [
      "weeklyReview",
      "weeklyInsights",
      "taskAnalytics",
      "pomodoro",
    ];
    return Array.from(new Set([...widgetOrder, ...required]));
  }, [widgetOrder]);

  useEffect(() => {
    const missing = mergedWidgetOrder.filter((id) => !widgetOrder.includes(id));
    if (missing.length > 0) {
      setWidgetOrder(mergedWidgetOrder);
    }
  }, [mergedWidgetOrder, widgetOrder, setWidgetOrder]);

  const renderWidget = (id) => {
    if (hiddenWidgets.includes(id)) return null;
    if (id === "weeklyReview") return <WeeklyReview key="weeklyReview" />;
    if (id === "weeklyInsights") return <WeeklyInsights key="weeklyInsights" />;
    if (id === "taskAnalytics") {
      return tasks.length > 0 ? (
        <TaskAnalytics key="taskAnalytics" tasks={tasks} />
      ) : null;
    }
    if (id === "pomodoro") return <PomodoroSummary key="pomodoro" />;
    return null;
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask({
        text: newTaskText.trim(),
        priority: selectedPriority,
        category: selectedCategory,
        dueDate: dueDate || null,
        recurring: recurring,
      });
      setNewTaskText("");
      setSelectedPriority("medium");
      setSelectedCategory(null);
      setDueDate("");
      setRecurring(null);
      setShowAdvanced(false);
      addXP(5, useToastStore.getState());
      addToast("tugas ditambahkan", "success");
    }
  };

  const handleToggleTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);

    if (!task.completed) {
      // Deliberate Interaction: Slow animation + celebration
      setTimeout(() => {
        toggleTask(taskId);
        addXP(15, useToastStore.getState());
        addToast("tugas selesai! 🎉", "success");
        playSound("taskComplete");
      }, 300);
    } else {
      toggleTask(taskId);
    }
  };

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-0">
          <div>
            <h2 className="text-2xl md:text-4xl font-serif italic text-(--text-main) mb-2">
              {user.name ? `hai, ${user.name}.` : "selamat datang."}
            </h2>
            <p className="font-mono text-xs md:text-sm text-(--text-muted) border-l-2 border-(--accent) pl-3 md:pl-4 italic">
              perlahan tapi pasti.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="font-mono text-xs text-(--text-muted) uppercase">
              Hari Ini
            </p>
            <p className="font-serif text-xl">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        {/* Stats Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* XP Progress Card */}
          <Card className="md:col-span-2">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-(--text-muted)">
                  Pertumbuhan
                </span>
                <span className="font-mono text-[10px] md:text-xs text-(--accent)">
                  Level {user.level} • {user.gardenStage}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-(bg-color) border border-(--border-color)">
                <div
                  className="h-full bg-(--accent) transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>

              <p className="font-mono text-[10px] md:text-xs text-(--text-muted)">
                {xpProgress} / 100 XP ke level berikutnya
              </p>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card variant="dashed" className="border-hover-dashed">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 text-(--text-main)">
                <BookOpen
                  size={14}
                  className="md:w-4 md:h-4 text-(--accent) shrink-0"
                />
                <span className="font-mono text-[10px] md:text-xs">
                  {readingBooks} sedang dibaca
                </span>
              </div>
              <div className="flex items-center gap-2 text-(--text-main)">
                <CheckCircle2
                  size={14}
                  className="md:w-4 md:h-4 text-(--accent) shrink-0"
                />
                <span className="font-mono text-[10px] md:text-xs">
                  {completedToday.length} tugas hari ini
                </span>
              </div>
              <div className="flex items-center gap-2 text-(--text-main)">
                <BookText
                  size={14}
                  className="md:w-4 md:h-4 text-(--accent) shrink-0"
                />
                <span className="font-mono text-[10px] md:text-xs">
                  {finishedBooks} buku selesai
                </span>
              </div>
              <div className="flex items-center gap-2 text-(--text-main) pt-2 border-t border-dashed border-(--border-color)">
                <span className="font-mono text-[10px] md:text-xs text-(--text-muted)">
                  avg progres
                </span>
                <span className="font-serif text-xl md:text-2xl text-(--accent) ml-auto">
                  {avgProgress}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Task Management */}
        <Card variant="dashed">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-sm uppercase tracking-widest text-(--text-main)">
                Tugas Hari Ini
              </h3>
              <span className="font-mono text-xs text-(--text-muted)">
                {incompleteTasks.length} tersisa
              </span>
            </div>

            {/* Add Task Form */}
            <div className="space-y-3">
              <div className="flex gap-1 md:gap-2">
                <Input
                  placeholder="tambah tugas baru..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !showAdvanced) handleAddTask();
                  }}
                  className="flex-1 text-xs md:text-sm"
                  variant="box"
                />
                <Button
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="px-2 md:px-3"
                >
                  {showAdvanced ? "−" : "+"}
                </Button>
                <Button
                  variant="accent"
                  onClick={handleAddTask}
                  disabled={!newTaskText.trim()}
                  className="px-3 md:px-4"
                >
                  <Plus size={14} className="md:w-4 md:h-4" />
                </Button>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="space-y-3 p-2 md:p-3 border border-dashed border-(--border-color) bg-(bg-color)/50">
                  {/* Priority Selector */}
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] md:text-xs text-(--text-muted) uppercase">
                      Priority
                    </label>
                    <div className="flex gap-1 md:gap-2">
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedPriority(key)}
                          className={clsx(
                            "flex-1 px-2 md:px-3 py-1.5 md:py-2 font-mono text-[10px] md:text-xs border transition-all",
                            selectedPriority === key
                              ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                              : "border-(--border-color) text-(--text-muted) hover:border-(text-main)"
                          )}
                        >
                          {config.emoji} {key}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-(--text-muted) uppercase">
                      Due Date (opsional)
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 font-mono text-xs bg-transparent text-(--text-main) border border-dashed border-(--border-color) focus:border-solid focus:outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs text-(--text-muted) uppercase">
                      Category (opsional)
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {["work", "personal", "study", "health"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() =>
                            setSelectedCategory(
                              selectedCategory === cat ? null : cat
                            )
                          }
                          className={clsx(
                            "px-3 py-1 font-mono text-xs border transition-all",
                            selectedCategory === cat
                              ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                              : "border-(--border-color) text-(--text-muted) hover:border-(text-main)"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recurring Pattern */}
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] md:text-xs text-(--text-muted) uppercase">
                      Recurring (opsional)
                    </label>
                    <div className="grid grid-cols-3 gap-1 md:gap-2">
                      {[
                        { value: "daily", label: "Harian", emoji: "📅" },
                        { value: "weekly", label: "Mingguan", emoji: "📆" },
                        { value: "monthly", label: "Bulanan", emoji: "🗓️" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setRecurring(
                              recurring === option.value ? null : option.value
                            )
                          }
                          className={clsx(
                            "px-2 md:px-3 py-1.5 md:py-2 font-mono text-[10px] md:text-xs border transition-all",
                            recurring === option.value
                              ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                              : "border-(--border-color) text-(--text-muted) hover:border-(text-main)"
                          )}
                        >
                          {option.emoji} {option.label}
                        </button>
                      ))}
                    </div>
                    {recurring && (
                      <p className="font-mono text-xs text-(--text-muted) italic">
                        ↻ Tugas akan dibuat ulang otomatis setelah selesai
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Task List */}
            <div className="space-y-2 pt-2">
              {tasks.length === 0 ? (
                <EmptyState
                  type="tasks"
                  customMessage="belum ada tugas. mulai dengan menambahkan satu."
                />
              ) : (
                <>
                  {/* Incomplete Tasks */}
                  {incompleteTasks.length > 0 && (
                    <div className="space-y-2">
                      {incompleteTasks
                        .sort((a, b) => {
                          const priorityOrder = { high: 0, medium: 1, low: 2 };
                          return (
                            priorityOrder[a.priority || "medium"] -
                            priorityOrder[b.priority || "medium"]
                          );
                        })
                        .map((task) => {
                          const priority =
                            priorityConfig[task.priority || "medium"];
                          const isOverdue =
                            task.dueDate && new Date(task.dueDate) < new Date();

                          return (
                            <div
                              key={task.id}
                              className="flex items-start gap-2 md:gap-3 p-2 md:p-3 border border-dashed border-(--border-color) hover:border-(--accent) transition-all duration-300 group"
                            >
                              <button
                                onClick={() => handleToggleTask(task.id)}
                                className="text-(--text-muted) hover:text-(--accent) transition-colors mt-0.5 shrink-0"
                              >
                                <Circle size={16} className="md:w-5 md:h-5" />
                              </button>

                              <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex items-center gap-1 md:gap-2">
                                  <span
                                    className={clsx(
                                      "text-[10px] md:text-xs shrink-0",
                                      priority.color
                                    )}
                                  >
                                    {priority.emoji}
                                  </span>
                                  <span className="font-mono text-xs md:text-sm text-(--text-main) truncate">
                                    {task.text}
                                  </span>
                                </div>

                                {/* Task Metadata */}
                                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-mono text-(--text-muted) flex-wrap">
                                  {task.category && (
                                    <span className="px-1.5 md:px-2 py-0.5 border border-(--border-color)">
                                      {task.category}
                                    </span>
                                  )}
                                  {task.dueDate && (
                                    <span
                                      className={clsx(
                                        "px-2 py-0.5 border",
                                        isOverdue
                                          ? "border-red-500 text-red-500"
                                          : "border-(--border-color)"
                                      )}
                                    >
                                      📅{" "}
                                      {new Date(
                                        task.dueDate
                                      ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-(--text-muted) hover:text-(--text-main) transition-all shrink-0"
                              >
                                <X size={14} className="md:w-4 md:h-4" />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Completed Tasks Today */}
                  {completedToday.length > 0 && (
                    <div className="pt-3 md:pt-4 mt-3 md:mt-4 border-t border-dashed border-(--border-color)">
                      <p className="font-mono text-[10px] md:text-xs text-(--text-muted) mb-2 uppercase tracking-widest">
                        Selesai Hari Ini
                      </p>
                      <div className="space-y-2">
                        {completedToday.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-(--accent)/5 border border-(--accent)/20"
                          >
                            <CheckCircle2
                              size={16}
                              className="md:w-5 md:h-5 text-(--accent) shrink-0"
                            />
                            <span className="flex-1 font-mono text-xs md:text-sm text-(--text-muted) line-through truncate">
                              {task.text}
                            </span>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-(--text-muted) hover:text-(--text-main) transition-colors shrink-0"
                            >
                              <X size={14} className="md:w-4 md:h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Widgets */}
        <div className="space-y-4">
          {mergedWidgetOrder.map((id) => renderWidget(id))}
          {mergedWidgetOrder.filter((id) => !hiddenWidgets.includes(id))
            .length === 0 && (
            <Card variant="dashed" className="border-hover-dashed">
              <div className="p-4 text-center">
                <p className="font-mono text-xs text-(--text-muted)">
                  semua widget disembunyikan. aktifkan kembali dari pengatur
                  tata letak.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};
