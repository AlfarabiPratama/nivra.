// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useThemeStore } from "../../store/useThemeStore";
import { useEffect } from "react";

export const MonkModeOverlay = ({ children }) => {
  const { isMonkMode, disableMonkMode } = useAppStore();
  const { isDarkMode } = useThemeStore();

  // Listen for Esc key to exit Monk Mode
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMonkMode) {
        disableMonkMode();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMonkMode, disableMonkMode]);

  return (
    <AnimatePresence>
      {isMonkMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`fixed inset-0 z-100 flex items-center justify-center ${
            isDarkMode ? "bg-warm-charcoal" : "bg-old-paper"
          }`}
        >
          {/* Noise Overlay */}
          <div
            className={isDarkMode ? "bg-noise-dark" : "bg-noise-light"}
          ></div>

          {/* Exit Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={disableMonkMode}
            className="absolute top-4 right-4 z-10 p-2 border border-(--text-muted) text-(--text-muted) hover:text-(--text-main) hover:border-(--text-main) transition-all duration-500"
            title="Exit Monk Mode (Esc)"
          >
            <X size={20} />
          </motion.button>

          {/* Hint Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 font-mono text-xs text-(--text-muted) tracking-widest"
          >
            [ MONK MODE ACTIVE • PRESS ESC TO EXIT ]
          </motion.p>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 w-full h-full max-w-7xl mx-auto p-4 overflow-auto"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
