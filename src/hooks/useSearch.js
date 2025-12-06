import { useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useBookStore } from '../store/useBookStore';
import { useJournalStore } from '../store/useJournalStore';
import { useHabitStore } from '../store/useHabitStore';
import { usePomodoroStore } from '../store/usePomodoroStore';
import { useFinanceStore } from '../store/useFinanceStore';

export const useSearch = (query) => {
  const { tasks } = useTaskStore();
  const { books } = useBookStore();
  const { entries } = useJournalStore();
  const { habits } = useHabitStore();
  const { completedSessions } = usePomodoroStore();
  const { transactions } = useFinanceStore();

  const results = useMemo(() => {
    if (!query || query.trim().length < 2) return [];

    const searchTerm = query.toLowerCase().trim();
    const allResults = [];

    // Search Tasks
    tasks.forEach(task => {
      if (task.text.toLowerCase().includes(searchTerm)) {
        allResults.push({
          type: 'task',
          id: task.id,
          title: task.text,
          subtitle: `${task.completed ? 'Selesai' : 'Belum selesai'} • ${task.priority}`,
          data: task,
          view: 'dashboard',
          icon: '✓'
        });
      }
    });

    // Search Books
    books.forEach(book => {
      const matchTitle = book.title.toLowerCase().includes(searchTerm);
      const matchAuthor = book.author.toLowerCase().includes(searchTerm);
      
      if (matchTitle || matchAuthor) {
        allResults.push({
          type: 'book',
          id: book.id,
          title: book.title,
          subtitle: `oleh ${book.author} • ${book.status}`,
          data: book,
          view: 'reading',
          icon: '📖'
        });
      }

      // Search in book notes
      if (book.notes) {
        book.notes.forEach(note => {
          if (note.text.toLowerCase().includes(searchTerm)) {
            allResults.push({
              type: 'note',
              id: note.id,
              title: note.text,
              subtitle: `Catatan dari "${book.title}" • hal. ${note.page}`,
              data: { ...note, bookId: book.id, bookTitle: book.title },
              view: 'reading',
              icon: '📝'
            });
          }
        });
      }

      // Search in book quotes
      if (book.quotes) {
        book.quotes.forEach(quote => {
          if (quote.text.toLowerCase().includes(searchTerm)) {
            allResults.push({
              type: 'quote',
              id: quote.id,
              title: quote.text,
              subtitle: `Kutipan dari "${book.title}" • hal. ${quote.page}`,
              data: { ...quote, bookId: book.id, bookTitle: book.title },
              view: 'reading',
              icon: '💭'
            });
          }
        });
      }
    });

    // Search Journal Entries
    entries.forEach(entry => {
      const matchContent = entry.content.toLowerCase().includes(searchTerm);
      const matchTags = entry.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (matchContent || matchTags) {
        allResults.push({
          type: 'journal',
          id: entry.id,
          title: entry.content.substring(0, 50) + (entry.content.length > 50 ? '...' : ''),
          subtitle: `${entry.mood} • ${new Date(entry.date).toLocaleDateString('id-ID')}`,
          data: entry,
          view: 'journal',
          icon: '📔'
        });
      }
    });

    // Search Habits
    habits.forEach(habit => {
      if (habit.name.toLowerCase().includes(searchTerm)) {
        allResults.push({
          type: 'habit',
          id: habit.id,
          title: habit.name,
          subtitle: `${habit.emoji} • Streak: ${habit.currentStreak} hari`,
          data: habit,
          view: 'habits',
          icon: habit.emoji
        });
      }
    });

    // Search Pomodoro Sessions
    completedSessions.forEach(session => {
      if (session.activity && session.activity.toLowerCase().includes(searchTerm)) {
        allResults.push({
          type: 'pomodoro',
          id: session.id,
          title: session.activity,
          subtitle: `${session.duration} menit • ${new Date(session.completedAt).toLocaleDateString('id-ID')}`,
          data: session,
          view: 'pomodoro',
          icon: '🍅'
        });
      }
    });

    // Search Transactions
    transactions.forEach(transaction => {
      const matchDescription = transaction.description?.toLowerCase().includes(searchTerm);
      const matchCategory = transaction.category?.toLowerCase().includes(searchTerm);
      
      if (matchDescription || matchCategory) {
        allResults.push({
          type: 'transaction',
          id: transaction.id,
          title: transaction.description || transaction.category,
          subtitle: `${transaction.type === 'income' ? '+' : '-'}Rp ${transaction.amount.toLocaleString('id-ID')}`,
          data: transaction,
          view: 'finance',
          icon: transaction.type === 'income' ? '💰' : '💸'
        });
      }
    });

    return allResults;
  }, [query, tasks, books, entries, habits, completedSessions, transactions]);

  return results;
};
