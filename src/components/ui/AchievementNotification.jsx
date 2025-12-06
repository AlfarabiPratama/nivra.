import { useEffect, useState } from 'react';
import { achievementList, useAchievementStore } from '../../store/useAchievementStore';
import { Award, Sparkles } from 'lucide-react';

export const AchievementNotification = () => {
  const newAchievements = useAchievementStore((state) => state.newlyUnlocked || []);
  const [shownCount, setShownCount] = useState(0);

  // Auto-advance to next achievement
  useEffect(() => {
    if (shownCount >= newAchievements.length) {
      return;
    }

    const timer = setTimeout(() => {
      setShownCount(prev => prev + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [shownCount, newAchievements.length]);

  if (newAchievements.length === 0 || shownCount >= newAchievements.length) return null;

  const currentIndex = shownCount % newAchievements.length;

  const currentAchievement = newAchievements[currentIndex];

  const achievement = achievementList[currentAchievement];
  if (!achievement) return null;

  return (
    <div className="fixed z-50 transform -translate-x-1/2 pointer-events-none bottom-6 left-1/2">
      <div className="pointer-events-auto bg-[var(--card-color)] border-2 border-[var(--accent)] p-6 min-w-[400px] shadow-2xl fade-slide-up">
        <div className="flex items-center gap-4">
          {/* Achievement Icon */}
          <div className="relative">
            <div className="text-5xl animate-bounce">
              {achievement.emoji}
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles size={20} className="text-[var(--accent)] animate-spin-slow" />
            </div>
          </div>

          {/* Achievement Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[var(--accent)]" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                Pencapaian Terbuka!
              </h3>
            </div>
            
            <h4 className="text-xl font-serif italic text-[var(--text-main)]">
              {achievement.title}
            </h4>
            
            <p className="font-mono text-xs text-[var(--text-muted)]">
              {achievement.description}
            </p>
            
            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 border border-[var(--accent)] font-mono text-xs text-[var(--accent)]">
                +{achievement.xp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Decorative sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-2 text-[var(--accent)] opacity-50 glow-pulse">✨</div>
          <div className="absolute bottom-2 right-2 text-[var(--accent)] opacity-50 glow-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute top-1/2 right-4 text-[var(--accent)] opacity-30 glow-pulse" style={{ animationDelay: '1s' }}>⭐</div>
        </div>
      </div>
    </div>
  );
};
