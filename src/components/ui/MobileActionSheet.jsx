import { motion, AnimatePresence } from "framer-motion";
import {
  BookText,
  CheckCircle,
  Wallet,
  Sprout,
  Settings,
  X,
  Sun,
  Moon,
  Keyboard,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useThemeStore } from "../../store/useThemeStore";
import clsx from "clsx";

export const MobileActionSheet = ({ isOpen, onClose }) => {
  const { setCurrentView } = useAppStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const menuItems = [
    {
      id: "journal",
      label: "jurnal",
      icon: BookText,
      description: "catatan harian",
    },
    {
      id: "habits",
      label: "kebiasaan",
      icon: CheckCircle,
      description: "tracker kebiasaan",
    },
    {
      id: "finance",
      label: "keuangan",
      icon: Wallet,
      description: "kelola finansial",
    },
    {
      id: "garden",
      label: "taman",
      icon: Sprout,
      description: "gamifikasi tumbuhan",
    },
    {
      id: "settings",
      label: "pengaturan",
      icon: Settings,
      description: "preferensi aplikasi",
    },
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-(--card-color) border-t-2 border-(--border-color) z-50 rounded-t-2xl max-h-[80vh] overflow-hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-(--border-color) rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-dashed border-(--border-color)">
              <h2 className="font-serif text-lg text-(--text-main) lowercase">
                menu lainnya
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-(--text-muted) hover:text-(--text-main) transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Grid */}
            <div className="p-4 grid grid-cols-3 gap-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={clsx(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-xl",
                      "bg-(--bg-color) border border-(--border-color)",
                      "active:scale-95 transition-transform duration-150",
                      "min-h-[80px]"
                    )}
                  >
                    <Icon size={24} className="text-(--accent)" />
                    <span className="font-mono text-xs text-(--text-main) lowercase">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-4 space-y-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={clsx(
                  "w-full flex items-center gap-4 p-4 rounded-xl",
                  "bg-(--bg-color) border border-dashed border-(--border-color)",
                  "active:scale-98 transition-transform"
                )}
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-amber-400" />
                ) : (
                  <Moon size={20} className="text-indigo-400" />
                )}
                <div className="flex-1 text-left">
                  <span className="font-mono text-sm text-(--text-main) lowercase block">
                    {isDarkMode ? "mode siang" : "mode malam"}
                  </span>
                  <span className="font-mono text-xs text-(--text-muted)">
                    tekan untuk beralih
                  </span>
                </div>
              </button>

              {/* Keyboard Shortcuts Hint */}
              <div className="flex items-center gap-2 px-2 py-2 opacity-50">
                <Keyboard size={14} className="text-(--text-muted)" />
                <span className="font-mono text-[10px] text-(--text-muted) uppercase tracking-wide">
                  tekan ? untuk shortcuts
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
