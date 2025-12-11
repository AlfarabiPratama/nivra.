import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_WIDGET_ORDER = [
  "soundscapes",
  "weeklyReview",
  "weeklyInsights",
  "taskAnalytics",
  "pomodoro",
];
const PRESETS = {
  focus: [
    "soundscapes",
    "weeklyReview",
    "taskAnalytics",
    "pomodoro",
    "weeklyInsights",
  ],
  balance: [
    "soundscapes",
    "weeklyReview",
    "weeklyInsights",
    "taskAnalytics",
    "pomodoro",
  ],
  analytics: [
    "taskAnalytics",
    "weeklyInsights",
    "weeklyReview",
    "pomodoro",
    "soundscapes",
  ],
};

export const useLayoutStore = create(
  persist(
    (set, get) => ({
      widgetOrder: DEFAULT_WIDGET_ORDER,
      hiddenWidgets: [],

      moveWidget: (id, direction) => {
        const order = [...get().widgetOrder];
        const index = order.indexOf(id);
        if (index === -1) return;

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= order.length) return;

        [order[index], order[targetIndex]] = [order[targetIndex], order[index]];
        set({ widgetOrder: order });
      },

      toggleWidgetVisibility: (id) => {
        const hidden = new Set(get().hiddenWidgets);
        if (hidden.has(id)) {
          hidden.delete(id);
        } else {
          hidden.add(id);
        }
        set({ hiddenWidgets: Array.from(hidden) });
      },

      setWidgetOrder: (order) => set({ widgetOrder: order }),

      resetLayout: () =>
        set({
          widgetOrder: DEFAULT_WIDGET_ORDER,
          hiddenWidgets: [],
        }),

      applyPreset: (preset) => {
        if (PRESETS[preset]) {
          set({ widgetOrder: PRESETS[preset], hiddenWidgets: [] });
        }
      },
    }),
    { name: "nivra-layout" }
  )
);

export { DEFAULT_WIDGET_ORDER };
export { PRESETS };
