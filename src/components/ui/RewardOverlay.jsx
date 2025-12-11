/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBadgeStore } from "../../store/useBadgeStore";
import { useCelebrationStore } from "../../store/useCelebrationStore";
import { BadgeCard } from "../widgets/BadgeCard";
import { Button } from "../ui/Button";
import { Share2, X } from "lucide-react";

/**
 * RewardOverlay - Displays unlocked achievements/badges
 * Listens to pendingBadges in badge store
 */
export const RewardOverlay = () => {
  const { popPendingBadge, pendingBadges } = useBadgeStore();
  const { celebrate } = useCelebrationStore();

  // Local state to display one badge at a time
  const [currentBadge, setCurrentBadge] = useState(null);

  // Check for pending badges
  useEffect(() => {
    // If we're not currently showing a badge and there are pending ones
    if (!currentBadge && pendingBadges.length > 0) {
      const nextBadge = useBadgeStore.getState().popPendingBadge();
      if (nextBadge) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentBadge(nextBadge);
        celebrate("full", nextBadge.emoji);
      }
    }
  }, [pendingBadges.length, currentBadge, popPendingBadge, celebrate]);

  const handleClose = () => {
    setCurrentBadge(null);
    // The effect will trigger again if there are more badges
  };

  return (
    <AnimatePresence>
      {currentBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                delay: 0.1,
              },
            }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            className="w-full max-w-sm"
          >
            <div className="relative bg-[#f8f3e8] dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-(--accent)">
              {/* Shine effect background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/10 to-transparent rotate-45 animate-pulse" />
              </div>

              <div className="relative p-6 text-center space-y-6">
                <div className="space-y-2">
                  <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
                    className="font-mono text-xs uppercase tracking-widest text-(--accent)"
                  >
                    Pencapaian Baru Terbuka!
                  </motion.p>

                  <motion.h2
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: { delay: 0.4 },
                    }}
                    className="font-serif text-2xl text-(--text-main)"
                  >
                    {currentBadge.title}
                  </motion.h2>
                </div>

                <motion.div
                  initial={{ rotate: -10, scale: 0.5, opacity: 0 }}
                  animate={{
                    rotate: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      delay: 0.5,
                    },
                  }}
                  className="flex justify-center py-4"
                >
                  <div className="scale-125 transform">
                    <BadgeCard badge={currentBadge} />
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.7 } }}
                  className="font-serif italic text-(--text-muted)"
                >
                  "{currentBadge.description}"
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }}
                  className="flex gap-3 pt-2"
                >
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // TODO: Implement share
                      alert("Fitur share akan segera hadir!");
                    }}
                  >
                    <Share2 size={16} className="mr-2" />
                    Pamer
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleClose}
                  >
                    Lanjut
                  </Button>
                </motion.div>
              </div>

              {/* Close button top right */}
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 p-2 text-(--text-muted) hover:text-(--text-main) hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
