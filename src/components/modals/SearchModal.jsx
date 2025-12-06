import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useAppStore } from '../../store/useAppStore';
import { Search, X, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { setCurrentView } = useAppStore();
  
  const results = useSearch(query);

  const handleSelectResult = useCallback((result) => {
    setCurrentView(result.view);
    onClose();
  }, [setCurrentView, onClose]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(0); // Reset selection when query changes
  };

  // Reset selected index when results change (derived from results length)
  const validSelectedIndex = Math.min(selectedIndex, Math.max(0, results.length - 1));

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[validSelectedIndex]) {
        e.preventDefault();
        handleSelectResult(results[validSelectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, validSelectedIndex, onClose, handleSelectResult]);

  const getCategoryLabel = (type) => {
    const labels = {
      task: 'tugas',
      book: 'buku',
      note: 'catatan',
      quote: 'kutipan',
      journal: 'jurnal',
      habit: 'kebiasaan',
      pomodoro: 'sesi fokus',
      transaction: 'transaksi'
    };
    return labels[type] || type;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-(--card-color) border border-(--border-color) shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-dashed border-(--border-color)">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-(--text-muted)" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="cari di semua konten..."
              className="flex-1 bg-transparent font-mono text-sm text-(--text-main) placeholder:text-(--text-muted) focus:outline-none"
            />
            <button
              onClick={onClose}
              className="text-(--text-muted) hover:text-(--text-main) transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query || query.length < 2 ? (
            <div className="p-8 text-center">
              <Search size={48} className="mx-auto text-(--text-muted) opacity-30 mb-4" />
              <p className="font-mono text-xs text-(--text-muted) uppercase tracking-wider">
                ketik minimal 2 karakter untuk mencari
              </p>
              <div className="mt-6 space-y-2">
                <p className="font-mono text-xs text-(--text-muted)">
                  Tips: Cari tugas, buku, jurnal, kebiasaan, dan lainnya
                </p>
                <div className="flex items-center justify-center gap-2 text-(--text-muted) font-mono text-xs">
                  <kbd className="px-2 py-1 border border-dashed border-(--border-color)">↑</kbd>
                  <kbd className="px-2 py-1 border border-dashed border-(--border-color)">↓</kbd>
                  <span>navigasi</span>
                  <kbd className="px-2 py-1 border border-dashed border-(--border-color)">Enter</kbd>
                  <span>buka</span>
                  <kbd className="px-2 py-1 border border-dashed border-(--border-color)">Esc</kbd>
                  <span>tutup</span>
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-mono text-sm text-(--text-muted)">
                tidak ada hasil untuk "{query}"
              </p>
            </div>
          ) : (
            <div className="divide-y divide-dashed divide-(--border-color)">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelectResult(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={clsx(
                    'w-full p-4 text-left transition-colors group',
                    index === validSelectedIndex
                      ? 'bg-(--accent)/10 border-l-2 border-l-(--accent)'
                      : 'border-l-2 border-l-transparent hover:bg-(--bg-color)/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={clsx(
                          'font-mono text-xs uppercase tracking-wider px-2 py-0.5 border border-dashed',
                          index === validSelectedIndex
                            ? 'text-(--accent) border-(--accent)'
                            : 'text-(--text-muted) border-(--border-color)'
                        )}>
                          {getCategoryLabel(result.type)}
                        </span>
                      </div>
                      <p className={clsx(
                        'font-mono text-sm mb-1 truncate',
                        index === validSelectedIndex
                          ? 'text-(--text-main)'
                          : 'text-(--text-main)'
                      )}>
                        {result.title}
                      </p>
                      <p className="font-mono text-xs text-(--text-muted) truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <ArrowRight 
                      size={16} 
                      className={clsx(
                        'shrink-0 transition-transform',
                        index === validSelectedIndex ? 'text-(--accent) translate-x-1' : 'text-(--text-muted) opacity-0 group-hover:opacity-100'
                      )}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 border-t border-dashed border-(--border-color) bg-(--bg-color)/50">
            <p className="font-mono text-xs text-(--text-muted) text-center">
              {results.length} hasil ditemukan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
