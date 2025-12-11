import { Card } from "../ui/Card";
import { CollapsibleSection } from "../ui/CollapsibleSection";
import { useTaskStore } from "../../store/useTaskStore";
import { useHabitStore } from "../../store/useHabitStore";
import { usePomodoroStore } from "../../store/usePomodoroStore";
import { useFinanceStore } from "../../store/useFinanceStore";
import { TrendingUp } from "lucide-react";

import {
  getStartOfWeek,
  getEndOfWeek,
  formatDateRange,
  isDateInThisWeek,
} from "../../utils/dateUtils";
const getWeekDays = () => {
  const days = [];
  const start = getStartOfWeek(new Date());
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push(date);
  }
  return days;
};

export const WeeklyInsights = () => {
  const { tasks } = useTaskStore();
  const { checkIns } = useHabitStore();
  const { getWeekSessions } = usePomodoroStore();
  // Using useFinanceStore for transactions

  // Safety checks for undefined arrays
  const taskList = tasks || [];
  const checkInData = checkIns || {};

  const weekDays = getWeekDays();

  const completedByDay = weekDays.map((day) => {
    const key = day.toDateString();
    const count = taskList.filter(
      (t) => t.completed && new Date(t.completedAt).toDateString() === key
    ).length;
    return { key, day, count };
  });

  const now = new Date();
  const weekStart = getStartOfWeek(now);
  const weekEnd = getEndOfWeek(now);

  const bestTaskDay = completedByDay.reduce(
    (best, curr) => (curr.count > best.count ? curr : best),
    { count: 0, day: new Date(), key: "" }
  );

  const habitDayCount = weekDays.map((day) => {
    const key = day.toDateString();
    const count = Object.values(checkInData).reduce((sum, habitDays) => {
      return habitDays[key] ? sum + 1 : sum;
    }, 0);
    return { key, day, count };
  });

  const bestHabitDay = habitDayCount.reduce(
    (best, curr) => (curr.count > best.count ? curr : best),
    { count: 0, day: new Date(), key: "" }
  );

  const pomodoroWeek = getWeekSessions();
  const focusMinutes = pomodoroWeek
    .filter((s) => s.type === "focus" && isDateInThisWeek(s.startTime, now))
    .reduce((sum, s) => sum + s.duration, 0);

  const { transactions } = useFinanceStore(); // Get raw transactions
  const financeWeekRaw = transactions.filter(
    (t) => isDateInThisWeek(t.date, now) && t.type === "expense"
  );

  const topSpendingDay = financeWeekRaw.reduce(
    (acc, curr) => {
      if (curr.amount > acc.amount) {
        return { amount: curr.amount, date: curr.date };
      }
      return acc;
    },
    { amount: 0, date: null }
  );

  return (
    <CollapsibleSection
      title="weekly insights"
      icon={<TrendingUp size={18} />}
      defaultExpanded={false}
      rightContent={formatDateRange(weekStart, weekEnd)}
    >
      <div className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-dashed border-(--border-color) p-3 space-y-1">
            <p className="font-mono text-[10px] uppercase text-(--text-muted)">
              tugas
            </p>
            <p className="font-serif text-lg text-(--text-main)">
              {bestTaskDay.count} selesai
            </p>
            <p className="font-mono text-xs text-(--text-muted)">
              hari terbaik:{" "}
              {bestTaskDay.day.toLocaleDateString("id-ID", { weekday: "long" })}
            </p>
          </div>

          <div className="border border-dashed border-(--border-color) p-3 space-y-1">
            <p className="font-mono text-[10px] uppercase text-(--text-muted)">
              kebiasaan
            </p>
            <p className="font-serif text-lg text-(--text-main)">
              {bestHabitDay.count} check-in
            </p>
            <p className="font-mono text-xs text-(--text-muted)">
              hari terbaik:{" "}
              {bestHabitDay.day.toLocaleDateString("id-ID", {
                weekday: "long",
              })}
            </p>
          </div>

          <div className="border border-dashed border-(--border-color) p-3 space-y-1">
            <p className="font-mono text-[10px] uppercase text-(--text-muted)">
              pomodoro
            </p>
            <p className="font-serif text-lg text-(--text-main)">
              {focusMinutes} menit fokus
            </p>
            <p className="font-mono text-xs text-(--text-muted)">minggu ini</p>
          </div>
        </div>

        <div className="border border-dashed border-(--border-color) p-3 space-y-1">
          <p className="font-mono text-[10px] uppercase text-(--text-muted)">
            keuangan
          </p>
          <p className="font-serif text-lg text-(--text-main)">
            pengeluaran tertinggi:{" "}
            {topSpendingDay.amount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="font-mono text-xs text-(--text-muted)">
            {topSpendingDay.date
              ? `pada ${new Date(topSpendingDay.date).toLocaleDateString(
                  "id-ID",
                  { weekday: "long" }
                )}`
              : "belum ada data"}
          </p>
        </div>
      </div>
    </CollapsibleSection>
  );
};
