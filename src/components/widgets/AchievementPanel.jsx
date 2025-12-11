import { useMemo } from "react";
import { Card } from "../ui/Card";
import { useTaskStore } from "../../store/useTaskStore";
import { useBookStore } from "../../store/useBookStore";
import { useJournalStore } from "../../store/useJournalStore";
import { useHabitStore } from "../../store/useHabitStore";
import { useAppStore } from "../../store/useAppStore";
import { Trophy, Lock, CheckCircle } from "lucide-react";
import clsx from "clsx";

/**
 * Achievement definitions
 */
const ACHIEVEMENTS = [
  // Task achievements
  {
    id: "first_task",
    name: "Langkah Pertama",
    description: "Selesaikan tugas pertamamu",
    emoji: "🎯",
    category: "tasks",
    xp: 10,
    check: (data) => data.completedTasks >= 1,
    progress: (data) => Math.min(data.completedTasks, 1),
    target: 1,
  },
  {
    id: "task_10",
    name: "Produktif",
    description: "Selesaikan 10 tugas",
    emoji: "✅",
    category: "tasks",
    xp: 25,
    check: (data) => data.completedTasks >= 10,
    progress: (data) => Math.min(data.completedTasks, 10),
    target: 10,
  },
  {
    id: "task_50",
    name: "Task Master",
    description: "Selesaikan 50 tugas",
    emoji: "🏆",
    category: "tasks",
    xp: 50,
    check: (data) => data.completedTasks >= 50,
    progress: (data) => Math.min(data.completedTasks, 50),
    target: 50,
  },
  {
    id: "task_100",
    name: "Centurion",
    description: "Selesaikan 100 tugas",
    emoji: "💯",
    category: "tasks",
    xp: 100,
    check: (data) => data.completedTasks >= 100,
    progress: (data) => Math.min(data.completedTasks, 100),
    target: 100,
  },

  // Reading achievements
  {
    id: "first_book",
    name: "Bookworm",
    description: "Selesaikan buku pertamamu",
    emoji: "📖",
    category: "reading",
    xp: 25,
    check: (data) => data.finishedBooks >= 1,
    progress: (data) => Math.min(data.finishedBooks, 1),
    target: 1,
  },
  {
    id: "book_5",
    name: "Avid Reader",
    description: "Selesaikan 5 buku",
    emoji: "📚",
    category: "reading",
    xp: 50,
    check: (data) => data.finishedBooks >= 5,
    progress: (data) => Math.min(data.finishedBooks, 5),
    target: 5,
  },
  {
    id: "book_12",
    name: "Book a Month",
    description: "Selesaikan 12 buku",
    emoji: "🏅",
    category: "reading",
    xp: 100,
    check: (data) => data.finishedBooks >= 12,
    progress: (data) => Math.min(data.finishedBooks, 12),
    target: 12,
  },
  {
    id: "pages_1000",
    name: "Page Turner",
    description: "Baca 1000 halaman",
    emoji: "📄",
    category: "reading",
    xp: 50,
    check: (data) => data.totalPages >= 1000,
    progress: (data) => Math.min(data.totalPages, 1000),
    target: 1000,
  },

  // Journal achievements
  {
    id: "first_journal",
    name: "Dear Diary",
    description: "Tulis entri jurnal pertama",
    emoji: "✍️",
    category: "journal",
    xp: 10,
    check: (data) => data.journalEntries >= 1,
    progress: (data) => Math.min(data.journalEntries, 1),
    target: 1,
  },
  {
    id: "journal_7",
    name: "Week of Reflection",
    description: "Tulis 7 entri jurnal",
    emoji: "📝",
    category: "journal",
    xp: 25,
    check: (data) => data.journalEntries >= 7,
    progress: (data) => Math.min(data.journalEntries, 7),
    target: 7,
  },
  {
    id: "journal_30",
    name: "Journal Master",
    description: "Tulis 30 entri jurnal",
    emoji: "📓",
    category: "journal",
    xp: 75,
    check: (data) => data.journalEntries >= 30,
    progress: (data) => Math.min(data.journalEntries, 30),
    target: 30,
  },

  // Habit achievements
  {
    id: "habit_streak_7",
    name: "Week Warrior",
    description: "7 hari streak kebiasaan",
    emoji: "🔥",
    category: "habits",
    xp: 30,
    check: (data) => data.habitStreak >= 7,
    progress: (data) => Math.min(data.habitStreak, 7),
    target: 7,
  },
  {
    id: "habit_streak_30",
    name: "Monthly Master",
    description: "30 hari streak kebiasaan",
    emoji: "💪",
    category: "habits",
    xp: 100,
    check: (data) => data.habitStreak >= 30,
    progress: (data) => Math.min(data.habitStreak, 30),
    target: 30,
  },

  // Level achievements
  {
    id: "level_5",
    name: "Rising Star",
    description: "Capai level 5",
    emoji: "⭐",
    category: "level",
    xp: 0,
    check: (data) => data.level >= 5,
    progress: (data) => Math.min(data.level, 5),
    target: 5,
  },
  {
    id: "level_10",
    name: "Veteran",
    description: "Capai level 10",
    emoji: "🌟",
    category: "level",
    xp: 0,
    check: (data) => data.level >= 10,
    progress: (data) => Math.min(data.level, 10),
    target: 10,
  },
  {
    id: "level_25",
    name: "Elite",
    description: "Capai level 25",
    emoji: "💫",
    category: "level",
    xp: 0,
    check: (data) => data.level >= 25,
    progress: (data) => Math.min(data.level, 25),
    target: 25,
  },
];

