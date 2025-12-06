# Tailwind CSS Warnings - suggestCanonicalClasses

## Penjelasan

Warning `suggestCanonicalClasses` muncul karena Tailwind CSS v4 merekomendasikan sintaks baru untuk CSS variables:

**Old syntax (masih valid):**

```jsx
className = "text-[var(--text-main)]";
```

**New syntax (recommended):**

```jsx
className = "text-(--text-main)";
```

## Status

⚠️ **Warning ini AMAN untuk diabaikan** karena:

- Bukan error, hanya suggestion
- Tidak mempengaruhi functionality aplikasi
- Sintaks lama (`[var(--variable)]`) masih 100% valid dan didukung
- Aplikasi berjalan normal tanpa masalah

## Jika Ingin Memperbaiki

Untuk menghilangkan warning sepenuhnya, update manual setiap class:

### Find and Replace Pattern:

1. **Text colors:**

   - Find: `text-[var(--text-main)]` → Replace: `text-(--text-main)`
   - Find: `text-[var(--text-muted)]` → Replace: `text-(--text-muted)`
   - Find: `text-[var(--accent)]` → Replace: `text-(--accent)`

2. **Background colors:**

   - Find: `bg-[var(--bg-color)]` → Replace: `bg-(--bg-color)`
   - Find: `bg-[var(--card-color)]` → Replace: `bg-(--card-color)`
   - Find: `bg-[var(--accent)]` → Replace: `bg-(--accent)`

3. **Border colors:**

   - Find: `border-[var(--border-color)]` → Replace: `border-(--border-color)`
   - Find: `border-[var(--accent)]` → Replace: `border-(--accent)`

4. **Dengan opacity:**

   - Find: `bg-[var(--accent)]/10` → Replace: `bg-(--accent)/10`
   - Find: `bg-[var(--accent)]/5` → Replace: `bg-(--accent)/5`

5. **Hover states:**

   - Find: `hover:text-[var(--text-main)]` → Replace: `hover:text-(--text-main)`
   - Find: `hover:bg-[var(--border-color)]` → Replace: `hover:bg-(--border-color)`

6. **Other utilities:**
   - Find: `fill-[var(--accent)]` → Replace: `fill-(--accent)`
   - Find: `placeholder:text-[var(--text-muted)]` → Replace: `placeholder:text-(--text-muted)`

### Files yang Affected:

- `src/views/JournalView.jsx` - ~90 instances
- `src/views/ReadingView.jsx` - ~100 instances
- `src/views/GardenView.jsx` - ~30 instances
- Dan file-file lainnya

### Cara Cepat (VS Code):

1. Tekan `Ctrl+Shift+H` (Find and Replace in Files)
2. Enable Regex mode (Alt+R)
3. Find: `([a-z-]+)-\[var\(--([\w-]+)\)\]`
4. Replace: `$1-($2)`
5. Preview dan Replace All

**⚠️ BACKUP dulu sebelum mass replace!**

## Rekomendasi

**Untuk Development:** Abaikan warning ini, fokus ke fitur development.

**Untuk Production Release:** Boleh diperbaiki untuk code cleanliness, tapi tidak wajib.

## Trade-offs

✅ **Biarkan syntax lama:**

- Tidak perlu effort update
- Kode tetap berfungsi sempurna
- Compatible dengan Tailwind CSS v3 & v4

✅ **Update ke syntax baru:**

- Lebih modern dan clean
- Menghilangkan warning
- Slightly lebih performant (negligible)

---

_Note: This is purely cosmetic. The app works perfectly fine with current syntax._
