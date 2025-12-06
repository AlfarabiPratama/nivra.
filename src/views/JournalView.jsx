import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AnimatedPage } from '../components/ui/AnimatedPage';
import { EmptyState } from '../components/ui/EmptyState';
import { JournalMoodAnalytics } from '../components/widgets/JournalMoodAnalytics';
import { useJournalStore } from '../store/useJournalStore';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';
import { Feather, Smile, Meh, Frown, X } from 'lucide-react';
import clsx from 'clsx';

const moodOptions = [
  { value: 5, emoji: '😊', label: 'sangat baik', icon: Smile },
  { value: 4, emoji: '🙂', label: 'baik', icon: Smile },
  { value: 3, emoji: '😐', label: 'biasa', icon: Meh },
  { value: 2, emoji: '😔', label: 'kurang baik', icon: Frown },
  { value: 1, emoji: '😢', label: 'buruk', icon: Frown },
];

const journalPrompts = [
  "apa yang membuatmu bersyukur hari ini?",
  "satu hal kecil yang membuat hari ini berarti?",
  "apa yang ingin kamu pelajari lebih lanjut?",
  "bagaimana perasaanmu saat ini?",
  "apa yang membuatmu tersenyum hari ini?",
];

export const JournalView = () => {
  const { entries, addEntry, deleteEntry } = useJournalStore();
  const { addXP } = useAppStore();
  const { addToast } = useToastStore();
  
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [filterMood, setFilterMood] = useState(null);
  const [filterTag, setFilterTag] = useState(null);

  // Get all unique tags from entries
  const allTags = [...new Set(entries.flatMap(e => e.tags || []))];

  // Filter entries by mood and tag
  const filteredEntries = entries.filter(entry => {
    if (filterMood && entry.mood !== filterMood) return false;
    if (filterTag && !(entry.tags || []).includes(filterTag)) return false;
    return true;
  });

  const handleAddEntry = () => {
    if (content.trim()) {
      addEntry(content.trim(), selectedMood, tags);
      addXP(20, useToastStore.getState());
      addToast('entri jurnal tersimpan ✍️', 'success');
      setContent('');
      setSelectedMood(null);
      setTags([]);
      setShowPrompt(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const getRandomPrompt = () => {
    const prompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    setCurrentPrompt(prompt);
    setShowPrompt(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'hari ini, ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'kemarin, ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-4xl font-serif italic text-(text-main) mb-2">
            jurnal.
          </h2>
          <p className="font-mono text-xs md:text-sm text-(text-muted) lowercase">
            refleksi, satu pikiran pada satu waktu.
          </p>
        </div>

        {/* Filters */}
        {entries.length > 0 && (
          <Card>
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-(text-muted)">
                Filter Entri
              </h4>
              
              {/* Mood Filter */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterMood(null)}
                  className={clsx(
                    'px-3 py-1 font-mono text-xs border transition-all',
                    !filterMood 
                      ? 'border-(accent) bg-(accent)/10 text-(accent)'
                      : 'border-(border-color) text-(text-muted) hover:border-(text-main)'
                  )}
                >
                  semua mood
                </button>
                {moodOptions.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setFilterMood(mood.value)}
                    className={clsx(
                      'px-3 py-1 border transition-all',
                      filterMood === mood.value
                        ? 'border-(accent) bg-(accent)/10'
                        : 'border-(border-color) hover:border-(text-main)'
                    )}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
              
              {/* Tag Filter */}
              {allTags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilterTag(null)}
                    className={clsx(
                      'px-3 py-1 font-mono text-xs border transition-all',
                      !filterTag 
                        ? 'border-(accent) bg-(accent)/10 text-(accent)'
                        : 'border-(border-color) text-(text-muted) hover:border-(text-main)'
                    )}
                  >
                    semua tags
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setFilterTag(tag)}
                      className={clsx(
                        'px-3 py-1 font-mono text-xs border transition-all',
                        filterTag === tag
                          ? 'border-(accent) bg-(accent)/10 text-(accent)'
                          : 'border-(border-color) text-(text-muted) hover:border-(text-main)'
                      )}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

      {/* Write New Entry */}
      <Card variant="dashed">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-mono text-sm uppercase tracking-widest text-(text-main)">
              <Feather size={14} className="inline mr-2" />
              Tulis Sekarang
            </h3>
            
            <Button 
              variant="ghost"
              onClick={getRandomPrompt}
              className="text-xs"
            >
              prompt
            </Button>
          </div>

          {/* Journal Prompt */}
          {showPrompt && (
            <div className="p-4 border border-dashed border-(accent) bg-(accent)/5">
              <p className="font-serif italic text-sm text-(text-main)">
                "{currentPrompt}"
              </p>
            </div>
          )}

          {/* Mood Selector */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-(text-muted) uppercase tracking-widest">
              Bagaimana perasaanmu?
            </label>
            <div className="flex gap-2">
              {moodOptions.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={clsx(
                    'flex-1 p-2 md:p-3 border transition-all duration-300 hover:border-(accent)',
                    selectedMood === mood.value
                      ? 'border-(accent) bg-(accent)/10'
                      : 'border-(border-color)'
                  )}
                  title={mood.label}
                >
                  <span className="text-xl md:text-2xl">{mood.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="mulai menulis..."
            className="w-full min-h-[150px] md:min-h-[200px] p-3 md:p-4 font-serif text-sm bg-transparent text-(text-main) placeholder:text-(text-muted) placeholder:italic border border-dashed border-(border-color) focus:border-solid focus:border-(accent) focus:outline-none resize-none transition-all duration-300"
          />

          {/* Tags Input */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-(text-muted) uppercase tracking-widest">
              Tags (opsional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="tambah tag..."
                className="flex-1 px-3 py-2 font-mono text-xs bg-transparent text-(text-main) placeholder:text-(text-muted) border border-dashed border-(border-color) focus:border-solid focus:outline-none"
              />
              <Button 
                variant="ghost"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                +
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs bg-(accent)/10 text-(accent) border border-(accent)"
                  >
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <span className="font-mono text-xs text-(text-muted)">
              {content.length} karakter
            </span>
            <div className="flex gap-2 md:gap-3 w-full md:w-auto">
              <Button 
                variant="ghost"
                onClick={() => {
                  setContent('');
                  setSelectedMood(null);
                  setShowPrompt(false);
                }}
              >
                bersihkan
              </Button>
              <Button 
                variant="accent"
                onClick={handleAddEntry}
                disabled={!content.trim()}
              >
                simpan
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Journal Entries Timeline */}
      <div className="space-y-4">
        <h3 className="font-mono text-sm uppercase tracking-widest text-(text-muted)">
          Entri Terdahulu ({filteredEntries.length}/{entries.length})
        </h3>

        {filteredEntries.length === 0 ? (
          <EmptyState 
            type="journal" 
            customMessage={entries.length > 0 ? "tidak ada entri sesuai filter" : null}
            icon={<Feather size={48} className="text-(text-muted) opacity-50" />}
          />
        ) : (
          filteredEntries.map(entry => {
            const mood = moodOptions.find(m => m.value === entry.mood);
            return (
              <Card key={entry.id} hover>
                <div className="space-y-3">
                  {/* Entry Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {mood && (
                        <span className="text-2xl" title={mood.label}>
                          {mood.emoji}
                        </span>
                      )}
                      <span className="font-mono text-xs text-(text-muted)">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-(text-muted) hover:text-(text-main) transition-colors hover-scale"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Entry Content */}
                  <p className="font-serif text-sm text-(text-main) leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  {/* Entry Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-(border-color)">
                      {entry.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-1 font-mono text-xs bg-(accent)/10 text-(accent) border border-(accent)"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}

        {/* Mood Analytics */}
        {entries.length > 0 && <JournalMoodAnalytics />}
      </div>
      </div>
    </AnimatedPage>
  );
};
