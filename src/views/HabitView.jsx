import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AnimatedPage } from '../components/ui/AnimatedPage';
import { useHabitStore } from '../store/useHabitStore';
import { CheckCircle2, Circle, Flame, TrendingUp, Plus, X } from 'lucide-react';

export const HabitView = () => {
  const { 
    habits, 
    toggleCheckIn, 
    isCheckedToday,
    getStreak,
    getLast7Days,
    getTodayProgress,
    addHabit
  } = useHabitStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    emoji: '✨',
    category: 'growth',
    targetDays: 7
  });

  const todayProgress = getTodayProgress();

  const emojiOptions = ['📚', '💪', '💧', '✍️', '🧘', '😴', '🎨', '🎵', '🏃', '🥗', '💻', '📝', '🧠', '❤️', '✨'];
  const categoryOptions = [
    { id: 'growth', label: 'Pertumbuhan' },
    { id: 'health', label: 'Kesehatan' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'productivity', label: 'Produktivitas' },
    { id: 'creativity', label: 'Kreativitas' }
  ];

  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      addHabit(newHabit);
      setNewHabit({ name: '', emoji: '✨', category: 'growth', targetDays: 7 });
      setShowAddForm(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-4xl font-serif italic text-(--text-main) mb-2">
            kebiasaan harianmu.
          </h2>
          <p className="font-mono text-xs md:text-sm text-(--text-muted) border-l-2 border-(--accent) pl-3 md:pl-4 italic">
            konsistensi adalah kunci pertumbuhan.
          </p>
        </div>

        {/* Today's Progress */}
        <Card>
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="md:w-5 md:h-5 text-(--accent)" />
                <h3 className="font-mono text-xs md:text-sm uppercase tracking-wider text-(--text-muted)">
                  progres hari ini
                </h3>
              </div>
              <div className="text-center md:text-right">
                <span className="text-xl md:text-2xl font-serif text-(--text-main)">
                  {todayProgress.completed}/{todayProgress.total}
                </span>
                <p className="font-mono text-xs text-(--text-muted)">
                  {todayProgress.percentage}% selesai
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-(--bg-color) border border-(--border-color)">
              <div 
                className="h-full bg-(--accent) transition-all duration-500"
                style={{ width: `${todayProgress.percentage}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Add Habit Button/Form */}
        {!showAddForm ? (
          <Button
            variant="ghost"
            onClick={() => setShowAddForm(true)}
            className="w-full py-6 border-dashed"
          >
            <Plus size={20} />
            <span>tambah kebiasaan baru</span>
          </Button>
        ) : (
          <Card>
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs md:text-sm uppercase tracking-wider text-(--text-muted)">
                  kebiasaan baru
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-(--text-muted) hover:text-(--text-main) transition-colors"
                >
                  <X size={18} className="md:w-5 md:h-5" />
                </button>
              </div>

              {/* Emoji Selector */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-(--text-muted) uppercase">Emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewHabit({ ...newHabit, emoji })}
                      className={`text-xl md:text-2xl p-1.5 md:p-2 border transition-all ${
                        newHabit.emoji === emoji 
                          ? 'border-(--accent) bg-(--accent)/10' 
                          : 'border-(--border-color) hover:border-(--text-main)'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-(--text-muted) uppercase">Nama Kebiasaan</label>
                <Input
                  placeholder="contoh: Membaca 30 menit"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-(--text-muted) uppercase">Kategori</label>
                <div className="flex gap-2 flex-wrap">
                  {categoryOptions.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setNewHabit({ ...newHabit, category: cat.id })}
                      className={`px-3 md:px-4 py-1.5 md:py-2 font-mono text-[10px] md:text-xs border transition-all ${
                        newHabit.category === cat.id 
                          ? 'border-(--accent) bg-(--accent)/10 text-(--accent)' 
                          : 'border-(--border-color) text-(--text-muted) hover:border-(--text-main) hover:text-(--text-main)'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Days */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-(--text-muted) uppercase">Target per Minggu</label>
                <div className="flex gap-2">
                  {[1, 3, 5, 7].map(days => (
                    <button
                      key={days}
                      onClick={() => setNewHabit({ ...newHabit, targetDays: days })}
                      className={`flex-1 py-2 font-mono text-sm border transition-all ${
                        newHabit.targetDays === days 
                          ? 'border-(--accent) bg-(--accent)/10 text-(--accent)' 
                          : 'border-(--border-color) text-(--text-muted) hover:border-(--text-main)'
                      }`}
                    >
                      {days}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  batal
                </Button>
                <Button
                  variant="accent"
                  onClick={handleAddHabit}
                  disabled={!newHabit.name.trim()}
                  className="flex-1"
                >
                  tambah kebiasaan
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Habits List */}
        <div className="grid gap-4">
          {habits.map(habit => {
            const checked = isCheckedToday(habit.id);
            const streak = getStreak(habit.id);
            const last7Days = getLast7Days(habit.id);

            return (
              <Card key={habit.id}>
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-3 md:gap-4">
                    {/* Left: Habit Info */}
                    <div className="flex items-start gap-3 md:gap-4 flex-1">
                      {/* Check Button */}
                      <button
                        onClick={() => toggleCheckIn(habit.id)}
                        className="hover:scale-110 transition-transform"
                      >
                        {checked ? (
                          <CheckCircle2 size={32} className="md:w-10 md:h-10 text-(--accent)" />
                        ) : (
                          <Circle size={32} className="md:w-10 md:h-10 text-(--text-muted) opacity-50" />
                        )}
                      </button>

                      {/* Habit Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl md:text-2xl">{habit.emoji}</span>
                          <h3 className={`text-base md:text-xl font-serif ${checked ? 'text-(--accent)' : 'text-(--text-main)'}`}>
                            {habit.name}
                          </h3>
                        </div>
                        
                        {/* 7-Day Visual */}
                        <div className="flex gap-1 md:gap-2 mt-3">
                          {last7Days.map((day, idx) => (
                            <div 
                              key={idx} 
                              className="flex flex-col items-center gap-1"
                            >
                              <div 
                                className={`w-6 h-6 md:w-8 md:h-8 border-2 ${
                                  day.checked 
                                    ? 'bg-(--accent) border-(--accent)' 
                                    : 'bg-transparent border-(--border-color)'
                                }`}
                              />
                              <span className="font-mono text-xs text-(--text-muted)">
                                {day.day}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Streak */}
                    {streak > 0 && (
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Flame size={20} className="text-(--accent) glow-pulse" />
                          <span className="text-2xl font-serif text-(--accent)">
                            {streak}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-(--text-muted)">
                          hari streak
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Motivational Quote */}
        <Card>
          <div className="p-6 text-center">
            <p className="font-serif italic text-lg text-(--text-main)">
              "kebiasaan kecil yang dilakukan konsisten<br />
              menciptakan perubahan besar."
            </p>
            <div className="w-12 h-px bg-(--border-color) mx-auto mt-4" />
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};
