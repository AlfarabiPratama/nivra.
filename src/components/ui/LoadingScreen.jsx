// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useThemeStore } from "../../store/useThemeStore";

export const LoadingScreen = ({ onComplete }) => {
  const { isDarkMode } = useThemeStore();
  const [dots, setDots] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  // Typewriter effect for dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
        isDarkMode
          ? "bg-warm-charcoal text-ivory-white"
          : "bg-old-paper text-faded-ink"
      }`}
    >
      {/* Noise Overlay */}
      <div className={isDarkMode ? "bg-noise-dark" : "bg-noise-light"}></div>

      <div className="relative z-10 flex flex-col items-center">
        <img
          src={isDarkMode ? "/dark mode nivra.png" : "/nivra light mode .png"}
          alt="Nivra"
          className="w-24 md:w-32 h-auto mb-6 opacity-80"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xl tracking-widest mb-6"
        >
          <span className="opacity-70">LOADING</span>
          <span>{dots}</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-1 inline-block w-2.5 h-4 bg-current align-middle"
          />
        </motion.div>

        <p className="font-serif italic text-sm opacity-60">
          "Patience is a form of wisdom."
        </p>
      </div>
    </div>
  );
};
