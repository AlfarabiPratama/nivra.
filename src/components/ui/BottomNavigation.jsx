import { Home, BookOpen, Wallet, Timer, Sprout } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import clsx from 'clsx';

export const BottomNavigation = () => {
  const { currentView, setCurrentView } = useAppStore();

  const navItems = [
    { id: 'dashboard', label: 'beranda', icon: Home },
    { id: 'reading', label: 'bacaan', icon: BookOpen },
    { id: 'finance', label: 'keuangan', icon: Wallet },
    { id: 'pomodoro', label: 'timer', icon: Timer },
    { id: 'garden', label: 'taman', icon: Sprout },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-(--card-color) border-t border-(--border-color) z-40 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors',
                isActive ? 'text-(--accent)' : 'text-(--text-muted)'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-mono text-[10px] lowercase">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
