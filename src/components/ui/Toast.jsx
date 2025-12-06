import { useToastStore } from '../../store/useToastStore';
import { X, CheckCircle, Info, Sparkles, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const toastIcons = {
  info: Info,
  success: CheckCircle,
  xp: Sparkles,
  levelup: TrendingUp,
};

export const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm">
      {toasts.map((toast, index) => {
        const Icon = toastIcons[toast.type] || Info;
        
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[var(--card-color)] border border-[var(--border-color)] p-4 min-w-[300px] shadow-lg fade-slide-up hover-scale"
            style={{ 
              animationDelay: `${index * 100}ms`,
              transform: `translateY(${index * 10}px)`
            }}
          >
            <div className="flex items-start gap-3">
              <Icon 
                size={18} 
                className={clsx(
                  'transition-transform',
                  toast.type === 'xp' || toast.type === 'levelup' 
                    ? 'text-[var(--accent)] glow-pulse' 
                    : 'text-[var(--text-main)]'
                )}
              />
              
              <p className="flex-1 font-mono text-xs text-[var(--text-main)] lowercase">
                {toast.message}
              </p>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors hover-scale"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
