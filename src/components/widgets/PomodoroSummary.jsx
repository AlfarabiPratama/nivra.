import { usePomodoroStore } from '../../store/usePomodoroStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Brain, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const PomodoroSummary = () => {
  const { getTodaySessions } = usePomodoroStore();
  const { setCurrentView } = useAppStore();
  
  const todaySessions = getTodaySessions();
  const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-(--accent)" />
            <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
              pomodoro
            </h3>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('pomodoro')}
            className="text-xs"
          >
            buka
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-serif text-(--text-main)">
              {todaySessions.length}
            </div>
            <div className="font-mono text-xs text-(--text-muted) mt-1">
              sesi hari ini
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif text-(--accent)">
              {hours > 0 ? `${hours}j ${minutes}m` : `${minutes}m`}
            </div>
            <div className="font-mono text-xs text-(--text-muted) mt-1">
              waktu fokus
            </div>
          </div>
        </div>

        {todaySessions.length === 0 ? (
          <p className="font-mono text-xs text-(--text-muted) italic text-center pt-2">
            belum ada sesi hari ini.
          </p>
        ) : (
          <div className="pt-2 border-t border-dashed border-(--border-color)">
            <p className="font-mono text-xs text-(--text-muted) text-center">
              terus pertahankan fokusmu! 🎯
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
