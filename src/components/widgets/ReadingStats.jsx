import { useMemo } from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, Flame, BookOpen, Calendar } from 'lucide-react';

export const ReadingStats = ({ books }) => {
  const stats = useMemo(() => {
    const now = new Date().getTime();
    const readingBooks = books.filter(b => b.status === 'reading');
    const finishedBooks = books.filter(b => b.status === 'finished');
    
    // Calculate pages per day (average from reading books)
    const pagesPerDay = readingBooks.length > 0
      ? Math.round(
          readingBooks.reduce((sum, book) => {
            const daysReading = book.startedDate 
              ? Math.max(1, Math.floor((now - new Date(book.startedDate)) / (1000 * 60 * 60 * 24)))
              : 1;
            return sum + (book.progress / daysReading);
          }, 0) / readingBooks.length
        )
      : 0;
    
    // Calculate reading streak (consecutive days with progress)
    const streak = calculateStreak(books);
    
    // Total pages read
    const totalPages = finishedBooks.reduce((sum, book) => sum + (book.total || 0), 0);
    
    // Current progress percentage (average across reading books)
    const avgProgress = readingBooks.length > 0
      ? Math.round(
          readingBooks.reduce((sum, book) => {
            return sum + ((book.progress / book.total) * 100);
          }, 0) / readingBooks.length
        )
      : 0;
    
    return {
      pagesPerDay,
      streak,
      totalPages,
      finishedCount: finishedBooks.length,
      avgProgress,
      readingCount: readingBooks.length
    };
  }, [books]);
  
  return (
    <Card hover>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
            statistik bacaan
          </h3>
          <TrendingUp size={16} className="text-[var(--accent)]" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Reading Streak */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame 
                size={20} 
                className={`transition-colors ${stats.streak > 0 ? 'text-[var(--accent)] glow-pulse' : 'text-[var(--text-muted)]'}`}
              />
              <span className="text-2xl font-serif text-[var(--text-main)]">
                {stats.streak}
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] lowercase">
              hari beruntun
            </p>
          </div>
          
          {/* Pages per Day */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[var(--text-main)]" />
              <span className="text-2xl font-serif text-[var(--text-main)]">
                {stats.pagesPerDay}
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] lowercase">
              halaman/hari
            </p>
          </div>
          
          {/* Books Finished */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-[var(--text-main)]" />
              <span className="text-2xl font-serif text-[var(--text-main)]">
                {stats.finishedCount}
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] lowercase">
              buku selesai
            </p>
          </div>
          
          {/* Average Progress */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border border-[var(--border-color)] flex items-center justify-center">
                <div className="text-xs font-mono text-[var(--text-main)]">%</div>
              </div>
              <span className="text-2xl font-serif text-[var(--text-main)]">
                {stats.avgProgress}
              </span>
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] lowercase">
              rata-rata progress
            </p>
          </div>
        </div>
        
        {/* Progress Bar Visualization */}
        {stats.readingCount > 0 && (
          <div className="pt-4 border-t border-dashed border-[var(--border-color)]">
            <div className="space-y-2">
              <p className="font-mono text-xs text-[var(--text-muted)] lowercase">
                progress keseluruhan
              </p>
              <div className="w-full h-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div 
                  className="h-full bg-[var(--accent)] transition-all duration-500"
                  style={{ width: `${stats.avgProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Total Pages Achievement */}
        {stats.totalPages > 0 && (
          <div className="pt-2">
            <p className="font-mono text-xs text-[var(--text-muted)] lowercase text-center">
              total {stats.totalPages.toLocaleString()} halaman dibaca 📚
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Helper function to calculate reading streak
function calculateStreak(books) {
  // Get all progress update dates from books
  const progressDates = books
    .filter(b => b.progressHistory && b.progressHistory.length > 0)
    .flatMap(b => b.progressHistory.map(h => h.date))
    .map(dateStr => new Date(dateStr).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));
  
  if (progressDates.length === 0) return 0;
  
  // Count consecutive days from today
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < 365; i++) { // Max 365 days
    const dateStr = currentDate.toDateString();
    if (progressDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (i > 0) {
      // Streak broken
      break;
    } else {
      // No activity today, check yesterday
      currentDate.setDate(currentDate.getDate() - 1);
    }
  }
  
  return streak;
}
