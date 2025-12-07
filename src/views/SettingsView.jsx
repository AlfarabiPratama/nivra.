import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AnimatedPage } from "../components/ui/AnimatedPage";
import { useAppStore } from "../store/useAppStore";
import { usePomodoroStore } from "../store/usePomodoroStore";
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
  Info,
  LogOut,
  UserCog,
} from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
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

export const SettingsView = () => {
  const { user, setCurrentView, notifications, toggleNotification } =
    useAppStore();
  const { settings: pomodoroSettings, updateSettings } = usePomodoroStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
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
  const initialPermission =
    typeof Notification !== "undefined" ? Notification.permission : "default";
  const [notificationStatus, setNotificationStatus] =
    useState(initialPermission);
  const [integrityReport, setIntegrityReport] = useState([]);
  const [integrityLoading, setIntegrityLoading] = useState(false);
  const [reminderTime, setReminderTimeLocal] = useState(
    useAppStore.getState().reminderTime || "08:00"
  );

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

  const handleSavePomodoroSettings = () => {
    updateSettings({
      focusDuration: parseInt(focusDuration),
      shortBreakDuration: parseInt(shortBreak),
      longBreakDuration: parseInt(longBreak),
    });
    addToast("pengaturan pomodoro disimpan", "success");
  };

  const handleExportData = () => {
    const data = buildExportPayload();

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nivra-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast("data berhasil diekspor", "success");
  };

  const handleAskNotificationPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationStatus(permission);
    if (permission === "granted") {
      addToast("notifikasi diizinkan", "success");
    } else {
      addToast("notifikasi diblokir atau tidak didukung", "error");
    }
  };

  const handleUpdateReminderTime = (value) => {
    setReminderTimeLocal(value);
    useAppStore.getState().setReminderTime(value);
    addToast("waktu pengingat diperbarui", "success");
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const applied = importData(json);
      addToast(`import berhasil (${applied.join(", ")})`, "success");
    } catch (error) {
      addToast(error.message || "import gagal, format tidak valid", "error");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleIntegrityCheck = () => {
    setIntegrityLoading(true);
    const report = checkIntegrity();
    setIntegrityReport(report);
    setIntegrityLoading(false);
  };

  const handleResetStore = (name) => {
    const confirmed = window.confirm(
      `Reset store ${name}? Data lokal akan hilang untuk store ini.`
    );
    if (!confirmed) return;
    resetStore(name);
    addToast(`store ${name} direset`, "success");
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Yakin ingin keluar?")) {
      try {
        await signOut();
        addToast("Berhasil keluar", "success");
        window.location.reload();
      } catch (error) {
        console.error("Logout error:", error);
        addToast("Gagal keluar. Coba lagi.", "error");
      }
    }
  };

  const isAnonymous = firebaseUser?.isAnonymous;
  const userEmail = firebaseUser?.email || "Guest";

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h2 className="text-4xl font-serif italic text-(--text-main) mb-2">
            pengaturan.
          </h2>
          <p className="font-mono text-sm text-(--text-muted) border-l-2 border-(--accent) pl-4 italic">
            sesuaikan nivra dengan kebutuhanmu.
          </p>
        </div>

        {/* Profile Navigation Card */}
        <Card>
          <button
            onClick={() => setCurrentView("profile")}
            className="w-full p-6 flex items-center justify-between hover:bg-(--bg-color)/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-(--border-color) overflow-hidden bg-(--bg-color) flex items-center justify-center group-hover:border-(--accent) transition-colors">
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
                <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-main) mb-1">
                  profil pengguna
                </h3>
                <p className="font-mono text-xs text-(--text-muted)">
                  {user.name || "belum ada nama"} • level {user.level} •{" "}
                  {user.xp} XP
                </p>
              </div>
            </div>
            <ChevronRight
              size={20}
              className="text-(--text-muted) group-hover:text-(--accent) transition-colors"
            />
          </button>
        </Card>

        {/* Pomodoro Settings */}
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Timer size={20} className="text-(--accent)" />
              <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                pomodoro
              </h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="font-mono text-xs text-(--text-muted) uppercase">
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
                <label className="font-mono text-xs text-(--text-muted) uppercase">
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
                <label className="font-mono text-xs text-(--text-muted) uppercase">
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

              <div className="pt-3 border-t border-dashed border-(--border-color) space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-(--text-main) uppercase">
                      auto-start istirahat
                    </p>
                    <p className="font-mono text-xs text-(--text-muted) mt-1">
                      mulai istirahat otomatis setelah fokus
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateSettings({
                        autoStartBreaks: !pomodoroSettings.autoStartBreaks,
                      })
                    }
                    className={`p-2 border transition-colors ${
                      pomodoroSettings.autoStartBreaks
                        ? "border-(--accent) bg-(--accent) bg-opacity-10"
                        : "border-(--border-color) hover:border-(--accent)"
                    }`}
                  >
                    {pomodoroSettings.autoStartBreaks ? (
                      <Check size={16} className="text-(--accent)" />
                    ) : (
                      <X size={16} className="text-(--text-muted)" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-(--text-main) uppercase">
                      auto-start fokus
                    </p>
                    <p className="font-mono text-xs text-(--text-muted) mt-1">
                      mulai fokus otomatis setelah istirahat
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateSettings({
                        autoStartPomodoros:
                          !pomodoroSettings.autoStartPomodoros,
                      })
                    }
                    className={`p-2 border transition-colors ${
                      pomodoroSettings.autoStartPomodoros
                        ? "border-(--accent) bg-(--accent) bg-opacity-10"
                        : "border-(--border-color) hover:border-(--accent)"
                    }`}
                  >
                    {pomodoroSettings.autoStartPomodoros ? (
                      <Check size={16} className="text-(--accent)" />
                    ) : (
                      <X size={16} className="text-(--text-muted)" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-(--text-main) uppercase">
                      notifikasi suara
                    </p>
                    <p className="font-mono text-xs text-(--text-muted) mt-1">
                      suara lonceng saat sesi selesai
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateSettings({
                        soundEnabled: !pomodoroSettings.soundEnabled,
                      })
                    }
                    className={`p-2 border transition-colors ${
                      pomodoroSettings.soundEnabled
                        ? "border-(--accent) bg-(--accent) bg-opacity-10"
                        : "border-(--border-color) hover:border-(--accent)"
                    }`}
                  >
                    {pomodoroSettings.soundEnabled ? (
                      <Check size={16} className="text-(--accent)" />
                    ) : (
                      <X size={16} className="text-(--text-muted)" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                variant="accent"
                onClick={handleSavePomodoroSettings}
                className="w-full"
              >
                simpan pengaturan
              </Button>
            </div>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={20} className="text-(--accent)" />
              <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                tampilan
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-(--text-main)">
                  Mode Gelap
                </p>
                <p className="font-mono text-xs text-(--text-muted) mt-1">
                  {isDarkMode ? "the study room" : "the archive"}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="p-3 border border-(--border-color) hover:border-(--accent) transition-colors"
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-(--accent)" />
                ) : (
                  <Moon size={20} className="text-(--accent)" />
                )}
              </button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={20} className="text-(--accent)" />
              <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                notifikasi
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border border-dashed border-(--border-color) px-3 py-2">
                <div>
                  <p className="font-mono text-xs text-(--text-main) uppercase">
                    pomodoro selesai
                  </p>
                  <p className="font-mono text-[11px] text-(--text-muted)">
                    kirim notifikasi ketika sesi fokus berakhir
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => toggleNotification("pomodoroAlerts")}
                  className="px-3"
                >
                  {notifications?.pomodoroAlerts ? (
                    <Check size={14} className="text-(--accent)" />
                  ) : (
                    <X size={14} className="text-(--text-muted)" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between border border-dashed border-(--border-color) px-3 py-2">
                <div>
                  <p className="font-mono text-xs text-(--text-main) uppercase">
                    pengingat tugas
                  </p>
                  <p className="font-mono text-[11px] text-(--text-muted)">
                    pengingat harian untuk tugas jatuh tempo & kebiasaan
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => toggleNotification("taskAlerts")}
                  className="px-3"
                >
                  {notifications?.taskAlerts ? (
                    <Check size={14} className="text-(--accent)" />
                  ) : (
                    <X size={14} className="text-(--text-muted)" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between border border-dashed border-(--border-color) px-3 py-2">
                <div>
                  <p className="font-mono text-xs text-(--text-main) uppercase">
                    pengingat harian
                  </p>
                  <p className="font-mono text-[11px] text-(--text-muted)">
                    jam pengingat
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => handleUpdateReminderTime(e.target.value)}
                    className="border border-(--border-color) bg-transparent px-2 py-1 font-mono text-xs text-(--text-main)"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => toggleNotification("reminders")}
                    className="px-3"
                  >
                    {notifications?.reminders ? (
                      <Check size={14} className="text-(--accent)" />
                    ) : (
                      <X size={14} className="text-(--text-muted)" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border border-dashed border-(--border-color) px-3 py-2">
                <div>
                  <p className="font-mono text-xs text-(--text-main) uppercase">
                    izin browser
                  </p>
                  <p className="font-mono text-[11px] text-(--text-muted)">
                    status: {notificationStatus}
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

        {/* Dashboard Layout */}
        <Card variant="dashed" className="border-hover-dashed">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-(--text-muted)">
                  tata letak dashboard
                </p>
                <p className="font-mono text-xs text-(--text-muted)">
                  atur urutan dan visibilitas widget utama.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="font-mono text-xs border border-(--border-color) bg-transparent px-2 py-1 text-(--text-main)"
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
                  title="kembalikan urutan default"
                >
                  <RotateCcw size={14} />
                  <span>reset</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                    <p className="font-mono text-xs text-(--text-main) uppercase">
                      {widgetLabelMap[id] || id}
                    </p>
                    <p className="font-mono text-[10px] text-(--text-muted)">
                      posisi #{index + 1}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => moveWidget(id, "up")}
                      disabled={index === 0}
                      className="px-2 py-1"
                      title="geser ke atas"
                    >
                      <ArrowUp size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => moveWidget(id, "down")}
                      disabled={index === mergedWidgetOrder.length - 1}
                      className="px-2 py-1"
                      title="geser ke bawah"
                    >
                      <ArrowDown size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => toggleWidgetVisibility(id)}
                      className="px-2 py-1"
                      title={
                        hiddenWidgets.includes(id) ? "tampilkan" : "sembunyikan"
                      }
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

        {/* Data Management */}
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Download size={20} className="text-(--accent)" />
              <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                data
              </h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  onClick={handleExportData}
                  className="w-full"
                >
                  <Download size={16} />
                  <span>ekspor data (v{SCHEMA_VERSION})</span>
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
                  <div className="h-full">
                    <Button
                      variant="ghost"
                      type="button"
                      className="w-full cursor-pointer"
                    >
                      <Upload size={16} />
                      <span>{isImporting ? "memuat..." : "import data"}</span>
                    </Button>
                  </div>
                </label>
              </div>

              {/* Firebase Sync Migration */}
              <MigrationButton />

              <Button
                variant="ghost"
                onClick={handleClearData}
                className="w-full text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
                <span>hapus semua data</span>
              </Button>

              <p className="font-mono text-xs text-(--text-muted) italic text-center pt-2 border-t border-dashed border-(--border-color)">
                backup datamu secara berkala untuk menghindari kehilangan.
              </p>
            </div>
          </div>
        </Card>

        {/* Account Management */}
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <UserCog size={20} className="text-(--accent)" />
              <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                akun
              </h3>
            </div>

            {/* Account Info Display */}
            <div className="p-4 bg-(--bg-color) border border-dashed border-(--border-color) rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-(--text-muted)">
                  Status:
                </span>
                <span className="font-mono text-sm text-(--text-main)">
                  {isAnonymous ? "🔒 Guest Mode" : "✅ Signed In"}
                </span>
              </div>
              {!isAnonymous && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-(--text-muted)">
                    Email:
                  </span>
                  <span className="font-mono text-sm text-(--text-main)">
                    {userEmail}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-(--text-muted)">
                  Sync:
                </span>
                <span className="font-mono text-sm text-(--text-main)">
                  {isAuthenticated ? "☁️ Enabled" : "⚠️ Disabled"}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full text-red-500 hover:text-red-600"
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </Button>

            <p className="font-mono text-xs text-(--text-muted) italic text-center pt-2 border-t border-dashed border-(--border-color)">
              {isAnonymous
                ? "💡 Masuk dengan Google untuk sync di semua device"
                : "Data kamu aman dan ter-sync di cloud"}
            </p>
          </div>
        </Card>

        {/* Integrity Checker */}
        <Card variant="dashed" className="border-hover-dashed">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-(--text-muted)">
                  integritas data
                </p>
                <p className="font-mono text-xs text-(--text-muted)">
                  cek konsistensi localStorage per store.
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

            <div className="space-y-2">
              {integrityReport.length === 0 ? (
                <p className="font-mono text-xs text-(--text-muted)">
                  belum ada laporan. klik "run check".
                </p>
              ) : (
                integrityReport.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border border-dashed border-(--border-color) px-3 py-2"
                  >
                    <div>
                      <p className="font-mono text-xs text-(--text-main)">
                        {item.name}
                      </p>
                      <p className="font-mono text-[11px] text-(--text-muted)">
                        status: {item.status}{" "}
                        {item.size ? `• ${item.size} chars` : ""}
                        {item.missing?.length
                          ? ` • missing: ${item.missing.join(", ")}`
                          : ""}
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
                ))
              )}
            </div>
          </div>
        </Card>

        {/* App Info */}
        <Card variant="dashed">
          <div className="p-6 text-center space-y-2">
            <p className="font-serif text-2xl italic text-(--text-main)">
              nivra
            </p>
            <p className="font-mono text-xs text-(--text-muted)">
              digital sanctuary • v1.0.0
            </p>
            <div className="pt-3 border-t border-dashed border-(--border-color) mt-3">
              <p className="font-serif italic text-sm text-(--text-muted)">
                "perlahan tapi pasti."
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};
