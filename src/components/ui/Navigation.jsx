import {
  Home,
  BookOpen,
  BookText,
  Sprout,
  Sun,
  Moon,
  CheckCircle,
  Wallet,
  Timer,
  Settings,
  Keyboard,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useThemeStore } from "../../store/useThemeStore";
import { useState } from "react";
import { ShortcutsModal } from "../modals/ShortcutsModal";
import clsx from "clsx";

export const Navigation = ({
  isCollapsed = false,
  onToggle,
  isMobile = false,
  onClose,
}) => {
  const navItems = [
    { id: "dashboard", label: "beranda", icon: Home },
    { id: "reading", label: "bacaan", icon: BookOpen },
    { id: "calendar", label: "kalender", icon: CalendarDays },
    { id: "journal", label: "jurnal", icon: BookText },
    { id: "habits", label: "kebiasaan", icon: CheckCircle },
    { id: "finance", label: "keuangan", icon: Wallet },
    { id: "pomodoro", label: "pomodoro", icon: Timer },
    { id: "garden", label: "taman", icon: Sprout },
    { id: "digest", label: "digest", icon: BookText },
    { id: "settings", label: "pengaturan", icon: Settings },
  ];
  const { currentView, setCurrentView } = useAppStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleNavClick = (view) => {
    setCurrentView(view);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <nav className="bg-(--card-color) solid-border border-(--border-color) h-full flex flex-col">
      {/* Header with Logo - Expanded */}
      {!isCollapsed && (
        <div className="p-6 border-b border-dashed border-(--border-color)">
          <div className="flex items-start justify-between mb-2">
            <img
              src={
                isDarkMode ? "/dark mode nivra.png" : "/nivra light mode .png"
              }
              alt="Nivra Logo"
              className="w-32 h-auto opacity-90 transition-opacity duration-300"
            />
            <button
              onClick={onToggle}
              className="text-(--text-muted) hover:text-(--accent) transition-colors p-1 -mt-1 -mr-2"
              title="Sembunyikan label"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          <p className="text-xs font-mono text-(--text-muted) lowercase mt-1">
            digital sanctuary
          </p>
        </div>
      )}

      {/* Header - Collapsed */}
      {isCollapsed && (
        <div className="p-4 border-b border-dashed border-(--border-color)">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="font-serif text-xl text-(--accent)">N</span>
            </div>
            <button
              onClick={onToggle}
              className="text-(--text-muted) hover:text-(--accent) transition-colors p-1"
              title="Tampilkan label"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="p-4 space-y-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const shortcutKey = (index + 1).toString();

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed ? item.label : ""}
              className={clsx(
                "w-full flex items-center font-mono text-sm lowercase transition-all duration-300 group relative",
                "border border-transparent",
                isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3",
                isActive
                  ? "text-(--accent) border-(--accent) border-solid bg-(--accent)/5"
                  : "text-(--text-muted) hover:text-(--text-main) hover:border-(--text-main) hover:border-dashed"
              )}
            >
              <Icon size={18} className={isCollapsed ? "" : "shrink-0"} />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  <span className="font-mono text-xs opacity-0 group-hover:opacity-50 transition-opacity">
                    {shortcutKey}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-dashed border-(--border-color) space-y-3">
        <button
          onClick={toggleTheme}
          title={isCollapsed ? (isDarkMode ? "Mode Siang" : "Mode Malam") : ""}
          className={clsx(
            "w-full flex items-center font-mono text-xs uppercase tracking-widest transition-all duration-300 border border-(--text-muted) hover:border-(--text-main) text-(--text-muted) hover:text-(--text-main) group relative",
            isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
          )}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          {!isCollapsed && (
            <>
              <span className="flex-1">
                {isDarkMode ? "mode siang" : "mode malam"}
              </span>
              <span className="font-mono text-xs opacity-0 group-hover:opacity-50 transition-opacity">
                T
              </span>
            </>
          )}
        </button>

        {/* Keyboard Shortcuts Button */}
        <button
          onClick={() => setShowShortcuts(true)}
          title={isCollapsed ? "Shortcuts" : ""}
          className={clsx(
            "w-full flex items-center font-mono text-xs uppercase tracking-widest transition-all duration-300 border border-dashed border-(--border-color) hover:border-(--accent) text-(--text-muted) hover:text-(--accent) group",
            isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
          )}
        >
          <Keyboard size={16} />
          {!isCollapsed && (
            <>
              <span className="flex-1">shortcuts</span>
              <span className="font-mono text-xs opacity-0 group-hover:opacity-50 transition-opacity">
                ?
              </span>
            </>
          )}
        </button>
      </div>

      {/* Shortcuts Modal - CONDITIONAL RENDERING */}
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </nav>
  );
};
