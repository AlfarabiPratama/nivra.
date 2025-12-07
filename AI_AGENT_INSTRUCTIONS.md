# AI Agent Instructions - Nivra App

> **Panduan lengkap untuk AI agent yang akan bekerja di project ini**  
> Baca dokumen ini sebelum melakukan perubahan apapun!

---

## 🚀 Quick Start untuk AI Agent Baru

**Jika ini pertama kali kamu bekerja di project ini**, lakukan ini dulu:

### 1. Pull Latest Code dari GitHub

```bash
cd "e:\Nivra Fase 2\nivra lo-fi\nivra-app"
git pull origin main
```

### 2. Cek Status Repository

```bash
git status
git log --oneline -5  # Lihat 5 commit terakhir
```

### 3. Verifikasi Environment File

```bash
# Cek apakah .env.local ada (JANGAN baca isinya di chat!)
Test-Path .env.local  # PowerShell
# Jika tidak ada, minta user untuk setup Firebase credentials
```

### 4. Install Dependencies (jika perlu)

```bash
npm install
```

### 5. Run Dev Server untuk Test

```bash
npm run dev
# Buka http://localhost:5173
```

### 6. Baca Section Penting di Dokumen Ini

- [Design Philosophy](#design-philosophy) - Pahami filosofi desain
- [Firebase & Environment Setup](#firebase--environment-setup) - Setup Firebase
- [Code Standards](#code-standards) - Coding conventions
- [Git & GitHub Guidelines](#git--github-guidelines) - Git workflow
- [DO's and DON'Ts](#dos-and-donts) - Critical rules

---

## 📋 Table of Contents

1. [Quick Start untuk AI Agent Baru](#-quick-start-untuk-ai-agent-baru)
2. [Project Overview](#project-overview)
3. [Tech Stack & Architecture](#tech-stack--architecture)
4. [Design Philosophy](#design-philosophy)
5. [Development Workflow](#development-workflow)
6. [Git & GitHub Guidelines](#git--github-guidelines)
7. [Firebase & Environment Setup](#firebase--environment-setup)
8. [Code Standards](#code-standards)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)
11. [DO's and DON'Ts](#dos-and-donts)

---

## Project Overview

**Nivra** adalah productivity app dengan filosofi "Slow Productivity" - anti-hustle, fokus pada kedalaman bukan kecepatan.

### Core Features

- **Tasks & Calendar**: Task management dengan calendar integration
- **Habit Tracker**: Daily habit tracking dengan streak system
- **Pomodoro Timer**: Focus timer dengan analytics
- **Journal**: Daily journaling dengan mood tracking
- **Reading Tracker**: Book reading progress tracking dengan timer
- **Finance Tracker**: Personal finance management
- **Garden (Gamification)**: Virtual zen garden yang tumbuh berdasarkan produktivitas
- **Weekly Digest**: Weekly insights dan review

### User Context

- **Developer**: Alfarabi Pratama (solo developer)
- **Use Case**: Multi-device (berbagai browser), akan di-share ke teman untuk feedback
- **Primary Concern**: Data loss prevention (makanya pakai Firebase sync)
- **Language**: Bahasa Indonesia untuk UI dan komunikasi

---

## Tech Stack & Architecture

### Frontend

```
- React 18 + Vite
- Zustand (state management)
- Lucide React (icons)
- Framer Motion (animations)
- TailwindCSS (styling dengan custom config)
- React Router DOM (minimal routing)
```

### Backend & Auth

```
- Firebase Authentication (Google Sign-In + Anonymous)
- Firestore (real-time database sync)
- Firebase Storage (future: untuk file uploads)
```

### Build & Dev Tools

```
- Vite (dev server & bundler)
- ESLint (linting)
- PostCSS (CSS processing)
```

### State Management Architecture

**Zustand stores** (semua di `src/store/`):

- `useAppStore.js` - Global app state (view, search, shortcuts)
- `useTaskStore.js` - Tasks dengan calendar integration
- `useHabitStore.js` - Habits tracking dengan streaks
- `usePomodoroStore.js` - Pomodoro timer state
- `useJournalStore.js` - Journal entries dengan mood
- `useBookStore.js` - Reading progress tracking
- `useFinanceStore.js` - Finance transactions
- `useAchievementStore.js` - Gamification achievements
- `useLayoutStore.js` - Layout preferences (sidebar, widget visibility)
- `useThemeStore.js` - Theme switching (light/dark)
- `useToastStore.js` - Toast notifications
- `useSyncStore.js` - **PENTING**: Firebase sync orchestration

### Firebase Sync Architecture

**Real-time sync** untuk semua stores:

1. User login → Initialize sync dengan `initializeSync()`
2. Setiap store auto-subscribe ke Firestore collection
3. Local changes → Instant push ke Firestore
4. Remote changes → Instant pull ke local state
5. Offline support dengan localStorage fallback

**Sync Flow**:

```
User Action → Zustand Store → FirestoreService → Firebase
                ↓                                      ↓
         localStorage backup              Firestore Collection
                ↑                                      ↓
         On app load                    Other devices (real-time)
```

---

## Design Philosophy

> **CRITICAL**: Baca `design_manifesto.md` untuk detail lengkap!

### Visual Design Principles

#### 1. Slow Productivity Philosophy

- Anti-hustle culture
- Fokus pada depth, bukan speed
- Digital analog aesthetic (typewriter, paper texture)
- Intentional imperfection (bukan terlalu polished)

#### 2. Color Palette (Warm & Muted)

**Dark Mode (The Study Room)**:

```css
--bg-color: #1c1b19 (charcoal warm)
--text-main: #e0d8cc (ivory)
--text-muted: #8a8580 (warm gray)
--accent: #7f9e96 (sage green)
--border-color: #3a3935
```

**Light Mode (The Archive)**:

```css
--bg-color: #e8e4dc (old paper)
--text-main: #2c2b29 (faded ink)
--text-muted: #6b6864
--accent: #7f9e96 (sage green - sama)
--border-color: #d4d0c8
```

#### 3. Typography

- **Serif (Lora)**: Untuk judul, quotes, humanis text
- **Monospace (Courier Prime)**: Untuk data, label, input, angka (RAW DATA)
- Kontras antara "jiwa" (serif) dan "mesin" (mono)

#### 4. Visual Elements

- **Noise overlay**: Film grain texture di seluruh app (NO plastic screen)
- **Dashed borders**: Untuk secondary elements (form paper aesthetic)
- **Minimal shadows**: Subtle atau none, hindari drop-shadow tebal
- **Square corners**: `rounded-sm` atau none, hindari `rounded-full` berlebihan

#### 5. Interactions

- **Text-based buttons**: `[ action ]` style atau border tipis
- **Subtle hover**: Warna berubah atau border solid, NO bounce animation
- **Whitespace**: Banyak ruang negatif, jangan cramped layout

---

## Development Workflow

### 1. Sebelum Mulai Coding

**ALWAYS check current state**:

```bash
# Check branch
git branch

# Check uncommitted changes
git status

# Check recent commits
git log --oneline -5

# Pull latest changes
git pull origin main
```

### 2. Creating New Features

**Standard workflow**:

1. Create feature branch (optional untuk solo dev):

   ```bash
   git checkout -b feature/nama-fitur
   ```

2. Implement dengan incremental commits:

   - Commit setiap logical change (bukan 1 giant commit)
   - Commit messages: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`

3. Test locally:

   ```bash
   npm run dev
   ```

4. Check for errors:

   - Browser console (F12)
   - Terminal output
   - Firebase Console (Firestore data)

5. Commit & push:

   ```bash
   git add .
   git commit -m "feat: descriptive message"
   git push origin main
   ```

6. **Deploy to production** (if changes are production-ready):
   ```bash
   npm run deploy
   ```

### 3. Complete Change & Deploy Workflow

**CRITICAL**: Setiap perubahan yang ingin di-publish ke production HARUS follow workflow ini!

#### Step 1: Development & Testing (Local)

```powershell
# 1. Start dev server
npm run dev

# 2. Make changes to code

# 3. Test in browser (http://localhost:5173)
#    - Check functionality works
#    - Check console for errors (F12)
#    - Test Firebase sync (login, add data, refresh)
#    - Test on different screen sizes (mobile/desktop)

# 4. Stop dev server (Ctrl+C) when testing done
```

#### Step 2: Code Quality Check

```powershell
# 1. Check for linting errors
npm run lint

# 2. Fix any errors found
#    - Follow error messages
#    - Maintain code standards

# 3. Test build (ensure no build errors)
npm run build

# 4. Preview production build locally (optional)
npm run preview
```

#### Step 3: Git Commit

```powershell
# 1. Check what changed
git status
git diff

# 2. Verify NO sensitive files (.env.local)
#    If .env.local appears in git status, DON'T commit!

# 3. Stage all changes
git add .

# 4. Commit with descriptive message
git commit -m "type: detailed description of changes"

# Examples:
# git commit -m "feat: add dark mode toggle to settings"
# git commit -m "fix: resolve authentication loop in LoginView"
# git commit -m "refactor: optimize Firebase sync performance"
# git commit -m "style: update card shadows for better contrast"
```

#### Step 4: Push to GitHub

```powershell
# 1. Push to remote
git push origin main

# 2. Verify push successful
#    - Check terminal output for errors
#    - Verify at https://github.com/AlfarabiPratama/nivra
```

#### Step 5: Deploy to Firebase Hosting

**CRITICAL**: Only deploy after successful testing & GitHub push!

```powershell
# Option A: One-line command (recommended)
npm run deploy

# Option B: Using PowerShell script
.\deploy.ps1

# Option C: Manual steps
npm run build
firebase deploy --only hosting
```

**What happens during deployment**:

1. ✅ Build production bundle (`npm run build`)
2. ✅ Optimize & minify code
3. ✅ Upload to Firebase Hosting
4. ✅ Deploy to CDN globally
5. ✅ Live at https://nivra-app-581be.web.app

**Deployment time**: ~2-3 minutes

#### Step 6: Post-Deployment Verification

**CRITICAL**: Always verify deployment worked!

```powershell
# 1. Open live URL in browser
# https://nivra-app-581be.web.app

# 2. Hard refresh to clear cache
#    - Windows: Ctrl + Shift + R
#    - Or: Ctrl + F5

# 3. Verify checklist:
#    ✅ App loads without errors
#    ✅ Login works (Google Sign-In)
#    ✅ Firebase sync active
#    ✅ New feature/fix visible
#    ✅ No console errors (F12)
#    ✅ Mobile responsive (test on phone or DevTools)
#    ✅ Service Worker registered (check Application tab)

# 4. Test on different devices (if critical change)
#    - Desktop browser
#    - Mobile browser
#    - Different network (WiFi vs mobile data)
```

#### Step 7: Rollback (if deployment failed)

**If live app has critical bugs**:

```powershell
# Option A: Quick rollback via Firebase Console
# 1. Go to https://console.firebase.google.com/project/nivra-app-581be/hosting
# 2. Click "Hosting" → "View all releases"
# 3. Find previous working version
# 4. Click three dots → "Rollback to this version"

# Option B: Deploy previous commit
git log --oneline -10  # Find previous commit hash
git checkout <previous-commit-hash>
npm run deploy
git checkout main  # Return to latest
```

### 4. File Organization

**JANGAN** create random files di root! Structure:

```
src/
├── assets/          # Images, fonts (static)
├── components/      # Reusable UI components
│   ├── auth/        # Auth-related (ProtectedRoute, etc)
│   ├── modals/      # Modal dialogs
│   ├── sync/        # Firebase sync components
│   ├── ui/          # Base UI components (Button, Card, Input)
│   └── widgets/     # Dashboard widgets
├── config/          # Configuration files (firebaseConfig.js)
├── constants/       # App constants
├── hooks/           # Custom React hooks
├── router/          # Routing config
├── services/        # External services (authService, firestoreService)
├── store/           # Zustand stores (state management)
├── styles/          # Global styles
├── utils/           # Helper functions
└── views/           # Page components (Dashboard, TaskView, etc)
```

---

## Git & GitHub Guidelines

### Commit Message Convention

**Format**: `<type>: <description>`

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring (no behavior change)
- `style`: UI/CSS changes
- `docs`: Documentation changes
- `chore`: Build/config changes
- `perf`: Performance improvements

**Examples**:

```bash
git commit -m "feat: add Google Sign-In authentication"
git commit -m "fix: resolve Service Worker chrome-extension error"
git commit -m "refactor: simplify routing logic in App.jsx"
git commit -m "style: update accent color for dark mode"
git commit -m "docs: add Firebase setup instructions"
```

### What to Commit (ALWAYS)

✅ **Source Code**:

- All `.jsx`, `.js`, `.css` files in `src/`
- Configuration files: `vite.config.js`, `tailwind.config.js`, `eslint.config.js`, `package.json`
- Public assets: `public/` (manifest, icons, Service Worker)
- Documentation: `README.md`, `*.md` files
- Root config: `.gitignore`, `index.html`

✅ **Dependencies**:

- `package.json` (dependency list)
- `package-lock.json` (lock file untuk consistent installs)

### What to NEVER Commit (GITIGNORE)

❌ **Environment Variables**:

```
.env
.env.local
.env.*.local
```

**WHY**: Contains Firebase API keys, secrets (meskipun Firebase keys aman di client, tetap best practice)

❌ **Node Modules**:

```
node_modules/
```

**WHY**: Massive size (~200MB+), bisa di-install ulang dengan `npm install`

❌ **Build Output**:

```
dist/
build/
.vite/
```

**WHY**: Generated files, tidak perlu versioning

❌ **IDE/Editor Files**:

```
.vscode/
.idea/
*.swp
*.swo
.DS_Store
```

**WHY**: Personal preferences, bisa conflict antar developer

❌ **Logs & Cache**:

```
*.log
npm-debug.log*
.cache/
```

### Current .gitignore Content

Verify `.gitignore` contains:

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.*.local

# Build output
build/
.vite/
```

### Automated Git Workflow for AI Agents

**CRITICAL**: Sebelum push apapun, WAJIB cek status untuk hindari commit file sensitif!

**Standard workflow** (gunakan `appmod-version-control` tool jika tersedia):

```bash
# 1. Check for uncommitted changes
git status

# 2. Stage all changes (kecuali yang di .gitignore)
git add .

# 3. Commit with descriptive message
git commit -m "type: descriptive message"

# 4. Push to GitHub
git push origin main
```

**One-liner automation** (PowerShell):

```powershell
# Safe version - stops if .env.local detected
$status = git status --short
if ($status -match '\.env\.local') {
  Write-Host "⚠️ ERROR: .env.local detected! Aborting..." -ForegroundColor Red
  exit 1
}
git add .; git commit -m "your message"; git push origin main
```

**Verification before push**:

```bash
# 1. Verify no sensitive files staged
git status

# 2. Check what will be committed
git diff --cached --name-only

# 3. If .env.local appears, UNSTAGE IT:
git reset HEAD .env.local

# 4. Then push
git push origin main
```

### Auto-Pull Strategy for New AI Sessions

**Rule**: Selalu pull latest code saat memulai session baru

```bash
# At start of every new chat session:
cd "e:\Nivra Fase 2\nivra lo-fi\nivra-app"
git pull origin main

# If there are local uncommitted changes:
git stash              # Save local changes
git pull origin main   # Pull latest
git stash pop          # Restore local changes
```

**Why auto-pull**:

- Developer mungkin commit dari device lain
- Avoid merge conflicts
- Always work on latest codebase
- Prevent duplicate work

### Branching Strategy (Solo Developer)

**Simple approach** (current):

- Main branch: `main`
- Feature branches: Optional (bisa langsung commit ke main)
- Hotfix: Commit langsung dengan prefix `fix:`

**If collaborating later**:

- `main` - Production-ready code
- `develop` - Active development
- `feature/*` - New features
- `hotfix/*` - Urgent fixes

---

## Firebase & Environment Setup

### Environment Variables (.env.local)

**Location**: Root directory (NEVER commit!)

**Required variables**:

```env
VITE_FIREBASE_API_KEY=AIzaSyBeTVHnz5glT5wVUwM4LQ1Uc77PNabUmkg
VITE_FIREBASE_AUTH_DOMAIN=nivra-app-581be.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nivra-app-581be
VITE_FIREBASE_STORAGE_BUCKET=nivra-app-581be.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=993942743354
VITE_FIREBASE_APP_ID=1:993942743354:web:fd2f230a3d43556eb00803
VITE_ENABLE_FIREBASE_SYNC=true
```

**Usage in code**:

```javascript
// In firebaseConfig.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

### Firebase Authentication Setup

**Enabled providers** (Firebase Console):

1. **Anonymous** ✅ (Guest mode)
2. **Google** ✅ (Primary sign-in)

**To enable Google Sign-In**:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `nivra-app-581be`
3. Authentication → Sign-in method
4. Enable **Google** provider
5. Save

**Auth Flow**:

```
User opens app
    ↓
Check auth state (1.5s delay)
    ↓
Not authenticated? → Show LoginView
    ├─ Google Sign-In (recommended)
    └─ Guest Mode (anonymous auth)
    ↓
Authenticated → Initialize Firebase sync → Show Dashboard
```

### Firestore Structure

**Collections** (auto-created per user):

```
users/{userId}/
├── tasks/          # Task items
├── habits/         # Habit tracking
├── pomodoros/      # Pomodoro sessions
├── journals/       # Journal entries
├── books/          # Reading list & progress
├── finances/       # Finance transactions
├── achievements/   # Unlocked achievements
├── settings/       # User preferences
└── layout/         # Layout configuration
```

**Security Rules** (Firestore):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Key point**: Each user only access their own data (`userId` === `auth.uid`)

---

## Code Standards

### React Component Style

**Functional components** only (no class components):

```jsx
// ✅ GOOD
export const MyComponent = () => {
  const [state, setState] = useState(initial);

  return <div>...</div>;
};

// ❌ BAD
export class MyComponent extends React.Component { ... }
```

**Hooks order**:

```jsx
export const MyComponent = () => {
  // 1. Zustand stores
  const { data, actions } = useMyStore();

  // 2. React hooks (useState, useEffect, etc)
  const [localState, setLocalState] = useState();

  // 3. Custom hooks
  const customValue = useCustomHook();

  // 4. Computed values / functions
  const derivedValue = useMemo(() => ..., [deps]);
  const handleClick = useCallback(() => ..., [deps]);

  // 5. Side effects
  useEffect(() => { ... }, [deps]);

  // 6. Render
  return <div>...</div>;
};
```

### Zustand Store Pattern

**Template** (follow existing stores):

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { firestoreService } from '../services/firestoreService';

export const useMyStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,

      // Actions
      addItem: (item) => {
        const newItem = { ...item, id: crypto.randomUUID() };
        set((state) => ({
          items: [...state.items, newItem]
        }));

        // Firebase sync (if authenticated)
        const userId = /* get from useSyncStore */;
        if (userId) {
          firestoreService.addDocument(userId, 'myCollection', newItem);
        }
      },

      // ... more actions
    }),
    {
      name: 'my-store', // localStorage key
      version: 1,
    }
  )
);
```

**CRITICAL Firebase Sync Pattern**:

```javascript
// In action function
const { user } = useSyncStore.getState();
if (user?.uid) {
  await firestoreService.addDocument(user.uid, "collection", data);
}
```

### TailwindCSS Custom Syntax

**CSS Variable access** (CUSTOM PLUGIN):

```jsx
// ✅ CORRECT - Custom syntax
<div className="bg-(--bg-color) text-(--text-main) border-(--border-color)">

// ❌ WRONG - Don't use bracket notation
<div className="bg-[var(--bg-color)] text-[var(--text-main)]">
```

**Why?**: Custom Tailwind plugin translates `-(--var-name)` → `var(--var-name)`

**Common variables**:

- `bg-(--bg-color)` - Background
- `text-(--text-main)` - Primary text
- `text-(--text-muted)` - Secondary text
- `text-(--accent)` - Accent color
- `border-(--border-color)` - Border color

**Opacity**:

```jsx
<div className="bg-(--accent)/10">  {/* 10% opacity */}
```

### Component Imports Order

**Standard order**:

```javascript
// 1. React & external libraries
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. UI Components
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

// 3. Icons
import { Calendar, Clock, Trash2 } from "lucide-react";

// 4. Stores
import { useTaskStore } from "../store/useTaskStore";
import { useSyncStore } from "../store/useSyncStore";

// 5. Services & Utils
import { authService } from "../services/authService";
import { formatDate } from "../utils/helpers";
```

---

## Common Tasks

### 1. Adding New Feature View

**Steps**:

```bash
# 1. Create view file
# src/views/NewFeatureView.jsx

# 2. Add to App.jsx views object
const views = {
  // ... existing
  newfeature: <NewFeatureView />,
};

# 3. Add navigation item (if needed)
# In src/components/ui/Navigation.jsx or BottomNavigation.jsx
```

**View template**:

```jsx
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useMyStore } from "../store/useMyStore";

export const NewFeatureView = () => {
  const { data, actions } = useMyStore();

  return (
    <div className="container-custom py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-(--text-main)">
          Feature Title
        </h1>
      </div>

      <Card>{/* Content */}</Card>
    </div>
  );
};
```

### 2. Creating New Zustand Store

**Steps**:

```bash
# 1. Create store file
# src/store/useNewStore.js

# 2. Follow template (see Code Standards section)

# 3. Add Firebase sync subscription in useSyncStore.js
# In initializeSync() function
```

**Sync subscription template**:

```javascript
// In useSyncStore.js → initializeSync()
firestoreService.subscribeToCollection(
  currentUser.uid,
  "newCollection",
  (data) => {
    useNewStore.getState().setItems(data);
  }
);
```

### 3. Adding New UI Component

**Steps**:

```bash
# 1. Create component in src/components/ui/
# Example: src/components/ui/NewComponent.jsx

# 2. Follow design system (see Design Philosophy)

# 3. Export from index if needed
```

**Component template**:

```jsx
export const NewComponent = ({
  variant = "default",
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "font-mono text-(--text-main)";
  const variants = {
    default: "bg-(--bg-color)",
    accent: "bg-(--accent)/10",
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
```

### 4. Firebase Debugging

**Check sync status**:

```javascript
// In browser console
useSyncStore.getState().isAuthenticated; // Should be true
useSyncStore.getState().user; // User object
useSyncStore.getState().syncStatus; // 'synced', 'syncing', 'error'
```

**Check Firestore data**:

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Firestore Database
3. Navigate to `users/{userId}/collection`

**Force re-sync**:

```javascript
// In browser console
useSyncStore.getState().initializeSync();
```

### 5. Handling Errors

**Error patterns**:

**Service Worker errors**:

```javascript
// Check public/sw.js
// Ensure filters for chrome-extension:// and devtools://
```

**Firestore permission errors**:

```javascript
// Check userId matches auth.uid
// Verify auth state: useSyncStore.getState().user
```

**Build errors**:

```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run dev
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Service Worker Cache Errors

**Error**: `TypeError: Failed to execute 'put' on 'Cache': Request scheme 'chrome-extension' is unsupported`

**Solution**: Already fixed in `public/sw.js`:

```javascript
// Filter non-HTTP(S) schemes
if (!url.startsWith("http://") && !url.startsWith("https://")) {
  return;
}
```

**To apply**: Hard refresh browser (Ctrl+Shift+R)

---

#### 2. WebSocket Connection Failed (Vite HMR)

**Error**: `WebSocket connection to 'ws://localhost:5173/' failed`

**Solution**: Already configured in `vite.config.js`:

```javascript
server: {
  watch: {
    usePolling: true,
    interval: 1000,
  },
}
```

**Impact**: Error appears but HMR still works (polling fallback)

---

#### 3. Firebase Sync Not Working

**Check**:

```javascript
// 1. Auth state
useSyncStore.getState().isAuthenticated; // true?

// 2. User ID
useSyncStore.getState().user?.uid; // exists?

// 3. Sync status
useSyncStore.getState().syncStatus; // 'synced'?

// 4. Network (Firestore rules)
// Firebase Console → Firestore → Rules
// Ensure: allow read, write: if request.auth.uid == userId
```

**Solution**:

- If not authenticated: Logout → Login again
- If rules error: Check Firebase Console security rules
- If network error: Check internet connection

---

#### 4. Data Not Persisting After Refresh

**Check**:

```javascript
// 1. localStorage
localStorage.getItem("task-store"); // Should exist

// 2. Zustand persist config
// In store file, ensure persist() middleware used
```

**Solution**:

- Clear localStorage: `localStorage.clear()` → Refresh
- Check persist name doesn't conflict with other stores

---

#### 5. TailwindCSS Classes Not Working

**Issue**: Custom `-(--variable)` syntax not working

**Solution**:

```bash
# Restart dev server
npm run dev
```

**Check**: `tailwind.config.js` has custom plugin:

```javascript
plugin(function ({ addUtilities, theme }) {
  // CSS variable utilities
});
```

---

#### 6. Authentication Loop (Redirects Infinitely)

**Check**: `App.jsx` auth initialization delay:

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    setIsCheckingAuth(false);
  }, 1500); // Should be 1500ms minimum
  return () => clearTimeout(timer);
}, []);
```

**Solution**: Increase delay if Firebase auth slow

---

#### 7. Build Fails on Production

**Common causes**:

```bash
# 1. Missing environment variables
# Create .env.production with same vars as .env.local

# 2. Import errors
# Check all imports use correct relative paths

# 3. Unused imports/variables
# Run: npm run build
# Fix ESLint errors shown
```

---

## 🔄 Change Scenarios & Workflows

**Comprehensive guide untuk berbagai jenis perubahan dan apa yang harus dilakukan setelahnya**

### Scenario 1: Bug Fix (Production Critical)

**Example**: Login button tidak berfungsi, users tidak bisa masuk

**Workflow**:

```powershell
# 1. URGENT: Test locally first
npm run dev
# → Fix bug
# → Test di browser
# → Verify bug solved

# 2. Quick commit
git add .
git commit -m "fix: resolve login button not responding"
git push origin main

# 3. IMMEDIATE DEPLOY
npm run deploy

# 4. VERIFY LIVE
# Open https://nivra-app-581be.web.app
# Hard refresh (Ctrl+Shift+R)
# Test login button works

# ⏱️ Total time: 5-10 minutes
```

**Priority**: 🔴 CRITICAL - Deploy immediately

---

### Scenario 2: New Feature (Non-Critical)

**Example**: Add new "Reading Stats" widget

**Workflow**:

```powershell
# 1. Development (take your time)
npm run dev
# → Implement feature
# → Test thoroughly
# → Check responsive design
# → Test Firebase sync

# 2. Commit with detailed description
git add .
git commit -m "feat: add Reading Stats widget with weekly progress chart"
git push origin main

# 3. Deploy when ready (not urgent)
npm run deploy

# 4. Test live version
# Verify widget appears
# Test on mobile
# Check analytics data displays correctly

# ⏱️ Total time: 30-60 minutes
```

**Priority**: 🟡 NORMAL - Deploy after thorough testing

---

### Scenario 3: UI/Style Changes

**Example**: Update card shadow, change accent color

**Workflow**:

```powershell
# 1. Test styles locally
npm run dev
# → Change CSS/Tailwind classes
# → Test in light & dark mode
# → Check all components affected

# 2. Commit style changes
git add .
git commit -m "style: update card shadows and accent color for better contrast"
git push origin main

# 3. Deploy (low risk)
npm run deploy

# 4. Visual verification
# Open live site
# Hard refresh to clear CSS cache
# Check all pages look correct
# Test both light/dark themes

# ⏱️ Total time: 10-20 minutes
```

**Priority**: 🟢 LOW - Deploy anytime, low impact

---

### Scenario 4: Firebase/Backend Changes

**Example**: Add new Firestore collection, update security rules

**Workflow**:

```powershell
# 1. Update code locally
npm run dev
# → Add new store (e.g., useGoalsStore.js)
# → Add sync subscription in useSyncStore
# → Test data saves to Firestore

# 2. Update Firebase Security Rules
# Go to Firebase Console → Firestore → Rules
# Add rules for new collection:
match /users/{userId}/goals/{goalId} {
  allow read, write: if request.auth.uid == userId;
}
# → Click "Publish"

# 3. Commit code changes
git add .
git commit -m "feat: add Goals tracking with Firebase sync"
git push origin main

# 4. Deploy code
npm run deploy

# 5. CRITICAL: Test full sync flow
# - Login to live app
# - Add goal → Check Firestore Console (data saved?)
# - Refresh page → Check goal still there
# - Login from different device → Check goal synced

# ⏱️ Total time: 30-45 minutes
```

**Priority**: 🟠 MEDIUM-HIGH - Test thoroughly before deploy

---

### Scenario 5: Configuration Changes

**Example**: Update `vite.config.js`, `tailwind.config.js`

**Workflow**:

```powershell
# 1. Change config locally
# Edit config file
npm run dev  # Restart dev server
# → Test changes work

# 2. Test production build
npm run build
npm run preview
# → Ensure build works
# → Check preview at http://localhost:4173

# 3. Commit config
git add .
git commit -m "chore: update Vite config for better chunk splitting"
git push origin main

# 4. Deploy
npm run deploy

# 5. Monitor build output
# Check for:
# - Build errors
# - Bundle size changes
# - Warning messages

# ⏱️ Total time: 15-25 minutes
```

**Priority**: 🟡 NORMAL - Deploy after build verification

---

### Scenario 6: Environment Variables Update

**Example**: Change Firebase API key, add new feature flag

**Workflow**:

```powershell
# 1. Update .env.local (local machine)
# Edit .env.local with new values
# DO NOT COMMIT .env.local!

# 2. Test locally
npm run dev
# → Verify new env vars work

# 3. Commit code changes (if any)
# If you added code that uses new env var:
git add .
git commit -m "feat: add feature flag for experimental mode"
git push origin main

# 4. CRITICAL: Update production env vars
# Firebase Hosting uses env vars from build time!
# The .env.local values are BUNDLED into production build

# 5. Rebuild & Deploy
npm run build  # Rebuilds with current .env.local values
npm run deploy

# 6. Verify env vars in production
# Open browser console:
# console.log(import.meta.env.VITE_NEW_VAR)

# ⏱️ Total time: 10-15 minutes
```

**Priority**: 🟠 MEDIUM - Ensure .env.local correct before deploy

---

### Scenario 7: Refactoring (No Behavior Change)

**Example**: Optimize code, improve performance, clean up

**Workflow**:

```powershell
# 1. Refactor locally
npm run dev
# → Restructure code
# → Test EVERYTHING still works
# → Check no regressions

# 2. Run tests (if available)
npm run lint
npm run build

# 3. Commit refactor
git add .
git commit -m "refactor: optimize Firestore subscription performance"
git push origin main

# 4. Deploy (low urgency)
# Since no behavior change, can batch with other changes
npm run deploy

# 5. Monitor for issues
# Check Firebase Console for errors
# Monitor user reports (if shared)

# ⏱️ Total time: 20-40 minutes
```

**Priority**: 🟢 LOW - Can defer deployment

---

### Scenario 8: Dependency Update

**Example**: Update React, Vite, Firebase SDK

**Workflow**:

```powershell
# 1. Update package.json
npm update react react-dom
# Or: npm install react@latest react-dom@latest

# 2. Test locally THOROUGHLY
npm run dev
# → Test ALL features
# → Check for deprecation warnings
# → Test Firebase sync
# → Test authentication

# 3. Test production build
npm run build
npm run preview

# 4. Commit updates
git add package.json package-lock.json
git commit -m "chore: update React to v19.2.0"
git push origin main

# 5. Deploy with caution
npm run deploy

# 6. CRITICAL: Monitor production
# Test all major features:
# - Login/logout
# - Data sync
# - All views load
# - No console errors

# 7. Rollback if issues
# If critical bug found:
firebase hosting:clone nivra-app-581be:previous nivra-app-581be:live

# ⏱️ Total time: 45-90 minutes
```

**Priority**: 🔴 HIGH-RISK - Thorough testing required

---

### Quick Reference: When to Deploy

| Change Type          | Deploy Priority | Testing Level   | Est. Time |
| -------------------- | --------------- | --------------- | --------- |
| **Critical Bug**     | 🔴 Immediate    | Quick verify    | 5-10 min  |
| **Security Issue**   | 🔴 Immediate    | Essential only  | 5-15 min  |
| **New Feature**      | 🟡 Normal       | Thorough        | 30-60 min |
| **UI/Style**         | 🟢 Low          | Visual check    | 10-20 min |
| **Refactoring**      | 🟢 Can defer    | Regression test | 20-40 min |
| **Config Change**    | 🟡 Normal       | Build verify    | 15-25 min |
| **Dependencies**     | 🔴 High-risk    | Extensive       | 45-90 min |
| **Firebase Backend** | 🟠 Medium-high  | Full sync test  | 30-45 min |
| **Env Variables**    | 🟠 Medium       | Env verify      | 10-15 min |

---

### Post-Deploy Monitoring Checklist

**After EVERY deployment**, check:

```markdown
✅ Live URL loads: https://nivra-app-581be.web.app
✅ No console errors (F12)
✅ Login/logout works
✅ Firebase sync active (add/edit/delete data)
✅ Service Worker registered (Application tab)
✅ Mobile responsive (DevTools mobile view)
✅ PWA installable (check install prompt)
✅ All navigation works
✅ No broken images/assets
✅ Theme switching works (light/dark)
```

**If ANY fails**: Rollback immediately!

---

## DO's and DON'Ts

### ✅ DO's

**Code Quality**:

- ✅ Use functional components with hooks
- ✅ Follow existing file structure (don't create random folders)
- ✅ Add comments for complex logic
- ✅ Use TypeScript-style JSDoc for functions:
  ```javascript
  /**
   * Calculate streak from habit data
   * @param {Array} habitData - Array of habit completion dates
   * @returns {number} Current streak count
   */
  ```
- ✅ Test on `npm run dev` before committing
- ✅ Check browser console for errors after changes

**Git**:

- ✅ Commit frequently with clear messages
- ✅ Use conventional commit format (`feat:`, `fix:`, etc)
- ✅ Pull before starting new work: `git pull origin main`
- ✅ Check `.gitignore` covers `.env.local` and `node_modules`
- ✅ Review `git status` before committing

**Firebase**:

- ✅ Always check `user?.uid` before Firestore operations
- ✅ Handle offline state gracefully (localStorage fallback)
- ✅ Subscribe to collections in `useSyncStore.initializeSync()`
- ✅ Unsubscribe on cleanup (return function in useEffect)

**Design**:

- ✅ Follow `design_manifesto.md` principles
- ✅ Use CSS variables via Tailwind custom syntax: `bg-(--bg-color)`
- ✅ Monospace font for data, Serif for humanis text
- ✅ Dashed borders for secondary elements
- ✅ Film grain overlay (noise texture)
- ✅ Ample whitespace (don't cram UI)

---

### ❌ DON'Ts

**Code Quality**:

- ❌ NEVER use class components
- ❌ NEVER commit without testing locally first
- ❌ DON'T hardcode values (use constants or config)
- ❌ DON'T ignore ESLint warnings (fix them!)
- ❌ DON'T create duplicate components (check existing first)
- ❌ DON'T use inline styles (use Tailwind classes)

**Git**:

- ❌ NEVER commit `.env.local` (contains Firebase keys)
- ❌ NEVER commit `node_modules/` (huge folder)
- ❌ NEVER commit `dist/` or build output
- ❌ DON'T push directly without checking `git status`
- ❌ DON'T use vague commit messages ("fix stuff", "update")
- ❌ DON'T commit commented-out code (delete it!)

**Firebase**:

- ❌ NEVER expose Firebase Admin SDK keys (use client SDK only)
- ❌ DON'T bypass Firestore security rules
- ❌ DON'T forget to unsubscribe from Firestore listeners
- ❌ DON'T make Firestore calls without checking auth state
- ❌ NEVER hardcode user IDs

**Design**:

- ❌ DON'T use bright/neon colors (muted palette only!)
- ❌ DON'T use `bg-[var(--variable)]` syntax (use `bg-(--variable)`)
- ❌ DON'T use excessive animations (keep subtle)
- ❌ DON'T use rounded-full everywhere (square corners!)
- ❌ DON'T ignore the warm, analog aesthetic
- ❌ DON'T make "Silicon Valley startup" UI (anti-polished!)

---

## Quick Reference Commands

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint check
npm run lint
```

### Git Workflow

```bash
# Check status
git status

# Pull latest
git pull origin main

# Stage all changes
git add .

# Commit with message
git commit -m "feat: your description"

# Push to GitHub
git push origin main

# View commit history
git log --oneline -10

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

### Firebase Console Links

- **Project Console**: https://console.firebase.google.com/project/nivra-app-581be
- **Authentication**: https://console.firebase.google.com/project/nivra-app-581be/authentication/users
- **Firestore**: https://console.firebase.google.com/project/nivra-app-581be/firestore
- **Storage**: https://console.firebase.google.com/project/nivra-app-581be/storage

---

## Initial Setup Checklist (For New AI Agent)

Saat pertama kali handle project ini:

### 1. Read Documentation

- [ ] Read this file completely (AI_AGENT_INSTRUCTIONS.md)
- [ ] Read design_manifesto.md
- [ ] Scan README.md
- [ ] Check FIREBASE_SYNC_INSTRUCTIONS.md (if exists)

### 2. Verify Environment

```bash
# Check Node.js version (should be 18+)
node --version

# Check if .env.local exists
ls -la .env.local

# Verify Firebase credentials in .env.local
cat .env.local
```

### 3. Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser: http://localhost:5173
```

### 4. Check Git Status

```bash
# Current branch
git branch

# Recent commits
git log --oneline -5

# Uncommitted changes
git status

# Pull latest (if needed)
git pull origin main
```

### 5. Verify Firebase Connection

- [ ] Open app in browser
- [ ] Try login with Guest mode
- [ ] Check browser console (no errors?)
- [ ] Add a test task → Check Firestore Console
- [ ] Verify data appears in Firestore

### 6. Review Codebase Structure

```bash
# View structure
tree src -L 2

# Or manually explore:
# - src/store/ (Zustand stores)
# - src/services/ (Firebase services)
# - src/views/ (Page components)
# - src/components/ (Reusable components)
```

---

## Advanced Topics

### Account Linking (Guest → Google)

**Future feature** untuk upgrade guest user ke permanent account:

```javascript
// In authService.js
import { linkWithCredential, GoogleAuthProvider } from "firebase/auth";

export const linkGuestToGoogle = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user.isAnonymous) {
    throw new Error("User is not anonymous");
  }

  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);

  // Link accounts
  await linkWithCredential(user, credential.credential);

  return user;
};
```

**UI**: Add button in Settings → Account section for anonymous users

---

### Performance Optimization

**Lazy loading routes** (if adding complex routing later):

```javascript
import { lazy, Suspense } from "react";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<LoadingScreen />}>
  <HeavyComponent />
</Suspense>;
```

**Zustand selector optimization**:

```javascript
// ❌ BAD - Re-renders on any store change
const store = useTaskStore();

// ✅ GOOD - Only re-renders when tasks change
const tasks = useTaskStore((state) => state.tasks);
```

---

### Testing Strategy (Future)

**Recommended tools**:

- **Vitest**: Unit tests
- **React Testing Library**: Component tests
- **Playwright**: E2E tests

**Test structure**:

```javascript
// src/store/__tests__/useTaskStore.test.js
import { renderHook, act } from "@testing-library/react";
import { useTaskStore } from "../useTaskStore";

describe("useTaskStore", () => {
  it("should add task", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask({ title: "Test task" });
    });

    expect(result.current.tasks).toHaveLength(1);
  });
});
```

---

## Contact & Context

**Developer**: Alfarabi Pratama  
**Project Start**: November 2024  
**Current Phase**: MVP with Firebase sync + Authentication  
**Language**: Bahasa Indonesia (UI & communication)

**Key Concerns**:

1. Data loss prevention (solved with Firebase sync)
2. Multi-device support (solved with Firestore real-time)
3. Sharing app for feedback (solved with authentication)

**Future Plans**:

- Account linking (guest → permanent)
- Offline mode improvements
- Progressive Web App (PWA) features
- Sharing/collaboration features
- Export data (JSON, CSV)

---

## Changelog

**v1.0** (Dec 2024):

- Initial authentication system (Google + Anonymous)
- Firebase real-time sync for all stores
- Complete UI following design manifesto
- Service Worker with offline support
- Weekly digest and insights

---

## Final Notes for AI Agents

**Personality & Communication**:

- Speak in Bahasa Indonesia (user preference)
- Be concise but thorough
- Explain WHY, not just WHAT
- If unsure, ask before implementing
- Test changes locally before committing

**Problem-Solving Approach**:

1. Read error messages carefully
2. Check relevant documentation first
3. Verify existing patterns in codebase
4. Test fix locally
5. Commit with clear message

**When Stuck**:

- Check this file (AI_AGENT_INSTRUCTIONS.md)
- Check design_manifesto.md for design decisions
- Search codebase for similar patterns: `grep -r "pattern" src/`
- Check Firebase Console for data/auth issues
- Ask user for clarification if architectural decision needed

---

**Good luck & happy coding!** 🌱

_This document is maintained by Alfarabi Pratama. Last updated: December 2024._
