import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTaskStore } from '../store/useTaskStore';
import { useHabitStore } from '../store/useHabitStore';
import { sendNotification } from '../utils/notifications';

const getTimeToday = (hour = 8, minute = 0) => {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.getTime();
};

export const useReminder = () => {
  const { notifications, reminderTime } = useAppStore();
  const { tasks } = useTaskStore();
  const { checkIns, habits } = useHabitStore();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!notifications?.reminders) return;
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') return;

    const [h, m] = (reminderTime || '08:00').split(':').map(Number);
    const target = getTimeToday(h, m);
    const now = Date.now();
    const delay = target > now ? target - now : target + 24 * 60 * 60 * 1000 - now;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const dueToday = tasks.filter(
        (t) =>
          !t.completed &&
          t.dueDate &&
          new Date(t.dueDate).toDateString() === new Date().toDateString(),
      );

      const habitsUnchecked = Object.keys(checkIns).reduce((count, habitId) => {
        const today = new Date().toDateString();
        return checkIns[habitId]?.[today] ? count : count + 1;
      }, 0);

      const habitNames = habits.map((h) => h.name).join(', ');

      if (dueToday.length || habitsUnchecked) {
        sendNotification({
          title: 'Reminder harian',
          body:
            `${dueToday.length} tugas jatuh tempo hari ini` +
            (habitsUnchecked ? ` • ${habitsUnchecked} kebiasaan belum dicentang (${habitNames})` : ''),
        });
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [notifications?.reminders, reminderTime, tasks, checkIns, habits]);
};
