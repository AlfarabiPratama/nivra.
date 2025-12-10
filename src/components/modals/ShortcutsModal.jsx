import { X } from "lucide-react";

export const ShortcutsModal = ({ onClose }) => {
  const shortcuts = [
    { keys: ["1"], description: "pergi ke beranda" },
    { keys: ["2"], description: "pergi ke bacaan" },
    { keys: ["3"], description: "pergi ke jurnal" },
    { keys: ["4"], description: "pergi ke kebiasaan" },
    { keys: ["5"], description: "pergi ke keuangan" },
    { keys: ["6"], description: "pergi ke pomodoro" },
    { keys: ["7"], description: "pergi ke pengaturan" },
    { keys: ["8"], description: "pergi ke taman" },
    { keys: ["9"], description: "pergi ke kalender" },
    { keys: ["Ctrl", "K"], description: "buka pencarian" },
    { keys: ["T"], description: "toggle tema" },
    { keys: ["M"], description: "monk mode" },
    { keys: ["?"], description: "shortcuts" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-(--card-color) border-2 border-(--border-color) max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-dashed border-(--border-color)">
          <h2 className="font-serif text-xl text-(--text-main) lowercase">
            keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-(--text-muted) hover:text-(--text-main) transition-colors p-2 hover:bg-(--bg-color) border border-transparent hover:border-(--border-color)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {shortcuts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-2.5 hover:bg-(--bg-color) transition-colors border-l-2 border-transparent hover:border-(--accent)"
              >
                <span className="font-mono text-xs text-(--text-main) flex-1 lowercase">
                  {item.description}
                </span>
                <div className="flex items-center gap-1">
                  {item.keys.map((key, keyIdx) => (
                    <div key={keyIdx} className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-(--bg-color) border border-(--border-color) font-mono text-xs text-(--text-main) min-w-7 text-center">
                        {key}
                      </kbd>
                      {keyIdx < item.keys.length - 1 && (
                        <span className="text-(--text-muted) text-xs">+</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-4 p-3 border border-dashed border-(--accent)/30 bg-(--accent)/5">
            <p className="font-mono text-xs text-(--text-muted)">
              <span className="text-(--accent)">💡</span> klik X atau backdrop
              untuk tutup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
