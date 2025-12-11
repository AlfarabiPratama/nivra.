import { useState, useMemo, useEffect, useRef } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AnimatedPage } from "../components/ui/AnimatedPage";
import {
  useHabitStore,
  FREQUENCY_TYPES,
  WEEKDAYS,
} from "../store/useHabitStore";
import {
  CheckCircle2,
  Circle,
  Flame,
  TrendingUp,
  Plus,
  X,
  Calendar,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import clsx from "clsx";
import { useToastStore } from "../store/useToastStore";

export const HabitView = () => {
  const {
    habits,
    toggleCheckIn,
    isCheckedToday,
    isHabitDueToday,
    getStreak,
    getLast7Days,
    getTodayProgress,
    getFrequencyText,
    getCompletionRate,
    addHabit,
  } = useHabitStore();

  const { addToast } = useToastStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    emoji: "✨",
    category: "growth",
    frequencyType: FREQUENCY_TYPES.DAILY,
    targetDays: 7,
    intervalDays: 2,
    specificDays: [1, 3, 5], // Mon, Wed, Fri default
  });

  const todayProgress = getTodayProgress();

  // Track if celebration was already shown today
  const celebrationShownRef = useRef(false);

  // Completion celebration - show toast when all habits completed
  useEffect(() => {
    const { total, percentage } = todayProgress;

    // Only celebrate if:
    // 1. All habits are completed (100%)
    // 2. There are habits to complete (total > 0)
    // 3. Haven't celebrated yet today
    if (percentage === 100 && total > 0 && !celebrationShownRef.current) {
      celebrationShownRef.current = true;
      addToast({
        type: "success",
        message: `🎉 Luar biasa! Semua ${total} kebiasaan hari ini selesai!`,
        duration: 5000,
      });
    }

    // Reset celebration flag if progress drops below 100%
    if (percentage < 100) {
      celebrationShownRef.current = false;
    }
  }, [todayProgress, addToast]);

  // Helper function for color-coded progress
  const getProgressColor = (percentage) => {
    if (percentage === 0) return "bg-(--border-color)";
    if (percentage < 30) return "bg-red-400/70";
    if (percentage < 70) return "bg-amber-400/70";
    return "bg-(--accent)";
  };

  const getProgressTextColor = (percentage) => {
    if (percentage === 0) return "text-(--text-muted)";
    if (percentage < 30) return "text-red-400";
    if (percentage < 70) return "text-amber-400";
    return "text-(--accent)";
  };

  const emojiOptions = [
    "📚",
    "💪",
    "💧",
    "✍️",
    "🧘",
    "😴",
    "🎨",
    "🎵",
    "🏃",
    "🥗",
    "💻",
    "📝",
    "🧠",
    "❤️",
    "✨",
  ];
  const categoryOptions = [
    { id: "growth", label: "Pertumbuhan" },
    { id: "health", label: "Kesehatan" },
    { id: "mindfulness", label: "Mindfulness" },
    { id: "productivity", label: "Produktivitas" },
    { id: "creativity", label: "Kreativitas" },
  ];

  const frequencyOptions = [
    { id: FREQUENCY_TYPES.DAILY, label: "Harian", icon: "📅" },
    { id: FREQUENCY_TYPES.INTERVAL, label: "Interval", icon: "🔄" },
    { id: FREQUENCY_TYPES.WEEKLY, label: "Mingguan", icon: "📊" },
    { id: FREQUENCY_TYPES.SPECIFIC_DAYS, label: "Hari Tertentu", icon: "📌" },
  ];

  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      addHabit(newHabit);
      setNewHabit({
        name: "",
        emoji: "✨",
        category: "growth",
        frequencyType: FREQUENCY_TYPES.DAILY,
        targetDays: 7,
        intervalDays: 2,
        specificDays: [1, 3, 5],
      });
      setShowAddForm(false);
    }
  };

  const toggleSpecificDay = (dayId) => {
    const days = newHabit.specificDays || [];
    if (days.includes(dayId)) {
      setNewHabit({
        ...newHabit,
        specificDays: days.filter((d) => d !== dayId),
      });
    } else {
      setNewHabit({ ...newHabit, specificDays: [...days, dayId].sort() });
    }
  };

  // Weekly overview data
  const weeklyOverview = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toDateString(),
        dayShort: date.toLocaleDateString("id-ID", { weekday: "short" }),
        dayNum: date.getDate(),
        isToday: i === 0,
      });
    }
    return days;
  }, []);

  // Separate due today and not due
  const habitsDueToday = habits.filter((h) => isHabitDueToday(h.id));
  const habitsNotDueToday = habits.filter((h) => !isHabitDueToday(h.id));

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="type-h1 mb-2">kebiasaan harianmu.</h2>
          <p className="type-body text-(--text-muted) border-l-2 border-(--accent) pl-3 md:pl-4 italic">
            konsistensi adalah kunci pertumbuhan.
          </p>
        </div>

        {/* Today's Progress */}
        <Card>
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp
                  size={16}
                  className="md:w-5 md:h-5 text-(--accent)"
                />
                <h3 className="type-label text-(--text-muted)">
                  progres hari ini
                </h3>
              </div>
              <div className="text-center md:text-right">
                <span className={clsx("type-h1 transition-colors duration-300", getProgressTextColor(todayProgress.percentage))}>
                  {todayProgress.completed}/{todayProgress.total}
                </span>
                <p className={clsx("type-caption transition-colors duration-300", getProgressTextColor(todayProgress.percentage))}>
                  {todayProgress.percentage}% selesai
                </p>
              </div>
            </div>

            {/* Progress Bar - Color-coded */}
            <div className="h-2 bg-(--bg-color) border border-(--border-color) overflow-hidden">
              <div
                className={clsx(
                  "h-full transition-all duration-500",
                  getProgressColor(todayProgress.percentage)
                )}
                style={{ width: `${todayProgress.percentage}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Weekly Overview */}
        <Card>
          <div className="p-4 md:p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-(--accent)" />
                <h3 className="type-label text-(--text-muted)">
                  overview mingguan
                </h3>
              </div>
              {showAnalytics ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>

            {showAnalytics && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr>
                      <th className="text-left type-caption pb-2">Habit</th>
                      {weeklyOverview.map((day) => (
                        <th
                          key={day.date}
                          className={clsx(
                            "text-center font-mono text-[10px] pb-2",
                            day.isToday
                              ? "text-(--accent)"
                              : "text-(--text-muted)"
                          )}
                        >
                          <div>{day.dayShort}</div>
                          <div className="text-[8px]">{day.dayNum}</div>
                        </th>
                      ))}
                      <th className="text-center type-caption pb-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map((habit) => {
                      const last7 = getLast7Days(habit.id);
                      const rate = getCompletionRate(habit.id, 7);
                      return (
                        <tr
                          key={habit.id}
                          className="border-t border-dashed border-(--border-color)"
                        >
                          <td className="py-2">
                            <span className="text-sm">{habit.emoji}</span>
                            <span className="type-body ml-2">{habit.name}</span>
                          </td>
                          {last7.map((day, idx) => (
                            <td key={idx} className="text-center py-2">
                              <div
                                className={clsx(
                                  "w-4 h-4 mx-auto border",
                                  day.checked
                                    ? "bg-(--accent) border-(--accent)"
                                    : day.isScheduled
                                    ? "border-(--border-color)"
                                    : "border-transparent bg-(--bg-color)/50"
                                )}
                              />
                            </td>
                          ))}
                          <td className="text-center">
                            <span
                              className={clsx(
                                "font-mono text-xs",
                                rate >= 80
                                  ? "text-(--accent)"
                                  : rate >= 50
                                  ? "text-(--text-main)"
                                  : "text-(--text-muted)"
                              )}
                            >
                              {rate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Add Habit Button/Form */}
        {!showAddForm ? (
          <Button
            variant="ghost"
            onClick={() => setShowAddForm(true)}
            className="w-full py-6 border-dashed"
          >
            <Plus size={20} />
            <span>tambah kebiasaan baru</span>
          </Button>
        ) : (
          <Card>
            <div className="p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs md:text-sm uppercase tracking-wider text-(--text-muted)">
                  kebiasaan baru
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-(--text-muted) hover:text-(--text-main) transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Emoji Selector */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-(--text-muted) uppercase">
                  Emoji
                </label>
                <div className="flex gap-2 flex-wrap">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewHabit({ ...newHabit, emoji })}
                      className={clsx(
                        "text-xl p-1.5 border selectable-strong",
                        newHabit.emoji === emoji
                          ? "border-(--accent) bg-(--accent)/10 scale-105"
                          : "border-(--border-color)"
                      )}
                    >
                      <span className="emoji-bounce inline-block">{emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="type-label">Nama Kebiasaan</label>
                <Input
                  placeholder="contoh: Membaca 30 menit"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="type-label">Kategori</label>
                <div className="flex gap-2 flex-wrap">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setNewHabit({ ...newHabit, category: cat.id })
                      }
                      className={clsx(
                        "px-3 py-1.5 type-caption border transition-all",
                        newHabit.category === cat.id
                          ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                          : "border-(--border-color) text-(--text-muted) hover:border-(--text-main)"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Type Selector */}
              <div className="space-y-2">
                <label className="type-label flex items-center gap-2">
                  <Clock size={12} />
                  Frekuensi
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {frequencyOptions.map((freq) => (
                    <button
                      key={freq.id}
                      onClick={() =>
                        setNewHabit({ ...newHabit, frequencyType: freq.id })
                      }
                      className={clsx(
                        "px-3 py-2 font-mono text-xs border transition-all flex flex-col items-center gap-1",
                        newHabit.frequencyType === freq.id
                          ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                          : "border-(--border-color) text-(--text-muted) hover:border-(--text-main)"
                      )}
                    >
                      <span className="text-lg">{freq.icon}</span>
                      <span>{freq.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interval Days (if interval selected) */}
              {newHabit.frequencyType === FREQUENCY_TYPES.INTERVAL && (
                <div className="space-y-2">
                  <label className="type-label">Setiap berapa hari?</label>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 7].map((days) => (
                      <button
                        key={days}
                        onClick={() =>
                          setNewHabit({ ...newHabit, intervalDays: days })
                        }
                        className={clsx(
                          "flex-1 py-2 type-body border transition-all",
                          newHabit.intervalDays === days
                            ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                            : "border-(--border-color) text-(--text-muted) hover:border-(--text-main)"
                        )}
                      >
                        {days} hari
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific Days (if specific-days selected) */}
              {newHabit.frequencyType === FREQUENCY_TYPES.SPECIFIC_DAYS && (
                <div className="space-y-2">
                  <label className="type-label">Pilih hari</label>
                  <div className="flex gap-2">
                    {WEEKDAYS.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => toggleSpecificDay(day.id)}
                        className={clsx(
                          "flex-1 py-2 font-mono text-xs border transition-all",
                          newHabit.specificDays?.includes(day.id)
                            ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                            : "border-(--border-color) text-(--text-muted) hover:border-(--text-main)"
                        )}
                      >
                        {day.short}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Days per Week (if weekly selected) */}
              {newHabit.frequencyType === FREQUENCY_TYPES.WEEKLY && (
                <div className="space-y-2">
                  <label className="type-label">Berapa kali per minggu?</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                      <button
                        key={days}
                        onClick={() =>
                          setNewHabit({ ...newHabit, targetDays: days })
                        }
                        className={clsx(
                          "flex-1 py-2 type-body border transition-all",
                          newHabit.targetDays === days
                            ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                            : "border-(--border-color) text-(--text-muted) hover:border-(--text-main)"
                        )}
                      >
                        {days}x
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  batal
                </Button>
                <Button
                  variant="accent"
                  onClick={handleAddHabit}
                  disabled={!newHabit.name.trim()}
                  className="flex-1"
                >
                  tambah kebiasaan
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Due Today Section */}
        {habitsDueToday.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-(--accent)" />
              <h3 className="type-label text-(--text-muted)">
                Due Hari Ini ({habitsDueToday.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {habitsDueToday.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCheckedToday={isCheckedToday}
                  getStreak={getStreak}
                  getLast7Days={getLast7Days}
                  getFrequencyText={getFrequencyText}
                  toggleCheckIn={toggleCheckIn}
                  isDue={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Not Due Today Section */}
        {habitsNotDueToday.length > 0 && (
          <div className="space-y-3">
            <h3 className="type-label text-(--text-muted)">
              Tidak Dijadwalkan Hari Ini ({habitsNotDueToday.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 opacity-60">
              {habitsNotDueToday.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCheckedToday={isCheckedToday}
                  getStreak={getStreak}
                  getLast7Days={getLast7Days}
                  getFrequencyText={getFrequencyText}
                  toggleCheckIn={toggleCheckIn}
                  isDue={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Motivational Quote */}
        <Card>
          <div className="p-6 text-center">
            <p className="font-serif italic text-lg text-(--text-main)">
              "kebiasaan kecil yang dilakukan konsisten
              <br />
              menciptakan perubahan besar."
            </p>
            <div className="w-12 h-px bg-(--border-color) mx-auto mt-4" />
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};

// Habit Card Component - Compact Grid Version with UX Improvements
const HabitCard = ({
  habit,
  isCheckedToday,
  getStreak,
  getLast7Days,
  getFrequencyText,
  toggleCheckIn,
  isDue,
}) => {
  const checked = isCheckedToday(habit.id);
  const streak = getStreak(habit.id);
  const last7Days = getLast7Days(habit.id);
  const frequencyText = getFrequencyText(habit.id);

  // Handle card click - toggles habit check
  const handleCardClick = (e) => {
    // Prevent double-triggering if clicking the checkbox button directly
    if (e.target.closest("button")) return;
    toggleCheckIn(habit.id);
  };

  return (
    <Card
      hover
      className={clsx(
        "h-full cursor-pointer transition-all duration-300",
        // Visual feedback: tint background when checked
        checked && "bg-(--accent)/10 border-(--accent)/50"
      )}
    >
      {/* Clickable entire card */}
      <div
        className="p-3 md:p-4"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggleCheckIn(habit.id)}
      >
        {/* Header: Check + Name + Streak */}
        <div className="flex items-center gap-2 mb-2">
          {/* Check Button with micro-animation */}
          <button
            onClick={() => toggleCheckIn(habit.id)}
            className={clsx(
              "shrink-0 transition-all duration-200",
              checked
                ? "scale-110" // Pulse effect when checked
                : "hover:scale-110"
            )}
          >
            {checked ? (
              <CheckCircle2
                size={24}
                className="text-(--accent) drop-shadow-sm"
              />
            ) : (
              <Circle
                size={24}
                className={clsx(
                  "transition-colors",
                  isDue ? "text-(--text-muted)" : "text-(--border-color)"
                )}
              />
            )}
          </button>

          {/* Emoji + Name */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className={clsx(
                "text-lg shrink-0 transition-transform duration-200",
                checked && "scale-110" // Emoji bounce when checked
              )}
            >
              {habit.emoji}
            </span>
            <div className="min-w-0">
              <h3
                className={clsx(
                  "text-sm md:text-base font-serif truncate transition-colors duration-200",
                  checked ? "text-(--accent)" : "text-(--text-main)"
                )}
              >
                {habit.name}
              </h3>
              <p className="font-mono text-[9px] text-(--text-muted) truncate">
                {frequencyText}
              </p>
            </div>
          </div>

          {/* Streak Badge - more prominent when checked */}
          {streak > 0 && (
            <div
              className={clsx(
                "flex items-center gap-0.5 shrink-0 px-1.5 py-0.5 rounded-sm transition-all duration-200",
                checked && "bg-(--accent)/20"
              )}
            >
              <Flame
                size={14}
                className={clsx("text-(--accent)", checked && "animate-pulse")}
              />
              <span className="text-sm font-mono text-(--accent) font-semibold">
                {streak}
              </span>
            </div>
          )}
        </div>

        {/* 7-Day Visual - Compact */}
        <div className="flex gap-1 mt-2">
          {last7Days.map((day, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-0.5 flex-1"
            >
              <div
                className={clsx(
                  "w-full aspect-square max-w-[24px] border transition-all duration-200",
                  day.checked
                    ? "bg-(--accent) border-(--accent)"
                    : day.isScheduled
                    ? "bg-transparent border-(--border-color)"
                    : "bg-(--bg-color)/50 border-transparent"
                )}
              />
              <span className="font-mono text-[8px] text-(--text-muted)">
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
