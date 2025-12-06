import { useState } from 'react';
import { AnimatedPage } from '../components/ui/AnimatedPage';
import { Card } from '../components/ui/Card';
import { useTaskStore } from '../store/useTaskStore';
import { useHabitStore } from '../store/useHabitStore';
import { usePomodoroStore } from '../store/usePomodoroStore';
import { useJournalStore } from '../store/useJournalStore';
import { useFinanceStore } from '../store/useFinanceStore';

const formatCurrency = (value) =>
  value?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export const WeeklyDigest = () => {
  const { tasks } = useTaskStore();
  const { getWeeklyStats } = useHabitStore();
  const { getWeekSessions } = usePomodoroStore();
  const { entries } = useJournalStore();
  const { getLast7DaysActivity } = useFinanceStore();
  const [now] = useState(() => Date.now());

  const completedThisWeek = tasks.filter((t) => {
    if (!t.completedAt) return false;
    const diff = now - new Date(t.completedAt).getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  });

  const habitsWeekly = getWeeklyStats();
  const pomodoroWeek = getWeekSessions();
  const journalWeek = entries.filter((e) => now - new Date(e.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000);
  const financeWeek = getLast7DaysActivity();
  const financeTotals = financeWeek.reduce(
    (acc, day) => ({
      income: acc.income + day.income,
      expense: acc.expense + day.expense,
    }),
    { income: 0, expense: 0 },
  );

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 print:bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif italic text-(--text-main)">weekly digest</h1>
            <p className="font-mono text-xs text-(--text-muted)">ringkasan 7 hari terakhir</p>
          </div>
          <button
            className="font-mono text-xs border border-(--border-color) px-3 py-2"
            onClick={() => window.print()}
          >
            print
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <div className="p-4 space-y-2">
              <h3 className="font-mono text-xs uppercase text-(--text-muted)">tasks</h3>
              <p className="font-serif text-2xl text-(--text-main)">{completedThisWeek.length} selesai</p>
              <p className="font-mono text-sm text-(--text-muted)">
                total tasks: {tasks.length} • minggu ini: {completedThisWeek.length}
              </p>
            </div>
          </Card>

          <Card>
            <div className="p-4 space-y-2">
              <h3 className="font-mono text-xs uppercase text-(--text-muted)">pomodoro</h3>
              <p className="font-serif text-2xl text-(--text-main)">{pomodoroWeek.length} sesi</p>
              <p className="font-mono text-sm text-(--text-muted)">fokus + break minggu ini</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <div className="p-4 space-y-2">
              <h3 className="font-mono text-xs uppercase text-(--text-muted)">habits</h3>
              {habitsWeekly.length === 0 ? (
                <p className="font-mono text-sm text-(--text-muted)">belum ada data kebiasaan.</p>
              ) : (
                <div className="space-y-1">
                  {habitsWeekly.map((h) => (
                    <div key={h.id} className="flex justify-between text-sm font-mono text-(--text-main)">
                      <span>{h.name}</span>
                      <span>{h.completionRate}% • streak {h.streak}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="p-4 space-y-2">
              <h3 className="font-mono text-xs uppercase text-(--text-muted)">jurnal</h3>
              <p className="font-serif text-2xl text-(--text-main)">{journalWeek.length} entri</p>
              <p className="font-mono text-sm text-(--text-muted)">week highlights</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4 space-y-2">
            <h3 className="font-mono text-xs uppercase text-(--text-muted)">keuangan</h3>
            <p className="font-serif text-xl text-(--text-main)">
              income {formatCurrency(financeTotals.income)} • expense {formatCurrency(financeTotals.expense)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {financeWeek.map((day, idx) => (
                <div key={idx} className="border border-dashed border-(--border-color) p-2">
                  <p className="font-mono text-[11px] text-(--text-muted)">{day.day}</p>
                  <p className="font-mono text-xs text-(--text-main)">in {formatCurrency(day.income)}</p>
                  <p className="font-mono text-xs text-(--text-main)">out {formatCurrency(day.expense)}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};
