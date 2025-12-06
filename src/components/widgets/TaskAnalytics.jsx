import { useMemo } from 'react';
import { Card } from '../ui/Card';
import { BarChart2, TrendingUp, Calendar } from 'lucide-react';
import clsx from 'clsx';

export const TaskAnalytics = ({ tasks }) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const last7Days = [];
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        completed: 0
      });
    }
    
    // Count completed tasks per day
    tasks.filter(t => t.completed).forEach(task => {
      const taskDate = new Date(task.completedAt).toISOString().split('T')[0];
      const dayData = last7Days.find(d => d.date === taskDate);
      if (dayData) dayData.completed++;
    });
    
    // Weekly stats
    const weeklyTotal = last7Days.reduce((sum, day) => sum + day.completed, 0);
    const weeklyAvg = Math.round(weeklyTotal / 7);
    const maxDaily = Math.max(...last7Days.map(d => d.completed));
    
    // Priority distribution
    const priorityDist = {
      high: tasks.filter(t => !t.completed && t.priority === 'high').length,
      medium: tasks.filter(t => !t.completed && t.priority === 'medium').length,
      low: tasks.filter(t => !t.completed && t.priority === 'low').length,
    };
    
    // Completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      last7Days,
      weeklyTotal,
      weeklyAvg,
      maxDaily,
      priorityDist,
      completionRate,
      totalTasks,
      completedTasks
    };
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        <Card hover>
          <div className="text-center space-y-1 md:space-y-2 p-3 md:p-4">
            <div className="font-mono text-lg md:text-2xl text-(accent)">
              {analytics.weeklyTotal}
            </div>
            <div className="font-mono text-[10px] md:text-xs text-(text-muted) uppercase leading-tight">
              minggu ini
            </div>
          </div>
        </Card>
        
        <Card hover>
          <div className="text-center space-y-1 md:space-y-2 p-3 md:p-4">
            <div className="font-mono text-lg md:text-2xl text-(accent)">
              {analytics.weeklyAvg}
            </div>
            <div className="font-mono text-[10px] md:text-xs text-(text-muted) uppercase leading-tight">
              rata-rata/hari
            </div>
          </div>
        </Card>
        
        <Card hover>
          <div className="text-center space-y-1 md:space-y-2 p-3 md:p-4">
            <div className="font-mono text-lg md:text-2xl text-(accent)">
              {analytics.completionRate}%
            </div>
            <div className="font-mono text-[10px] md:text-xs text-(text-muted) uppercase leading-tight">
              completion
            </div>
          </div>
        </Card>
        
        <Card hover>
          <div className="text-center space-y-1 md:space-y-2 p-3 md:p-4">
            <div className="font-mono text-lg md:text-2xl text-(accent)">
              {analytics.maxDaily}
            </div>
            <div className="font-mono text-[10px] md:text-xs text-(text-muted) uppercase leading-tight">
              best day
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Bar Chart */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-(text-muted)">
              7 Hari Terakhir
            </h3>
            <BarChart2 size={16} className="text-(accent)" />
          </div>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {analytics.last7Days.map((day, index) => {
              const height = analytics.maxDaily > 0 
                ? (day.completed / analytics.maxDaily) * 100 
                : 0;
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end h-full">
                    <div
                      className={clsx(
                        'w-full bg-(accent) transition-all duration-500 hover-scale',
                        day.completed > 0 ? 'opacity-100' : 'opacity-20'
                      )}
                      style={{ 
                        height: `${Math.max(height, 5)}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                      title={`${day.completed} tasks`}
                    />
                  </div>
                  <div className="font-mono text-xs text-(text-muted)">
                    {day.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Priority Distribution */}
      <Card>
        <div className="space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-(text-muted)">
            Priority Distribution
          </h3>
          
          <div className="space-y-3">
            {Object.entries(analytics.priorityDist).map(([priority, count]) => {
              const total = Object.values(analytics.priorityDist).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const colors = {
                high: 'bg-red-500',
                medium: 'bg-yellow-500',
                low: 'bg-green-500'
              };
              
              return (
                <div key={priority} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-(text-main) capitalize">
                      {priority}
                    </span>
                    <span className="font-mono text-xs text-(text-muted)">
                      {count} tasks
                    </span>
                  </div>
                  <div className="w-full h-2 bg-(bg-color) border border-(border-color)">
                    <div 
                      className={clsx('h-full transition-all duration-500', colors[priority])}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
