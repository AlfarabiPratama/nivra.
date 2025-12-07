import { Routes, Route, Navigate } from "react-router-dom";
import { LoginView } from "../views/LoginView";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { AppShell } from "../components/ui/AppShell";
import { Dashboard } from "../views/Dashboard";
import { ReadingView } from "../views/ReadingView";
import { JournalView } from "../views/JournalView";
import { GardenView } from "../views/GardenView";
import { HabitView } from "../views/HabitView";
import { FinanceView } from "../views/FinanceView";
import { PomodoroView } from "../views/PomodoroView";
import { SettingsView } from "../views/SettingsView";
import { ProfileView } from "../views/ProfileView";
import { CalendarView } from "../views/CalendarView";
import { WeeklyDigest } from "../views/WeeklyDigest";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Route - Login */}
      <Route path="/login" element={<LoginView />} />

      {/* Protected Routes - Main App */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
