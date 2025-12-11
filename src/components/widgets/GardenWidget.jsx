/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { getGardenStage, getNextStage } from "../../config/gardenLevels";
import { getProgressWithinLevel } from "../../utils/xp";
import { Card } from "../ui/Card";
import { Droplets, Sun, Wind } from "lucide-react";
import clsx from "clsx";
import { useAudioStore } from "../../store/useAudioStore";

export const GardenWidget = () => {
  const { user } = useAppStore();
  const { playSound } = useAudioStore();
  const [isWatering, setIsWatering] = useState(false);

  const currentStage = getGardenStage(user.level);
  const nextStage = getNextStage(user.level);
  const levelProgress = Math.round(getProgressWithinLevel(user.xp) * 100);

  const handleWater = () => {
    setIsWatering(true);
    playSound("water"); // Assuming sound exists, otherwise silent fallback
    setTimeout(() => setIsWatering(false), 2000);
  };

  // Icon Component
  const PlantIcon = currentStage.icon;

  return (
    <Card className="relative overflow-hidden min-h-[280px] flex flex-col items-center justify-center text-center p-6 gradient-bg">
      {/* Dynamic Background */}
      <div
        className={clsx(
          "absolute inset-0 opacity-30 bg-linear-to-br transition-colors duration-1000",
          currentStage.bgGradient
        )}
      />

      {/* Ambient Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-4 right-4 text-amber-400 opacity-20"
      >
        <Sun size={40} />
      </motion.div>

      {/* Plant Container */}
      <div className="relative z-10 my-4 cursor-pointer" onClick={handleWater}>
        {/* Growth Aura */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className={clsx(
            "absolute inset-0 rounded-full blur-xl",
            currentStage.color.replace("text-", "bg-")
          )}
        />

        {/* The Plant */}
        <motion.div
          animate={
            isWatering
              ? {
                  scale: [1, 1.1, 1, 1.1, 1],
                  rotate: [0, -5, 5, -5, 0],
                }
              : {
                  y: [0, -5, 0],
                }
          }
          transition={
            isWatering
              ? { duration: 2 }
              : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <PlantIcon
            size={80}
            strokeWidth={1.5}
            className={clsx(
              "transition-colors duration-500 drop-shadow-lg",
              currentStage.color
            )}
          />
        </motion.div>

        {/* Water Drops Animation */}
        <AnimatePresence>
          {isWatering && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-blue-400"
            >
              <Droplets size={24} className="animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="relative z-10 space-y-2 max-w-xs mx-auto">
        <div>
          <h3 className="font-serif text-lg text-(--text-main)">
            {currentStage.name}
          </h3>
          <p className="font-mono text-xs text-(--text-muted) italic">
            "{currentStage.description}"
          </p>
        </div>

        {/* Progress Bar resembling soil/roots */}
        <div className="pt-4 w-full">
          <div className="flex justify-between text-[10px] font-mono mb-1 text-(--text-muted)">
            <span>Lvl {user.level}</span>
            <span>
              {nextStage
                ? `Next: ${nextStage.name} (Lvl ${nextStage.minLevel})`
                : "Max Level"}
            </span>
          </div>
          <div className="h-3 bg-(--border-color)/30 rounded-full overflow-hidden border border-(--border-color)/50 relative">
            {/* Gradient Progress */}
            <motion.div
              className="h-full bg-linear-to-r from-emerald-400 to-lime-400"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1 }}
            />

            {/* Particles in progress bar? Maybe expensive. Keep it simple. */}
          </div>
          <p className="text-[10px] font-mono text-right mt-1 text-(--text-muted)">
            {user.xp} XP Total
          </p>
        </div>
      </div>

      {/* Interactive Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        className="absolute bottom-2 text-[10px] font-mono text-(--text-muted) cursor-help"
      >
        *klik tanaman untuk menyiram
      </motion.p>
    </Card>
  );
};
