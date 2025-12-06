import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, RotateCcw, Clock, Disc } from 'lucide-react';
import clsx from 'clsx';

export const ReadingTimer = ({ onComplete, bookTitle = null }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // focus, break
  const intervalRef = useRef(null);

  const totalSeconds = sessionType === 'focus' ? 25 * 60 : 5 * 60;
  const currentTotalSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentTotalSeconds) / totalSeconds) * 100;

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(intervalRef.current);
            setIsActive(false);
            if (onComplete) {
              onComplete(sessionType === 'focus' ? 30 : 10); // XP reward
            }
            
            // Auto switch to break or focus
            if (sessionType === 'focus') {
              setSessionType('break');
              setMinutes(5);
            } else {
              setSessionType('focus');
              setMinutes(25);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, minutes, seconds, sessionType, onComplete]);

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setMinutes(sessionType === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = (mode) => {
    setSessionType(mode);
    setIsActive(false);
    setIsPaused(false);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <Card variant="dashed" className="relative overflow-hidden">
      {/* Decorative grain lines */}
      <div className="grain-line-top"></div>
      <div className="grain-line-bottom"></div>
      
      {/* Background progress */}
      <div 
        className="absolute inset-0 bg-(accent) opacity-5 transition-all duration-1000"
        style={{ width: `${progress}%` }}
      />
      
      {/* Spinning disc decoration */}
      <div className="absolute top-4 right-4 opacity-20">
        <Disc 
          size={40} 
          className={clsx(
            'text-(text-muted)',
            isActive && !isPaused && 'animate-spin-slow'
          )} 
        />
      </div>
      
      <div className="relative space-y-6">
        {/* Session Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => switchMode('focus')}
            className={clsx(
              'flex-1 font-mono text-xs uppercase tracking-widest py-2 border transition-all duration-300',
              sessionType === 'focus'
                ? 'border-(accent) text-(accent) bg-(accent)/10'
                : 'border-(border-color) text-(text-muted) hover:border-(text-main)'
            )}
          >
            fokus
          </button>
          <button
            onClick={() => switchMode('break')}
            className={clsx(
              'flex-1 font-mono text-xs uppercase tracking-widest py-2 border transition-all duration-300',
              sessionType === 'break'
                ? 'border-(accent) text-(accent) bg-(accent)/10'
                : 'border-(border-color) text-(text-muted) hover:border-(text-main)'
            )}
          >
            istirahat
          </button>
        </div>

        {/* Session Header with Icon */}
        <div className="text-center space-y-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-(text-muted) flex items-center justify-center gap-2">
            <Disc 
              className={clsx(
                'text-(text-muted)',
                isActive && !isPaused && 'animate-spin-slow'
              )} 
              size={14} 
            /> 
            mode {sessionType === 'focus' ? 'fokus' : 'istirahat'}
          </h3>
          {bookTitle && (
            <p className="font-serif italic text-sm text-(text-main)">
              "{bookTitle}"
            </p>
          )}
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className="font-mono text-6xl tracking-tighter text-(text-main) tabular-nums opacity-90">
            {String(minutes).padStart(2, '0')}
            <span className="animate-pulse-slow">:</span>
            {String(seconds).padStart(2, '0')}
          </div>
          
          <p className="mt-4 font-mono text-xs text-(text-muted) uppercase tracking-widest">
            {isActive && !isPaused ? (
              sessionType === 'focus' ? 'fokus membaca...' : 'waktu istirahat...'
            ) : (
              'siap untuk memulai'
            )}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-(bg-color) border border-(border-color)">
          <div 
            className="h-full bg-(accent) transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="accent"
            onClick={toggleTimer}
            className="flex items-center gap-2"
          >
            {isActive && !isPaused ? (
              <>
                <Pause size={14} />
                jeda
              </>
            ) : (
              <>
                <Play size={14} />
                {isActive ? 'lanjut' : 'mulai'}
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            onClick={resetTimer}
            className="flex items-center gap-2"
          >
            <RotateCcw size={14} />
            reset
          </Button>
        </div>

        {/* XP Info */}
        <div className="text-center pt-4 border-t border-dashed border-(border-color)">
          <p className="font-mono text-xs text-(text-muted)">
            <Clock size={12} className="inline mr-1" />
            selesaikan sesi untuk mendapat +{sessionType === 'focus' ? '30' : '10'} xp
          </p>
        </div>
      </div>
    </Card>
  );
};
