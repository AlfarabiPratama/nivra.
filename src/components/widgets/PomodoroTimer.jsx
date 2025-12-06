import { useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { usePomodoroStore } from '../../store/usePomodoroStore';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

export const PomodoroTimer = () => {
  const { 
    timeLeft, 
    isRunning, 
    sessionType,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
    switchSession,
    tick,
    getTodaySessions
  } = usePomodoroStore();

  // Tick every second
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = sessionType === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  const todaySessions = getTodaySessions();

  return (
    <Card>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            {sessionType === 'focus' ? (
              <Brain size={20} className="text-(--accent)" />
            ) : (
              <Coffee size={20} className="text-(--accent)" />
            )}
            <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
              {sessionType === 'focus' ? 'fokus' : sessionType === 'shortBreak' ? 'istirahat' : 'istirahat panjang'}
            </h3>
          </div>
          <p className="font-mono text-xs text-(--text-muted)">
            sesi #{sessionCount + 1}
          </p>
        </div>

        {/* Timer Display */}
        <div className="relative flex items-center justify-center">
          {/* Progress Circle */}
          <svg className="w-64 h-64 -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="var(--border-color)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="var(--accent)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - percentage / 100)}`}
              className="transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-display text-6xl font-light text-(--text-main) tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <p className="font-mono text-xs text-(--text-muted) mt-2">
                {isRunning ? 'berjalan...' : 'siap'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="ghost"
            onClick={resetTimer}
            className="px-4"
          >
            <RotateCcw size={18} />
          </Button>
          
          <Button
            variant="accent"
            onClick={isRunning ? pauseTimer : startTimer}
            className="px-8"
          >
            {isRunning ? (
              <>
                <Pause size={18} />
                <span className="ml-2">jeda</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span className="ml-2">mulai</span>
              </>
            )}
          </Button>
        </div>

        {/* Session Switcher */}
        <div className="flex gap-2 justify-center pt-4 border-t border-dashed border-(--border-color)">
          <button
            onClick={() => switchSession('focus')}
            className={`px-3 py-1 font-mono text-xs transition-colors ${
              sessionType === 'focus' 
                ? 'bg-(--accent) text-white' 
                : 'text-(--text-muted) hover:text-(--text-main)'
            }`}
          >
            fokus
          </button>
          <button
            onClick={() => switchSession('shortBreak')}
            className={`px-3 py-1 font-mono text-xs transition-colors ${
              sessionType === 'shortBreak' 
                ? 'bg-(--accent) text-white' 
                : 'text-(--text-muted) hover:text-(--text-main)'
            }`}
          >
            istirahat
          </button>
          <button
            onClick={() => switchSession('longBreak')}
            className={`px-3 py-1 font-mono text-xs transition-colors ${
              sessionType === 'longBreak' 
                ? 'bg-(--accent) text-white' 
                : 'text-(--text-muted) hover:text-(--text-main)'
            }`}
          >
            istirahat panjang
          </button>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-(--border-color)">
          <div className="text-center">
            <div className="text-2xl font-serif text-(--text-main)">
              {todaySessions.length}
            </div>
            <div className="font-mono text-xs text-(--text-muted)">
              sesi hari ini
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-serif text-(--text-main)">
              {Math.floor(todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60)}h
            </div>
            <div className="font-mono text-xs text-(--text-muted)">
              total fokus
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-serif text-(--text-main)">
              {sessionCount}
            </div>
            <div className="font-mono text-xs text-(--text-muted)">
              streak
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
