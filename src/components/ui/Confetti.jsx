/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

/**
 * Generate particles once with all random values pre-computed
 */
const generateParticles = (count = 50) => {
  const colors = [
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    size: Math.random() * 8 + 4,
    shape: Math.random() > 0.5 ? "circle" : "square",
    duration: 2 + Math.random(),
  }));
};

/**
 * Confetti Animation - Celebration effect
 */
export const Confetti = ({ trigger, duration = 2500 }) => {
  const [isActive, setIsActive] = useState(false);
  const prevTriggerRef = useRef(trigger);

  // Pre-generate particles
  const particles = useMemo(() => generateParticles(50), []);

  useEffect(() => {
    // Only trigger when value changes from false to true
    if (trigger && !prevTriggerRef.current) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), duration);
      return () => clearTimeout(timer);
    }
    prevTriggerRef.current = trigger;
  }, [trigger, duration]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: -20,
              rotate: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              y: "110vh",
              rotate: particle.rotation + 720,
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            style={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: particle.shape === "circle" ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Celebration Emoji Burst
 */
export const EmojiBurst = ({ trigger, emoji = "🎉" }) => {
  const [isActive, setIsActive] = useState(false);
  const prevTriggerRef = useRef(trigger);

  useEffect(() => {
    // Only trigger when value changes from false to true
    if (trigger && !prevTriggerRef.current) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 1000);
      return () => clearTimeout(timer);
    }
    prevTriggerRef.current = trigger;
  }, [trigger]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <span className="text-6xl">{emoji}</span>
    </motion.div>
  );
};
