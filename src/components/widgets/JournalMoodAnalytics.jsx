import { useMemo } from "react";
import { Card } from "../ui/Card";
import { Smile, TrendingUp } from "lucide-react";

const moodEmojis = {
  5: "😊",
  4: "🙂",
  3: "😐",
  2: "😔",
  1: "😢",
};

const moodLabels = {
  5: "Sangat Baik",
  4: "Baik",
  3: "Biasa",
  2: "Kurang Baik",
  1: "Buruk",
};

export const JournalMoodAnalytics = ({ entries }) => {
  const analytics = useMemo(() => {
    // Safety check for undefined entries
    const entryList = entries || [];
    const entriesWithMood = entryList.filter((e) => e.mood);

    // Mood distribution
    const moodDist = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    entriesWithMood.forEach((entry) => {
      if (entry.mood) moodDist[entry.mood]++;
    });

    // Calculate average mood
    const totalMoodPoints = entriesWithMood.reduce(
      (sum, e) => sum + (e.mood || 0),
      0
    );
    const avgMood =
      entriesWithMood.length > 0
        ? (totalMoodPoints / entriesWithMood.length).toFixed(1)
        : 0;

    // Last 7 days mood trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayEntries = entryList.filter((e) => {
        const entryDate = new Date(e.createdAt).toISOString().split("T")[0];
        return entryDate === dateStr && e.mood;
      });

      const dayAvgMood =
        dayEntries.length > 0
          ? dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length
          : null;

      last7Days.push({
        date: dateStr,
        label: date.toLocaleDateString("id-ID", { weekday: "short" }),
        mood: dayAvgMood,
      });
    }

    // Most common mood
    const mostCommonMood = Object.entries(moodDist).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    return {
      moodDist,
      avgMood,
      last7Days,
      mostCommonMood,
      totalWithMood: entriesWithMood.length,
    };
  }, [entries]);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card hover>
          <div className="text-center space-y-2">
            <div className="text-3xl">
              {moodEmojis[Math.round(analytics.avgMood)] || "😐"}
            </div>
            <div className="font-mono text-2xl text-(accent)">
              {analytics.avgMood}
            </div>
            <div className="font-mono text-xs text-(text-muted) uppercase">
              avg mood
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="text-center space-y-2">
            <div className="text-3xl">
              {moodEmojis[analytics.mostCommonMood] || "😐"}
            </div>
            <div className="font-mono text-sm text-(text-main)">
              {moodLabels[analytics.mostCommonMood] || "N/A"}
            </div>
            <div className="font-mono text-xs text-(text-muted) uppercase">
              most common
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="text-center space-y-2">
            <div className="font-mono text-2xl text-(accent)">
              {analytics.totalWithMood}
            </div>
            <div className="font-mono text-xs text-(text-muted) uppercase">
              tracked moods
            </div>
          </div>
        </Card>
      </div>

      {/* Mood Trend Line */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-(text-muted)">
              Mood Trend (7 Hari)
            </h3>
            <TrendingUp size={16} className="text-(accent)" />
          </div>

          <div className="relative h-32">
            {/* Grid lines */}
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="absolute w-full border-t border-dashed border-(border-color) opacity-30"
                style={{ bottom: `${(level - 1) * 25}%` }}
              />
            ))}

            {/* Mood line */}
            <svg className="absolute inset-0 w-full h-full">
              {analytics.last7Days.map((day, index) => {
                if (day.mood === null || index === 0) return null;

                const prevDay = analytics.last7Days[index - 1];
                if (prevDay.mood === null) return null;

                const x1 = ((index - 1) / 6) * 100;
                const y1 = 100 - (prevDay.mood / 5) * 100;
                const x2 = (index / 6) * 100;
                const y2 = 100 - (day.mood / 5) * 100;

                return (
                  <line
                    key={index}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="var(--accent)"
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                );
              })}

              {/* Mood points */}
              {analytics.last7Days.map((day, index) => {
                if (day.mood === null) return null;

                const x = (index / 6) * 100;
                const y = 100 - (day.mood / 5) * 100;

                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="var(--accent)"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
          </div>

          {/* Day labels */}
          <div className="flex justify-between pt-2">
            {analytics.last7Days.map((day) => (
              <div
                key={day.date}
                className="font-mono text-xs text-(text-muted)"
              >
                {day.label}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Mood Distribution */}
      <Card>
        <div className="space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-(text-muted)">
            Mood Distribution
          </h3>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((mood) => {
              const count = analytics.moodDist[mood];
              const percentage =
                analytics.totalWithMood > 0
                  ? (count / analytics.totalWithMood) * 100
                  : 0;

              return (
                <div key={mood} className="flex items-center gap-3">
                  <span className="text-2xl">{moodEmojis[mood]}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-(text-main)">
                        {moodLabels[mood]}
                      </span>
                      <span className="font-mono text-xs text-(text-muted)">
                        {count}x
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-(bg-color) border border-(border-color)">
                      <div
                        className="h-full bg-(accent) transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
