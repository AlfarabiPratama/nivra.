import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const FOCUS_DURATION = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

export const usePomodoroStore = create(
  persist(
    (set, get) => ({
      // Timer state
      timeLeft: FOCUS_DURATION,
      isRunning: false,
      sessionType: 'focus', // 'focus', 'shortBreak', 'longBreak'
      sessionCount: 0,
      
      // Current activity
      currentActivity: null,
      
      // History
      completedSessions: [],
      totalFocusTime: 0,
      
      // Settings
      settings: {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        soundEnabled: true,
      },

      // Actions
      setCurrentActivity: (activity) => {
        set({ currentActivity: activity });
      },

      updateSettings: (newSettings) => {
        set(state => ({ settings: { ...state.settings, ...newSettings } }));
      },

      startTimer: () => {
        set({ isRunning: true });
      },

      pauseTimer: () => {
        set({ isRunning: false });
      },

      resetTimer: () => {
        const { sessionType, settings } = get();
        const duration = sessionType === 'focus' 
          ? settings.focusDuration * 60
          : sessionType === 'shortBreak'
          ? settings.shortBreakDuration * 60
          : settings.longBreakDuration * 60;
        
        set({ 
          timeLeft: duration,
          isRunning: false 
        });
      },

      tick: () => {
        const { isRunning, timeLeft } = get();
        if (!isRunning || timeLeft <= 0) return;
        
        set({ timeLeft: timeLeft - 1 });
        
        // When timer completes
        if (timeLeft - 1 === 0) {
          get().completeSession();
        }
      },

      completeSession: () => {
        const { sessionType, sessionCount, currentActivity, settings } = get();
        
        if (sessionType === 'focus') {
          // Save completed focus session
          const session = {
            id: Date.now(),
            type: 'focus',
            duration: settings.focusDuration,
            activity: currentActivity,
            completedAt: new Date().toISOString(),
          };
          
          set(state => ({
            completedSessions: [session, ...state.completedSessions],
            totalFocusTime: state.totalFocusTime + settings.focusDuration,
            sessionCount: state.sessionCount + 1,
          }));
          
          // Determine next session type
          const nextCount = sessionCount + 1;
          const isLongBreak = nextCount % settings.sessionsUntilLongBreak === 0;
          
          get().switchSession(isLongBreak ? 'longBreak' : 'shortBreak');
          
          // Auto-start break if enabled
          if (settings.autoStartBreaks) {
            setTimeout(() => get().startTimer(), 100);
          }
        } else {
          // Break completed, switch to focus
          get().switchSession('focus');
          
          // Auto-start pomodoro if enabled
          if (settings.autoStartPomodoros) {
            setTimeout(() => get().startTimer(), 100);
          }
        }
      },

      switchSession: (type) => {
        const { settings } = get();
        const duration = type === 'focus' 
          ? settings.focusDuration * 60
          : type === 'shortBreak'
          ? settings.shortBreakDuration * 60
          : settings.longBreakDuration * 60;
        
        set({ 
          sessionType: type,
          timeLeft: duration,
          isRunning: false
        });
      },

      setActivity: (activity) => {
        set({ currentActivity: activity });
      },

      // Analytics
      getTodaySessions: () => {
        const today = new Date().toDateString();
        return get().completedSessions.filter(
          session => new Date(session.completedAt).toDateString() === today
        );
      },

      getWeekSessions: () => {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return get().completedSessions.filter(
          session => new Date(session.completedAt).getTime() > weekAgo
        );
      },
    }),
    {
      name: 'nivra-pomodoro',
    }
  )
);
