import { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAchievementStore } from '../store/useAchievementStore';
import { useTaskStore } from '../store/useTaskStore';
import { useBookStore } from '../store/useBookStore';
import { useJournalStore } from '../store/useJournalStore';
import { useHabitStore } from '../store/useHabitStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Camera, User, Trophy, BookOpen, CheckCircle, Feather, TrendingUp, Award, Star } from 'lucide-react';

export const ProfileView = () => {
  const { user, setUserName, setUserAvatar } = useAppStore();
  const { unlockedAchievements, getAllAchievements } = useAchievementStore();
  const { tasks } = useTaskStore();
  const { books } = useBookStore();
  const { entries } = useJournalStore();
  const { habits } = useHabitStore();
  
  const achievements = getAllAchievements();
  
  const [editName, setEditName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const fileInputRef = useRef(null);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setEditName(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Ukuran file terlalu besar. Maksimal 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setUserAvatar(null);
  };

  // Calculate stats
  const completedTasks = tasks.filter(t => t.completed).length;
  const finishedBooks = books.filter(b => b.status === 'finished').length;
  const totalJournals = entries.length;
  const activeHabits = habits.filter(h => !h.archived).length;
  const xpToNextLevel = (user.level * 100) - user.xp;
  const xpProgress = ((user.xp % 100) / 100) * 100;

  return (
    <div className="p-4 md:p-10 space-y-4 md:space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-serif italic text-(--text-main) mb-2">
          profil pengguna
        </h1>
        <p className="font-mono text-xs text-(--text-muted) uppercase tracking-wider">
          informasi dan statistik personal
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-(--border-color) overflow-hidden bg-(--bg-color) flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-(--text-muted)" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-(--card-color) border border-(--border-color) rounded-full flex items-center justify-center hover:border-(--accent) transition-colors"
                title="Ubah foto profil"
              >
                <Camera size={16} className="text-(--text-muted)" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            {user.avatar && (
              <button
                onClick={handleRemoveAvatar}
                className="font-mono text-xs text-(--text-muted) hover:text-(--accent) transition-colors"
              >
                hapus foto
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-6">
            {/* Name */}
            <div>
              <label className="font-mono text-xs text-(--text-muted) uppercase tracking-wider block mb-2">
                nama
              </label>
              {editName ? (
                <div className="flex gap-2">
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    placeholder="Masukkan nama..."
                    className="flex-1"
                    autoFocus
                  />
                  <Button onClick={handleSaveName} variant="primary">
                    simpan
                  </Button>
                  <Button onClick={() => {
                    setEditName(false);
                    setTempName(user.name);
                  }}>
                    batal
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="font-serif text-2xl text-(--text-main)">
                    {user.name || 'belum ada nama'}
                  </p>
                  <button
                    onClick={() => setEditName(true)}
                    className="font-mono text-xs text-(--text-muted) hover:text-(--accent) transition-colors uppercase"
                  >
                    edit
                  </button>
                </div>
              )}
            </div>

            {/* Level & XP */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-(--accent)" />
                  <span className="font-mono text-xs text-(--text-muted) uppercase tracking-wider">
                    level {user.level}
                  </span>
                </div>
                <span className="font-mono text-xs text-(--text-muted)">
                  {user.xp} XP
                </span>
              </div>
              <div className="w-full h-3 bg-(--bg-color) border border-dashed border-(--border-color)">
                <div 
                  className="h-full bg-(--accent) transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="font-mono text-xs text-(--text-muted) mt-1">
                {xpToNextLevel} XP lagi ke level {user.level + 1}
              </p>
            </div>

            {/* Garden Stage */}
            <div>
              <label className="font-mono text-xs text-(--text-muted) uppercase tracking-wider block mb-2">
                tahap taman
              </label>
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {user.gardenStage === 'seed' && '🌱'}
                  {user.gardenStage === 'sprout' && '🌿'}
                  {user.gardenStage === 'flower' && '🌸'}
                  {user.gardenStage === 'forest' && '🌳'}
                </span>
                <span className="font-mono text-sm text-(--text-main) capitalize">
                  {user.gardenStage === 'seed' && 'benih'}
                  {user.gardenStage === 'sprout' && 'tunas'}
                  {user.gardenStage === 'flower' && 'bunga'}
                  {user.gardenStage === 'forest' && 'hutan'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto text-(--accent) mb-2" />
          <div className="font-mono text-2xl text-(--text-main) mb-1">
            {completedTasks}
          </div>
          <div className="font-mono text-xs text-(--text-muted) uppercase">
            tugas selesai
          </div>
        </Card>

        <Card className="text-center">
          <BookOpen size={24} className="mx-auto text-(--accent) mb-2" />
          <div className="font-mono text-2xl text-(--text-main) mb-1">
            {finishedBooks}
          </div>
          <div className="font-mono text-xs text-(--text-muted) uppercase">
            buku dibaca
          </div>
        </Card>

        <Card className="text-center">
          <Feather size={24} className="mx-auto text-(--accent) mb-2" />
          <div className="font-mono text-2xl text-(--text-main) mb-1">
            {totalJournals}
          </div>
          <div className="font-mono text-xs text-(--text-muted) uppercase">
            jurnal ditulis
          </div>
        </Card>

        <Card className="text-center">
          <TrendingUp size={24} className="mx-auto text-(--accent) mb-2" />
          <div className="font-mono text-2xl text-(--text-main) mb-1">
            {activeHabits}
          </div>
          <div className="font-mono text-xs text-(--text-muted) uppercase">
            kebiasaan aktif
          </div>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={20} className="text-(--accent)" />
          <h2 className="font-serif text-xl text-(--text-main)">
            pencapaian
          </h2>
          <span className="font-mono text-xs text-(--text-muted)">
            {unlockedAchievements.length} / {achievements.length}
          </span>
        </div>

        {unlockedAchievements.length === 0 ? (
          <p className="font-mono text-sm text-(--text-muted) text-center py-8">
            belum ada achievement yang terbuka. terus berkarya! 🌟
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map(id => {
              const achievement = achievements.find(a => a.id === id);
              if (!achievement) return null;
              
              return (
                <div 
                  key={id}
                  className="flex items-start gap-3 p-4 border border-dashed border-(--border-color) hover:border-(--accent) transition-colors"
                >
                  <span className="text-3xl shrink-0">{achievement.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-sm text-(--text-main) mb-1">
                      {achievement.title}
                    </h3>
                    <p className="font-mono text-xs text-(--text-muted)">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Award size={12} className="text-(--accent)" />
                      <span className="font-mono text-xs text-(--accent)">
                        +{achievement.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

