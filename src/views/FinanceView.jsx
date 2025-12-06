import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AnimatedPage } from '../components/ui/AnimatedPage';
import { EmptyState } from '../components/ui/EmptyState';
import { useFinanceStore } from '../store/useFinanceStore';
import { useToastStore } from '../store/useToastStore';
import { Plus, TrendingUp, TrendingDown, Wallet, X, Filter, Search, Target, BarChart3, Calendar, ArrowUpDown, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import clsx from 'clsx';

export const FinanceView = () => {
  const { 
    transactions, 
    categories,
    paymentMethods,
    budgets,
    addTransaction, 
    deleteTransaction,
    setBudget,
    getBudgetStatus,
    getBalance,
    getCurrentMonthStats,
    getCategoryBreakdown,
    filterTransactions,
    getMonthComparison,
    getTopCategories,
    getAverageDailySpending,
    getSavingRate,
    getPaymentMethodInfo
  } = useFinanceStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: '',
    startDate: '',
    endDate: '',
    paymentMethod: '',
  });
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    paymentSubcategory: '',
  });

  const balance = getBalance();
  const monthStats = getCurrentMonthStats();
  const expenseBreakdown = getCategoryBreakdown('expense');
  const monthComparison = getMonthComparison();
  const topCategories = getTopCategories(5);
  const avgDailySpending = getAverageDailySpending();
  const savingRate = getSavingRate();
  
  const filteredTransactions = searchQuery 
    ? filterTransactions({ ...filters, query: searchQuery })
    : filters.type !== 'all' || filters.category || filters.startDate || filters.endDate
    ? filterTransactions(filters)
    : transactions;

  const handleSubmit = () => {
    if (!formData.amount || !formData.category) {
      addToast('Lengkapi jumlah dan kategori', 'error');
      return;
    }

    if (!formData.paymentMethod) {
      addToast('Pilih metode pembayaran', 'error');
      return;
    }

    const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);
    if (selectedMethod?.hasSubcategory && !formData.paymentSubcategory) {
      addToast(`Pilih ${selectedMethod.name} yang digunakan`, 'error');
      return;
    }

    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    addToast(
      `${formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} ditambahkan`,
      'success'
    );

    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      paymentSubcategory: '',
    });
    setShowForm(false);
  };

  const handleSetBudget = () => {
    if (!budgetCategory || !budgetAmount) {
      addToast('Pilih kategori dan masukkan jumlah budget', 'error');
      return;
    }

    setBudget(budgetCategory, parseFloat(budgetAmount));
    addToast('Budget berhasil diatur', 'success');
    setBudgetCategory('');
    setBudgetAmount('');
    setShowBudgetForm(false);
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      category: '',
      startDate: '',
      endDate: '',
      paymentMethod: '',
    });
    setSearchQuery('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportToExcel = () => {
    // Prepare data for export
    const dataToExport = filteredTransactions.map(transaction => {
      const category = categories[transaction.type].find(c => c.id === transaction.category);
      const paymentInfo = transaction.paymentMethod 
        ? getPaymentMethodInfo(transaction.paymentMethod, transaction.paymentSubcategory)
        : null;
      
      return {
        'Tanggal': new Date(transaction.date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        'Tipe': transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        'Kategori': category?.name || '-',
        'Jumlah': transaction.amount,
        'Deskripsi': transaction.description || '-',
        'Metode Pembayaran': paymentInfo?.name || '-'
      };
    });

    // Add summary at the top
    const summaryData = [
      { 'Tanggal': 'RINGKASAN', 'Tipe': '', 'Kategori': '', 'Jumlah': '', 'Deskripsi': '', 'Metode Pembayaran': '' },
      { 'Tanggal': 'Total Pemasukan', 'Tipe': '', 'Kategori': '', 'Jumlah': monthStats.income, 'Deskripsi': '', 'Metode Pembayaran': '' },
      { 'Tanggal': 'Total Pengeluaran', 'Tipe': '', 'Kategori': '', 'Jumlah': monthStats.expense, 'Deskripsi': '', 'Metode Pembayaran': '' },
      { 'Tanggal': 'Saldo', 'Tipe': '', 'Kategori': '', 'Jumlah': balance.balance, 'Deskripsi': '', 'Metode Pembayaran': '' },
      { 'Tanggal': '', 'Tipe': '', 'Kategori': '', 'Jumlah': '', 'Deskripsi': '', 'Metode Pembayaran': '' },
      { 'Tanggal': 'TRANSAKSI', 'Tipe': '', 'Kategori': '', 'Jumlah': '', 'Deskripsi': '', 'Metode Pembayaran': '' },
    ];

    const fullData = [...summaryData, ...dataToExport];

    // Convert to CSV format
    const headers = Object.keys(fullData[0]);
    const csvContent = [
      headers.join(','),
      ...fullData.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `keuangan_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast('Data berhasil diexport ke CSV', 'success');
  };

  const tabs = [
    { id: 'overview', label: 'ringkasan', icon: Wallet },
    { id: 'transactions', label: 'transaksi', icon: ArrowUpDown },
    { id: 'budget', label: 'budget', icon: Target },
    { id: 'analytics', label: 'analitik', icon: BarChart3 },
  ];

  return (
    <AnimatedPage>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-serif italic text-(--text-main) mb-2">
              keuangan sederhana.
            </h2>
            <p className="font-mono text-xs md:text-sm text-(--text-muted) border-l-2 border-(--accent) pl-3 md:pl-4 italic">
              kendalikan arus kasmu.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              variant="ghost" 
              onClick={exportToExcel}
              disabled={transactions.length === 0}
              className="flex-1 md:flex-none"
            >
              <Download size={14} className="md:w-4 md:h-4" />
              <span>Export</span>
            </Button>
            <Button variant="accent" onClick={() => setShowForm(!showForm)} className="flex-1 md:flex-none">
              <Plus size={14} className="md:w-4 md:h-4" />
              <span>Tambah</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <div className="p-3 md:p-4 text-center">
              <TrendingUp size={18} className="md:w-5 md:h-5 mx-auto mb-2 text-green-500" />
              <p className="font-mono text-[10px] md:text-xs text-(--text-muted) mb-1">pemasukan</p>
              <p className="text-sm md:text-xl font-mono text-green-500">{formatCurrency(monthStats.income)}</p>
            </div>
          </Card>
          <Card>
            <div className="p-3 md:p-4 text-center">
              <TrendingDown size={18} className="md:w-5 md:h-5 mx-auto mb-2 text-red-500" />
              <p className="font-mono text-[10px] md:text-xs text-(--text-muted) mb-1">pengeluaran</p>
              <p className="text-sm md:text-xl font-mono text-red-500">{formatCurrency(monthStats.expense)}</p>
            </div>
          </Card>
          <Card>
            <div className="p-3 md:p-4 text-center">
              <Wallet size={18} className="md:w-5 md:h-5 mx-auto mb-2 text-(--accent)" />
              <p className="font-mono text-[10px] md:text-xs text-(--text-muted) mb-1">saldo</p>
              <p className={`text-sm md:text-xl font-mono ${balance.balance >= 0 ? 'text-(--accent)' : 'text-red-500'}`}>
                {formatCurrency(balance.balance)}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-3 md:p-4 text-center">
              <CheckCircle size={18} className="md:w-5 md:h-5 mx-auto mb-2 text-(--accent)" />
              <p className="font-mono text-[10px] md:text-xs text-(--text-muted) mb-1">saving rate</p>
              <p className="text-sm md:text-xl font-mono text-(--accent)">
                {savingRate > 0 ? '+' : ''}{savingRate.toFixed(1)}%
              </p>
            </div>
          </Card>
        </div>

        {/* Add Transaction Form */}
        {showForm && (
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                  transaksi baru
                </h3>
                <button onClick={() => setShowForm(false)} className="text-(--text-muted) hover:text-(--text-main)">
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                  className={clsx(
                    'flex-1 py-2 font-mono text-sm border transition-colors',
                    formData.type === 'income'
                      ? 'bg-(--accent) text-white border-(--accent)'
                      : 'bg-(--bg-color) text-(--text-muted) border-(--border-color)'
                  )}
                >
                  pemasukan
                </button>
                <button
                  onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                  className={clsx(
                    'flex-1 py-2 font-mono text-sm border transition-colors',
                    formData.type === 'expense'
                      ? 'bg-(--accent) text-white border-(--accent)'
                      : 'bg-(--bg-color) text-(--text-muted) border-(--border-color)'
                  )}
                >
                  pengeluaran
                </button>
              </div>

              <Input
                type="number"
                placeholder="jumlah..."
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />

              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {categories[formData.type].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={clsx(
                      'p-2 md:p-3 text-center border transition-colors',
                      formData.category === cat.id
                        ? 'border-(--accent) bg-(--accent)/10'
                        : 'border-(--border-color) hover:border-(--text-main)'
                    )}
                  >
                    <div className="text-xl md:text-2xl mb-1">{cat.emoji}</div>
                    <div className="font-mono text-[10px] md:text-xs text-(--text-muted)">{cat.name}</div>
                  </button>
                ))}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="font-mono text-[10px] md:text-xs text-(--text-muted)">metode pembayaran *</label>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setFormData({ 
                        ...formData, 
                        paymentMethod: method.id,
                        paymentSubcategory: '' 
                      })}
                      className={clsx(
                        'p-2 md:p-3 text-center border transition-colors',
                        formData.paymentMethod === method.id
                          ? 'border-(--accent) bg-(--accent)/10'
                          : 'border-(--border-color) hover:border-(--text-main)'
                      )}
                    >
                      <div className="text-xl md:text-2xl mb-1">{method.emoji}</div>
                      <div className="font-mono text-[10px] md:text-xs text-(--text-muted)">{method.name}</div>
                    </button>
                  ))}
                </div>

                {/* Subcategory Selector (E-Wallet or Bank) */}
                {formData.paymentMethod && 
                 paymentMethods.find(m => m.id === formData.paymentMethod)?.hasSubcategory && (
                  <div className="pl-3 md:pl-4 border-l-2 border-(--accent) space-y-2">
                    <label className="font-mono text-[10px] md:text-xs text-(--text-muted)">
                      pilih {paymentMethods.find(m => m.id === formData.paymentMethod)?.name.toLowerCase()} *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {paymentMethods
                        .find(m => m.id === formData.paymentMethod)
                        ?.subcategories.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => setFormData({ 
                              ...formData, 
                              paymentSubcategory: sub.id 
                            })}
                            className={clsx(
                              'p-2 text-center border transition-colors',
                              formData.paymentSubcategory === sub.id
                                ? 'border-(--accent) bg-(--accent)/10'
                                : 'border-(--border-color) hover:border-(--text-main)'
                            )}
                          >
                            <div className="text-base md:text-lg mb-1">{sub.emoji}</div>
                            <div className="font-mono text-[10px] md:text-xs text-(--text-muted)">{sub.name}</div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                placeholder="catatan (opsional)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />

              <div className="flex gap-2 md:gap-3">
                <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1">
                  batal
                </Button>
                <Button variant="accent" onClick={handleSubmit} className="flex-1">
                  simpan
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-dashed border-(--border-color) overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 font-mono text-xs md:text-sm transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'text-(--accent) border-b-2 border-(--accent) -mb-px'
                    : 'text-(--text-muted) hover:text-(--text-main)'
                )}
              >
                <Icon size={14} className="md:w-4 md:h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4 md:space-y-6">
            {/* Month Comparison */}
            <Card>
              <div className="p-4 md:p-6">
                <h3 className="font-mono text-xs md:text-sm uppercase tracking-wider text-(--text-muted) mb-3 md:mb-4 flex items-center gap-2">
                  <Calendar size={14} className="md:w-4 md:h-4" />
                  perbandingan bulan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <p className="font-mono text-xs text-(--text-muted) mb-2">bulan ini</p>
                    <p className="text-lg md:text-2xl font-mono text-(--text-main) mb-1">
                      {formatCurrency(monthComparison.current.expense)}
                    </p>
                    <p className={clsx(
                      'font-mono text-sm flex items-center gap-1',
                      monthComparison.expenseChange > 0 ? 'text-red-500' : 'text-green-500'
                    )}>
                      {monthComparison.expenseChange > 0 ? '↑' : '↓'}
                      {Math.abs(monthComparison.expenseChange).toFixed(1)}% dari bulan lalu
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-(--text-muted) mb-2">rata-rata harian</p>
                    <p className="text-2xl font-mono text-(--text-main)">
                      {formatCurrency(avgDailySpending)}
                    </p>
                    <p className="font-mono text-xs text-(--text-muted)">
                      pengeluaran per hari
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Top Categories */}
            <Card>
              <div className="p-4 md:p-6">
                <h3 className="font-mono text-xs md:text-sm uppercase tracking-wider text-(--text-muted) mb-3 md:mb-4">
                  kategori terbesar
                </h3>
                {topCategories.length === 0 ? (
                  <p className="text-center text-(--text-muted) font-mono text-sm py-4">
                    belum ada data
                  </p>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    {topCategories.map((cat, index) => (
                      <div key={cat.id} className="flex items-center gap-2 md:gap-3">
                        <span className="font-mono text-xs md:text-sm text-(--text-muted) w-3 md:w-4">{index + 1}</span>
                        <span className="text-lg md:text-2xl">{cat.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1 gap-2">
                            <span className="font-mono text-xs md:text-sm text-(--text-main) truncate">{cat.name}</span>
                            <span className="font-mono text-xs md:text-sm text-(--text-main) whitespace-nowrap">
                              {formatCurrency(cat.total)}
                            </span>
                          </div>
                          <div className="h-2 bg-(--bg-color) border border-(--border-color)">
                            <div 
                              className="h-full bg-(--accent) transition-all"
                              style={{ width: `${cat.percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-mono text-xs text-(--text-muted) w-12 text-right">
                          {cat.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-2 md:gap-3">
              <div className="flex-1 relative">
                <Search size={14} className="md:w-4 md:h-4 absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
                <Input
                  placeholder="cari transaksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 md:pl-10 text-sm"
                />
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4"
              >
                <Filter size={14} className="md:w-4 md:h-4" />
                <span className="hidden md:inline">filter</span>
              </Button>
              {(filters.type !== 'all' || filters.category || filters.paymentMethod || searchQuery) && (
                <Button variant="ghost" onClick={handleClearFilters}>
                  reset
                </Button>
              )}
            </div>

            {/* Filter Panel */}
            {showFilter && (
              <Card>
                <div className="p-4 space-y-4">
                  <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted)">
                    filter transaksi
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                    <div>
                      <label className="font-mono text-xs text-(--text-muted) mb-2 block">tipe</label>
                      <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="w-full bg-(--bg-color) border border-(--border-color) p-2 font-mono text-xs md:text-sm text-(--text-main)"
                      >
                        <option value="all">semua</option>
                        <option value="income">pemasukan</option>
                        <option value="expense">pengeluaran</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="font-mono text-xs text-(--text-muted) mb-2 block">metode pembayaran</label>
                      <select
                        value={filters.paymentMethod}
                        onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                        className="w-full bg-(--bg-color) border border-(--border-color) p-2 font-mono text-sm text-(--text-main)"
                      >
                        <option value="">semua metode</option>
                        {paymentMethods.map(method => (
                          <option key={method.id} value={method.id}>
                            {method.emoji} {method.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-xs text-(--text-muted) mb-2 block">dari tanggal</label>
                      <Input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="font-mono text-xs text-(--text-muted) mb-2 block">sampai tanggal</label>
                      <Input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button variant="accent" onClick={() => setShowFilter(false)} className="w-full">
                    terapkan filter
                  </Button>
                </div>
              </Card>
            )}

            {/* Transactions List */}
            <Card>
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="font-mono text-xs md:text-sm uppercase tracking-wider text-(--text-muted)">
                    daftar transaksi
                  </h3>
                  <span className="font-mono text-xs text-(--text-muted)">
                    {filteredTransactions.length} transaksi
                  </span>
                </div>

                {filteredTransactions.length === 0 ? (
                  <EmptyState type="finance" customMessage="tidak ada transaksi ditemukan" />
                ) : (
                  <div className="space-y-2">
                    {filteredTransactions.slice(0, 50).map(transaction => {
                      const category = categories[transaction.type].find(c => c.id === transaction.category);
                      const paymentInfo = transaction.paymentMethod 
                        ? getPaymentMethodInfo(transaction.paymentMethod, transaction.paymentSubcategory)
                        : null;
                      
                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-2 md:p-3 bg-(--bg-color) border border-dashed border-(--border-color) hover:border-(--accent) transition-colors gap-2"
                        >
                          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                            <div className="text-lg md:text-2xl flex-shrink-0">{category?.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-xs md:text-sm text-(--text-main) truncate">
                                {category?.name}
                              </p>
                              {transaction.description && (
                                <p className="font-mono text-[10px] md:text-xs text-(--text-muted) truncate">
                                  {transaction.description}
                                </p>
                              )}
                              <div className="flex items-center gap-1 md:gap-2 mt-1 flex-wrap">
                                <p className="font-mono text-[10px] md:text-xs text-(--text-muted) whitespace-nowrap">
                                  {new Date(transaction.date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                                {paymentInfo && (
                                  <>
                                    <span className="text-(--text-muted) hidden md:inline">•</span>
                                    <span className="text-xs">{paymentInfo.emoji}</span>
                                    <p className="font-mono text-[10px] md:text-xs text-(--text-muted) truncate">
                                      {paymentInfo.name}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-3 flex-shrink-0">
                            <p
                              className={clsx(
                                'font-mono text-xs md:text-base whitespace-nowrap',
                                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                              )}
                            >
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                            <button
                              onClick={() => {
                                if (window.confirm('Hapus transaksi ini?')) {
                                  deleteTransaction(transaction.id);
                                  addToast('Transaksi dihapus', 'success');
                                }
                              }}
                              className="text-(--text-muted) hover:text-red-500 transition-colors"
                            >
                              <X size={14} className="md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-4">
            <Card>
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h3 className="font-mono text-xs md:text-sm uppercase tracking-wider text-(--text-muted) flex items-center gap-2">
                    <Target size={14} className="md:w-4 md:h-4" />
                    budget bulanan
                  </h3>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowBudgetForm(!showBudgetForm)}
                    className="text-xs w-full md:w-auto"
                  >
                    {showBudgetForm ? 'tutup' : '+ atur budget'}
                  </Button>
                </div>

                {showBudgetForm && (
                  <div className="p-3 md:p-4 border border-dashed border-(--border-color) space-y-3">
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {categories.expense.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setBudgetCategory(cat.id)}
                          className={clsx(
                            'p-2 md:p-3 border transition-all',
                            budgetCategory === cat.id
                              ? 'border-(--accent) bg-(--accent)/10'
                              : 'border-(--border-color) hover:border-(--text-main)'
                          )}
                        >
                          <div className="text-base md:text-xl">{cat.emoji}</div>
                          <div className="font-mono text-[10px] md:text-xs text-(--text-muted) mt-1">{cat.name}</div>
                        </button>
                      ))}
                    </div>

                    <Input
                      type="number"
                      placeholder="jumlah budget..."
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                    />

                    <Button
                      variant="accent"
                      onClick={handleSetBudget}
                      disabled={!budgetCategory || !budgetAmount}
                      className="w-full"
                    >
                      simpan budget
                    </Button>
                  </div>
                )}

                {Object.keys(budgets).length === 0 ? (
                  <div className="text-center py-8">
                    <Target size={48} className="mx-auto text-(--text-muted) opacity-30 mb-4" />
                    <p className="font-mono text-sm text-(--text-muted)">
                      belum ada budget yang diatur
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categories.expense.map(cat => {
                      const budgetStatus = getBudgetStatus(cat.id);
                      if (!budgetStatus) return null;

                      return (
                        <div key={cat.id} className="p-3 md:p-4 border border-dashed border-(--border-color)">
                          <div className="flex items-start md:items-center justify-between mb-3 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-base md:text-xl flex-shrink-0">{cat.emoji}</span>
                              <span className="font-mono text-xs md:text-sm text-(--text-main) truncate">{cat.name}</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className={clsx(
                                'font-mono text-[10px] md:text-sm whitespace-nowrap',
                                budgetStatus.isOverBudget ? 'text-red-500' :
                                budgetStatus.isNearLimit ? 'text-yellow-500' :
                                'text-(--text-main)'
                              )}>
                                {formatCurrency(budgetStatus.spent)} / {formatCurrency(budgetStatus.budget)}
                              </p>
                              <p className="font-mono text-[10px] md:text-xs text-(--text-muted)">
                                {budgetStatus.percentage.toFixed(0)}% terpakai
                              </p>
                            </div>
                          </div>

                          <div className="h-2 bg-(--bg-color) border border-(--border-color) overflow-hidden mb-2">
                            <div 
                              className={clsx(
                                'h-full transition-all duration-500',
                                budgetStatus.isOverBudget ? 'bg-red-500' :
                                budgetStatus.isNearLimit ? 'bg-yellow-500' :
                                'bg-(--accent)'
                              )}
                              style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
                            />
                          </div>

                          {budgetStatus.isNearLimit && !budgetStatus.isOverBudget && (
                            <div className="flex items-center gap-1 md:gap-2 text-yellow-500">
                              <AlertTriangle size={12} className="md:w-3.5 md:h-3.5 flex-shrink-0" />
                              <p className="font-mono text-[10px] md:text-xs">
                                mendekati batas! sisa {formatCurrency(budgetStatus.remaining)}
                              </p>
                            </div>
                          )}
                          {budgetStatus.isOverBudget && (
                            <div className="flex items-center gap-1 md:gap-2 text-red-500">
                              <AlertTriangle size={12} className="md:w-3.5 md:h-3.5 flex-shrink-0" />
                              <p className="font-mono text-[10px] md:text-xs">
                                melebihi budget {formatCurrency(Math.abs(budgetStatus.remaining))}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted) mb-4 flex items-center gap-2">
                  <BarChart3 size={16} />
                  ringkasan analitik
                </h3>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 border border-dashed border-(--border-color)">
                    <p className="font-mono text-xs text-(--text-muted) mb-2">total transaksi</p>
                    <p className="text-3xl font-mono text-(--accent) mb-1">{transactions.length}</p>
                    <p className="font-mono text-xs text-(--text-muted)">sepanjang waktu</p>
                  </div>
                  
                  <div className="text-center p-4 border border-dashed border-(--border-color)">
                    <p className="font-mono text-xs text-(--text-muted) mb-2">rata-rata harian</p>
                    <p className="text-3xl font-mono text-(--accent) mb-1">
                      {formatCurrency(avgDailySpending)}
                    </p>
                    <p className="font-mono text-xs text-(--text-muted)">bulan ini</p>
                  </div>
                  
                  <div className="text-center p-4 border border-dashed border-(--border-color)">
                    <p className="font-mono text-xs text-(--text-muted) mb-2">saving rate</p>
                    <p className={clsx(
                      'text-3xl font-mono mb-1',
                      savingRate >= 20 ? 'text-green-500' :
                      savingRate >= 10 ? 'text-(--accent)' :
                      'text-red-500'
                    )}>
                      {savingRate.toFixed(1)}%
                    </p>
                    <p className="font-mono text-xs text-(--text-muted)">
                      {savingRate >= 20 ? 'excellent!' :
                       savingRate >= 10 ? 'good!' :
                       'perlu ditingkatkan'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted) mb-4">
                  breakdown kategori pengeluaran
                </h3>
                
                {Object.keys(expenseBreakdown).length === 0 ? (
                  <p className="text-center text-(--text-muted) font-mono text-sm py-8">
                    belum ada data pengeluaran bulan ini
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Object.values(expenseBreakdown)
                      .sort((a, b) => b.total - a.total)
                      .map(cat => (
                        <div key={cat.id} className="flex items-center gap-3">
                          <span className="text-2xl">{cat.emoji}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-mono text-sm text-(--text-main)">{cat.name}</span>
                              <span className="font-mono text-sm text-(--text-main)">
                                {formatCurrency(cat.total)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-(--bg-color) border border-(--border-color)">
                                <div 
                                  className="h-full bg-(--accent) transition-all"
                                  style={{ width: `${cat.percentage}%` }}
                                />
                              </div>
                              <span className="font-mono text-xs text-(--text-muted) w-12 text-right">
                                {cat.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-mono text-sm uppercase tracking-wider text-(--text-muted) mb-4">
                  perbandingan dengan bulan lalu
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 border border-dashed border-(--border-color)">
                    <p className="font-mono text-xs text-(--text-muted) mb-2">pemasukan</p>
                    <p className="text-2xl font-mono text-green-500 mb-2">
                      {formatCurrency(monthComparison.current.income)}
                    </p>
                    <p className={clsx(
                      'font-mono text-sm flex items-center gap-1',
                      monthComparison.incomeChange >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {monthComparison.incomeChange >= 0 ? '↑' : '↓'}
                      {Math.abs(monthComparison.incomeChange).toFixed(1)}% dari bulan lalu
                    </p>
                  </div>

                  <div className="p-4 border border-dashed border-(--border-color)">
                    <p className="font-mono text-xs text-(--text-muted) mb-2">pengeluaran</p>
                    <p className="text-2xl font-mono text-red-500 mb-2">
                      {formatCurrency(monthComparison.current.expense)}
                    </p>
                    <p className={clsx(
                      'font-mono text-sm flex items-center gap-1',
                      monthComparison.expenseChange > 0 ? 'text-red-500' : 'text-green-500'
                    )}>
                      {monthComparison.expenseChange > 0 ? '↑' : '↓'}
                      {Math.abs(monthComparison.expenseChange).toFixed(1)}% dari bulan lalu
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};
