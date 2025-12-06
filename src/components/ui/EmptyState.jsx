import { useState } from 'react';
import { Card } from './Card';
import { CheckSquare, BookOpen, PenLine, Sprout } from 'lucide-react';

const emptyStateIcons = {
  tasks: CheckSquare,
  books: BookOpen,
  journal: PenLine,
  garden: Sprout,
};

const emptyStateQuotes = {
  tasks: [
    "tidak ada tugas. waktunya istirahat.",
    "ketenangan sebelum produktivitas.",
    "mulai dengan satu langkah kecil.",
  ],
  books: [
    "belum ada buku. mulai perjalanan membacamu.",
    "setiap buku adalah petualangan baru.",
    "satu halaman pada satu waktu.",
  ],
  journal: [
    "belum ada entri. mulai menulis refleksimu.",
    "pikiranmu berharga untuk diabadikan.",
    "setiap kata adalah jejak waktu.",
  ],
  garden: [
    "tamanmu menunggu untuk tumbuh.",
    "benih memerlukan waktu untuk bertunas.",
    "kesabaran adalah kunci pertumbuhan.",
  ],
};

export const EmptyState = ({ 
  type = 'tasks', 
  customMessage = null,
  icon = null 
}) => {
  const quotes = emptyStateQuotes[type] || emptyStateQuotes.tasks;
  const [randomQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const IconComponent = emptyStateIcons[type] || emptyStateIcons.tasks;

  return (
    <Card>
      <div className="text-center py-12 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          {icon || <IconComponent size={64} className="text-(--text-muted) opacity-30" strokeWidth={1.5} />}
        </div>

        {/* Quote */}
        <div className="space-y-2">
          <p className="font-serif italic text-base text-(text-main)">
            "{customMessage || randomQuote}"
          </p>
          <div className="w-12 h-px bg-(border-color) mx-auto" />
        </div>

        {/* Subtle hint */}
        <p className="font-mono text-xs text-(text-muted) opacity-60">
          • • •
        </p>

        {/* Subtle logo watermark */}
        <div className="pt-6 opacity-20 hover:opacity-40 transition-opacity duration-300">
          <img 
            src="/nivra light mode .png" 
            alt="" 
            className="w-20 h-auto mx-auto dark:hidden"
          />
          <img 
            src="/dark mode nivra.png" 
            alt="" 
            className="w-20 h-auto mx-auto hidden dark:block"
          />
        </div>
      </div>
    </Card>
  );
};

