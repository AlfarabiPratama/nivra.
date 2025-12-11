import { useRef, useEffect } from "react";

/**
 * AudioVisualizer - Simulates a gentle waveform animation
 * Used for Soundscapes to provide visual feedback
 */
export const AudioVisualizer = ({ isPlaying, color = "var(--accent)" }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let time = 0;

    // Set canvas size
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!isPlaying) {
        // Fade out effect
        ctx.fillStyle =
          getComputedStyle(document.documentElement).getPropertyValue(
            "--bg-color"
          ) || "#ffffff";
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
        return;
      }

      time += 0.05;

      // Clear canvas with slight trail effect for smoothness
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.lineWidth = 2;

      // Determine stroke color (prefer CSS var, fallback to prop)
      const accent =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--accent"
        ) || color;
      ctx.strokeStyle = accent || "#4ade80";

      // Draw 3 sine waves with different frequencies/phases
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y =
            centerY +
            Math.sin(x * 0.01 + time + i) * 10 * Math.sin(time * 0.5) + // Primary wave
            Math.sin(x * 0.02 - time) * 5; // Secondary turbulence

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = 1 - i * 0.3; // Fade out secondary waves
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animate();
    } else {
      // Clear when stopped
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
    />
  );
};
