import { X, Command, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'navigasi',
      items: [
        { keys: ['1'], description: 'pergi ke beranda' },
        { keys: ['2'], description: 'pergi ke bacaan' },
        { keys: ['3'], description: 'pergi ke jurnal' },
        { keys: ['4'], description: 'pergi ke kebiasaan' },
        { keys: ['5'], description: 'pergi ke keuangan' },
        { keys: ['6'], description: 'pergi ke pomodoro' },
        { keys: ['7'], description: 'pergi ke pengaturan' },
        { keys: ['8'], description: 'pergi ke taman' },
      ]
    },
    {
      category: 'navigasi cepat (tekan G lalu)',
      items: [
        { keys: ['G', 'D'], description: 'dashboard' },
        { keys: ['G', 'R'], description: 'reading / bacaan' },
        { keys: ['G', 'J'], description: 'journal / jurnal' },
        { keys: ['G', 'H'], description: 'habits / kebiasaan' },
        { keys: ['G', 'F'], description: 'finance / keuangan' },
        { keys: ['G', 'P'], description: 'pomodoro' },
        { keys: ['G', 'S'], description: 'settings / pengaturan' },
        { keys: ['G', 'G'], description: 'garden / taman' },
      ]
    },
    {
      category: 'fitur umum',
      items: [
        { keys: ['Ctrl', 'K'], description: 'buka pencarian global' },
        { keys: ['T'], description: 'toggle mode siang/malam' },
        { keys: ['Esc'], description: 'tutup modal/dialog' },
        { keys: ['?'], description: 'tampilkan shortcuts (modal ini)' },
      ]
    },
    {
      category: 'navigasi dalam modal pencarian',
      items: [
        { keys: ['↑'], description: 'pilih hasil sebelumnya' },
        { keys: ['↓'], description: 'pilih hasil selanjutnya' },
        { keys: ['Enter'], description: 'buka hasil terpilih' },
        { keys: ['Esc'], description: 'tutup pencarian' },
      ]
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-(--card-color) solid-border border-(--border-color) max-w-3xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dashed border-(--border-color)">
          <h2 className="font-serif text-2xl text-(--text-main) lowercase">
            keyboard shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-(--text-muted) hover:text-(--text-main) transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="font-mono text-sm text-(--text-muted)">
            gunakan shortcuts ini untuk navigasi lebih cepat di aplikasi nivra.
          </p>

          {shortcuts.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-wider text-(--accent) opacity-70">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className="flex items-center justify-between gap-4 p-3 border border-dashed border-(--border-color) hover:border-(--text-muted) transition-colors group"
                  >
                    <span className="font-mono text-sm text-(--text-main) flex-1 lowercase">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, keyIdx) => (
                        <div key={keyIdx} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 bg-(--bg-color) border border-(--border-color) font-mono text-xs text-(--text-main) min-w-8 text-center group-hover:border-(--accent) transition-colors">
                            {key === '↑' ? <ArrowUp size={12} className="inline" /> :
                             key === '↓' ? <ArrowDown size={12} className="inline" /> :
                             key === '←' ? <ArrowLeft size={12} className="inline" /> :
                             key === '→' ? <ArrowRight size={12} className="inline" /> :
                             key}
                          </kbd>
                          {keyIdx < item.keys.length - 1 && (
                            <span className="text-(--text-muted) text-xs mx-1">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Tips */}
          <div className="mt-8 p-4 border border-dashed border-(--accent)/30 bg-(--accent)/5">
            <p className="font-mono text-xs text-(--text-muted) leading-relaxed">
              <span className="text-(--accent) font-bold">💡 tips:</span> tekan <kbd className="px-1 py-0.5 bg-(--bg-color) border border-(--border-color) font-mono text-xs mx-1">?</kbd> kapan saja untuk membuka panduan shortcuts ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
