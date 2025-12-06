import { Card } from '../ui/Card';
import { useTaskStore } from '../../store/useTaskStore';
import { useHabitStore } from '../../store/useHabitStore';
import { usePomodoroStore } from '../../store/usePomodoroStore';
import { useFinanceStore } from '../../store/useFinanceStore';

const getWeekDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  return days;
};

export const WeeklyInsights = () => {
  const { tasks } = useTaskStore();
  const { checkIns } = useHabitStore();
  const { getWeekSessions } = usePomodoroStore();
  const { getLast7DaysActivity } = useFinanceStore();

  const weekDays = getWeekDays();

  const completedByDay = weekDays.map((day) => {
    const key = day.toDateString();
    const count = tasks.filter(
      (t) => t.completed && new Date(t.completedAt).toDateString() === key
    ).length;
    return { key, day, count };
  });

  const bestTaskDay = completedByDay.reduce(
    (best, curr) => (curr.count > best.count ? curr : best),
    { count: 0, day: new Date(), key: '' }
  );

  const habitDayCount = weekDays.map((day) => {
    const key = day.toDateString();
    const count = Object.values(checkIns).reduce((sum, habitDays) => {
      return habitDays[key] ? sum + 1 : sum;
    }, 0);
    return { key, day, count };
  });

  const bestHabitDay = habitDayCount.reduce(
    (best, curr) => (curr.count > best.count ? curr : best),
    { count: 0, day: new Date(), key: '' }
  );

  const pomodoroWeek = getWeekSessions();
  const focusMinutes = pomodoroWeek
    .filter((s) => s.type === 'focus')
    .reduce((sum, s) => sum + s.duration, 0);

  const financeWeek = getLast7DaysActivity();
  const topSpendingDay = financeWeek.reduce(
    (best, curr) => (curr.expense > best.expense ? curr : best),
    { expense: 0, day: null, date: null }
  );

  return (
    <Card>
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-(--text-muted)">
              weekly insights
            </p>
            <h3 className="font-serif text-xl text-(--text-main)">ringkasan 7 hari</h3>
          </div>
          <span className="font-mono text-xs text-(--text-muted)">
            {weekDays[0].toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} -{' '}
            {weekDays[6].toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-dashed border-(--border-color) p-3 space-y-1">
            <p className="font-mono text-[10px] uppercase text-(--text-muted)">tugas</p>
            <p className="font-serif text-lg text-(--text-main)">
              {bestTaskDay.count} selesai
            </p>
            <p className="font-mono text-xs text-(--text-muted)">
              hari terbaik: {bestTaskDay.day.toLocaleDateString('id-ID', { weekday: 'long' })}
            </p>
          </div>

          <div className="border border-dashed border-(--border-color) p-3 space-y-1">
            <p className="font-mono text-[10px] uppercase text-(--text-muted)">kebiasaan</p>
            <p className="font-serif text-lg text-(--text-main)">
              {bestHabitDay.count} check-in
            </p>
            <p className="font-mono text-xs text-(--text-muted)">
              hari terbaik: {bestHabitDay.day.toLocaleDateString('id-ID', { weekday: 'long' })}
            </p>
          </div>

          <div className="border border-dashed border-(--border-color) p-3 space-y-1">
            <p className="font-mono text-[10px] uppercase text-(--text-muted)">pomodoro</p>
            <p className="font-serif text-lg text-(--text-main)">
              {focusMinutes} menit fokus
            </p>
            <p className="font-mono text-xs text-(--text-muted)">7 hari terakhir</p>
          </div>
        </div>

        <div className="border border-dashed border-(--border-color) p-3 space-y-1">
          <p className="font-mono text-[10px] uppercase text-(--text-muted)">keuangan</p>
          <p className="font-serif text-lg text-(--text-main)">
            pengeluaran tertinggi: {topSpendingDay.expense.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
          </p>
          <p className="font-mono text-xs text-(--text-muted)">
            {topSpendingDay.day
              ? `pada ${new Date(topSpendingDay.date).toLocaleDateString('id-ID', { weekday: 'long' })}`
              : 'belum ada data'}
          </p>
        </div>
      </div>
    </Card>
  );
};
