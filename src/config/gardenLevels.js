import {
  Sprout,
  Leaf,
  TreeDeciduous,
  TreePalm,
  Flower2,
  BeanOff,
  Clover,
} from "lucide-react";

export const GARDEN_STAGES = [
  {
    id: "seed",
    minLevel: 1,
    name: "Benih Harapan",
    description: "Awal dari segalanya. Sirami dengan produktivitas.",
    icon: BeanOff,
    color: "text-amber-700", // Tanah/Benih
    bgGradient: "from-amber-100 to-stone-200",
    scale: 0.8,
  },
  {
    id: "sprout",
    minLevel: 4,
    name: "Tunas Muda",
    description: "Mulai terlihat kehidupan. Teruslah konsisten.",
    icon: Sprout,
    color: "text-lime-500",
    bgGradient: "from-lime-100 to-emerald-100",
    scale: 1,
  },
  {
    id: "slapping",
    minLevel: 8,
    name: "Tanaman Kecil",
    description: "Akar mulai kuat. Kebiasaan mulai terbentuk.",
    icon: Leaf,
    color: "text-green-600",
    bgGradient: "from-green-100 to-teal-100",
    scale: 1.1,
  },
  {
    id: "blooming",
    minLevel: 12,
    name: "Mulai Berbunga",
    description: "Indah dipandang. Hasil kerja kerasmu.",
    icon: Flower2,
    color: "text-pink-500",
    bgGradient: "from-pink-100 to-rose-100",
    scale: 1.2,
  },
  {
    id: "tree",
    minLevel: 16,
    name: "Pohon Rindang",
    description: "Memberi teduh bagi sekitar. Digital Sanctuary sejati.",
    icon: TreeDeciduous,
    color: "text-emerald-700",
    bgGradient: "from-emerald-100 to-green-200",
    scale: 1.3,
  },
  {
    id: "forest",
    minLevel: 25,
    name: "Hutan Abadi",
    description: "Legenda produktivitas. Kamu telah mencapai Zen.",
    icon: TreePalm, // Using Palm/Tree combo metaphor
    color: "text-teal-800",
    bgGradient: "from-teal-100 to-cyan-200",
    scale: 1.4,
  },
];

export const getGardenStage = (level) => {
  // Reverse sort to find the highest matching stage
  return (
    GARDEN_STAGES.slice()
      .reverse()
      .find((s) => level >= s.minLevel) || GARDEN_STAGES[0]
  );
};

export const getNextStage = (level) => {
  return GARDEN_STAGES.find((s) => s.minLevel > level) || null;
};
