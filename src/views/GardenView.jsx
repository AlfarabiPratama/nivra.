import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { AnimatedPage } from '../components/ui/AnimatedPage';
import { useAppStore } from '../store/useAppStore';
import { useTaskStore } from '../store/useTaskStore';
import { useBookStore } from '../store/useBookStore';
import { useJournalStore } from '../store/useJournalStore';
import { Sparkles, TrendingUp, Target, BookOpen, PenTool, Cloud, CloudRain, Sun, Snowflake } from 'lucide-react';
import clsx from 'clsx';

// Get current season based on month
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

// Weather system
const weatherTypes = ['sunny', 'cloudy', 'rainy', 'snowy'];

export const GardenView = () => {
  const { user } = useAppStore();
  const { tasks } = useTaskStore();
  const { books } = useBookStore();
  const { entries } = useJournalStore();
  const [season] = useState(getCurrentSeason());
  const [weather, setWeather] = useState('sunny');

  // Seasonal plant variations
  const seasonalPlants = {
    spring: {
      seed: { emoji: '🌱', companions: ['🌷', '🌼', '🦋'] },
      sprout: { emoji: '🌿', companions: ['🌸', '🌺', '🐝'] },
      flower: { emoji: '🌸', companions: ['🌹', '🌻', '🦋'] },
      forest: { emoji: '🌳', companions: ['🌲', '🌾', '🐦'] },
    },
    summer: {
      seed: { emoji: '🌱', companions: ['☀️', '🌻', '🦗'] },
      sprout: { emoji: '🌿', companions: ['🌻', '🌺', '🐞'] },
      flower: { emoji: '🌺', companions: ['🌻', '🌹', '🦋'] },
      forest: { emoji: '🌳', companions: ['🌴', '🍃', '🐦'] },
    },
    fall: {
      seed: { emoji: '🌱', companions: ['🍂', '🍁', '🦔'] },
      sprout: { emoji: '🌿', companions: ['🍂', '🌾', '🦉'] },
      flower: { emoji: '🌸', companions: ['🍄', '🍂', '🦔'] },
      forest: { emoji: '🌳', companions: ['🍁', '🍂', '🦌'] },
    },
    winter: {
      seed: { emoji: '🌱', companions: ['❄️', '⛄', '🐧'] },
      sprout: { emoji: '🌿', companions: ['❄️', '🌲', '🦌'] },
      flower: { emoji: '🌸', companions: ['❄️', '🌲', '⛄'] },
      forest: { emoji: '🌲', companions: ['🌲', '❄️', '🦌'] },
    },
  };

  const weatherConfig = {
    sunny: { icon: Sun, color: 'text-yellow-500', bg: 'from-blue-50 to-yellow-50' },
    cloudy: { icon: Cloud, color: 'text-gray-500', bg: 'from-gray-100 to-gray-200' },
    rainy: { icon: CloudRain, color: 'text-blue-500', bg: 'from-blue-100 to-blue-200' },
    snowy: { icon: Snowflake, color: 'text-blue-300', bg: 'from-blue-50 to-white' },
  };

  const stageInfo = {
    seed: {
      emoji: seasonalPlants[season].seed.emoji,
      companions: seasonalPlants[season].seed.companions,
      name: 'benih',
      description: 'awal perjalananmu. setiap langkah kecil berarti.',
      minXP: 0,
      nextStage: 'sprout',
      nextXP: 100,
      color: '#8da399',
    },
    sprout: {
      emoji: seasonalPlants[season].sprout.emoji,
      companions: seasonalPlants[season].sprout.companions,
      name: 'tunas',
      description: 'kamu mulai tumbuh. konsistensi adalah kunci.',
      minXP: 100,
      nextStage: 'flower',
      nextXP: 250,
      color: '#7f9e96',
    },
    flower: {
      emoji: seasonalPlants[season].flower.emoji,
      companions: seasonalPlants[season].flower.companions,
      name: 'bunga',
      description: 'produktivitasmu mekar indah. terus berkembang.',
      minXP: 250,
      nextStage: 'forest',
      nextXP: 500,
      color: '#c9ada7',
    },
    forest: {
      emoji: seasonalPlants[season].forest.emoji,
      companions: seasonalPlants[season].forest.companions,
      name: 'hutan',
      description: 'kamu telah menjadi ekosistem produktivitas.',
      minXP: 500,
      nextStage: null,
      nextXP: null,
      color: '#5c7c74',
    },
  };

  // Random weather changes
  useEffect(() => {
    const interval = setInterval(() => {
      const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      setWeather(randomWeather);
    }, 30000); // Change every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentStage = stageInfo[user.gardenStage];
  const completedTasks = tasks.filter(t => t.completed).length;
  const finishedBooks = books.filter(b => b.status === 'finished').length;
  const journalEntries = entries.length;

  const stats = [
    { icon: Target, label: 'tugas selesai', value: completedTasks, color: 'var(--accent)' },
    { icon: BookOpen, label: 'buku dibaca', value: finishedBooks, color: 'var(--accent)' },
    { icon: PenTool, label: 'entri jurnal', value: journalEntries, color: 'var(--accent)' },
  ];

  const progressToNext = currentStage.nextXP 
    ? ((user.xp - currentStage.minXP) / (currentStage.nextXP - currentStage.minXP)) * 100
    : 100;

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="text-4xl font-serif italic text-[var(--text-main)] mb-2">
            taman zen.
          </h2>
          <p className="font-mono text-xs text-[var(--text-muted)] lowercase">
            pertumbuhan organik, satu hari pada satu waktu.
          </p>
        </div>

        {/* Season & Weather Indicator */}
        <Card variant="dashed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[var(--text-muted)] uppercase">Season:</span>
              <span className="font-mono text-sm text-[var(--text-main)]">{season}</span>
            </div>
            <div className="flex items-center gap-2">
              {React.createElement(weatherConfig[weather].icon, { 
                size: 20, 
                className: clsx('transition-colors duration-500', weatherConfig[weather].color) 
              })}
              <span className="font-mono text-xs text-[var(--text-muted)]">{weather}</span>
            </div>
          </div>
        </Card>

        {/* Main Garden Display */}
        <Card className={`season-${season}`}>
          <div className="text-center space-y-6 py-8 relative overflow-hidden">
            {/* Weather Effects Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              {weather === 'rainy' && (
                <div className="absolute inset-0 rain-effect" />
              )}
              {weather === 'snowy' && (
                <div className="absolute inset-0 snow-effect" />
              )}
            </div>

            {/* Garden Stage Visual */}
            <div className="relative">
              <div className="text-8xl mb-4 animate-slow-fade">
                {currentStage.emoji}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border border-dashed border-[var(--border-color)] rounded-full opacity-20" />
              </div>
            </div>

            {/* Stage Info */}
            <div className="space-y-2">
              <h3 className="text-2xl font-serif italic text-[var(--text-main)]">
                {currentStage.name}
              </h3>
              <p className="font-mono text-sm text-[var(--text-muted)] max-w-md mx-auto">
                {currentStage.description}
              </p>
            </div>

            {/* Level & XP */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="font-mono text-3xl text-[var(--accent)]">
                  {user.level}
                </div>
                <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">
                  level
                </div>
              </div>
              
              <div className="w-px h-12 bg-[var(--border-color)]" />
              
              <div className="text-center">
                <div className="font-mono text-3xl text-[var(--accent)]">
                  {user.xp}
                </div>
                <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">
                  total xp
                </div>
              </div>
            </div>

            {/* Progress to Next Stage */}
            {currentStage.nextStage && (
              <div className="pt-6 border-t border-dashed border-[var(--border-color)] max-w-md mx-auto">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      menuju {currentStage.nextStage}
                    </span>
                    <span className="font-mono text-xs text-[var(--accent)]">
                      {user.xp} / {currentStage.nextXP} xp
                    </span>
                  </div>
                  
                  <div className="h-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                    <div 
                      className="h-full bg-[var(--accent)] transition-all duration-1000"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Achievement Unlocked */}
            {!currentStage.nextStage && (
              <div className="pt-6 border-t border-dashed border-[var(--border-color)]">
                <div className="flex items-center justify-center gap-2 text-[var(--accent)]">
                  <Sparkles size={16} />
                  <span className="font-mono text-xs uppercase tracking-widest">
                    tahap tertinggi tercapai
                  </span>
                  <Sparkles size={16} />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label}
                variant="dashed"
                className={clsx('card-enter', `stagger-${index + 1}`)}
              >
                <div className="text-center space-y-3">
                  <Icon size={24} className="mx-auto text-[var(--accent)]" />
                  <div className="font-mono text-2xl text-[var(--text-main)]">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Growth Journey */}
        <Card variant="dashed">
          <div className="space-y-4">
            <h3 className="font-mono text-sm uppercase tracking-widest text-[var(--text-main)]">
              Perjalanan Pertumbuhan
            </h3>
            
            <div className="space-y-3">
              {Object.entries(stageInfo).map(([key, stage]) => {
                const isCompleted = user.xp >= stage.minXP;
                const isCurrent = user.gardenStage === key;
                
                return (
                  <div 
                    key={key}
                    className={clsx(
                      'flex items-center gap-4 p-3 border transition-all duration-300',
                      isCurrent 
                        ? 'border-[var(--accent)] bg-[var(--accent)]/5' 
                        : 'border-[var(--border-color)]',
                      !isCompleted && 'opacity-50'
                    )}
                  >
                    <div className="text-3xl">{stage.emoji}</div>
                    <div className="flex-1">
                      <div className="font-mono text-sm text-[var(--text-main)]">
                        {stage.name}
                      </div>
                      <div className="font-mono text-xs text-[var(--text-muted)]">
                        {stage.minXP} xp
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="text-[var(--accent)]">
                        {isCurrent ? <TrendingUp size={18} /> : '✓'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Inspirational Quote */}
        <Card>
          <div className="text-center py-6">
            <p className="font-serif italic text-lg text-[var(--text-main)] mb-4">
              "pertumbuhan sejati tidak terlihat,<br />
              tapi dirasakan dalam setiap langkah kecil."
            </p>
            <div className="w-12 h-px bg-[var(--border-color)] mx-auto" />
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};
