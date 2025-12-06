# Tailwind CSS Best Practices - Nivra App

## 📋 Panduan Syntax Tailwind CSS v4

### ✅ Syntax yang BENAR (Canonical)

Gunakan syntax ini untuk semua code baru:

```jsx
// ✅ CSS Variables - Gunakan format pendek
className = "text-(--text-main)";
className = "bg-(--bg-color)";
className = "border-(--border-color)";
className = "text-(--accent)";

// ✅ Dengan opacity
className = "bg-(--accent)/10";
className = "bg-(--accent)/5";

// ✅ Hover states
className = "hover:text-(--text-main)";
className = "hover:bg-(--border-color)";
className = "hover:border-(--accent)";

// ✅ Other states
className = "focus:border-(--accent)";
className = "placeholder:text-(--text-muted)";
className = "group-hover:text-(--accent)";

// ✅ Utility classes yang sudah diperbarui
className = "shrink-0"; // bukan flex-shrink-0
```

### ❌ Syntax yang LAMA (Deprecated)

Hindari syntax ini (meskipun masih berfungsi):

```jsx
// ❌ Format lama - JANGAN gunakan lagi
className = "text-[var(--text-main)]";
className = "bg-[var(--bg-color)]";
className = "border-[var(--border-color)]";

// ❌ Dengan opacity format lama
className = "bg-[var(--accent)]/10";

// ❌ Utility lama
className = "flex-shrink-0"; // gunakan shrink-0
```

## 🎨 CSS Variables yang Tersedia

### Theme Colors

```jsx
// Text colors
text - (--text - main); // Primary text
text - (--text - muted); // Secondary/muted text
text - --accent; // Accent/highlight color

// Background colors
bg - (--bg - color); // Main background
bg - (--card - color); // Card background
bg - (--bg - elevated); // Elevated background

// Border colors
border - (--border - color); // Default border
border - --accent; // Accent border
```

### Contoh Penggunaan Real

#### Card Component

```jsx
<Card className="bg-(--card-color) border border-(--border-color) p-4">
  <h3 className="text-(--text-main) font-serif text-xl">Title</h3>
  <p className="text-(--text-muted) text-sm">Description text</p>
</Card>
```

#### Button dengan Hover

```jsx
<button
  className="
  border border-(--border-color) 
  text-(--text-muted) 
  hover:border-(--accent) 
  hover:text-(--accent) 
  hover:bg-(--accent)/10
  transition-colors
"
>
  Click Me
</button>
```

#### Input Field

```jsx
<input
  className="
    bg-transparent 
    text-(--text-main) 
    placeholder:text-(--text-muted)
    border-b border-(--border-color)
    focus:border-(--accent)
  "
  placeholder="Enter text..."
/>
```

#### Progress Bar

```jsx
<div className="w-full h-2 bg-(--bg-color) border border-(--border-color)">
  <div
    className="h-full bg-(--accent) transition-all"
    style={{ width: `${progress}%` }}
  />
</div>
```

## 🔧 Migration Checklist untuk Code Baru

Sebelum commit code baru, pastikan:

- [ ] Tidak ada `[var(--variable)]` syntax
- [ ] Gunakan `(--variable)` untuk CSS variables
- [ ] Gunakan `shrink-0` bukan `flex-shrink-0`
- [ ] Gunakan `grow-0` bukan `flex-grow-0`
- [ ] Test di browser bahwa styling berfungsi
- [ ] Run linter untuk cek warnings

## 📝 Quick Reference Table

| Old Syntax ❌                  | New Syntax ✅             |
| ------------------------------ | ------------------------- |
| `text-[var(--text-main)]`      | `text-(--text-main)`      |
| `bg-[var(--bg-color)]`         | `bg-(--bg-color)`         |
| `border-[var(--border-color)]` | `border-(--border-color)` |
| `bg-[var(--accent)]/10`        | `bg-(--accent)/10`        |
| `hover:text-[var(--accent)]`   | `hover:text-(--accent)`   |
| `flex-shrink-0`                | `shrink-0`                |

## 🚀 VS Code Snippets (Optional)

Tambahkan ke `.vscode/snippets.code-snippets` untuk productivity:

```json
{
  "Tailwind Text Color": {
    "prefix": "tw-text",
    "body": "text-(--text-${1|main,muted,accent|})",
    "description": "Tailwind text color with CSS variable"
  },
  "Tailwind Background": {
    "prefix": "tw-bg",
    "body": "bg-(--${1|bg-color,card-color,accent|})",
    "description": "Tailwind background with CSS variable"
  },
  "Tailwind Border": {
    "prefix": "tw-border",
    "body": "border border-(--${1|border-color,accent|})",
    "description": "Tailwind border with CSS variable"
  }
}
```

## 🎯 Tips Development

1. **Konsistensi**: Selalu gunakan syntax baru untuk semua code
2. **Copy-paste**: Jika copy dari file lama, update syntaxnya
3. **Review**: Cek PR/commit untuk syntax lama sebelum merge
4. **Linter**: Perhatikan warnings dari Tailwind CSS IntelliSense
5. **Testing**: Test di dark/light mode untuk ensure colors bekerja

## 📚 References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [CSS Variables in Tailwind](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- Project: `TAILWIND_WARNINGS.md` untuk context migration

---

**Last Updated:** December 6, 2025
**Tailwind Version:** 4.1.17
**Maintained by:** Alfarabi Pratama
