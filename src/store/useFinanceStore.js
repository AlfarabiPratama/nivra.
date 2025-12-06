import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const categories = {
  income: [
    { id: 'salary', name: 'Gaji', emoji: '💼' },
    { id: 'freelance', name: 'Freelance', emoji: '💻' },
    { id: 'investment', name: 'Investasi', emoji: '📈' },
    { id: 'other-income', name: 'Lainnya', emoji: '💰' },
  ],
  expense: [
    { id: 'food', name: 'Makanan', emoji: '🍜' },
    { id: 'transport', name: 'Transportasi', emoji: '🚗' },
    { id: 'bills', name: 'Tagihan', emoji: '📄' },
    { id: 'shopping', name: 'Belanja', emoji: '🛍️' },
    { id: 'health', name: 'Kesehatan', emoji: '⚕️' },
    { id: 'education', name: 'Pendidikan', emoji: '📚' },
    { id: 'entertainment', name: 'Hiburan', emoji: '🎬' },
    { id: 'other-expense', name: 'Lainnya', emoji: '💸' },
  ],
};

const paymentMethods = [
  { 
    id: 'cash', 
    name: 'Tunai', 
    emoji: '💵',
    hasSubcategory: false
  },
  { 
    id: 'ewallet', 
    name: 'E-Wallet', 
    emoji: '📱',
    hasSubcategory: true,
    subcategories: [
      { id: 'gopay', name: 'GoPay', emoji: '🟢' },
      { id: 'ovo', name: 'OVO', emoji: '🟣' },
      { id: 'dana', name: 'DANA', emoji: '🔵' },
      { id: 'shopeepay', name: 'ShopeePay', emoji: '🟠' },
      { id: 'linkaja', name: 'LinkAja', emoji: '🔴' },
      { id: 'other-ewallet', name: 'E-Wallet Lainnya', emoji: '📲' },
    ]
  },
  { 
    id: 'bank', 
    name: 'Bank/Debit', 
    emoji: '🏦',
    hasSubcategory: true,
    subcategories: [
      { id: 'bca', name: 'BCA', emoji: '🔵' },
      { id: 'mandiri', name: 'Mandiri', emoji: '🟡' },
      { id: 'bri', name: 'BRI', emoji: '🔵' },
      { id: 'bni', name: 'BNI', emoji: '🟠' },
      { id: 'cimb', name: 'CIMB Niaga', emoji: '🔴' },
      { id: 'permata', name: 'Permata', emoji: '🟢' },
      { id: 'other-bank', name: 'Bank Lainnya', emoji: '🏦' },
    ]
  },
];

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      // Transactions
      transactions: [],

      // Categories
      categories,

      // Payment Methods
      paymentMethods,

      // Budget settings per category
      budgets: {},

      // Get payment method info including subcategory
      getPaymentMethodInfo: (paymentMethod, paymentSubcategory) => {
        const method = paymentMethods.find(m => m.id === paymentMethod);
        if (!method) return { name: 'Unknown', emoji: '❓' };
        
        if (method.hasSubcategory && paymentSubcategory) {
          const sub = method.subcategories.find(s => s.id === paymentSubcategory);
          return {
            name: `${method.name} - ${sub?.name || 'Unknown'}`,
            emoji: sub?.emoji || method.emoji,
            method: method.name,
            subcategory: sub?.name
          };
        }
        
        return { name: method.name, emoji: method.emoji, method: method.name };
      },

      // Actions
      setBudget: (categoryId, amount) => {
        set(state => ({
          budgets: { ...state.budgets, [categoryId]: amount }
        }));
      },

      getBudgetStatus: (categoryId) => {
        const { budgets, getCategoryBreakdown } = get();
        const budget = budgets[categoryId] || 0;
        if (budget === 0) return null;

        const breakdown = getCategoryBreakdown('expense');
        const categoryData = breakdown.find(b => b.category === categoryId);
        const spent = categoryData ? categoryData.total : 0;
        const remaining = budget - spent;
        const percentage = (spent / budget) * 100;

        return {
          budget,
          spent,
          remaining,
          percentage: Math.min(percentage, 100),
          isOverBudget: spent > budget,
          isNearLimit: percentage >= 80 && percentage < 100
        };
      },

      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: Date.now(),
          date: transaction.date || new Date().toISOString(),
        };
        
        set(state => ({
          transactions: [newTransaction, ...state.transactions]
        }));
      },

      deleteTransaction: (id) => {
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }));
      },

      // Analytics
      getBalance: () => {
        const { transactions } = get();
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        return { income, expense, balance: income - expense };
      },

      getMonthlyTransactions: (month, year) => {
        const { transactions } = get();
        return transactions.filter(t => {
          const date = new Date(t.date);
          return date.getMonth() === month && date.getFullYear() === year;
        });
      },

      getCurrentMonthStats: () => {
        const now = new Date();
        const monthTransactions = get().getMonthlyTransactions(
          now.getMonth(),
          now.getFullYear()
        );

        const income = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        return { income, expense, balance: income - expense, count: monthTransactions.length };
      },

      getCategoryBreakdown: (type = 'expense') => {
        const now = new Date();
        const monthTransactions = get().getMonthlyTransactions(
          now.getMonth(),
          now.getFullYear()
        ).filter(t => t.type === type);

        const breakdown = {};
        categories[type].forEach(cat => {
          const total = monthTransactions
            .filter(t => t.category === cat.id)
            .reduce((sum, t) => sum + t.amount, 0);
          
          if (total > 0) {
            breakdown[cat.id] = {
              ...cat,
              total,
              percentage: 0, // Will calculate after
            };
          }
        });

        // Calculate percentages
        const totalAmount = Object.values(breakdown).reduce((sum, cat) => sum + cat.total, 0);
        Object.keys(breakdown).forEach(key => {
          breakdown[key].percentage = Math.round((breakdown[key].total / totalAmount) * 100);
        });

        return breakdown;
      },

      getLast7DaysActivity: () => {
        const { transactions } = get();
        const days = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toDateString();
          
          const dayTransactions = transactions.filter(
            t => new Date(t.date).toDateString() === dateStr
          );

          const income = dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          const expense = dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          days.push({
            date: dateStr,
            day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
            income,
            expense,
            balance: income - expense,
          });
        }
        
        return days;
      },

      // Filter transactions
      filterTransactions: (filters) => {
        const { transactions } = get();
        let filtered = [...transactions];

        // Filter by type
        if (filters.type && filters.type !== 'all') {
          filtered = filtered.filter(t => t.type === filters.type);
        }

        // Filter by category
        if (filters.category) {
          filtered = filtered.filter(t => t.category === filters.category);
        }

        // Filter by payment method
        if (filters.paymentMethod) {
          filtered = filtered.filter(t => t.paymentMethod === filters.paymentMethod);
        }

        // Filter by date range
        if (filters.startDate) {
          filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
          filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.endDate));
        }

        // Filter by search query
        if (filters.query) {
          const query = filters.query.toLowerCase();
          filtered = filtered.filter(t => 
            t.description?.toLowerCase().includes(query) ||
            categories[t.type].find(c => c.id === t.category)?.name.toLowerCase().includes(query)
          );
        }

        return filtered;
      },

      // Get comparison with previous month
      getMonthComparison: () => {
        const now = new Date();
        const currentMonth = get().getMonthlyTransactions(now.getMonth(), now.getFullYear());
        const lastMonth = get().getMonthlyTransactions(
          now.getMonth() === 0 ? 11 : now.getMonth() - 1,
          now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
        );

        const currentIncome = currentMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const currentExpense = currentMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const lastIncome = lastMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const lastExpense = lastMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        return {
          current: { income: currentIncome, expense: currentExpense },
          last: { income: lastIncome, expense: lastExpense },
          incomeChange: lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0,
          expenseChange: lastExpense > 0 ? ((currentExpense - lastExpense) / lastExpense) * 100 : 0,
        };
      },

      // Get top spending categories
      getTopCategories: (limit = 5) => {
        const breakdown = get().getCategoryBreakdown('expense');
        return Object.values(breakdown)
          .sort((a, b) => b.total - a.total)
          .slice(0, limit);
      },

      // Get average daily spending
      getAverageDailySpending: () => {
        const now = new Date();
        const monthTransactions = get().getMonthlyTransactions(now.getMonth(), now.getFullYear());
        const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const daysInMonth = now.getDate(); // Current day of month
        return daysInMonth > 0 ? expense / daysInMonth : 0;
      },

      // Get saving rate
      getSavingRate: () => {
        const monthStats = get().getCurrentMonthStats();
        if (monthStats.income === 0) return 0;
        const savings = monthStats.income - monthStats.expense;
        return (savings / monthStats.income) * 100;
      },
    }),
    {
      name: 'nivra-finance',
    }
  )
);
