import { create } from "zustand";

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: (message, type = "info", duration = 3000) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type, // info, success, xp, levelup
    };

    set({ toasts: [...get().toasts, toast] });

    // Auto remove after duration
    setTimeout(() => {
      get().removeToast(id);
    }, duration);

    return id;
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));
