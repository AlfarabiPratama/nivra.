import { useMemo } from "react";
import { Flame, Award, TrendingUp } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import { useJournalStore } from "../../store/useJournalStore";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clsx from "clsx";

/**
 * StreakBanner - Motivational streak counter
 */
export const StreakBanner = () => {
  const { tasks } = useTaskStore();
  const { entries } = useJournalStore();

  // Calculate streak (consecutive days with activity)
  const streak = useMemo(() => {
    // Safety checks for undefined arrays
    const taskList = tasks || [];
    const entryList = entries || [];

    const activityDays = new Set();

    // Add task completion days
    taskList.forEach((t) => {
      if (t.completedAt) {
        activityDays.add(new Date(t.completedAt).toDateString());
      }
    });

    // Add journal entry days
    entryList.forEach((e) => {
      if (e.createdAt) {
        activityDays.add(new Date(e.createdAt).toDateString());
      }
    });

    // Calculate consecutive days from today backwards
    let count = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      if (activityDays.has(checkDate.toDateString())) {
        count++;
      } else if (i > 0) {
        // Allow today to be missing, but break on any other gap
        break;
      }
    }

    return count;
  }, [tasks, entries]);

  // Get motivational message
  const getMessage = () => {
    if (streak >= 30)
      return "Luar biasa! Kamu sudah membangun kebiasaan yang kuat 💪";
    if (streak >= 14) return "Dua minggu konsisten! Terus pertahankan 🔥";
    if (streak >= 7) return "Seminggu penuh! Momentummu bagus 🌟";
    if (streak >= 3) return "Konsistensi adalah superpower ✨";
    if (streak >= 1) return "Awal yang baik! Lanjutkan besok 🌱";
    return "Mulai hari ini, bangun streak-mu! 🎯";
  };

  const getStreakColor = () => {
    if (streak >= 30) return "from-orange-500 to-red-500";
    if (streak >= 14) return "from-yellow-500 to-orange-500";
    if (streak >= 7) return "from-green-500 to-yellow-500";
    if (streak >= 3) return "from-blue-500 to-green-500";
    return "from-gray-500 to-blue-500";
  };

  if (streak === 0) {
    return (
      <div className="border border-dashed border-(--border-color) p-3 text-center">
        <p className="font-mono text-xs text-(--text-muted)">
          🎯 Mulai hari ini, bangun streak-mu!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "relative overflow-hidden border border-(--border-color) p-4",
        "bg-linear-to-r",
        getStreakColor(),
        "bg-opacity-10"
      )}
      style={{
        background: `linear-gradient(135deg, var(--card-color) 0%, var(--card-color) 100%)`,
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className={clsx("absolute inset-0 bg-linear-to-r", getStreakColor())}
        />
      </div>

      <div className="relative flex items-center gap-4">
        {/* Flame Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="shrink-0"
        >
          <Flame
            size={32}
            className={clsx(
              streak >= 7 ? "text-orange-500" : "text-(--accent)"
            )}
          />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-(--text-main)">
              {streak}
            </span>
            <span className="font-mono text-xs uppercase text-(--text-muted)">
              hari berturut-turut
            </span>
            {streak >= 7 && <Award size={16} className="text-yellow-500" />}
          </div>
          <p className="font-mono text-xs text-(--text-muted) truncate">
            {getMessage()}
          </p>
        </div>

        {/* Trend indicator */}
        <div className="shrink-0 hidden sm:block">
          <TrendingUp size={20} className="text-green-500" />
        </div>
      </div>

      {/* Mini progress dots */}
      <div className="flex gap-1 mt-3">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={clsx(
              "h-1.5 flex-1 rounded-full transition-all",
              i < Math.min(streak, 7) ? "bg-(--accent)" : "bg-(--border-color)"
            )}
          />
        ))}
      </div>
    </motion.div>
  );
};
