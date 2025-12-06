import { useEffect, useState, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AnimatedPage } from '../components/ui/AnimatedPage';
import { usePomodoroStore } from '../store/usePomodoroStore';
import { Play, Pause, RotateCcw, Coffee, Brain, BarChart2, Calendar, Edit2 } from 'lucide-react';

export const PomodoroView = () => {
  const { 
    timeLeft, 
    isRunning, 
    sessionType,
    sessionCount,
    currentActivity,
    settings,
    setCurrentActivity,
    startTimer,
    pauseTimer,
    resetTimer,
    switchSession,
    tick,
    getTodaySessions,
    getWeekSessions
  } = usePomodoroStore();

  const [activityInput, setActivityInput] = useState(currentActivity || '');
  const [showActivityInput, setShowActivityInput] = useState(false);

  // Play completion sound
  const playCompletionSound = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Create a subtle bell sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Soft bell tone (C6 = 1046.5 Hz)
    oscillator.frequency.value = 1046.5;
    oscillator.type = 'sine';
    
    // Gentle fade out
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  }, [settings.soundEnabled]);

  // Tick every second
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  // Detect session completion
  useEffect(() => {
    if (timeLeft === 0 && !isRunning) {
      playCompletionSound();
    }
  }, [timeLeft, isRunning, playCompletionSound]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = sessionType === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  const todaySessions = getTodaySessions();
  const weekSessions = getWeekSessions();

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-4xl font-serif italic text-(--text-main) mb-2">
            pomodoro timer.
          </h2>
          <p className="font-mono text-xs md:text-sm text-(--text-muted) border-l-2 border-(--accent) pl-3 md:pl-4 italic">
            fokus dalam, satu sesi pada satu waktu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Timer Section */}
          <Card>
            <div className="p-4 md:p-8 space-y-4 md:space-y-6">
              {/* Session Type */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {sessionType === 'focus' ? (
                    <Brain size={20} className="md:w-6 md:h-6 text-(--accent)" />
                  ) : (
                    <Coffee size={20} className="md:w-6 md:h-6 text-(--accent)" />
                  )}
                  <h3 className="font-mono text-sm md:text-lg uppercase tracking-wider text-(--text-muted)">
                    {sessionType === 'focus' ? 'fokus' : sessionType === 'shortBreak' ? 'istirahat' : 'istirahat panjang'}
                  </h3>
                </div>
                <p className="font-mono text-[10px] md:text-xs text-(--text-muted)">
                  sesi #{sessionCount + 1}
                </p>
              </div>

              {/* Timer Display */}
              <div className="relative flex items-center justify-center">
                {/* Progress Circle */}
                <svg className="w-56 h-56 md:w-72 md:h-72 -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="104"
                    className="md:hidden"
                    stroke="var(--border-color)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="104"
                    className="md:hidden"
                    stroke="var(--accent)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 104}`}
                    strokeDashoffset={`${2 * Math.PI * 104 * (1 - percentage / 100)}`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="144"
                    cy="144"
                    r="136"
                    className="hidden md:block"
                    stroke="var(--border-color)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="144"
                    cy="144"
                    r="136"
                    className="hidden md:block"
                    stroke="var(--accent)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 136}`}
                    strokeDashoffset={`${2 * Math.PI * 136 * (1 - percentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-display text-5xl md:text-7xl font-light text-(--text-main) tabular-nums">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <p className="font-mono text-xs md:text-sm text-(--text-muted) mt-2 md:mt-3">
                      {isRunning ? 'berjalan...' : 'siap untuk fokus'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Input - Only show for focus sessions */}
              {sessionType === 'focus' && (
                <div className="space-y-2">
                  {!showActivityInput && !currentActivity ? (
                    <button
                      onClick={() => setShowActivityInput(true)}
                      className="w-full py-2 px-3 md:px-4 font-mono text-xs md:text-sm text-(--text-muted) hover:text-(--text-main) border border-dashed border-(--border-color) hover:border-(--text-main) transition-colors"
                    >
                      <Edit2 size={14} className="inline mr-2" />
                      apa yang akan kamu kerjakan?
                    </button>
                  ) : showActivityInput ? (
                    <div className="flex flex-col md:flex-row gap-2">
                      <Input
                        placeholder="contoh: baca bab 3..."
                        value={activityInput}
                        onChange={(e) => setActivityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && activityInput.trim()) {
                            setCurrentActivity(activityInput.trim());
                            setShowActivityInput(false);
                          }
                        }}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        variant="accent"
                        onClick={() => {
                          if (activityInput.trim()) {
                            setCurrentActivity(activityInput.trim());
                            setShowActivityInput(false);
                          }
                        }}
                        disabled={!activityInput.trim()}
                        className="w-full md:w-auto md:px-4"
                      >
                        simpan
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between py-2 px-3 md:px-4 bg-(--bg-color) border border-(--border-color)">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Brain size={14} className="md:w-4 md:h-4 text-(--accent) shrink-0" />
                        <span className="font-mono text-xs md:text-sm text-(--text-main) truncate">
                          {currentActivity}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setActivityInput(currentActivity);
                          setShowActivityInput(true);
                        }}
                        className="text-(--text-muted) hover:text-(--text-main) transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-2 md:gap-3 justify-center">
                <Button
                  variant="ghost"
                  onClick={resetTimer}
                  className="flex-1 md:flex-none md:px-6"
                >
                  <RotateCcw size={18} className="md:w-5 md:h-5" />
                  <span>reset</span>
                </Button>
                
                <Button
                  variant="accent"
                  className="flex-1 md:flex-none"
                  onClick={isRunning ? pauseTimer : startTimer}
                >
                  {isRunning ? (
                    <>
                      <Pause size={20} />
                      <span>jeda</span>
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      <span>mulai</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Session Switcher */}
              <div className="flex gap-2 justify-center pt-4 border-t border-dashed border-(--border-color)">
                <button
                  onClick={() => switchSession('focus')}
                  className={`px-4 py-2 font-mono text-sm transition-colors ${
                    sessionType === 'focus' 
                      ? 'bg-(--accent) text-white' 
                      : 'text-(--text-muted) hover:text-(--text-main) border border-(--border-color)'
                  }`}
                >
                  fokus
                </button>
                <button
                  onClick={() => switchSession('shortBreak')}
                  className={`px-4 py-2 font-mono text-sm transition-colors ${
                    sessionType === 'shortBreak' 
                      ? 'bg-(--accent) text-white' 
                      : 'text-(--text-muted) hover:text-(--text-main) border border-(--border-color)'
                  }`}
                >
                  istirahat
                </button>
                <button
                  onClick={() => switchSession('longBreak')}
                  className={`px-4 py-2 font-mono text-sm transition-colors ${
                    sessionType === 'longBreak' 
                      ? 'bg-(--accent) text-white' 
                      : 'text-(--text-muted) hover:text-(--text-main) border border-(--border-color)'
                  }`}
                >
                  istirahat panjang
                </button>
              </div>
            </div>
          </Card>

          {/* Statistics Section */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={20} className="text-(--accent)" />
                  <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                    hari ini
                  </h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-serif text-(--text-main)">
                      {todaySessions.length}
                    </div>
                    <div className="font-mono text-xs text-(--text-muted) mt-1">
                      sesi selesai
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-serif text-(--text-main)">
                      {Math.floor(todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60)}h
                    </div>
                    <div className="font-mono text-xs text-(--text-muted) mt-1">
                      waktu fokus
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-serif text-(--accent)">
                      {sessionCount}
                    </div>
                    <div className="font-mono text-xs text-(--text-muted) mt-1">
                      streak
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Weekly Overview */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 size={20} className="text-(--accent)" />
                  <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                    7 hari terakhir
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-(--text-muted)">total sesi</span>
                    <span className="font-serif text-lg text-(--text-main)">{weekSessions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-(--text-muted)">total fokus</span>
                    <span className="font-serif text-lg text-(--text-main)">
                      {Math.floor(weekSessions.reduce((sum, s) => sum + s.duration, 0) / 60)} jam
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-(--text-muted)">rata-rata/hari</span>
                    <span className="font-serif text-lg text-(--text-main)">
                      {Math.round(weekSessions.length / 7)} sesi
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Motivational Quote */}
            <Card>
              <div className="p-6 text-center space-y-3">
                <p className="font-serif italic text-lg text-(--text-main)">
                  "fokus dalam adalah superpower<br />
                  di era distraksi."
                </p>
                <div className="w-12 h-px bg-(--border-color) mx-auto" />
                <p className="font-mono text-xs text-(--text-muted)">
                  — cal newport
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
