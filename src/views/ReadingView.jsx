import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AnimatedPage } from "../components/ui/AnimatedPage";
import { EmptyState } from "../components/ui/EmptyState";
import { ReadingTimer } from "../components/widgets/ReadingTimer";
import { useBookStore } from "../store/useBookStore";
import { useAppStore } from "../store/useAppStore";
import { buildAchievementStats } from "../utils/achievementStats";
import { useToastStore } from "../store/useToastStore";
import {
  BookOpen,
  Plus,
  X,
  Star,
  Clock,
  Pencil,
  Filter,
  Minimize2,
  Maximize2,
} from "lucide-react";
import clsx from "clsx";

const FILTERS = [
  { id: "all", label: "semua" },
  { id: "reading", label: "sedang dibaca" },
  { id: "finished", label: "selesai" },
  { id: "wishlist", label: "wishlist" },
];

const defaultForm = {
  title: "",
  author: "",
  total: 100,
  cover: "",
  status: "reading",
};

export const ReadingView = () => {
  const {
    books,
    yearlyGoal,
    addBook,
    updateBook,
    deleteBook,
    setYearlyGoal,
    getYearlyProgress,
    addNote,
    addQuote,
    deleteNote,
    deleteQuote,
  } = useBookStore();
  const { addXP } = useAppStore();
  const { addToast } = useToastStore();

  const [filter, setFilter] = useState("all");
  const [showTimer, setShowTimer] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [goalInput, setGoalInput] = useState(yearlyGoal);
  const [expanded, setExpanded] = useState({});
  const [noteInput, setNoteInput] = useState({});
  const [quoteInput, setQuoteInput] = useState({});
  const [modeCompact, setModeCompact] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const yearlyProgress = getYearlyProgress();

  const filteredBooks = books.filter((book) => {
    if (filter === "all") return true;
    return book.status === filter;
  });

  const readingBooks = filteredBooks.filter((b) => b.status === "reading");

  const monthlyCounts = useMemo(() => {
    const counts = Array(12).fill(0);
    books.forEach((b) => {
      if (b.status === "finished" && b.finishedDate) {
        const d = new Date(b.finishedDate);
        if (d.getFullYear() === new Date().getFullYear()) {
          counts[d.getMonth()] += 1;
        }
      }
    });
    return counts;
  }, [books]);

  const handleAddBook = () => {
    if (!formData.title.trim() || !formData.author.trim()) return;
    addBook({
      title: formData.title.trim(),
      author: formData.author.trim(),
      total: parseInt(formData.total) || 100,
      cover: formData.cover.trim(),
      status: formData.status || "reading",
    });
    setFormData(defaultForm);
    setShowAddForm(false);
    addToast("buku ditambahkan", "success");
  };

  const handleEditSave = () => {
    if (!editingBook) return;
    const total = Math.max(1, parseInt(editingBook.total) || 1);
    const progress = Math.min(editingBook.progress || 0, total);
    const updates = {
      title: editingBook.title,
      author: editingBook.author,
      total,
      cover: editingBook.cover,
      status: editingBook.status,
      progress,
    };
    if (updates.status === "finished" && !editingBook.finishedDate) {
      updates.finishedDate = new Date().toISOString();
      updates.progress = total;
    }
    updateBook(editingBook.id, updates);
    setEditingBook(null);
    addToast("buku diperbarui", "success");
  };

  const handleUpdateProgress = (book, increment) => {
    const newProgress = Math.min(book.progress + increment, book.total);
    const isCompleting = book.progress < book.total && newProgress >= book.total;
    updateBook(book.id, {
      progress: newProgress,
      status: newProgress >= book.total ? "finished" : "reading",
      finishedDate:
        newProgress >= book.total
          ? new Date().toISOString()
          : book.finishedDate || null,
    });
    if (isCompleting) {
      addXP(30, useToastStore.getState(), {
        source: "buku selesai",
        stats: buildAchievementStats(),
      });
      addToast("selamat! buku selesai dibaca", "success");
    }
  };

  const handleAddNote = (bookId) => {
    const text = noteInput[bookId];
    if (text && text.trim()) {
      addNote(bookId, text.trim());
      setNoteInput({ ...noteInput, [bookId]: "" });
      addToast("catatan tersimpan", "success");
    }
  };

  const handleAddQuote = (bookId) => {
    const text = quoteInput[bookId];
    if (text && text.trim()) {
      addQuote(bookId, text.trim());
      setQuoteInput({ ...quoteInput, [bookId]: "" });
      addToast("kutipan tersimpan", "success");
    }
  };

  const renderBarChart = () => {
    const max = Math.max(...monthlyCounts, 1);
    const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    return (
      <div className="grid grid-cols-12 gap-2">
        {monthlyCounts.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-mono text-(--text-muted)">
              {months[idx]}
            </div>
            <div className="w-full h-20 bg-(--bg-color) border border-(--border-color) flex items-end">
              <div
                className="w-full bg-(--accent)/80 transition-all"
                style={{ height: `${(val / max) * 100}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-(--text-main)">
              {val}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReadingCard = (book) => {
    const percent = Math.min(
      100,
      Math.round((book.progress / Math.max(book.total, 1)) * 100)
    );
    return (
      <Card key={book.id} className="flex gap-4 p-4 items-center">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-20 h-28 object-cover border border-(--border-color)"
          />
        ) : (
          <div className="w-20 h-28 border border-dashed border-(--border-color) flex items-center justify-center text-(--text-muted)">
            <BookOpen size={20} />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="type-h3">{book.title}</h3>
              <p className="type-caption text-(--text-muted)">{book.author}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingBook(book)}
              >
                <Pencil size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteBook(book.id)}
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-(--text-muted)">
              <span>{percent}%</span>
              <span>
                {book.progress} / {book.total} halaman
              </span>
            </div>
            <div className="h-3 bg-(--bg-color) border border-(--border-color) rounded-sm overflow-hidden">
              <div
                className="h-full bg-(--accent) transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="accent"
              size="sm"
              onClick={() => handleUpdateProgress(book, 10)}
            >
              +10 halaman
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateProgress(book, Math.ceil(book.total * 0.05))}
            >
              +1 sesi
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const renderBookCard = (book) => {
    const percent = Math.min(
      100,
      Math.round((book.progress / Math.max(book.total, 1)) * 100)
    );
    const isExpanded = expanded[book.id];
    return (
      <Card key={book.id} className="p-4 space-y-3">
        <div className="flex gap-3 items-start">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="w-16 h-22 object-cover border border-(--border-color)"
            />
          ) : (
            <div className="w-16 h-22 border border-dashed border-(--border-color) flex items-center justify-center text-(--text-muted)">
              <BookOpen size={18} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="type-h4 truncate">{book.title}</h3>
                <p className="type-caption text-(--text-muted) truncate">
                  {book.author}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingBook(book)}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBook(book.id)}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>

            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-[11px] font-mono text-(--text-muted)">
                <span className="uppercase">{book.status}</span>
                <span>
                  {percent}% • {book.progress}/{book.total} hlm
                </span>
              </div>
              <div className="h-2.5 bg-(--bg-color) border border-(--border-color)">
                <div
                  className="h-full bg-(--accent) transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, [book.id]: !prev[book.id] }))
                }
              >
                {isExpanded ? "tutup" : "lihat catatan"}
              </Button>
              {book.status === "reading" && (
                <div className="flex gap-2">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => handleUpdateProgress(book, 10)}
                  >
                    +10 hlm
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleUpdateProgress(book, Math.ceil(book.total * 0.05))
                    }
                  >
                    +1 sesi
                  </Button>
                </div>
              )}
            </div>

            {isExpanded && (
              <div className="mt-3 space-y-3 border-t border-dashed border-(--border-color) pt-3">
                <div className="space-y-1">
                  <div className="type-caption text-(--text-muted)">Catatan</div>
                  {(book.notes || []).length === 0 ? (
                    <p className="type-caption text-(--text-muted)">
                      belum ada catatan
                    </p>
                  ) : (
                    (book.notes || []).map((note) => (
                      <div
                        key={note.id}
                        className="p-2 border border-dashed border-(--border-color) text-sm flex justify-between gap-2"
                      >
                        <span className="font-mono">{note.text}</span>
                        <button
                          onClick={() => deleteNote(book.id, note.id)}
                          className="text-(--text-muted) hover:text-(--text-main)"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="tambah catatan..."
                      value={noteInput[book.id] || ""}
                      onChange={(e) =>
                        setNoteInput({ ...noteInput, [book.id]: e.target.value })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddNote(book.id)
                      }
                      variant="box"
                    />
                    <Button
                      variant="accent"
                      onClick={() => handleAddNote(book.id)}
                      disabled={!noteInput[book.id]?.trim()}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="type-caption text-(--text-muted)">Kutipan</div>
                  {(book.quotes || []).length === 0 ? (
                    <p className="type-caption text-(--text-muted)">
                      belum ada kutipan
                    </p>
                  ) : (
                    (book.quotes || []).map((quote) => (
                      <div
                        key={quote.id}
                        className="p-2 border-l-2 border-(--accent) bg-(--accent)/5 text-sm flex justify-between gap-2"
                      >
                        <span className="font-serif italic">
                          "{quote.text}"
                        </span>
                        <button
                          onClick={() => deleteQuote(book.id, quote.id)}
                          className="text-(--text-muted) hover:text-(--text-main)"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="tambah kutipan..."
                      value={quoteInput[book.id] || ""}
                      onChange={(e) =>
                        setQuoteInput({
                          ...quoteInput,
                          [book.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddQuote(book.id)
                      }
                      variant="box"
                    />
                    <Button
                      variant="accent"
                      onClick={() => handleAddQuote(book.id)}
                      disabled={!quoteInput[book.id]?.trim()}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-3">
          <div>
            <h2 className="type-h1 mb-1">bacaan.</h2>
            <p className="type-caption text-(--text-muted)">
              satu halaman pada satu waktu.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="ghost" onClick={() => setModeCompact(!modeCompact)}>
              {modeCompact ? (
                <>
                  <Maximize2 size={14} className="mr-1" /> mode detail
                </>
              ) : (
                <>
                  <Minimize2 size={14} className="mr-1" /> mode ringkas
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={() => setShowTimer(!showTimer)}>
              <Clock size={14} className="mr-1" />
              timer
            </Button>
            <Button variant="accent" onClick={() => setShowAddForm(true)}>
              <Plus size={14} className="mr-1" />
              tambah buku
            </Button>
          </div>
        </div>

        <Card className="p-5 md:p-6 bg-(--card-color) border border-(--border-color)">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-end">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase text-(--text-muted)">
                goal tahunan
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-serif">
                  {yearlyProgress.finished}/{yearlyProgress.goal}
                </span>
                <span className="font-mono text-xs text-(--text-muted)">
                  buku {new Date().getFullYear()}
                </span>
              </div>
              <div className="h-3 bg-(--bg-color) border border-(--border-color) rounded-sm overflow-hidden">
                <div
                  className="h-full bg-(--accent) transition-all duration-700"
                  style={{ width: `${yearlyProgress.percentage}%` }}
                />
              </div>
              <p className="font-mono text-[11px] text-(--text-muted)">
                {yearlyProgress.remaining} buku lagi • proyeksi {yearlyProgress.projectedTotal}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min="1"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-24"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setYearlyGoal(goalInput);
                  addToast("target diperbarui", "success");
                }}
              >
                simpan target
              </Button>
            </div>
          </div>
        </Card>

        {!modeCompact && (
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Filter size={14} />
              <span className="type-label">Aktivitas bulan ini</span>
            </div>
            {renderBarChart()}
          </Card>
        )}

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={clsx(
                "px-3 py-1 font-mono text-xs uppercase border",
                filter === tab.id
                  ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                  : "border-(--border-color) text-(--text-muted) hover:text-(--text-main)"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {!modeCompact && readingBooks.length > 0 && (
          <div className="space-y-3">
            <div className="type-label">Sedang dibaca</div>
            <div className="grid gap-3">
              {readingBooks.map((book) => renderReadingCard(book))}
            </div>
          </div>
        )}

        {filteredBooks.length === 0 ? (
          <EmptyState
            type="books"
            customMessage="belum ada buku. mulai tambah buku pertama?"
          >
            <Button variant="accent" onClick={() => setShowAddForm(true)}>
              tambah buku pertama
            </Button>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            <div className="type-label">Daftar buku</div>
            <div className="space-y-3">
              {filteredBooks.map((book) => renderBookCard(book))}
            </div>
          </div>
        )}

        {showTimer && (
          <ReadingTimer
            onComplete={(xp) => {
              addXP(xp, useToastStore.getState(), {
                source: "timer baca",
                stats: buildAchievementStats(),
              });
              addToast(`sesi selesai! +${xp} xp`, "success");
            }}
            bookTitle={readingBooks[0]?.title}
          />
        )}

        {showAddForm && (
          <Card variant="dashed" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="type-label">Buku Baru</h3>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                tutup
              </Button>
            </div>
            <Input
              placeholder="judul buku"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              variant="box"
            />
            <Input
              placeholder="penulis"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              variant="box"
            />
            <Input
              type="number"
              placeholder="total halaman"
              value={formData.total}
              onChange={(e) =>
                setFormData({ ...formData, total: parseInt(e.target.value) || 100 })
              }
              variant="box"
            />
            <Input
              placeholder="tautan cover (opsional)"
              value={formData.cover}
              onChange={(e) =>
                setFormData({ ...formData, cover: e.target.value })
              }
              variant="box"
            />
            <div className="flex gap-2">
              <Button variant="accent" onClick={handleAddBook}>
                simpan
              </Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                batal
              </Button>
            </div>
          </Card>
        )}

        {editingBook && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="type-label">Edit Buku</h3>
                <Button variant="ghost" onClick={() => setEditingBook(null)}>
                  <X size={16} />
                </Button>
              </div>
              <Input
                value={editingBook.title}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, title: e.target.value })
                }
                placeholder="judul"
                variant="box"
              />
              <Input
                value={editingBook.author}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, author: e.target.value })
                }
                placeholder="penulis"
                variant="box"
              />
              <Input
                type="number"
                value={editingBook.total}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    total: parseInt(e.target.value) || 1,
                  })
                }
                placeholder="total halaman"
                variant="box"
              />
              <Input
                value={editingBook.cover || ""}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, cover: e.target.value })
                }
                placeholder="tautan cover (opsional)"
                variant="box"
              />
              <div className="flex gap-2">
                <select
                  value={editingBook.status}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, status: e.target.value })
                  }
                  className="border border-(--border-color) bg-transparent px-3 py-2 text-sm"
                >
                  <option value="reading">sedang dibaca</option>
                  <option value="finished">selesai</option>
                  <option value="wishlist">wishlist</option>
                </select>
                <Input
                  type="number"
                  value={editingBook.progress}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      progress: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="progres"
                  variant="box"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="accent" onClick={handleEditSave}>
                  simpan
                </Button>
                <Button variant="ghost" onClick={() => setEditingBook(null)}>
                  batal
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};
