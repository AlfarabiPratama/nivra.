import { useMemo } from "react";
import { Card } from "../ui/Card";
import { useTaskStore } from "../../store/useTaskStore";
import { useJournalStore } from "../../store/useJournalStore";
import { useHabitStore } from "../../store/useHabitStore";
import { useAppStore } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";
import { buildAchievementStats } from "../../utils/achievementStats";
import { Target, CheckCircle2, Circle, Sparkles, Gift } from "lucide-react";
import clsx from "clsx";

/**
 * Daily Quests - Gamified daily challenges
 */
export const DailyQuests = () => {
  const { tasks } = useTaskStore();
  const { entries, addEntry } = useJournalStore();
  const { checkIns, habits } = useHabitStore();
  const { addXP } = useAppStore();
  const { addToast } = useToastStore();

  const today = new Date().toDateString();

  // Define daily quests
  const quests = useMemo(() => {
    // Safety checks for undefined arrays
    const taskList = tasks || [];
    const entryList = entries || [];
    const habitList = habits || [];
    const checkInData = checkIns || {};

    // Calculate completion status
    const tasksCompletedToday = taskList.filter(
      (t) => t.completed && new Date(t.completedAt).toDateString() === today
    ).length;

    const journaledToday = entryList.some(
      (e) => new Date(e.createdAt).toDateString() === today
    );

    const habitsCompletedToday = habitList.filter(
      (h) => checkInData[h.id]?.[today]
    ).length;

    return [
      {
        id: "tasks",
        title: "Selesaikan 3 tugas",
        description: "Fokus pada hal-hal penting",
        xp: 15,
        current: Math.min(tasksCompletedToday, 3),
        target: 3,
        completed: tasksCompletedToday >= 3,
        icon: CheckCircle2,
        color: "text-blue-500",
      },
      {
        id: "journal",
        title: "Tulis jurnal hari ini",
        description: "Refleksi sejenak",
        xp: 10,
        current: journaledToday ? 1 : 0,
        target: 1,
        completed: journaledToday,
        icon: Sparkles,
        color: "text-purple-500",
        action: !journaledToday
          ? () => {
              // Quick journal placeholder
              addEntry("Hari ini...");
              addXP(10, useToastStore.getState(), {
                source: "daily quest",
                stats: buildAchievementStats(),
              });
              addToast("Quest selesai! +10 XP 🎉", "success");
            }
          : null,
      },
      {
        id: "habits",
        title: "Selesaikan 2 kebiasaan",
        description: "Bangun rutinitas sehat",
        xp: 10,
        current: Math.min(habitsCompletedToday, 2),
        target: 2,
        completed: habitsCompletedToday >= 2,
        icon: Target,
        color: "text-green-500",
      },
      {
        id: "bonus",
        title: "BONUS: Semua quest",
        description: "Selesaikan semua quest di atas",
        xp: 25,
        current: [
          tasksCompletedToday >= 3,
          journaledToday,
          habitsCompletedToday >= 2,
        ].filter(Boolean).length,
        target: 3,
        completed:
          tasksCompletedToday >= 3 &&
          journaledToday &&
          habitsCompletedToday >= 2,
        icon: Gift,
        color: "text-yellow-500",
        isBonus: true,
      },
    ];
  }, [tasks, entries, habits, checkIns, today, addEntry, addXP, addToast]);

  const totalXP = quests.reduce((sum, q) => sum + (q.completed ? q.xp : 0), 0);
  const maxXP = quests.reduce((sum, q) => sum + q.xp, 0);

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-(--accent)" />
          <span className="font-mono text-xs uppercase tracking-widest text-(--text-muted)">
            Quest Harian
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs text-(--accent)">
            {totalXP}/{maxXP} XP
          </span>
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={clsx(
              "flex items-start gap-3 p-2 transition-all",
              quest.completed && "opacity-60",
              quest.isBonus &&
                "border border-dashed border-yellow-500/30 bg-yellow-500/5"
            )}
          >
            {/* Status Icon */}
            <div className="mt-0.5">
              {quest.completed ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Circle size={16} className="text-(--text-muted)" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <quest.icon size={14} className={quest.color} />
                <span
                  className={clsx(
                    "text-sm font-serif",
                    quest.completed
                      ? "line-through text-(--text-muted)"
                      : "text-(--text-main)"
                  )}
                >
                  {quest.title}
                </span>
                <span className="font-mono text-[10px] text-(--accent)">
                  +{quest.xp} XP
                </span>
              </div>

              <p className="text-[10px] font-mono text-(--text-muted) mt-0.5">
                {quest.description}
              </p>

              {/* Progress Bar */}
              {!quest.completed && quest.target > 1 && (
                <div className="mt-2 h-1 bg-(--border-color) rounded-full overflow-hidden">
                  <div
                    className="h-full bg-(--accent) transition-all duration-300"
                    style={{
                      width: `${(quest.current / quest.target) * 100}%`,
                    }}
                  />
                </div>
              )}

              {/* Quick Action Button */}
              {quest.action && (
                <button
                  onClick={quest.action}
                  className="mt-2 text-[10px] font-mono text-(--accent) hover:underline"
                >
                  Selesaikan sekarang →
                </button>
              )}
            </div>

            {/* Progress Counter */}
            <div className="text-right shrink-0">
              <span className="font-mono text-xs text-(--text-muted)">
                {quest.current}/{quest.target}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {quests.every((q) => q.completed) && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 text-center">
          <p className="font-mono text-xs text-green-500">
            🎉 Semua quest selesai! Kamu luar biasa!
          </p>
        </div>
      )}
    </Card>
  );
};
