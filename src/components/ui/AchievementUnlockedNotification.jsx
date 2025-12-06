import { Trophy } from 'lucide-react';
import { achievementList } from '../../store/useAchievementStore';

export const AchievementUnlockedNotification = ({ achievementId }) => {
  const achievement = achievementList[achievementId];
  
  if (!achievement) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60 pointer-events-none">
      <div className="bg-(--card-color) border-2 border-(--accent) p-6 min-w-[400px] shadow-2xl fade-slide-up">
        <div className="text-center space-y-4">
          {/* Trophy Icon */}
          <div className="flex justify-center">
            <Trophy size={48} className="text-(accent) glow-pulse" />
          </div>
          
          {/* Achievement Title */}
          <div className="space-y-2">
            <div className="text-5xl mb-2">{achievement.emoji}</div>
            <h3 className="font-serif text-2xl text-(text-main) italic">
              Achievement Unlocked!
            </h3>
            <h4 className="font-mono text-lg text-(accent)">
              {achievement.title}
            </h4>
            <p className="font-mono text-xs text-(text-muted)">
              {achievement.description}
            </p>
          </div>
          
          {/* XP Reward */}
          <div className="pt-4 border-t border-dashed border-(border-color)">
            <p className="font-mono text-sm text-(accent)">
              +{achievement.xp} XP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

