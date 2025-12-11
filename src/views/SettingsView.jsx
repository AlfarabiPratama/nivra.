import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Switch } from "../components/ui/Switch";
import { AnimatedPage } from "../components/ui/AnimatedPage";
import { useAppStore } from "../store/useAppStore";
import { usePomodoroStore } from "../store/usePomodoroStore";
import { useSoundscapesStore } from "../store/useSoundscapesStore";
import { useToastStore } from "../store/useToastStore";
import {
  User,
  Timer,
  Palette,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Check,
  X,
  ChevronRight,
  Bell,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RotateCcw,
  LogOut,
  UserCog,
  Settings,
  Database,
  Layout,
  Volume2,
} from "lucide-react";
import { useThemeStore, ACCENT_COLORS } from "../store/useThemeStore";
import {
  buildExportPayload,
  importData,
  SCHEMA_VERSION,
} from "../store/dataExport";
import { requestNotificationPermission } from "../utils/notifications";
import { useLayoutStore, PRESETS } from "../store/useLayoutStore";
import { checkIntegrity, resetStore } from "../utils/schema";
import { MigrationButton } from "../utils/migrationHelper.jsx";
import { useSyncStore } from "../store/useSyncStore";
import { signOut } from "../services/authService";
import clsx from "clsx";

// Tab definitions
const TABS = [
  { id: "general", label: "Umum", icon: Settings },
  { id: "appearance", label: "Tampilan", icon: Palette },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "layout", label: "Layout", icon: Layout },
  { id: "data", label: "Data", icon: Database },
  { id: "account", label: "Akun", icon: UserCog },
];

