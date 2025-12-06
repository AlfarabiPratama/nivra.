# 🌱 Nivra - Productivity App

Aplikasi produktivitas minimalis dengan desain zen yang menggabungkan manajemen tugas, habit tracking, reading tracker, journal, finance tracker, dan pomodoro timer dalam satu platform yang kohesif.

## ✨ Fitur Utama

### 📋 Dashboard

- Overview komprehensif dari semua aktivitas
- Widget analytics untuk tasks, reading, dan journal
- Quick stats dan weekly review
- Fully responsive untuk mobile dan desktop

### ✅ Task Management

- Create, edit, dan delete tasks
- Filter berdasarkan prioritas (tinggi, sedang, rendah)
- Mark tasks sebagai complete/incomplete
- Task analytics dengan visualisasi data
- Stats: minggu ini, rata-rata/hari, completion rate, best day

### 📚 Reading Tracker

- Tracking buku yang sedang dibaca, selesai, dan wishlist
- Reading timer untuk mencatat durasi membaca
- Progress chart dengan statistik membaca
- Filter berdasarkan status buku
- Informasi detail: judul, penulis, halaman

### 📝 Journal

- Daily journaling dengan mood tracking
- 5 pilihan mood: senang, sedih, marah, cemas, netral
- Mood analytics untuk melihat pola emosi
- Search dan filter entries
- Timestamp otomatis

### 💰 Finance Tracker

- Tracking pemasukan dan pengeluaran
- Kategorisasi transaksi (makanan, transportasi, hiburan, dll)
- Budget planning dan monitoring
- Filter berdasarkan tipe dan tanggal
- **Export ke CSV/Excel** untuk analisis eksternal
- Summary: total income, expense, dan balance

### 🍅 Pomodoro Timer

- Dual timer (kerja dan istirahat)
- Session history tracking
- Pomodoro summary statistics
- Control: start, pause, reset
- Responsive dengan ukuran timer yang adaptif

### 🌿 Habit Tracker

- Track kebiasaan harian
- Mark habits sebagai complete per hari
- Today's progress dengan visualisasi
- Weekly consistency tracking
- Stats: streak, completion rate, best day

### 🌳 Taman Zen (Garden View)

- Gamifikasi pertumbuhan produktivitas
- 4 tahap: benih → tunas → bunga → hutan
- Level dan XP system
- Seasonal variations (spring, summer, fall, winter)
- Dynamic weather effects (dekoratif)
- Progress tracking visual

### ⚙️ Settings & Profile

- Customize aplikasi sesuai preferensi
- Export semua data
- Delete all data (dengan konfirmasi)
- User profile management

### 🏆 Achievement System

- Unlock achievements berdasarkan aktivitas
- Achievement notifications
- Achievement modal untuk detail
- Badges: first task, task master, bookworm, journal streak, dll

## 🛠️ Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.17
- **State Management**: Zustand 5.0.9
- **Routing**: React Router DOM 7.10.1
- **Icons**: Lucide React 0.555.0
- **Utilities**: clsx 2.1.1
- **Backend (Optional)**: Firebase 10.8.0+ (Firestore + Auth)

## 📱 Responsive Design

Sepenuhnya responsive untuk mobile dan desktop:

- **Mobile**: < 768px - Bottom navigation, stack layout, touch-optimized
- **Desktop**: ≥ 768px - Sidebar navigation, grid layout, hover effects

## 🚀 Instalasi