/**
 * AchievementPanel - Display achievements with progress
 */
export const AchievementPanel = ({ compact = false }) => {
  const { tasks } = useTaskStore();
  const { books } = useBookStore();
  const { entries } = useJournalStore();
  const { checkIns, habits } = useHabitStore();
  const { user } = useAppStore();

  // Calculate user data for achievement checking
  const userData = useMemo(() => {
    // Safety checks for undefined arrays
    const taskList = tasks || [];
    const bookList = books || [];
    const entryList = entries || [];
    const habitList = habits || [];
    const checkInData = checkIns || {};

    const completedTasks = taskList.filter((t) => t.completed).length;
    const finishedBooks = bookList.filter((b) => b.status === "finished").length;
    const totalPages = bookList.reduce(
      (sum, b) =>
        sum + (b.status === "finished" ? b.total || 0 : b.progress || 0),
      0
    );
    const journalEntries = entryList.length;

    // Calculate habit streak
    let habitStreak = 0;
    if (habitList.length > 0) {
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toDateString();

        const allHabitsChecked = habitList.every((h) => checkInData[h.id]?.[dateStr]);
        if (allHabitsChecked) {
          habitStreak++;
        } else if (i > 0) {
          break;
        }
      }
    }

    return {
      completedTasks,
      finishedBooks,
      totalPages,
      journalEntries,
      habitStreak,
      level: user?.level || 1,
    };
  }, [tasks, books, entries, checkIns, habits, user?.level]);

  // Check achievements
  const achievementStatus = useMemo(() => {
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: achievement.check(userData),
      currentProgress: achievement.progress(userData),
    }));
  }, [userData]);

  const unlockedCount = achievementStatus.filter((a) => a.unlocked).length;
  const totalCount = achievementStatus.length;

  // Group by category
  const categories = [
    { id: "tasks", name: "Tugas", emoji: "✅" },
    { id: "reading", name: "Membaca", emoji: "📚" },
    { id: "journal", name: "Jurnal", emoji: "✍️" },
    { id: "habits", name: "Kebiasaan", emoji: "🔥" },
    { id: "level", name: "Level", emoji: "⭐" },
  ];

  if (compact) {
    // Compact view for dashboard
    const recentUnlocked = achievementStatus
      .filter((a) => a.unlocked)
      .slice(-3);
    const nextToUnlock = achievementStatus
      .filter((a) => !a.unlocked)
      .sort(
        (a, b) => b.currentProgress / b.target - a.currentProgress / a.target
      )
      .slice(0, 2);

    return (
      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-(--text-muted)">
              Achievements
            </h3>
            <span className="font-mono text-xs text-(--accent)">
              {unlockedCount}/{totalCount}
            </span>
          </div>

          {/* Recent unlocked */}
          <div className="flex gap-2 flex-wrap">
            {recentUnlocked.map((a) => (
              <div
                key={a.id}
                className="p-2 border border-(--accent) bg-(--accent)/10"
                title={`${a.name}: ${a.description}`}
              >
                <span className="text-lg">{a.emoji}</span>
              </div>
            ))}
            {recentUnlocked.length === 0 && (
              <p className="font-mono text-xs text-(--text-muted) italic">
                Belum ada achievement
              </p>
            )}
          </div>

          {/* Next to unlock */}
          {nextToUnlock.length > 0 && (
            <div className="pt-2 border-t border-dashed border-(--border-color)">
              <p className="font-mono text-[10px] text-(--text-muted) mb-2">
                Hampir unlock:
              </p>
              {nextToUnlock.map((a) => (
                <div key={a.id} className="flex items-center gap-2 mb-1">
                  <span className="text-sm opacity-50">{a.emoji}</span>
                  <div className="flex-1">
                    <div className="h-1 bg-(--border-color)">
                      <div
                        className="h-full bg-(--accent) transition-all"
                        style={{
                          width: `${(a.currentProgress / a.target) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-(--text-muted)">
                    {a.currentProgress}/{a.target}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Full view
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-yellow-500" />
          <h2 className="font-serif text-xl text-(--text-main)">
            Achievements
          </h2>
        </div>
        <span className="font-mono text-sm text-(--accent)">
          {unlockedCount}/{totalCount} Unlocked
        </span>
      </div>

      {/* Categories */}
      {categories.map((category) => {
        const categoryAchievements = achievementStatus.filter(
          (a) => a.category === category.id
        );
        const categoryUnlocked = categoryAchievements.filter(
          (a) => a.unlocked
        ).length;

        return (
          <Card key={category.id}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{category.emoji}</span>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-(--text-muted)">
                    {category.name}
                  </h3>
                </div>
                <span className="font-mono text-xs text-(--text-muted)">
                  {categoryUnlocked}/{categoryAchievements.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={clsx(
                      "p-3 border transition-all",
                      achievement.unlocked
                        ? "border-(--accent) bg-(--accent)/5"
                        : "border-(--border-color) opacity-60"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={clsx(
                          "text-2xl",
                          !achievement.unlocked && "grayscale opacity-50"
                        )}
                      >
                        {achievement.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-mono text-sm text-(--text-main) truncate">
                            {achievement.name}
                          </h4>
                          {achievement.unlocked ? (
                            <CheckCircle
                              size={14}
                              className="text-green-500 shrink-0"
                            />
                          ) : (
                            <Lock
                              size={14}
                              className="text-(--text-muted) shrink-0"
                            />
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-(--text-muted)">
                          {achievement.description}
                        </p>

                        {/* Progress bar for locked achievements */}
                        {!achievement.unlocked && (
                          <div className="mt-2">
                            <div className="h-1 bg-(--border-color)">
                              <div
                                className="h-full bg-(--accent) transition-all"
                                style={{
                                  width: `${
                                    (achievement.currentProgress /
                                      achievement.target) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-(--text-muted)">
                              {achievement.currentProgress}/{achievement.target}
                            </span>
                          </div>
                        )}

                        {/* XP reward */}
                        {achievement.xp > 0 && (
                          <span
                            className={clsx(
                              "font-mono text-[10px]",
                              achievement.unlocked
                                ? "text-(--accent)"
                                : "text-(--text-muted)"
                            )}
                          >
                            +{achievement.xp} XP
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