export const SettingsView = () => {
  const { user, setCurrentView, notifications, toggleNotification } =
    useAppStore();
  const { settings: pomodoroSettings, updateSettings } = usePomodoroStore();
  const { isDarkMode, toggleTheme, accentColorId, setAccentColor } =
    useThemeStore();
  const { addToast } = useToastStore();
  const { user: firebaseUser, isAuthenticated } = useSyncStore();
  const {
    widgetOrder,
    hiddenWidgets,
    moveWidget,
    toggleWidgetVisibility,
    resetLayout,
    setWidgetOrder,
    applyPreset,
  } = useLayoutStore();

  // Active tab state
  const [activeTab, setActiveTab] = useState("general");
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'saved'

  const [focusDuration, setFocusDuration] = useState(
    pomodoroSettings.focusDuration
  );
  const [shortBreak, setShortBreak] = useState(
    pomodoroSettings.shortBreakDuration
  );
  const [longBreak, setLongBreak] = useState(
    pomodoroSettings.longBreakDuration
  );
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const initialPermission =
    typeof Notification !== "undefined" ? Notification.permission : "default";
  const [notificationStatus, setNotificationStatus] =
    useState(initialPermission);
  const [integrityReport, setIntegrityReport] = useState([]);
  const [integrityLoading, setIntegrityLoading] = useState(false);
  const [reminderTime, setReminderTimeLocal] = useState(
    useAppStore.getState().reminderTime || "08:00"
  );

  // Auto-save for Pomodoro duration settings with debounce
  useEffect(() => {
    // Skip initial render
    if (
      focusDuration === pomodoroSettings.focusDuration &&
      shortBreak === pomodoroSettings.shortBreakDuration &&
      longBreak === pomodoroSettings.longBreakDuration
    ) {
      return;
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus("saving");

    // Debounce save by 500ms
    saveTimeoutRef.current = setTimeout(() => {
      const focus = parseInt(focusDuration) || 25;
      const short = parseInt(shortBreak) || 5;
      const long = parseInt(longBreak) || 15;

      updateSettings({
        focusDuration: Math.min(60, Math.max(1, focus)),
        shortBreakDuration: Math.min(30, Math.max(1, short)),
        longBreakDuration: Math.min(60, Math.max(1, long)),
      });

      setSaveStatus("saved");

      // Clear saved status after 2 seconds
      setTimeout(() => setSaveStatus(null), 2000);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    focusDuration,
    shortBreak,
    longBreak,
    updateSettings,
    pomodoroSettings.focusDuration,
    pomodoroSettings.shortBreakDuration,
    pomodoroSettings.longBreakDuration,
  ]);

  const widgetLabelMap = {
    weeklyReview: "weekly review",
    weeklyInsights: "weekly insights",
    taskAnalytics: "task analytics",
    pomodoro: "pomodoro summary",
  };

  const mergedWidgetOrder = useMemo(() => {
    const required = [
      "weeklyReview",
      "weeklyInsights",
      "taskAnalytics",
      "pomodoro",
    ];
    return Array.from(new Set([...widgetOrder, ...required]));
  }, [widgetOrder]);

  useEffect(() => {
    const missing = mergedWidgetOrder.filter((id) => !widgetOrder.includes(id));
    if (missing.length > 0) {
      setWidgetOrder(mergedWidgetOrder);
    }
  }, [mergedWidgetOrder, widgetOrder, setWidgetOrder]);

  const handleExportData = async () => {
    try {
      const exportPayload = buildExportPayload();
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nivra-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      addToast("data berhasil di-export ✓", "success");
    } catch {
      addToast("gagal mengekspor data", "error");
    }
  };

  const handleAskNotificationPermission = async () => {
    const result = await requestNotificationPermission();
    setNotificationStatus(result);
    if (result === "granted") addToast("notifikasi diizinkan ✓", "success");
    else addToast("izin tidak diberikan", "info");
  };

  const handleUpdateReminderTime = (value) => {
    setReminderTimeLocal(value);
    useAppStore.setState({ reminderTime: value });
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      importData(json);
      addToast("data berhasil di-import ✓", "success");
    } catch (err) {
      console.error(err);
      addToast("gagal mengimport data: format invalid", "error");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleIntegrityCheck = async () => {
    setIntegrityLoading(true);
    const report = checkIntegrity();
    setIntegrityReport(report);
    setIntegrityLoading(false);
  };

  const handleResetStore = (name) => {
    if (confirm(`reset store "${name}"? data akan dikembalikan ke default.`)) {
      resetStore(name);
      addToast(`store '${name}' berhasil direset`, "success");
      handleIntegrityCheck();
    }
  };

  const handleClearData = () => {
    if (
      confirm(
        "PERINGATAN: Ini akan menghapus SEMUA data. Apakah kamu yakin? Backup data dulu jika perlu."
      )
    ) {
      localStorage.clear();
      addToast("semua data dihapus. refresh halaman...", "info");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleLogout = async () => {
    if (confirm("Apakah kamu yakin ingin keluar?")) {
      try {
        await signOut();
        addToast("Berhasil keluar", "success");
        setCurrentView("dashboard");
      } catch (error) {
        console.error("Logout error:", error);
        addToast("Gagal keluar. Coba lagi.", "error");
      }
    }
  };

  const isAnonymous = firebaseUser?.isAnonymous;
  const userEmail = firebaseUser?.email || "Guest";

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <GeneralTab
            focusDuration={focusDuration}
            setFocusDuration={setFocusDuration}
            shortBreak={shortBreak}
            setShortBreak={setShortBreak}
            longBreak={longBreak}
            setLongBreak={setLongBreak}
            pomodoroSettings={pomodoroSettings}
            updateSettings={updateSettings}
            saveStatus={saveStatus}
          />
        );
      case "appearance":
        return (
          <AppearanceTab
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            accentColorId={accentColorId}
            setAccentColor={setAccentColor}
            accentColors={ACCENT_COLORS}
          />
        );
      case "notifications":
        return (
          <NotificationsTab
            notifications={notifications}
            toggleNotification={toggleNotification}
            notificationStatus={notificationStatus}
            handleAskNotificationPermission={handleAskNotificationPermission}
            reminderTime={reminderTime}
            handleUpdateReminderTime={handleUpdateReminderTime}
          />
        );
      case "layout":
        return (
          <LayoutTab
            mergedWidgetOrder={mergedWidgetOrder}
            widgetLabelMap={widgetLabelMap}
            hiddenWidgets={hiddenWidgets}
            moveWidget={moveWidget}
            toggleWidgetVisibility={toggleWidgetVisibility}
            resetLayout={resetLayout}
            setWidgetOrder={setWidgetOrder}
            applyPreset={applyPreset}
          />
        );
      case "data":
        return (
          <DataTab
            handleExportData={handleExportData}
            handleImport={handleImport}
            handleClearData={handleClearData}
            isImporting={isImporting}
            fileInputRef={fileInputRef}
            integrityReport={integrityReport}
            integrityLoading={integrityLoading}
            handleIntegrityCheck={handleIntegrityCheck}
            handleResetStore={handleResetStore}
          />
        );
      case "account":
        return (
          <AccountTab
            isAnonymous={isAnonymous}
            userEmail={userEmail}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h2 className="type-h1 mb-2">pengaturan.</h2>
          <p className="type-body text-(--text-muted) border-l-2 border-(--accent) pl-4 italic">
            sesuaikan nivra dengan kebutuhanmu.
          </p>
        </div>

        {/* Profile Quick Card */}
        <Card>
          <button
            onClick={() => setCurrentView("profile")}
            className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-(--bg-color)/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-dashed border-(--border-color) overflow-hidden bg-(--bg-color) flex items-center justify-center group-hover:border-(--accent) transition-colors">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} className="text-(--text-muted)" />
                )}
              </div>
              <div className="text-left">
                <h3 className="type-label text-(--text-main) mb-1">
                  {user.name || "belum ada nama"}
                </h3>
                <p className="type-caption text-(--text-muted)">
                  Level {user.level} • {user.xp} XP
                </p>
              </div>
            </div>
            <ChevronRight
              size={20}
              className="text-(--text-muted) group-hover:text-(--accent) transition-colors"
            />
          </button>
        </Card>

        {/* Tab Navigation */}
        <div className="border-b border-(--border-color)">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide pb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-3 type-label whitespace-nowrap transition-all border-b-2 -mb-px",
                    activeTab === tab.id
                      ? "border-(--accent) text-(--accent)"
                      : "border-transparent text-(--text-muted) hover:text-(--text-main) hover:border-(--border-color)"
                  )}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">{renderTabContent()}</div>

        {/* App Info */}
        <Card>
          <div className="p-6 text-center space-y-2">
            <div className="flex justify-center">
              <img
                src={
                  isDarkMode ? "/dark mode nivra.png" : "/nivra light mode .png"
                }
                alt="Nivra"
                className="w-32 h-auto opacity-90"
              />
            </div>
            <p className="type-caption text-(--text-muted)">
              digital sanctuary • v1.0.0
            </p>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};

// === TAB COMPONENTS ===

// General Tab - Pomodoro Settings
const GeneralTab = ({
  focusDuration,
  setFocusDuration,
  shortBreak,
  setShortBreak,
  longBreak,
  setLongBreak,
  pomodoroSettings,
  updateSettings,
  saveStatus,
}) => (
  <div className="space-y-4">
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer size={20} className="text-(--accent)" />
            <h3 className="type-label text-(--text-muted)">pomodoro</h3>
          </div>
          {/* Auto-save Status Indicator */}
          {saveStatus && (
            <div
              className={clsx(
                "flex items-center gap-2 px-3 py-1 type-caption transition-all",
                saveStatus === "saving" && "text-(--text-muted)",
                saveStatus === "saved" && "text-(--accent)"
              )}
            >
              {saveStatus === "saving" && (
                <>
                  <span className="w-2 h-2 bg-(--text-muted) rounded-full animate-pulse" />
                  <span>menyimpan...</span>
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <Check size={12} />
                  <span>tersimpan</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="type-label text-(--text-muted)">
              Durasi Fokus (menit)
            </label>
            <Input
              type="number"
              min="1"
              max="60"
              value={focusDuration}
              onChange={(e) => setFocusDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="type-label text-(--text-muted)">
              Istirahat Pendek (menit)
            </label>
            <Input
              type="number"
              min="1"
              max="30"
              value={shortBreak}
              onChange={(e) => setShortBreak(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="type-label text-(--text-muted)">
              Istirahat Panjang (menit)
            </label>
            <Input
              type="number"
              min="1"
              max="60"
              value={longBreak}
              onChange={(e) => setLongBreak(e.target.value)}
            />
          </div>
        </div>

        <p className="type-caption text-(--text-muted) italic pt-2">
          ✨ perubahan disimpan otomatis
        </p>

        <div className="pt-4 border-t border-dashed border-(--border-color) space-y-4">
          <Switch
            label="Auto-start istirahat"
            description="Mulai istirahat otomatis setelah fokus"
            checked={pomodoroSettings.autoStartBreaks}
            onChange={() =>
              updateSettings({
                autoStartBreaks: !pomodoroSettings.autoStartBreaks,
              })
            }
          />

          <Switch
            label="Auto-start fokus"
            description="Mulai fokus otomatis setelah istirahat"
            checked={pomodoroSettings.autoStartPomodoros}
            onChange={() =>
              updateSettings({
                autoStartPomodoros: !pomodoroSettings.autoStartPomodoros,
              })
            }
          />

          <Switch
            label="Notifikasi suara"
            description="Suara lonceng saat sesi selesai"
            checked={pomodoroSettings.soundEnabled}
            onChange={() =>
              updateSettings({ soundEnabled: !pomodoroSettings.soundEnabled })
            }
          />
        </div>
      </div>
    </Card>

    {/* Soundscapes Settings */}
    <SoundscapesSettings />
  </div>
);

// Soundscapes Settings Component
const SoundscapesSettings = () => {
  const { showPopup, togglePopup } = useSoundscapesStore();

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 size={20} className="text-(--accent)" />
          <h3 className="type-label text-(--text-muted)">soundscapes</h3>
        </div>

        <Switch
          label="Tampilkan tombol soundscapes"
          description="Tombol floating di kanan atas untuk kontrol audio ambient"
          checked={showPopup}
          onChange={togglePopup}
        />
      </div>
    </Card>
  );
};

// Appearance Tab
const AppearanceTab = ({
  isDarkMode,
  toggleTheme,
  accentColorId,
  setAccentColor,
  accentColors,
}) => (
  <div className="space-y-4">
    {/* Theme Mode Card */}
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={20} className="text-(--accent)" />
          <h3 className="type-label text-(--text-muted)">tema</h3>
        </div>

        <div className="flex items-center justify-between p-4 border border-dashed border-(--border-color)">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-(--border-color) rounded">
              {isDarkMode ? (
                <Moon size={18} className="text-(--accent)" />
              ) : (
                <Sun size={18} className="text-(--accent)" />
              )}
            </div>
            <div>
              <p className="type-body text-(--text-main)">Mode Gelap</p>
              <p className="type-caption text-(--text-muted) mt-0.5">
                {isDarkMode ? "the study room" : "the archive"}
              </p>
            </div>
          </div>
          <Switch checked={isDarkMode} onChange={toggleTheme} size="lg" />
        </div>
      </div>
    </Card>

    {/* Accent Color Picker Card */}
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={20} className="text-(--accent)" />
          <h3 className="type-label text-(--text-muted)">warna aksen</h3>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {accentColors.map((color) => {
            const isSelected = accentColorId === color.id;
            const colorValue = isDarkMode ? color.dark : color.light;

            return (
              <button
                key={color.id}
                onClick={() => setAccentColor(color.id)}
                className={clsx(
                  "flex flex-col items-center gap-2 p-3 border transition-all",
                  isSelected
                    ? "border-current bg-current/10"
                    : "border-(--border-color) hover:border-current"
                )}
                style={{
                  "--current-color": colorValue,
                  borderColor: isSelected ? colorValue : undefined,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: colorValue,
                    borderColor: isSelected ? "white" : "transparent",
                  }}
                />
                <span className="type-caption uppercase tracking-wider text-(--text-muted)">
                  {color.name}
                </span>
                {isSelected && <Check size={12} className="text-(--accent)" />}
              </button>
            );
          })}
        </div>

        <p className="type-caption text-(--text-muted) italic text-center pt-2 border-t border-dashed border-(--border-color)">
          warna aksen diterapkan di seluruh aplikasi
        </p>
      </div>
    </Card>
  </div>
);

// Notifications Tab
const NotificationsTab = ({
  notifications,
  toggleNotification,
  notificationStatus,
  handleAskNotificationPermission,
  reminderTime,
  handleUpdateReminderTime,
}) => (
  <div className="space-y-4">
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={20} className="text-(--accent)" />
          <h3 className="type-label text-(--text-muted)">notifikasi</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border border-dashed border-(--border-color) px-4 py-3">
            <div>
              <p className="type-label text-(--text-main)">Pomodoro selesai</p>
              <p className="type-caption text-(--text-muted)">
                Notifikasi ketika sesi fokus berakhir
              </p>
            </div>
            <Switch
              checked={notifications?.pomodoroAlerts}
              onChange={() => toggleNotification("pomodoroAlerts")}
            />
          </div>

          <div className="flex items-center justify-between border border-dashed border-(--border-color) px-4 py-3">
            <div>
              <p className="type-label text-(--text-main)">Pengingat tugas</p>
              <p className="type-caption text-(--text-muted)">
                Pengingat untuk tugas jatuh tempo
              </p>
            </div>
            <Switch
              checked={notifications?.taskAlerts}
              onChange={() => toggleNotification("taskAlerts")}
            />
          </div>

          <div className="flex items-center justify-between border border-dashed border-(--border-color) px-4 py-3">
            <div>
              <p className="type-label text-(--text-main)">Pengingat harian</p>
              <p className="type-caption text-(--text-muted)">Jam pengingat</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => handleUpdateReminderTime(e.target.value)}
                className="border border-(--border-color) bg-transparent px-2 py-1 type-body text-(--text-main)"
              />
              <Switch
                checked={notifications?.reminders}
                onChange={() => toggleNotification("reminders")}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border border-dashed border-(--border-color) px-4 py-3">
            <div>
              <p className="type-label text-(--text-main)">Izin browser</p>
              <p className="type-caption text-(--text-muted)">
                Status: {notificationStatus}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleAskNotificationPermission}
              className="px-3"
            >
              minta izin
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// Layout Tab
const LayoutTab = ({
  mergedWidgetOrder,
  widgetLabelMap,
  hiddenWidgets,
  moveWidget,
  toggleWidgetVisibility,
  resetLayout,
  setWidgetOrder,
  applyPreset,
}) => (
  <div className="space-y-4">
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-label text-(--text-main)">
              Tata Letak Dashboard
            </p>
            <p className="type-caption text-(--text-muted)">
              Atur urutan dan visibilitas widget.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="type-caption border border-(--border-color) bg-transparent px-2 py-1 text-(--text-main)"
              onChange={(e) => applyPreset(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                preset
              </option>
              {Object.keys(PRESETS).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              onClick={resetLayout}
              className="px-3"
              title="Reset to default"
            >
              <RotateCcw size={14} />
              <span>reset</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {mergedWidgetOrder.map((id, index) => (
            <div
              key={id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/widget-id", id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData("text/widget-id");
                if (!draggedId || draggedId === id) return;
                const currentOrder = [...mergedWidgetOrder];
                const from = currentOrder.indexOf(draggedId);
                const to = currentOrder.indexOf(id);
                if (from === -1 || to === -1) return;
                currentOrder.splice(from, 1);
                currentOrder.splice(to, 0, draggedId);
                setWidgetOrder(currentOrder);
              }}
              className="flex items-center justify-between gap-2 border border-dashed border-(--border-color) px-3 py-2 bg-(--bg-color)/60 cursor-move"
            >
              <div>
                <p className="type-label text-(--text-main)">
                  {widgetLabelMap[id] || id}
                </p>
                <p className="type-caption text-(--text-muted)">
                  posisi #{index + 1}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  onClick={() => moveWidget(id, "up")}
                  disabled={index === 0}
                  className="px-2 py-1"
                >
                  <ArrowUp size={12} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => moveWidget(id, "down")}
                  disabled={index === mergedWidgetOrder.length - 1}
                  className="px-2 py-1"
                >
                  <ArrowDown size={12} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => toggleWidgetVisibility(id)}
                  className="px-2 py-1"
                >
                  {hiddenWidgets.includes(id) ? (
                    <Eye size={12} />
                  ) : (
                    <EyeOff size={12} />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

// Data Tab
const DataTab = ({
  handleExportData,
  handleImport,
  handleClearData,
  isImporting,
  fileInputRef,
  integrityReport,
  integrityLoading,
  handleIntegrityCheck,
  handleResetStore,
}) => (
  <div className="space-y-4">
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Download size={20} className="text-(--accent)" />
          <h3 className="type-label text-(--text-muted)">ekspor & impor</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button variant="ghost" onClick={handleExportData} className="w-full">
            <Download size={16} />
            <span>Ekspor data (v{SCHEMA_VERSION})</span>
          </Button>

          <label className="w-full">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
              disabled={isImporting}
            />
            <Button
              variant="ghost"
              type="button"
              className="w-full cursor-pointer"
            >
              <Upload size={16} />
              <span>{isImporting ? "memuat..." : "Impor data"}</span>
            </Button>
          </label>
        </div>

        <MigrationButton />

        <p className="type-caption text-(--text-muted) italic text-center pt-2 border-t border-dashed border-(--border-color)">
          Backup datamu secara berkala
        </p>
      </div>
    </Card>

    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-label text-(--text-main)">Integritas Data</p>
            <p className="type-caption text-(--text-muted)">
              Cek konsistensi localStorage per store.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleIntegrityCheck}
            className="px-3"
          >
            <span>{integrityLoading ? "cek..." : "run check"}</span>
          </Button>
        </div>

        {integrityReport.length > 0 && (
          <div className="space-y-2">
            {integrityReport.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between border border-dashed border-(--border-color) px-3 py-2"
              >
                <div>
                  <p className="type-body text-(--text-main)">{item.name}</p>
                  <p className="type-caption text-(--text-muted)">
                    status: {item.status}{" "}
                    {item.size ? `• ${item.size} chars` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleResetStore(item.name)}
                  className="px-2 py-1"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>

    <Card>
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={handleClearData}
          className="w-full text-red-500 hover:text-red-600"
        >
          <Trash2 size={16} />
          <span>Hapus semua data</span>
        </Button>
      </div>
    </Card>
  </div>
);

// Account Tab
const AccountTab = ({
  isAnonymous,
  userEmail,
  isAuthenticated,
  handleLogout,
}) => (
  <div className="space-y-4">
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <UserCog size={20} className="text-(--accent)" />
          <h3 className="type-label text-(--text-muted)">informasi akun</h3>
        </div>

        <div className="p-4 bg-(--bg-color) border border-dashed border-(--border-color) space-y-3">
          <div className="flex items-center justify-between">
            <span className="type-caption text-(--text-muted)">Status:</span>
            <span className="type-body text-(--text-main)">
              {isAnonymous ? "🔒 Guest Mode" : "✅ Signed In"}
            </span>
          </div>
          {!isAnonymous && (
            <div className="flex items-center justify-between">
              <span className="type-caption text-(--text-muted)">Email:</span>
              <span className="type-body text-(--text-main)">{userEmail}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="type-caption text-(--text-muted)">Sync:</span>
            <span className="type-body text-(--text-main)">
              {isAuthenticated ? "☁️ Enabled" : "⚠️ Disabled"}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full text-red-500 hover:text-red-600"
        >
          <LogOut size={16} />
          <span>Keluar</span>
        </Button>

        <p className="type-caption text-(--text-muted) italic text-center pt-2 border-t border-dashed border-(--border-color)">
          {isAnonymous
            ? "💡 Masuk dengan Google untuk sync di semua device"
            : "Data kamu aman dan ter-sync di cloud"}
        </p>
      </div>
    </Card>
  </div>
);

// Legacy helper components removed - now using Switch component from ../components/ui/Switch
