import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTaskStore } from '../../store/useTaskStore';
import { useBookStore } from '../../store/useBookStore';
import { useJournalStore } from '../../store/useJournalStore';
import { useHabitStore } from '../../store/useHabitStore';
import { usePomodoroStore } from '../../store/usePomodoroStore';
import { CheckCircle2, BookOpen, Feather, Flame, Brain, TrendingUp, Calendar } from 'lucide-react';

export const WeeklyReview = () => {
  const { tasks } = useTaskStore();
  const { books } = useBookStore();
  const { entries } = useJournalStore();
  const { getWeeklyStats } = useHabitStore();
  const { getWeekSessions } = usePomodoroStore();

  // Calculate weekly stats
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weeklyTasks = tasks.filter(t => {
    if (!t.completedAt) return false;
    const completedDate = new Date(t.completedAt);
    return completedDate >= weekAgo && completedDate <= now;
  });

  const weeklyJournals = entries.filter(e => {
    const entryDate = new Date(e.createdAt);
    return entryDate >= weekAgo && entryDate <= now;
  });

  const weeklyPomodoros = getWeekSessions();
  const weeklyHabits = getWeeklyStats();
  
  const totalFocusMinutes = weeklyPomodoros.reduce((sum, s) => sum + s.duration, 0);
  const totalFocusHours = Math.floor(totalFocusMinutes / 60);

  const readingBooks = books.filter(b => b.status === 'reading');
  const finishedBooks = books.filter(b => {
    if (b.status !== 'finished' || !b.finishedDate) return false;
    const finishedDate = new Date(b.finishedDate);
    return finishedDate >= weekAgo && finishedDate <= now;
  });

  const avgHabitCompletion = weeklyHabits.length > 0
    ? Math.round(weeklyHabits.reduce((sum, h) => sum + h.completionRate, 0) / weeklyHabits.length)
    : 0;

  const topStreak = weeklyHabits.reduce((max, h) => Math.max(max, h.streak), 0);

  return (
    <Card>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-(--accent)" />
            <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
              ringkasan minggu ini
            </h3>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-(--text-muted)">
              {weekAgo.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tasks */}
          <div className="text-center p-4 border border-dashed border-(--border-color)">
            <CheckCircle2 size={24} className="text-(--accent) mx-auto mb-2" />
            <div className="text-3xl font-serif text-(--text-main)">
              {weeklyTasks.length}
            </div>
            <div className="font-mono text-xs text-(--text-muted) mt-1">
              tugas selesai
            </div>
          </div>

          {/* Pomodoro */}
          <div className="text-center p-4 border border-dashed border-(--border-color)">
            <Brain size={24} className="text-(--accent) mx-auto mb-2" />
            <div className="text-3xl font-serif text-(--text-main)">
              {totalFocusHours}j
            </div>
            <div className="font-mono text-xs text-(--text-muted) mt-1">
              waktu fokus
            </div>
          </div>

          {/* Journal */}
          <div className="text-center p-4 border border-dashed border-(--border-color)">
            <Feather size={24} className="text-(--accent) mx-auto mb-2" />
            <div className="text-3xl font-serif text-(--text-main)">
              {weeklyJournals.length}
            </div>
            <div className="font-mono text-xs text-(--text-muted) mt-1">
              entri jurnal
            </div>
          </div>

          {/* Habits */}
          <div className="text-center p-4 border border-dashed border-(--border-color)">
            <Flame size={24} className="text-(--accent) mx-auto mb-2" />
            <div className="text-3xl font-serif text-(--text-main)">
              {avgHabitCompletion}%
            </div>
            <div className="font-mono text-xs text-(--text-muted) mt-1">
              kebiasaan
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-3 pt-4 border-t border-dashed border-(--border-color)">
          {/* Reading Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-(--accent)" />
              <span className="font-mono text-sm text-(--text-muted)">
                sedang membaca
              </span>
            </div>
            <span className="font-serif text-lg text-(--text-main)">
              {readingBooks.length} buku
            </span>
          </div>

          {finishedBooks.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-(--accent)" />
                <span className="font-mono text-sm text-(--text-muted)">
                  buku diselesaikan
                </span>
              </div>
              <span className="font-serif text-lg text-(--accent)">
                {finishedBooks.length}
              </span>
            </div>
          )}

          {/* Pomodoro Sessions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-(--accent)" />
              <span className="font-mono text-sm text-(--text-muted)">
                sesi pomodoro
              </span>
            </div>
            <span className="font-serif text-lg text-(--text-main)">
              {weeklyPomodoros.length} sesi
            </span>
          </div>

          {/* Top Habit Streak */}
          {topStreak > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-(--accent)" />
                <span className="font-mono text-sm text-(--text-muted)">
                  streak terpanjang
                </span>
              </div>
              <span className="font-serif text-lg text-(--accent)">
                {topStreak} hari
              </span>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <div className="pt-4 border-t border-dashed border-(--border-color) text-center">
          {weeklyTasks.length > 10 || totalFocusHours > 10 || avgHabitCompletion > 80 ? (
            <p className="font-serif italic text-sm text-(--text-main)">
              minggu yang produktif! terus pertahankan momentummu. ✨
            </p>
          ) : weeklyTasks.length > 5 || totalFocusHours > 5 ? (
            <p className="font-serif italic text-sm text-(--text-main)">
              progres yang baik. satu langkah pada satu waktu. 🌱
            </p>
          ) : (
            <p className="font-serif italic text-sm text-(--text-muted)">
              setiap perjalanan dimulai dengan satu langkah kecil. 🌿
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
