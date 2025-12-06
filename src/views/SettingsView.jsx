import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AnimatedPage } from '../components/ui/AnimatedPage';
import { useAppStore } from '../store/useAppStore';
import { usePomodoroStore } from '../store/usePomodoroStore';
import { useToastStore } from '../store/useToastStore';
import { User, Timer, Palette, Download, Upload, Trash2, Sun, Moon, Check, X, ChevronRight } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export const SettingsView = () => {
  const { user, setCurrentView } = useAppStore();
  const { settings: pomodoroSettings, updateSettings } = usePomodoroStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { addToast } = useToastStore();

  const [focusDuration, setFocusDuration] = useState(pomodoroSettings.focusDuration);
  const [shortBreak, setShortBreak] = useState(pomodoroSettings.shortBreakDuration);
  const [longBreak, setLongBreak] = useState(pomodoroSettings.longBreakDuration);

  const handleSavePomodoroSettings = () => {
    updateSettings({
      focusDuration: parseInt(focusDuration),
      shortBreakDuration: parseInt(shortBreak),
      longBreakDuration: parseInt(longBreak)
    });
    addToast('pengaturan pomodoro disimpan', 'success');
  };

  const handleExportData = () => {
    const data = {
      user,
      timestamp: new Date().toISOString(),
      // Add other store data as needed
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nivra-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addToast('data berhasil diekspor', 'success');
  };

  const handleClearData = () => {
    if (window.confirm('Yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

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
            onClick={() => setCurrentView('profile')}
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
                  {user.name || 'belum ada nama'} • level {user.level} • {user.xp} XP
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-(--text-muted) group-hover:text-(--accent) transition-colors" />
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
                    <p className="font-mono text-xs text-(--text-main) uppercase">auto-start istirahat</p>
                    <p className="font-mono text-xs text-(--text-muted) mt-1">
                      mulai istirahat otomatis setelah fokus
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ autoStartBreaks: !pomodoroSettings.autoStartBreaks })}
                    className={`p-2 border transition-colors ${
                      pomodoroSettings.autoStartBreaks 
                        ? 'border-(--accent) bg-(--accent) bg-opacity-10' 
                        : 'border-(--border-color) hover:border-(--accent)'
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
                    <p className="font-mono text-xs text-(--text-main) uppercase">auto-start fokus</p>
                    <p className="font-mono text-xs text-(--text-muted) mt-1">
                      mulai fokus otomatis setelah istirahat
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ autoStartPomodoros: !pomodoroSettings.autoStartPomodoros })}
                    className={`p-2 border transition-colors ${
                      pomodoroSettings.autoStartPomodoros 
                        ? 'border-(--accent) bg-(--accent) bg-opacity-10' 
                        : 'border-(--border-color) hover:border-(--accent)'
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
                    <p className="font-mono text-xs text-(--text-main) uppercase">notifikasi suara</p>
                    <p className="font-mono text-xs text-(--text-muted) mt-1">
                      suara lonceng saat sesi selesai
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ soundEnabled: !pomodoroSettings.soundEnabled })}
                    className={`p-2 border transition-colors ${
                      pomodoroSettings.soundEnabled 
                        ? 'border-(--accent) bg-(--accent) bg-opacity-10' 
                        : 'border-(--border-color) hover:border-(--accent)'
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
                <p className="font-mono text-sm text-(--text-main)">Mode Gelap</p>
                <p className="font-mono text-xs text-(--text-muted) mt-1">
                  {isDarkMode ? 'the study room' : 'the archive'}
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
              <Button
                variant="ghost"
                onClick={handleExportData}
                className="w-full"
              >
                <Download size={16} />
                <span>ekspor data</span>
              </Button>

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

