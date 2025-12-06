import { useEffect, useState } from 'react';
import { Sprout } from 'lucide-react';

export const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--bg-color) transition-opacity duration-500">
      <div className="text-center space-y-6 animate-slow-fade">
        <div className="flex justify-center">
          <Sprout 
            size={120} 
            className="text-(--accent) animate-pulse"
            strokeWidth={1.5}
          />
        </div>
        <div className="font-display text-4xl font-light text-(--text-main) tracking-wider">
          nivra
        </div>
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};
