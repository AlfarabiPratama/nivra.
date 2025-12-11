import { useMemo } from "react";
import { useJournalStore } from "../../store/useJournalStore";
import clsx from "clsx";

/**
 * MoodHeatmap - Calendar heatmap showing mood patterns
 */
export const MoodHeatmap = () => {
  const { entries } = useJournalStore();

  // Generate last 12 weeks of data
  const heatmapData = useMemo(() => {
    const weeks = 12;
    const today = new Date();
    const data = [];

    // Create map of date -> mood
    const moodByDate = {};
    entries.forEach((entry) => {
      const date = new Date(entry.createdAt).toDateString();
      // If multiple entries on same day, use the latest mood
      if (
        !moodByDate[date] ||
        new Date(entry.createdAt) > new Date(moodByDate[date].date)
      ) {
        moodByDate[date] = {
          mood: entry.mood,
          date: entry.createdAt,
        };
      }
    });

    // Generate grid (7 days x 12 weeks)
    for (let week = weeks - 1; week >= 0; week--) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (week * 7 + (6 - day)));
        const dateString = date.toDateString();
        const entry = moodByDate[dateString];

        weekData.push({
          date: date,
          dateString: dateString,
          mood: entry?.mood || null,
          hasEntry: !!entry,
        });
      }
      data.push(weekData);
    }

    return data;
  }, [entries]);

  // Mood to color mapping
  const getMoodColor = (mood) => {
    if (!mood) return "bg-(--border-color) opacity-30";
    switch (mood) {
      case 5:
        return "bg-green-500"; // sangat baik
      case 4:
        return "bg-green-400"; // baik
      case 3:
        return "bg-yellow-400"; // biasa
      case 2:
        return "bg-orange-400"; // kurang baik
      case 1:
        return "bg-red-400"; // buruk
      default:
        return "bg-(--border-color)";
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 5:
        return "😊";
      case 4:
        return "🙂";
      case 3:
        return "😐";
      case 2:
        return "😔";
      case 1:
        return "😢";
      default:
        return "";
    }
  };

  // Calculate mood statistics
  const stats = useMemo(() => {
    const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalMood = 0;
    let entryCount = 0;

    entries.forEach((entry) => {
      if (entry.mood) {
        moodCounts[entry.mood]++;
        totalMood += entry.mood;
        entryCount++;
      }
    });

    const avgMood = entryCount > 0 ? (totalMood / entryCount).toFixed(1) : 0;
    const dominantMood = Object.entries(moodCounts).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      [0, 0]
    )[0];

    return {
      avgMood,
      dominantMood: parseInt(dominantMood),
      entryCount,
      moodCounts,
    };
  }, [entries]);

  const dayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-(--text-muted)">
          Pola Mood (12 Minggu)
        </h3>
        {stats.entryCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{getMoodEmoji(stats.dominantMood)}</span>
            <span className="font-mono text-xs text-(--text-muted)">
              Rata-rata: {stats.avgMood}/5
            </span>
          </div>
        )}
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            {dayLabels.map((day, i) => (
              <div
                key={day}
                className="h-3 w-6 flex items-center justify-end pr-1 font-mono text-[8px] text-(--text-muted)"
              >
                {i % 2 === 0 ? day : ""}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.dateString}
                  className={clsx(
                    "w-3 h-3 transition-all cursor-pointer hover:scale-125",
                    getMoodColor(day.mood)
                  )}
                  title={`${day.date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}: ${
                    day.mood ? getMoodEmoji(day.mood) : "Tidak ada entri"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-(--text-muted)">
            Buruk
          </span>
          {[1, 2, 3, 4, 5].map((mood) => (
            <div
              key={mood}
              className={clsx("w-3 h-3", getMoodColor(mood))}
              title={getMoodEmoji(mood)}
            />
          ))}
          <span className="font-mono text-[10px] text-(--text-muted)">
            Baik
          </span>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          {[5, 4, 3, 2, 1].map((mood) => (
            <div key={mood} className="flex items-center gap-1">
              <span className="text-xs">{getMoodEmoji(mood)}</span>
              <span className="font-mono text-[10px] text-(--text-muted)">
                {stats.moodCounts[mood]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {stats.entryCount === 0 && (
        <p className="font-mono text-xs text-(--text-muted) text-center italic py-4">
          Tulis jurnal dengan mood untuk melihat pola mood-mu 📝
        </p>
      )}
    </div>
  );
};
