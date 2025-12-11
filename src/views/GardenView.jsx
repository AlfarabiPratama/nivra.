import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { AnimatedPage } from "../components/ui/AnimatedPage";
import { useAppStore } from "../store/useAppStore";
import { useTaskStore } from "../store/useTaskStore";
import { useBookStore } from "../store/useBookStore";
import { useJournalStore } from "../store/useJournalStore";
import {
  GARDEN_XP_STAGES,
  getGardenStageByXp,
  getLevelFromXp,
} from "../utils/xp";
import {
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
  PenTool,
  Cloud,
  CloudRain,
  Sun,
  Snowflake,
} from "lucide-react";
import clsx from "clsx";

const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
};

const weatherTypes = ["sunny", "cloudy", "rainy", "snowy"];

const STAGE_META = {
  seed: {
    name: "benih",
    description: "awal perjalananmu. setiap langkah kecil berarti.",
    emoji: "🌱",
  },
  sprout: {
    name: "tunas",
    description: "kamu mulai tumbuh. konsistensi adalah kunci.",
    emoji: "🌿",
  },
  sapling: {
    name: "pohon kecil",
    description: "akar mulai kuat, tumbuh perlahan tapi pasti.",
    emoji: "🌲",
  },
  flower: {
    name: "bunga",
    description: "produktivitasmu mekar indah. terus berkembang.",
    emoji: "🌸",
  },
  forest: {
    name: "hutan",
    description: "ekosistem produktivitasmu sudah mapan.",
    emoji: "🌳",
  },
};

