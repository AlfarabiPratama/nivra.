# 🔥 Firebase Real-Time Sync Setup Guide

## Overview

Nivra sekarang mendukung **real-time sync** menggunakan Firebase Firestore. Data kamu akan tersinkronisasi otomatis antar semua device!

---

## 📋 Prerequisites

1. ✅ Firebase SDK sudah terinstall (`npm install firebase` - DONE)
2. ⏳ Akun Firebase (buat di [Firebase Console](https://console.firebase.google.com))
3. ⏳ Firebase project dengan Firestore enabled

---

## 🚀 Setup Steps

### Step 1: Create Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** atau **"Create a project"**
3. Beri nama project (contoh: `nivra-personal`)
4. Disable Google Analytics (optional untuk personal use)
5. Click **"Create project"**

### Step 2: Enable Firestore Database

1. Di sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Pilih **"Start in production mode"** (kita akan set rules nanti)
4. Pilih region terdekat (contoh: `asia-southeast1` untuk Indonesia)
5. Click **"Enable"**

### Step 3: Setup Firestore Security Rules

Di Firestore Console → **Rules tab**, paste rules ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **"Publish"**

### Step 4: Enable Authentication

1. Di sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Enable **"Anonymous"** authentication:
   - Click "Anonymous" → Toggle "Enable" → Save
4. (Optional) Enable **"Google"** authentication:
   - Click "Google" → Toggle "Enable" → Add support email → Save

### Step 5: Get Firebase Config

1. Di Project Overview (⚙️ Settings), click **"Project settings"**
2. Scroll ke **"Your apps"**
3. Click **Web icon** (</>) untuk add web app
4. Beri nama app (contoh: `nivra-web`)
5. **JANGAN** check "Firebase Hosting"
6. Click **"Register app"**
7. Copy Firebase config object yang muncul

### Step 6: Setup Environment Variables

1. Di root folder Nivra, copy `.env.example` ke `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local`, paste config dari Firebase:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=nivra-personal.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=nivra-personal
   VITE_FIREBASE_STORAGE_BUCKET=nivra-personal.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_ENABLE_FIREBASE_SYNC=true
   ```

3. **PENTING:** `.env.local` sudah ada di `.gitignore`, jangan commit file ini!

### Step 7: Add FirebaseSyncProvider to App

Edit `src/App.jsx`, wrap app dengan `FirebaseSyncProvider`:

```jsx
import { FirebaseSyncProvider } from "./components/sync/FirebaseSyncProvider";

function App() {
  return (
    <FirebaseSyncProvider>
      {/* Your existing app code */}
      <AppShell />
    </FirebaseSyncProvider>
  );
}
```

### Step 8: Add Sync Status Indicator (Optional)

Edit `src/components/ui/Navigation.jsx` atau `AppShell.jsx`, tambahkan:

```jsx
import { SyncStatusBadge } from "../sync/SyncStatusIndicator";

// Tambahkan di header/navigation
<SyncStatusBadge />;
```

---

## 🎯 How It Works

### Auto Sign-In

- Saat app pertama kali load, Firebase akan auto sign-in **anonymously**
- User ID akan disimpan, jadi data tetap konsisten antar session
- Tidak perlu email/password!

### Real-Time Sync

- Setiap perubahan data (add/edit/delete task, book, journal, habit) langsung disync ke Firestore
- Perubahan dari device lain langsung muncul secara real-time
- LocalStorage tetap digunakan sebagai offline cache

### Offline Support

- App tetap 100% functional offline
- Data disimpan di LocalStorage
- Saat online, data otomatis tersinkronisasi

---

## 🧪 Testing Sync

1. **Buka Nivra di laptop:**

   - Add task baru: "Test sync dari laptop"
   - Check browser console: harus ada log "✅ Tasks synced"

2. **Buka Nivra di phone (same browser, same account):**

   - Task "Test sync dari laptop" harus muncul otomatis!
   - Add task baru: "Test sync dari phone"

3. **Kembali ke laptop:**

   - Task "Test sync dari phone" harus muncul otomatis!

4. **Check Firestore Console:**
   - Buka Firestore Database
   - Lihat collection `users/{userId}/tasks`
   - Semua tasks harus ada di sana

---

## 🔧 Configuration Options

### Disable Sync (Offline Only Mode)

Edit `.env.local`:

```env
VITE_ENABLE_FIREBASE_SYNC=false
```

App akan tetap berjalan 100% offline tanpa Firebase.

### Manual Sync Toggle

User bisa disable auto-sync di Settings (fitur ini bisa ditambahkan nanti).

---

## 📊 Firestore Data Structure

```
users/
  {userId}/
    tasks/
      {taskId}
        - id
        - text
        - completed
        - priority
        - createdAt
        - updatedAt (serverTimestamp)

    books/
      {bookId}
        - id
        - title
        - author
        - status
        - ...

    journals/
      {journalId}
        - id
        - content
        - mood
        - ...

    habits/
      {habitId}
        - id
        - name
        - streak
        - ...
```

---

## 🐛 Troubleshooting

### Sync tidak bekerja

1. Check console untuk error messages
2. Pastikan `.env.local` sudah diisi dengan benar
3. Restart dev server: `npm run dev`
4. Check Firestore rules - pastikan user bisa read/write

### "Firebase not configured" di console

- `.env.local` belum dibuat atau environment variables tidak terload
- Restart dev server

### Sync lambat

- Check internet connection
- Firestore free tier ada rate limits (20K writes/day, 50K reads/day)
- Untuk personal use, ini sangat cukup

### Duplicate data

- Hapus data di LocalStorage: `localStorage.clear()`
- Reload app, data akan re-sync dari Firestore

---

## 💰 Firebase Free Tier Limits

**Firestore:**

- ✅ 1 GB storage
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day

**Authentication:**

- ✅ Unlimited anonymous auth

**Untuk personal use (1 user), ini gratis selamanya!**

---

## 🔐 Security Notes

- Data disimpan di Firestore dengan User ID sebagai key
- Firestore rules memastikan user hanya bisa akses data mereka sendiri
- Anonymous auth = no personal info (email/name) disimpan di Firebase
- Jika ingin lebih privacy, tetap gunakan offline-only mode

---

## 🚀 Next Steps

1. ✅ Setup Firebase project (ikuti step 1-6 di atas)
2. ✅ Test sync (step 🧪 Testing)
3. 🔄 Tambahkan sync untuk stores lainnya (books, journal, habits)
4. 🎨 Customize sync status UI
5. ⚙️ Add settings page untuk toggle sync on/off

---

## 📝 Notes

- Stores sudah siap untuk sync, tapi perlu ditambahkan `initializeSync()` dan sync logic ke masing-masing store
- Contoh implementasi ada di `useTaskStore.js` (akan diupdate)
- Migration script untuk existing data akan dibuat setelah testing

**Happy Syncing! 🎉**
