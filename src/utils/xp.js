// XP progression helpers
// Levels 1-5: 100 XP each, then +20 XP cost per level starting level 6

export const getXpNeededForLevel = (level) => {
  if (level <= 1) return 0;
  if (level <= 5) return 100;
  return 100 + (level - 5) * 20;
};

export const getTotalXpForLevel = (level) => {
  if (level <= 1) return 0;
  let total = 0;
  for (let lvl = 2; lvl <= level; lvl += 1) {
    total += getXpNeededForLevel(lvl);
  }
  return total;
};

export const getLevelFromXp = (xpTotal = 0) => {
  let level = 1;
  let remaining = Math.max(0, xpTotal);

  while (true) {
    const xpForNext = getXpNeededForLevel(level + 1);
    if (remaining >= xpForNext) {
      remaining -= xpForNext;
      level += 1;
    } else {
      break;
    }
  }

  const levelStart = getTotalXpForLevel(level);
  const xpForLevel = getXpNeededForLevel(level + 1);
  const xpIntoLevel = remaining;
  const xpToNextLevel = Math.max(xpForLevel - xpIntoLevel, 0);

  return {
    level,
    levelStart,
    xpForLevel,
    xpIntoLevel,
    xpToNextLevel,
    levelEnd: levelStart + xpForLevel,
  };
};

export const getXpRangeForLevel = (level) => {
  const start = getTotalXpForLevel(level);
  const end = start + getXpNeededForLevel(level + 1);
  return { start, end };
};

export const getProgressWithinLevel = (xpTotal = 0) => {
  const { xpForLevel, xpIntoLevel } = getLevelFromXp(xpTotal);
  if (xpForLevel === 0) return 1;
  return Math.min(Math.max(xpIntoLevel / xpForLevel, 0), 1);
};

// Garden stage thresholds with smoother steps
export const GARDEN_XP_STAGES = [
  { id: "seed", minXp: 0, name: "benih" },
  { id: "sprout", minXp: 100, name: "tunas" },
  { id: "sapling", minXp: 200, name: "pohon kecil" },
  { id: "flower", minXp: 300, name: "bunga" },
  { id: "forest", minXp: 500, name: "hutan" },
];

export const getGardenStageByXp = (xpTotal = 0) => {
  const stage =
    [...GARDEN_XP_STAGES].reverse().find((s) => xpTotal >= s.minXp) ||
    GARDEN_XP_STAGES[0];
  return stage.id;
};
