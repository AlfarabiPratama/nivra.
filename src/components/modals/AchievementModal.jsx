import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Trophy, Lock } from 'lucide-react';
import { achievementList, useAchievementStore } from '../../store/useAchievementStore';
import clsx from 'clsx';

export const AchievementModal = ({ isOpen, onClose, unlockedAchievements = [], stats = {} }) => {
  if (!isOpen) return null;

  const categories = ['reading', 'tasks', 'journal', 'level', 'special'];
  
  const achievementsByCategory = categories.map(category => ({
    category,
    achievements: Object.values(achievementList)
      .filter(a => a.category === category)
      .map(a => ({
        ...a,
        unlocked: unlockedAchievements.includes(a.id)
      }))
  }));

  const totalAchievements = Object.keys(achievementList).length;
  const unlockedCount = unlockedAchievements.length;
  const progress = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <div className="fixed inset-0 bg-(bg-color)/95 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto page-enter">
        <Card>
          <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy size={24} className="text-(accent)" />
                <h2 className="text-2xl font-serif italic text-(text-main)">
                  achievements
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-(text-muted) hover:text-(text-main) transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-(text-muted) uppercase">
                  Progress
                </span>
                <span className="font-mono text-xs text-(accent)">
                  {unlockedCount} / {totalAchievements}
                </span>
              </div>
              <div className="w-full h-2 bg-(bg-color) border border-(border-color)">
                <div 
                  className="h-full bg-(accent) transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Achievements by Category */}
            <div className="space-y-6">
              {achievementsByCategory.map(({ category, achievements }) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-(text-muted)">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map(achievement => {
                      const progress = !achievement.unlocked && stats 
                        ? useAchievementStore.getState().getAchievementProgress(achievement.id, stats)
                        : null;
                      
                      return (
                        <div
                          key={achievement.id}
                          className={clsx(
                            'p-4 border transition-all duration-300',
                            achievement.unlocked
                              ? 'border-(accent) bg-(accent)/5 hover-scale'
                              : 'border-(border-color) opacity-50'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">
                              {achievement.unlocked ? achievement.emoji : <Lock size={24} className="text-(text-muted)" />}
                            </div>
                            <div className="flex-1 space-y-1">
                              <h4 className="font-mono text-sm text-(text-main)">
                                {achievement.title}
                              </h4>
                              <p className="font-mono text-xs text-(text-muted)">
                                {achievement.description}
                              </p>
                              
                              {/* Progress Bar for Locked Achievements */}
                              {!achievement.unlocked && progress && progress.target > 0 && (
                                <div className="space-y-1 pt-1">
                                  <div className="flex justify-between items-center">
                                    <span className="font-mono text-xs text-(text-muted)">
                                      {progress.current} / {progress.target}
                                    </span>
                                    <span className="font-mono text-xs text-(accent)">
                                      {progress.percentage}%
                                    </span>
                                  </div>
                                  <div className="h-1 bg-(bg-color) border border-dashed border-(border-color)">
                                    <div 
                                      className="h-full bg-(accent) transition-all duration-500"
                                      style={{ width: `${progress.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              <div className="font-mono text-xs text-(accent)">
                                +{achievement.xp} xp
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <Button variant="accent" onClick={onClose} className="w-full">
              tutup
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

