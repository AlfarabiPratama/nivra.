import { useMemo } from 'react';
import { Card } from '../ui/Card';
import { BookOpen, TrendingUp } from 'lucide-react';

export const ReadingProgressChart = ({ books }) => {
  const analytics = useMemo(() => {
    // Last 30 days reading activity
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBooks = books.filter(book => {
        if (!book.progress?.length) return false;
        return book.progress.some(p => {
          const progressDate = new Date(p.date).toISOString().split('T')[0];
          return progressDate === dateStr;
        });
      });
      
      const pagesRead = dayBooks.reduce((sum, book) => {
        const dayProgress = book.progress.filter(p => {
          const progressDate = new Date(p.date).toISOString().split('T')[0];
          return progressDate === dateStr;
        });
        return sum + dayProgress.reduce((s, p) => s + (p.pagesRead || 0), 0);
      }, 0);
      
      last30Days.push({
        date: dateStr,
        pagesRead
      });
    }
    
    // Calculate stats
    const totalPages = last30Days.reduce((sum, d) => sum + d.pagesRead, 0);
    const avgDaily = Math.round(totalPages / 30);
    const maxDaily = Math.max(...last30Days.map(d => d.pagesRead));
    const bestDay = last30Days.find(d => d.pagesRead === maxDaily);
    
    // Last 7 days for detail view
    const last7Days = last30Days.slice(-7).map(day => {
      const date = new Date(day.date);
      return {
        ...day,
        label: date.toLocaleDateString('id-ID', { weekday: 'short' })
      };
    });
    
    // Reading consistency (days with any reading)
    const daysWithReading = last30Days.filter(d => d.pagesRead > 0).length;
    const consistency = Math.round((daysWithReading / 30) * 100);
    
    // Current month stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyPages = books.reduce((sum, book) => {
      if (!book.progress?.length) return sum;
      return sum + book.progress
        .filter(p => {
          const progressDate = new Date(p.date);
          return progressDate.getMonth() === currentMonth && 
                 progressDate.getFullYear() === currentYear;
        })
        .reduce((s, p) => s + (p.pagesRead || 0), 0);
    }, 0);
    
    return {
      last7Days,
      last30Days,
      totalPages,
      avgDaily,
      maxDaily,
      bestDay,
      consistency,
      monthlyPages
    };
  }, [books]);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        <Card hover>
          <div className="text-center space-y-1 md:space-y-2 p-3 md:p-4">
            <BookOpen size={20} className="md:w-6 md:h-6 mx-auto text-[var(--accent)]" />
            <div className="font-mono text-lg md:text-2xl text-[var(--accent)]">
              {analytics.monthlyPages}
            </div>
            <div className="font-mono text-[10px] md:text-xs text-[var(--text-muted)] uppercase leading-tight">
              bulan ini
            </div>
          </div>
        </Card>
        
        <Card hover>
          <div className="text-center space-y-1 md:space-y-2 p-3 md:p-4">
            <div className="font-mono text-lg md:text-2xl text-[var(--accent)]">
              {analytics.avgDaily}
            </div>
            <div className="font-mono text-[10px] md:text-xs text-[var(--text-muted)] uppercase leading-tight">
              rata-rata/hari
            </div>
          </div>
        </Card>
        
        <Card hover>
          <div className="text-center space-y-1 md:space-y-2 p-3 md:p-4">
            <div className="font-mono text-lg md:text-2xl text-[var(--accent)]">
              {analytics.consistency}%
            </div>
            <div className="font-mono text-[10px] md:text-xs text-[var(--text-muted)] uppercase leading-tight">
              konsistensi
            </div>
          </div>
        </Card>
        
        <Card hover>
          <div className="text-center space-y-1 md:space-y-2 p-3 md:p-4">
            <div className="font-mono text-lg md:text-2xl text-[var(--accent)]">
              {analytics.maxDaily}
            </div>
            <div className="font-mono text-[10px] md:text-xs text-[var(--text-muted)] uppercase leading-tight">
              best day
            </div>
          </div>
        </Card>
      </div>

      {/* 7 Days Bar Chart */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
              Halaman Dibaca (7 Hari Terakhir)
            </h3>
            <TrendingUp size={16} className="text-[var(--accent)]" />
          </div>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {analytics.last7Days.map(day => {
              const heightPercent = analytics.maxDaily > 0 
                ? (day.pagesRead / analytics.maxDaily) * 100 
                : 0;
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative flex-1 w-full flex items-end">
                    <div 
                      className="w-full bg-[var(--accent)] transition-all duration-500 hover:opacity-80 hover:scale-105 origin-bottom"
                      style={{ height: `${heightPercent}%` }}
                    />
                    {day.pagesRead > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs text-[var(--text-muted)]">
                        {day.pagesRead}
                      </div>
                    )}
                  </div>
                  <div className="font-mono text-xs text-[var(--text-muted)]">
                    {day.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 30 Days Heatmap */}
      <Card>
        <div className="space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
            Aktivitas 30 Hari
          </h3>
          
          <div className="grid grid-cols-10 gap-1.5">
            {analytics.last30Days.map(day => {
              const intensity = analytics.maxDaily > 0
                ? Math.min((day.pagesRead / analytics.maxDaily) * 100, 100)
                : 0;
              
              const getColor = () => {
                if (intensity === 0) return 'bg-[var(--bg-color)] border border-[var(--border-color)]';
                if (intensity < 25) return 'bg-[var(--accent)] opacity-25';
                if (intensity < 50) return 'bg-[var(--accent)] opacity-50';
                if (intensity < 75) return 'bg-[var(--accent)] opacity-75';
                return 'bg-[var(--accent)]';
              };
              
              return (
                <div
                  key={day.date}
                  className={`aspect-square ${getColor()} hover:scale-110 transition-transform cursor-pointer group relative`}
                  title={`${day.date}: ${day.pagesRead} halaman`}
                >
                  <div className="absolute hidden group-hover:block -top-12 left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] border border-[var(--border-color)] px-2 py-1 whitespace-nowrap z-10">
                    <div className="font-mono text-xs text-[var(--text-main)]">
                      {new Date(day.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="font-mono text-xs text-[var(--text-muted)]">
                      {day.pagesRead} hal
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <span className="font-mono text-xs text-[var(--text-muted)]">Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-[var(--bg-color)] border border-[var(--border-color)]" />
              <div className="w-3 h-3 bg-[var(--accent)] opacity-25" />
              <div className="w-3 h-3 bg-[var(--accent)] opacity-50" />
              <div className="w-3 h-3 bg-[var(--accent)] opacity-75" />
              <div className="w-3 h-3 bg-[var(--accent)]" />
            </div>
            <span className="font-mono text-xs text-[var(--text-muted)]">More</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
