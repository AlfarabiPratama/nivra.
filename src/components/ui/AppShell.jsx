import { useState, useEffect } from "react";
import { Navigation } from "../ui/Navigation";
import { BottomNavigation } from "../ui/BottomNavigation";
import { useAppStore } from "../../store/useAppStore";
import { useAchievementStore } from "../../store/useAchievementStore";
import { useTaskStore } from "../../store/useTaskStore";
import { useBookStore } from "../../store/useBookStore";
import { useJournalStore } from "../../store/useJournalStore";
import { AchievementModal } from "../modals/AchievementModal";
import { SyncStatusBadge } from "../sync/SyncStatusIndicator";
import { User, Trophy, Menu, X } from "lucide-react";

export const AppShell = ({ children }) => {
  const { user } = useAppStore();
  const { unlockedAchievements } = useAchievementStore();
  const { tasks } = useTaskStore();
  const { books } = useBookStore();
  const { entries } = useJournalStore();
  const [showAchievements, setShowAchievements] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate stats for achievements
  const stats = {
    level: user.level || 0,
    booksFinished: books.filter((b) => b.status === "finished").length,
    tasksCompleted: tasks.filter((t) => t.completed).length,
    journalEntries: entries.length,
    maxTasksInDay: 0, // Could be calculated from task completedAt dates
    taskStreak: 0, // Could be calculated from consecutive days
    journalStreak: 0, // Could be calculated from consecutive days
  };

  const quotes = [
    "bacalah dengan hatimu.",
    "perlahan tapi pasti.",
    "ilmu adalah benih yang tumbuh selamanya.",
    "satu halaman pada satu waktu.",
    "belajar tanpa berpikir sia-sia.",
  ];

  const dailyQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="min-h-screen flex">
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className="shrink-0 fixed left-0 top-0 h-screen transition-all duration-300 z-50"
        style={{
          width: isMobile ? "16rem" : sidebarOpen ? "16rem" : "5rem",
          transform:
            isMobile && !mobileMenuOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <div className="w-full h-full">
          <Navigation
            isCollapsed={!sidebarOpen && !isMobile}
            onToggle={() =>
              isMobile
                ? setMobileMenuOpen(!mobileMenuOpen)
                : setSidebarOpen(!sidebarOpen)
            }
            isMobile={isMobile}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 overflow-auto transition-all duration-300"
        style={{
          marginLeft: isMobile ? "0" : sidebarOpen ? "16rem" : "5rem",
          paddingBottom: isMobile ? "5rem" : "0",
        }}
      >
        {/* Header with Search and User Info */}
        <header className="h-16 md:h-24 flex items-center justify-between px-4 md:px-10 border-b border-dashed border-(--border-color) bg-(--bg-color)/90 backdrop-blur-sm sticky top-0 z-30">
          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-(--text-main) hover:text-(--accent) transition-colors p-2 md:hidden mr-3"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
            {/* Clock & Date */}
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <div className="font-mono text-sm md:text-lg text-(--text-main) tabular-nums">
                {currentTime.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className="font-mono text-[10px] md:text-xs text-(--text-muted) uppercase tracking-wider">
                {currentTime.toLocaleDateString("id-ID", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Daily Quote (desktop only) */}
            <span className="font-serif italic text-xs md:text-sm text-(--text-muted) hidden xl:block border-l border-dashed border-(--border-color) pl-4">
              "{dailyQuote}"
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Firebase Sync Status */}
            <SyncStatusBadge />

            <button
              onClick={() => setShowAchievements(true)}
              className="relative hover-scale"
            >
              <Trophy size={18} className="md:w-5 md:h-5 text-(--accent)" />
              {unlockedAchievements.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-(--accent) text-(--bg-color) text-[10px] md:text-xs font-mono flex items-center justify-center rounded-full">
                  {unlockedAchievements.length}
                </span>
              )}
            </button>
            <button
              onClick={() => useAppStore.getState().setCurrentView("profile")}
              className="w-7 h-7 md:w-8 md:h-8 bg-(--card-color) border border-(--border-color) flex items-center justify-center rounded-full hover:border-(--accent) transition-colors overflow-hidden hover-scale"
              title="Profil"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User
                  size={12}
                  className="md:w-3.5 md:h-3.5 text-(--text-muted)"
                />
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div>{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNavigation />}

      {/* Achievement Modal */}
      <AchievementModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        unlockedAchievements={unlockedAchievements}
        stats={stats}
      />
    </div>
  );
};
