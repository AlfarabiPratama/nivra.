import { useEffect, useState } from "react";
import { useThemeStore } from "./store/useThemeStore";
import { useAppStore } from "./store/useAppStore";
import { useSyncStore } from "./store/useSyncStore";
import { AppShell } from "./components/ui/AppShell";
import { Toast } from "./components/ui/Toast";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { AchievementNotification } from "./components/ui/AchievementNotification";
import { OnboardingModal } from "./components/modals/OnboardingModal";
import { LoginView } from "./views/LoginView";
import { Dashboard } from "./views/Dashboard";
import { ReadingView } from "./views/ReadingView";
import { JournalView } from "./views/JournalView";
import { GardenView } from "./views/GardenView";
import { HabitView } from "./views/HabitView";
import { FinanceView } from "./views/FinanceView";
import { PomodoroView } from "./views/PomodoroView";
import { SettingsView } from "./views/SettingsView";
import { ProfileView } from "./views/ProfileView";
import { SearchModal } from "./components/modals/SearchModal";
import { ShortcutsModal } from "./components/modals/ShortcutsModal";
import { CalendarView } from "./views/CalendarView";
import { WeeklyDigest } from "./views/WeeklyDigest";
import { useReminder } from "./hooks/useReminder";
import { FirebaseSyncProvider } from "./components/sync/FirebaseSyncProvider";

function App() {
  const { theme, isDarkMode } = useThemeStore();
  const { currentView, user } = useAppStore();
  const { isAuthenticated, user: firebaseUser } = useSyncStore();
  const [showOnboarding, setShowOnboarding] = useState(!user.name);
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  useReminder();

  // Wait for auth to initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Show login if not authenticated
  if (isCheckingAuth) {
    return (
      <FirebaseSyncProvider>
        <LoadingScreen />
      </FirebaseSyncProvider>
    );
  }

  if (!isAuthenticated || !firebaseUser) {
    return (
      <FirebaseSyncProvider>
        <LoginView />
      </FirebaseSyncProvider>
    );
  }

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg-color", theme.bg);
    root.style.setProperty("--card-color", theme.card);
    root.style.setProperty("--border-color", theme.border);
    root.style.setProperty("--text-main", theme.textMain);
    root.style.setProperty("--text-muted", theme.textMuted);
    root.style.setProperty("--accent", theme.accent);

    // Update body background
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.textMain;
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K for search (works anywhere)
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        return;
      }

      // Only trigger other shortcuts if not typing in input/textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      // Number keys for navigation (1-8)
      const keyMap = {
        1: "dashboard",
        2: "reading",
        3: "journal",
        4: "habits",
        5: "finance",
        6: "pomodoro",
        7: "settings",
        8: "garden",
        9: "calendar",
      };

      if (keyMap[e.key]) {
        e.preventDefault();
        useAppStore.getState().setCurrentView(keyMap[e.key]);
      }

      // G + D for Dashboard (GitHub style)
      if (e.key === "g") {
        const handleSecondKey = (e2) => {
          if (e2.key === "d") {
            e2.preventDefault();
            useAppStore.getState().setCurrentView("dashboard");
          } else if (e2.key === "r") {
            e2.preventDefault();
            useAppStore.getState().setCurrentView("reading");
          } else if (e2.key === "j") {
            e2.preventDefault();
            useAppStore.getState().setCurrentView("journal");
          } else if (e2.key === "h") {
            e2.preventDefault();
            useAppStore.getState().setCurrentView("habits");
          } else if (e2.key === "f") {
            e2.preventDefault();
            useAppStore.getState().setCurrentView("finance");
          } else if (e2.key === "p") {
            e2.preventDefault();
            useAppStore.getState().setCurrentView("pomodoro");
          } else if (e2.key === "s") {
            e2.preventDefault();
            useAppStore.getState().setCurrentView("settings");
          } else if (e2.key === "g") {
            e2.preventDefault();
            useAppStore.getState().setCurrentView("garden");
          } else if (e2.key === "c") {
            e2.preventDefault();
            useAppStore.getState().setCurrentView("calendar");
          }
          document.removeEventListener("keydown", handleSecondKey);
        };
        document.addEventListener("keydown", handleSecondKey, { once: true });
      }

      // Theme toggle with T
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        useThemeStore.getState().toggleTheme();
      }

      // Show shortcuts with ?
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  // View routing
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "reading":
        return <ReadingView />;
      case "journal":
        return <JournalView />;
      case "garden":
        return <GardenView />;
      case "habits":
        return <HabitView />;
      case "finance":
        return <FinanceView />;
      case "pomodoro":
        return <PomodoroView />;
      case "settings":
        return <SettingsView />;
      case "profile":
        return <ProfileView />;
      case "calendar":
        return <CalendarView />;
      case "digest":
        return <WeeklyDigest />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <FirebaseSyncProvider>
      <div className="min-h-screen font-sans selection:bg-(--accent) selection:text-white">
        {/* Noise Overlay */}
        <div className={isDarkMode ? "bg-noise-dark" : "bg-noise-light"}></div>

        {/* App Content */}
        <div className="relative z-10">
          <AppShell>{renderView()}</AppShell>
        </div>

        {/* Toast Notifications */}
        <Toast />

        {/* Achievement Notifications */}
        <AchievementNotification />

        {/* Onboarding Modal */}
        {showOnboarding && (
          <OnboardingModal onComplete={() => setShowOnboarding(false)} />
        )}

        {/* Search Modal */}
        {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}

        {/* Shortcuts Modal */}
        {showShortcuts && (
          <ShortcutsModal onClose={() => setShowShortcuts(false)} />
        )}
      </div>
    </FirebaseSyncProvider>
  );
}

export default App;
