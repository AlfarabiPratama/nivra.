import { useMemo } from "react";
import { Card } from "../ui/Card";
import {
  TrendingUp,
  Flame,
  BookOpen,
  Calendar,
  Clock,
  Target,
  Award,
  BarChart3,
} from "lucide-react";
import clsx from "clsx";

/**
 * ReadingStatsAdvanced - Enhanced reading statistics dashboard
 */
export const ReadingStatsAdvanced = ({ books }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const readingBooks = books.filter((b) => b.status === "reading");
    const finishedBooks = books.filter((b) => b.status === "finished");
    const allBooks = [...readingBooks, ...finishedBooks];

    // Monthly reading data (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthName = month.toLocaleDateString("id-ID", { month: "short" });
      const booksThisMonth = finishedBooks.filter((b) => {
        if (!b.finishedDate) return false;
        const finishDate = new Date(b.finishedDate);
        return (
          finishDate.getMonth() === month.getMonth() &&
          finishDate.getFullYear() === month.getFullYear()
        );
      });
      monthlyData.push({
        month: monthName,
        count: booksThisMonth.length,
        pages: booksThisMonth.reduce((sum, b) => sum + (b.total || 0), 0),
      });
    }

    // Reading speed (pages per day average)
    const pagesPerDay =
      readingBooks.length > 0
        ? Math.round(
            readingBooks.reduce((sum, book) => {
              const startDate = book.startedDate
                ? new Date(book.startedDate)
                : new Date();
              const daysReading = Math.max(
                1,
                Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
              );
              return sum + book.progress / daysReading;
            }, 0) / readingBooks.length
          )
        : 0;

    // Total pages read
    const totalPages = allBooks.reduce(
      (sum, book) =>
        sum +
        (book.status === "finished" ? book.total || 0 : book.progress || 0),
      0
    );

    // Estimated completion times for reading books
    const estimatedCompletions = readingBooks.map((book) => {
      const remainingPages = book.total - book.progress;
      const daysToComplete =
        pagesPerDay > 0 ? Math.ceil(remainingPages / pagesPerDay) : 0;
      return {
        title: book.title,
        progress: Math.round((book.progress / book.total) * 100),
        daysRemaining: daysToComplete,
        pagesRemaining: remainingPages,
      };
    });

    // Calculate average rating
    const ratedBooks = finishedBooks.filter((b) => b.rating);
    const avgRating =
      ratedBooks.length > 0
        ? (
            ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length
          ).toFixed(1)
        : 0;

    // Calculate reading activity (last 30 days)
    const activityData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateString = date.toDateString();

      // Check if any reading activity on this day
      const hasActivity = books.some((book) => {
        if (book.progressHistory) {
          return book.progressHistory.some(
            (h) => new Date(h.date).toDateString() === dateString
          );
        }
        if (book.finishedDate) {
          return new Date(book.finishedDate).toDateString() === dateString;
        }
        return false;
      });

      activityData.push({
        date: dateString,
        hasActivity,
        dayOfWeek: date.getDay(),
      });
    }

    const activeDays = activityData.filter((d) => d.hasActivity).length;

    return {
      pagesPerDay,
      totalPages,
      finishedCount: finishedBooks.length,
      readingCount: readingBooks.length,
      monthlyData,
      estimatedCompletions,
      avgRating,
      activityData,
      activeDays,
      totalBooks: allBooks.length,
    };
  }, [books]);

  const maxMonthlyCount = Math.max(...stats.monthlyData.map((m) => m.count), 1);

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-(--text-muted)">
              Statistik Bacaan Lengkap
            </h3>
            <BarChart3 size={16} className="text-(--accent)" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Books */}
            <div className="text-center p-3 border border-dashed border-(--border-color)">
              <BookOpen size={20} className="mx-auto mb-2 text-(--accent)" />
              <p className="text-2xl font-serif text-(--text-main)">
                {stats.totalBooks}
              </p>
              <p className="font-mono text-[10px] text-(--text-muted)">
                total buku
              </p>
            </div>

            {/* Finished */}
            <div className="text-center p-3 border border-dashed border-(--border-color)">
              <Award size={20} className="mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-serif text-(--text-main)">
                {stats.finishedCount}
              </p>
              <p className="font-mono text-[10px] text-(--text-muted)">
                selesai
              </p>
            </div>

            {/* Pages */}
            <div className="text-center p-3 border border-dashed border-(--border-color)">
              <Target size={20} className="mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-serif text-(--text-main)">
                {stats.totalPages.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] text-(--text-muted)">
                halaman dibaca
              </p>
            </div>

            {/* Pages per Day */}
            <div className="text-center p-3 border border-dashed border-(--border-color)">
              <Clock size={20} className="mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-serif text-(--text-main)">
                {stats.pagesPerDay}
              </p>
              <p className="font-mono text-[10px] text-(--text-muted)">
                halaman/hari
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Monthly Chart */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-(--text-muted)">
              Buku per Bulan (6 Bulan)
            </h3>
            <Calendar size={16} className="text-(--text-muted)" />
          </div>

          <div className="flex items-end justify-between gap-2 h-24">
            {stats.monthlyData.map((month, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className={clsx(
                    "w-full transition-all duration-500",
                    month.count > 0 ? "bg-(--accent)" : "bg-(--border-color)"
                  )}
                  style={{
                    height: `${Math.max(
                      (month.count / maxMonthlyCount) * 100,
                      4
                    )}%`,
                  }}
                />
                <span className="font-mono text-[10px] text-(--text-muted)">
                  {month.month}
                </span>
                <span className="font-mono text-xs text-(--text-main)">
                  {month.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Reading Activity Heatmap (30 days) */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-(--text-muted)">
              Aktivitas Membaca (30 Hari)
            </h3>
            <span className="font-mono text-xs text-(--accent)">
              {stats.activeDays}/30 hari aktif
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {stats.activityData.map((day, index) => (
              <div
                key={index}
                className={clsx(
                  "w-3 h-3 transition-all",
                  day.hasActivity
                    ? "bg-(--accent)"
                    : "bg-(--border-color) opacity-30"
                )}
                title={`${new Date(day.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}: ${day.hasActivity ? "Membaca" : "Tidak membaca"}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-(--text-muted)">
            <span>30 hari lalu</span>
            <span>Hari ini</span>
          </div>
        </div>
      </Card>

      {/* Currently Reading Progress */}
      {stats.estimatedCompletions.length > 0 && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-widest text-(--text-muted)">
                Sedang Dibaca
              </h3>
              <Flame size={16} className="text-orange-500" />
            </div>

            <div className="space-y-3">
              {stats.estimatedCompletions.slice(0, 3).map((book, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm text-(--text-main) truncate max-w-48">
                      {book.title}
                    </span>
                    <span className="font-mono text-xs text-(--accent) shrink-0">
                      {book.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-(--border-color)">
                    <div
                      className="h-full bg-(--accent) transition-all duration-500"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-(--text-muted)">
                    <span>{book.pagesRemaining} halaman lagi</span>
                    <span>
                      {book.daysRemaining > 0
                        ? `~${book.daysRemaining} hari`
                        : "Hampir selesai!"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Average Rating */}
      {stats.avgRating > 0 && (
        <div className="text-center p-4 border border-dashed border-(--border-color)">
          <div className="flex items-center justify-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={clsx(
                  "text-lg",
                  star <= Math.round(stats.avgRating)
                    ? "text-yellow-500"
                    : "text-(--border-color)"
                )}
              >
                ★
              </span>
            ))}
          </div>
          <p className="font-mono text-xs text-(--text-muted)">
            Rata-rata rating: {stats.avgRating}/5
          </p>
        </div>
      )}
    </div>
  );
};
