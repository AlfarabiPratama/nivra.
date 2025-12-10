import { useState } from "react";
import {
  Home,
  BookOpen,
  Timer,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { MobileActionSheet } from "./MobileActionSheet";
import clsx from "clsx";

export const BottomNavigation = () => {
  const { currentView, setCurrentView } = useAppStore();
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  // Primary items - limited to 5 for better UX (research-backed)
  const navItems = [
    { id: "dashboard", label: "beranda", icon: Home },
    { id: "reading", label: "bacaan", icon: BookOpen },
    { id: "pomodoro", label: "fokus", icon: Timer },
    { id: "calendar", label: "jadwal", icon: CalendarDays },
  ];

  // Check if current view is in secondary menu
  const secondaryViews = [
    "journal",
    "habits",
    "finance",
    "garden",
    "settings",
    "digest",
  ];
  const isInSecondary = secondaryViews.includes(currentView);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 bg-(--card-color) border-t border-(--border-color) z-40 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex justify-around items-center h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={clsx(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-2",
                  "min-h-[48px] min-w-[48px]", // Touch-friendly target
                  "active:scale-95 transition-all duration-150",
                  isActive ? "text-(--accent)" : "text-(--text-muted)"
                )}
              >
                <div
                  className={clsx(
                    "p-1.5 rounded-xl transition-colors",
                    isActive && "bg-(--accent)/10"
                  )}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  className={clsx(
                    "font-mono text-[10px] lowercase",
                    isActive && "font-medium"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMoreSheet(true)}
            className={clsx(
              "flex flex-col items-center justify-center gap-1 flex-1 py-2",
              "min-h-[48px] min-w-[48px]",
              "active:scale-95 transition-all duration-150",
              isInSecondary ? "text-(--accent)" : "text-(--text-muted)"
            )}
          >
            <div
              className={clsx(
                "p-1.5 rounded-xl transition-colors relative",
                isInSecondary && "bg-(--accent)/10"
              )}
            >
              <MoreHorizontal size={22} strokeWidth={isInSecondary ? 2.5 : 2} />
              {isInSecondary && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-(--accent) rounded-full" />
              )}
            </div>
            <span
              className={clsx(
                "font-mono text-[10px] lowercase",
                isInSecondary && "font-medium"
              )}
            >
              lainnya
            </span>
          </button>
        </div>
      </nav>

      {/* Action Sheet */}
      <MobileActionSheet
        isOpen={showMoreSheet}
        onClose={() => setShowMoreSheet(false)}
      />
    </>
  );
};
