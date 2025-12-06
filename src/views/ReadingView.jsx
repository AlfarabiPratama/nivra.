import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AnimatedPage } from "../components/ui/AnimatedPage";
import { EmptyState } from "../components/ui/EmptyState";
import { ReadingTimer } from "../components/widgets/ReadingTimer";
import { ReadingStats } from "../components/widgets/ReadingStats";
import { useBookStore } from "../store/useBookStore";
import { useAppStore } from "../store/useAppStore";
import { useToastStore } from "../store/useToastStore";
import { BookOpen, Plus, X, Star, Clock } from "lucide-react";
import clsx from "clsx";

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
  const [filter, setFilter] = useState("all"); // all, reading, finished
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalInput, setGoalInput] = useState(yearlyGoal);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [noteInput, setNoteInput] = useState({});
  const [quoteInput, setQuoteInput] = useState({});

  const yearlyProgress = getYearlyProgress();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    total: 100,
    cover: "",
  });

  const readingBooks = books.filter((b) => b.status === "reading");

  const filteredBooks = books.filter((book) => {
    if (filter === "all") return true;
    return book.status === filter;
  });

  const handleAddBook = () => {
    if (formData.title && formData.author) {
      addBook(formData);
      setFormData({ title: "", author: "", total: 100, cover: "" });
      setShowAddForm(false);
      addToast("buku ditambahkan ke daftar bacaan", "success");
    }
  };

  const handleUpdateProgress = (bookId, newProgress) => {
    const book = books.find((b) => b.id === bookId);
    const isCompleting =
      book.progress < book.total && newProgress >= book.total;

    updateBook(bookId, {
      progress: newProgress,
      status: newProgress >= book.total ? "finished" : "reading",
      finishedDate:
        newProgress >= book.total ? new Date().toLocaleDateString() : null,
    });

    if (isCompleting) {
      addXP(50, useToastStore.getState());
      addToast("selamat! buku selesai dibaca 📚", "success");
    } else {
      addToast("progress diperbarui", "info");
    }
  };

  const handleRating = (bookId, rating) => {
    updateBook(bookId, { rating });
    addXP(10, useToastStore.getState());
    addToast("rating tersimpan", "success");
  };

  const handleAddNote = (bookId) => {
    const text = noteInput[bookId];
    if (text && text.trim()) {
      addNote(bookId, text.trim());
      setNoteInput({ ...noteInput, [bookId]: "" });
      addXP(5, useToastStore.getState());
      addToast("catatan tersimpan", "success");
    }
  };

  const handleAddQuote = (bookId) => {
    const text = quoteInput[bookId];
    if (text && text.trim()) {
      addQuote(bookId, text.trim());
      setQuoteInput({ ...quoteInput, [bookId]: "" });
      addXP(5, useToastStore.getState());
      addToast("kutipan tersimpan", "success");
    }
  };

  const toggleNotesSection = (bookId) => {
    setExpandedNotes({ ...expandedNotes, [bookId]: !expandedNotes[bookId] });
  };

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div>
            <h2 className="text-2xl md:text-4xl font-serif italic text-(--text-main) mb-2">
              bacaan.
            </h2>
            <p className="font-mono text-xs text-(--text-muted) lowercase">
              satu halaman pada satu waktu.
            </p>
          </div>

          <div className="flex gap-2 md:gap-3 w-full md:w-auto">
            <Button variant="ghost" onClick={() => setShowTimer(!showTimer)}>
              <Clock size={14} className="inline mr-1" />
              timer
            </Button>
            <Button
              variant="accent"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={14} className="inline mr-1" />
              tambah buku
            </Button>
          </div>
        </div>

        {/* Yearly Reading Goal */}
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                  target bacaan {new Date().getFullYear()}
                </h3>
                <p className="font-serif text-3xl text-(--text-main) mt-2">
                  {yearlyProgress.finished} / {yearlyProgress.goal} buku
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowGoalForm(!showGoalForm)}
                className="text-xs"
              >
                {showGoalForm ? "tutup" : "ubah target"}
              </Button>
            </div>

            {/* Goal Form */}
            {showGoalForm && (
              <div className="p-4 border border-dashed border-(--border-color) space-y-3">
                <div className="space-y-2">
                  <label className="font-mono text-xs text-(--text-muted) uppercase">
                    Target Buku per Tahun
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                  />
                </div>
                <Button
                  variant="accent"
                  onClick={() => {
                    setYearlyGoal(goalInput);
                    setShowGoalForm(false);
                    addToast("target bacaan diperbarui", "success");
                  }}
                  className="w-full"
                >
                  simpan target
                </Button>
              </div>
            )}

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-3 bg-(--bg-color) border border-(--border-color)">
                <div
                  className={`h-full transition-all duration-500 ${
                    yearlyProgress.onTrack ? "bg-(--accent)" : "bg-yellow-500"
                  }`}
                  style={{ width: `${yearlyProgress.percentage}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-xs text-(--text-muted)">
                <span>{yearlyProgress.percentage.toFixed(0)}% tercapai</span>
                <span>{yearlyProgress.remaining} buku lagi</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-dashed border-(--border-color)">
              <div className="text-center">
                <div className="text-xl font-serif text-(--text-main)">
                  {yearlyProgress.averagePerMonth}
                </div>
                <div className="font-mono text-xs text-(--text-muted) mt-1">
                  per bulan
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-serif text-(--text-main)">
                  {yearlyProgress.projectedTotal}
                </div>
                <div className="font-mono text-xs text-(--text-muted) mt-1">
                  proyeksi
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-xl font-serif ${
                    yearlyProgress.onTrack
                      ? "text-(--accent)"
                      : "text-yellow-500"
                  }`}
                >
                  {yearlyProgress.onTrack ? "✓" : "⚠"}
                </div>
                <div className="font-mono text-xs text-(--text-muted) mt-1">
                  {yearlyProgress.onTrack ? "on track" : "perlu usaha"}
                </div>
              </div>
            </div>

            {!yearlyProgress.onTrack && yearlyProgress.finished > 0 && (
              <p className="font-mono text-xs text-yellow-500 text-center italic pt-2 border-t border-dashed border-(--border-color)">
                tingkatkan kecepatan membaca untuk mencapai target!
              </p>
            )}
          </div>
        </Card>

        {/* Reading Statistics */}
        {books.length > 0 && <ReadingStats books={books} />}

        {/* Reading Timer */}
        {showTimer && (
          <ReadingTimer
            onComplete={(xp) => {
              addXP(xp, useToastStore.getState());
              addToast(`sesi selesai! +${xp} xp 📚`, "success");
            }}
            bookTitle={readingBooks[0]?.title}
          />
        )}

        {/* Add Book Form */}
        {showAddForm && (
          <Card variant="dashed">
            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase tracking-widest text-(text-main)">
                Buku Baru
              </h3>

              <div className="space-y-3">
                <Input
                  placeholder="judul buku..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  variant="box"
                />

                <Input
                  placeholder="nama penulis..."
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  variant="box"
                />

                <Input
                  type="number"
                  placeholder="total halaman..."
                  value={formData.total}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total: parseInt(e.target.value) || 100,
                    })
                  }
                  variant="box"
                />

                <div>
                  <label className="block text-(text-muted) font-mono text-xs mb-2 uppercase">
                    Sampul Buku
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://..."
                      value={formData.cover}
                      onChange={(e) =>
                        setFormData({ ...formData, cover: e.target.value })
                      }
                      className="flex-1"
                      variant="box"
                    />
                    <button
                      type="button"
                      className="px-3 border border-dashed border-(border-color) hover:bg-(border-color) transition-colors text-(text-muted)"
                      title="Simulasi Upload"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] mt-1 text-(text-muted) font-mono">
                    *Tempel link gambar atau biarkan kosong.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddBook}>simpan</Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  batal
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-3">
          {["all", "reading", "finished"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={clsx(
                "font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-300",
                filter === tab
                  ? "border-(accent) text-(accent) bg-(accent)/5"
                  : "border-(border-color) text-(text-muted) hover:text-(text-main) hover:border-(text-main)"
              )}
            >
              {tab === "all"
                ? "semua"
                : tab === "reading"
                ? "dibaca"
                : "selesai"}
            </button>
          ))}
        </div>

        {/* Books List */}
        <div className="space-y-4">
          {filteredBooks.length === 0 ? (
            <EmptyState
              type="books"
              icon={
                <BookOpen size={48} className="text-(text-muted) opacity-50" />
              }
            />
          ) : (
            filteredBooks.map((book) => (
              <Card key={book.id}>
                <div className="space-y-4">
                  {/* Book Header with Cover */}
                  <div className="flex gap-6 items-start">
                    {/* Book Cover */}
                    {book.cover && (
                      <div className="w-24 h-32 bg-(bg-color) border border-(border-color) flex items-center justify-center shadow-lg relative rotate-subtle group overflow-hidden shrink-0">
                        <img
                          src={book.cover}
                          alt={book.title}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML =
                              '<svg class="w-8 h-8 text-(text-muted) opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
                          }}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 mix-blend-multiply group-hover:mix-blend-normal transition-all duration-500"
                        />
                        <div className="book-spine"></div>
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-xl font-serif text-(text-main) mb-1">
                        {book.title}
                      </h3>
                      <p className="font-mono text-xs text-(text-muted)">
                        oleh {book.author}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteBook(book.id)}
                      className="text-(text-muted) hover:text-(text-main) transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Progress for reading books */}
                  {book.status === "reading" && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-(text-muted)">
                          halaman {book.progress} / {book.total}
                        </span>
                        <span className="font-mono text-xs text-(accent)">
                          {Math.round((book.progress / book.total) * 100)}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 bg-(bg-color) border border-(border-color)">
                        <div
                          className="h-full bg-(accent) transition-all duration-500"
                          style={{
                            width: `${(book.progress / book.total) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Update Progress */}
                      <div className="flex gap-2 items-center pt-2">
                        <Input
                          type="number"
                          placeholder="halaman saat ini..."
                          defaultValue={book.progress}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 0 && val <= book.total) {
                              handleUpdateProgress(book.id, val);
                            }
                          }}
                          className="flex-1"
                          variant="box"
                        />
                        <Button
                          variant="accent"
                          onClick={() =>
                            handleUpdateProgress(book.id, book.total)
                          }
                        >
                          selesai
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Rating for finished books */}
                  {book.status === "finished" && (
                    <div className="border-t border-dashed border-(border-color) pt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-(text-muted)">
                          selesai: {book.finishedDate}
                        </span>

                        {/* Star Rating */}
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRating(book.id, star)}
                              className="transition-colors"
                            >
                              <Star
                                size={16}
                                className={clsx(
                                  book.rating >= star
                                    ? "fill-(accent) text-(accent)"
                                    : "text-(text-muted)"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes & Quotes Section */}
                  <div className="border-t border-dashed border-(border-color) pt-4 space-y-3">
                    <button
                      onClick={() => toggleNotesSection(book.id)}
                      className="w-full flex items-center justify-between font-mono text-xs text-(text-muted) uppercase tracking-widest hover:text-(text-main) transition-colors"
                    >
                      <span>catatan & kutipan</span>
                      <span className="text-(accent)">
                        {(book.notes || []).length +
                          (book.quotes || []).length || "+"}
                      </span>
                    </button>

                    {expandedNotes[book.id] && (
                      <div className="space-y-4 pt-2">
                        {/* Notes Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs text-(text-muted) uppercase">
                              📝 Catatan
                            </span>
                          </div>

                          {/* Notes List */}
                          {(book.notes || []).map((note) => (
                            <div
                              key={note.id}
                              className="p-3 border border-dashed border-(border-color) bg-(bg-color)/50 space-y-1"
                            >
                              <p className="font-mono text-sm text-(text-main)">
                                {note.text}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-(text-muted)">
                                  hal. {note.page}
                                </span>
                                <button
                                  onClick={() => deleteNote(book.id, note.id)}
                                  className="text-(text-muted) hover:text-(text-main) transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Add Note Input */}
                          <div className="flex gap-2">
                            <Input
                              placeholder="tambah catatan..."
                              value={noteInput[book.id] || ""}
                              onChange={(e) =>
                                setNoteInput({
                                  ...noteInput,
                                  [book.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleAddNote(book.id)
                              }
                              variant="box"
                              className="flex-1"
                            />
                            <Button
                              variant="accent"
                              onClick={() => handleAddNote(book.id)}
                              disabled={
                                !(
                                  noteInput[book.id] &&
                                  noteInput[book.id].trim()
                                )
                              }
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                        </div>

                        {/* Quotes Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs text-(text-muted) uppercase">
                              💭 Kutipan
                            </span>
                          </div>

                          {/* Quotes List */}
                          {(book.quotes || []).map((quote) => (
                            <div
                              key={quote.id}
                              className="p-3 border-l-2 border-(accent) bg-(accent)/5 space-y-1"
                            >
                              <p className="font-serif italic text-sm text-(text-main)">
                                "{quote.text}"
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-(text-muted)">
                                  hal. {quote.page}
                                </span>
                                <button
                                  onClick={() => deleteQuote(book.id, quote.id)}
                                  className="text-(text-muted) hover:text-(text-main) transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Add Quote Input */}
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
                              className="flex-1"
                            />
                            <Button
                              variant="accent"
                              onClick={() => handleAddQuote(book.id)}
                              disabled={
                                !(
                                  quoteInput[book.id] &&
                                  quoteInput[book.id].trim()
                                )
                              }
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
            ))
          )}

          {/* Empty Slot Placeholder */}
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-8 border border-dashed border-(border-color) hover:bg-(card-color) transition-all opacity-50 hover:opacity-100 group flex flex-col items-center justify-center gap-3"
          >
            <Plus
              size={32}
              className="text-(text-muted) group-hover:text-(accent) transition-colors"
            />
            <span className="font-hand text-sm text-(text-muted) -rotate-2">
              slot kosong, tambah buku baru?
            </span>
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};