export const GardenView = () => {
  const { user } = useAppStore();
  const { tasks } = useTaskStore();
  const { books } = useBookStore();
  const { entries } = useJournalStore();

  const [season] = useState(getCurrentSeason());
  const [weather, setWeather] = useState("sunny");

  useEffect(() => {
    const interval = setInterval(() => {
      const randomWeather =
        weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      setWeather(randomWeather);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const sortedStages = [...GARDEN_XP_STAGES].sort(
    (a, b) => a.minXp - b.minXp
  );
  const currentStageId = getGardenStageByXp(user.xp);
  const currentStageIndex = sortedStages.findIndex(
    (stage) => stage.id === currentStageId
  );
  const currentStage = sortedStages[currentStageIndex] || sortedStages[0];
  const nextStage = sortedStages[currentStageIndex + 1] || null;

  const stageProgress = nextStage
    ? Math.min(
        Math.max(
          ((user.xp - currentStage.minXp) /
            (nextStage.minXp - currentStage.minXp)) *
            100,
          0
        ),
        100
      )
    : 100;
  const stageXpToNext = nextStage
    ? Math.max(nextStage.minXp - user.xp, 0)
    : 0;

  const levelInfo = getLevelFromXp(user.xp);
  const xpProgress = Math.round(
    (levelInfo.xpIntoLevel / levelInfo.xpForLevel) * 100
  );

  const taskList = tasks || [];
  const bookList = books || [];
  const entryList = entries || [];

  const completedTasks = taskList.filter((t) => t.completed).length;
  const finishedBooks = bookList.filter((b) => b.status === "finished").length;
  const journalEntries = entryList.length;

  const stats = [
    { icon: Target, label: "tugas selesai", value: completedTasks },
    { icon: BookOpen, label: "buku dibaca", value: finishedBooks },
    { icon: PenTool, label: "entri jurnal", value: journalEntries },
  ];

  const weatherConfig = {
    sunny: {
      icon: Sun,
      color: "text-yellow-500",
      bg: "from-amber-50 to-yellow-50",
    },
    cloudy: {
      icon: Cloud,
      color: "text-gray-500",
      bg: "from-gray-100 to-gray-200",
    },
    rainy: {
      icon: CloudRain,
      color: "text-blue-500",
      bg: "from-blue-100 to-blue-200",
    },
    snowy: {
      icon: Snowflake,
      color: "text-blue-300",
      bg: "from-blue-50 to-white",
    },
  };

  const stageName = STAGE_META[currentStage.id]?.name || currentStage.id;
  const stageDescription =
    STAGE_META[currentStage.id]?.description || "bertumbuh setiap hari.";
  const stageEmoji = STAGE_META[currentStage.id]?.emoji || "🌱";
  const nextStageName = nextStage ? STAGE_META[nextStage.id]?.name : null;

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-5xl mx-auto">
        <div>
          <h2 className="text-4xl font-serif italic text-(--text-main) mb-2">
            taman zen.
          </h2>
          <p className="font-mono text-xs text-(--text-muted) lowercase">
            pertumbuhan organik, satu hari pada satu waktu.
          </p>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-(--text-muted)">
                Season
              </span>
              <span className="font-mono text-sm text-(--text-main)">
                {season}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {React.createElement(weatherConfig[weather].icon, {
                size: 18,
                className: clsx("transition-colors", weatherConfig[weather].color),
              })}
              <span className="font-mono text-xs text-(--text-muted)">
                {weather}
              </span>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div
            className={clsx(
              "absolute inset-0 opacity-20 bg-linear-to-br pointer-events-none",
              weatherConfig[weather].bg
            )}
          />
          <div className="relative text-center space-y-6 py-8">
            <div className="text-7xl md:text-8xl">{stageEmoji}</div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif italic text-(--text-main)">
                {stageName}
              </h3>
              <p className="font-mono text-sm text-(--text-muted) max-w-md mx-auto">
                {stageDescription}
              </p>
              {nextStageName && (
                <p className="font-mono text-xs text-(--text-muted)">
                  {stageXpToNext} xp lagi menuju {nextStageName}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
              <div className="border border-dashed border-(--border-color) p-4 rounded-sm bg-(--bg-color)/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-(--text-muted)">
                    Progress level
                  </span>
                  <span className="font-mono text-xs text-(--accent)">
                    {levelInfo.levelStart + levelInfo.xpIntoLevel} /{" "}
                    {levelInfo.levelEnd} xp
                  </span>
                </div>
                <div className="h-2 bg-(--bg-color) border border-(--border-color)">
                  <div
                    className="h-full bg-(--accent) transition-all duration-700"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] text-(--text-muted) mt-2">
                  {levelInfo.xpToNextLevel} xp lagi ke level {user.level + 1}
                </p>
              </div>

              <div className="border border-dashed border-(--border-color) p-4 rounded-sm bg-(--bg-color)/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-(--text-muted)">
                    Growth stage
                  </span>
                  <span className="font-mono text-xs text-(--accent)">
                    {stageProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-(--bg-color) border border-(--border-color)">
                  <div
                    className="h-full bg-(--accent) transition-all duration-700"
                    style={{ width: `${stageProgress}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] text-(--text-muted) mt-2">
                  {nextStage
                    ? `${stageXpToNext} xp lagi ke ${nextStageName}`
                    : "tahap tertinggi tercapai"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className={clsx("card-enter", `stagger-${index + 1}`)}
              >
                <div className="text-center space-y-2">
                  <Icon size={22} className="mx-auto text-(--accent)" />
                  <div className="font-mono text-2xl text-(--text-main)">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs text-(--text-muted) uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <div className="space-y-3">
            <h3 className="font-mono text-sm uppercase tracking-widest text-(--text-main)">
              perjalanan pertumbuhan
            </h3>
            <div className="space-y-2">
              {sortedStages.map((stage) => {
                const isCompleted = user.xp >= stage.minXp;
                const isCurrent = stage.id === currentStage.id;
                const meta = STAGE_META[stage.id] || { name: stage.id };
                return (
                  <div
                    key={stage.id}
                    className={clsx(
                      "flex items-center gap-3 p-3 border rounded-sm transition-all",
                      isCurrent
                        ? "border-(--accent) bg-(--accent)/5"
                        : "border-(--border-color)",
                      !isCompleted && "opacity-70"
                    )}
                  >
                    <span className="text-2xl">{meta.emoji}</span>
                    <div className="flex-1">
                      <div className="font-mono text-sm text-(--text-main)">
                        {meta.name}
                      </div>
                      <div className="font-mono text-[11px] text-(--text-muted)">
                        mulai {stage.minXp} xp
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="text-(--accent)">
                        {isCurrent ? <TrendingUp size={16} /> : "✓"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center py-6 space-y-3">
            <p className="font-serif italic text-lg text-(--text-main)">
              "pertumbuhan sejati tidak terlihat, tapi dirasakan dalam setiap
              langkah kecil."
            </p>
            <div className="font-mono text-xs text-(--text-muted)">
              level {user.level} - {user.xp} xp total
            </div>
            {nextStageName && (
              <div className="font-mono text-xs text-(--text-muted)">
                {stageXpToNext} xp lagi ke tahap {nextStageName}
              </div>
            )}
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};
