import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      
      addTask: async (taskData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        const newTask = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: typeof taskData === 'string' ? taskData : taskData.text,
          completed: false,
          priority: typeof taskData === 'object' ? (taskData.priority || 'medium') : 'medium',
          category: typeof taskData === 'object' ? (taskData.category || null) : null,
          dueDate: typeof taskData === 'object' ? (taskData.dueDate || null) : null,
          recurring: typeof taskData === 'object' ? (taskData.recurring || null) : null,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
        set({ tasks: [...get().tasks, newTask], isLoading: false });
      },
      
      toggleTask: async (id) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const task = get().tasks.find(t => t.id === id);
        
        // If completing a recurring task, create a new one
        if (task && !task.completed && task.recurring) {
          const newTask = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: task.text,
            completed: false,
            priority: task.priority,
            category: task.category,
            dueDate: task.dueDate ? get().calculateNextDueDate(task.dueDate, task.recurring) : null,
            recurring: task.recurring,
            createdAt: new Date().toISOString(),
            completedAt: null,
          };
          
          set({
            tasks: [
              ...get().tasks.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      completed: true,
                      completedAt: new Date().toISOString(),
                    }
                  : t
              ),
              newTask
            ],
            isLoading: false
          });
        } else {
          set({
            tasks: get().tasks.map((task) =>
              task.id === id
                ? {
                    ...task,
                    completed: !task.completed,
                    completedAt: !task.completed ? new Date().toISOString() : null,
                  }
                : task
            ),
            isLoading: false
          });
        }
      },
      
      deleteTask: async (id) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        set({
          tasks: get().tasks.filter((task) => task.id !== id),
          isLoading: false
        });
      },
      
      getTodayTasks: () => {
        const today = new Date().toDateString();
        return get().tasks.filter(
          (task) =>
            !task.completed &&
            new Date(task.createdAt).toDateString() === today
        );
      },
      
      getRecentCompleted: (count = 5) => {
        return get()
          .tasks.filter((task) => task.completed)
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, count);
      },
      
      calculateNextDueDate: (currentDate, recurring) => {
        if (!currentDate) return null;
        
        const date = new Date(currentDate);
        
        switch (recurring) {
          case 'daily':
            date.setDate(date.getDate() + 1);
            break;
          case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
          case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
          default:
            return null;
        }
        
        return date.toISOString().split('T')[0];
      },
    }),
    {
      name: 'nivra-tasks-storage',
    }
  )
);
