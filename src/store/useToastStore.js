import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],
  
  addToast: (message, type = 'info') => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type, // info, success, xp, levelup
    };
    
    set({ toasts: [...get().toasts, toast] });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
    
    return id;
  },
  
  removeToast: (id) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },
}));