```bash
# Clone repository
git clone <repository-url>
cd nivra-app

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build untuk production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🗂️ Struktur Folder

```
src/
├── assets/          # Static assets
├── components/      # React components
│   ├── modals/      # Modal components
│   ├── ui/          # UI components
│   └── widgets/     # Dashboard widgets
├── constants/       # App constants
├── hooks/           # Custom React hooks
├── store/           # Zustand stores
├── styles/          # Global styles
└── views/           # Page views
```

## 🎨 Design Philosophy

Nivra mengadopsi **zen minimalism** dengan prinsip:

- **Simplicity**: Interface yang clean dan intuitif
- **Consistency**: Design pattern yang konsisten
- **Accessibility**: Mudah digunakan untuk semua user
- **Performance**: Fast loading dan smooth animations
- **Responsiveness**: Adaptif untuk semua device sizes

## 💾 Data Persistence

### Local Storage (Default)

Semua data disimpan di **localStorage** browser:

- Tasks, habits, books, journal entries
- Finance transactions dan budgets
- Pomodoro sessions
- User profile dan XP/level
- Achievement progress

### 🔄 Firebase Real-Time Sync (Optional)

Nivra mendukung **cross-device sync** menggunakan Firebase:

- **Real-time synchronization** - Data otomatis sync antar perangkat
- **Offline-first** - Aplikasi tetap berfungsi tanpa internet
- **Anonymous auth** - Tidak perlu registrasi, auto sign-in
- **Optional Google sign-in** - Untuk akses di berbagai browser
- **Migration utility** - Migrasi data lokal ke cloud dengan satu klik

**Setup Firebase Sync:**

1. Ikuti panduan lengkap di [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)
2. Buat Firebase project di [console.firebase.google.com](https://console.firebase.google.com)
3. Copy credentials ke `.env.local`
4. Enable sync di aplikasi

**Keuntungan:**

- Access data dari laptop, phone, tablet
- Automatic backup ke cloud
- Seamless device switching
- No data loss jika hapus browser cache

**Free tier Firebase:** 50K reads/day, 20K writes/day, 1GB storage - cukup untuk personal use!

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

Minimum: Browsers yang support ES6+ dan localStorage

## 🔒 Security

### Data Privacy

- **Local-First**: Data utama disimpan di browser localStorage
- **Optional Cloud Sync**: Firebase sync bersifat opt-in (disabled by default)
- **User-Scoped Data**: Firestore security rules ensure data hanya accessible oleh owner
- **Anonymous Auth**: Tidak perlu email/password, device-specific login
- **No Tracking**: Tidak ada analytics atau tracking tanpa consent
- **Export Control**: User memiliki kontrol penuh atas data mereka

### Environment Variables

Untuk Firebase sync, copy template dan isi credentials:

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local dengan Firebase credentials
# Set VITE_ENABLE_FIREBASE_SYNC=true untuk enable sync
# JANGAN commit file .env.local ke Git
```

Lihat [SECURITY.md](SECURITY.md) untuk detail lengkap tentang security practices.

## 📖 Documentation

- **[Development Guidelines](docs/DEVELOPMENT_GUIDELINES.md)** - Coding standards dan best practices
- **[Firebase Setup Guide](docs/FIREBASE_SETUP.md)** - Step-by-step Firebase sync setup
- **[Tailwind CSS Best Practices](docs/TAILWIND_BEST_PRACTICES.md)** - Panduan syntax Tailwind v4
- **[Security Policy](SECURITY.md)** - Security guidelines dan vulnerability reporting
- **[Tailwind Warnings Info](TAILWIND_WARNINGS.md)** - Context tentang Tailwind CSS warnings

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**Before contributing:**

1. **WAJIB** baca [Development Guidelines](docs/DEVELOPMENT_GUIDELINES.md)
2. **WAJIB** gunakan Tailwind syntax yang benar: `text-(--variable)` bukan `text-[var(--variable)]`
3. Read [SECURITY.md](SECURITY.md) untuk security guidelines
4. Jangan commit file dengan sensitive data (API keys, passwords, dll)
5. Test di mobile dan desktop sebelum commit

## 👤 Author

**Alfarabi Pratama**

## 📧 Contact

Untuk pertanyaan atau feedback, silakan buka issue di repository ini.

---

**Made with ❤️ and ☕ by Alfarabi Pratama**
