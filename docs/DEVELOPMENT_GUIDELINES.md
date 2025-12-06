B# Development Guidelines - Nivra App

## 🎯 Coding Standards

### Tailwind CSS

- **WAJIB** gunakan syntax canonical: `text-(--variable)` bukan `text-[var(--variable)]`
- Lihat `docs/TAILWIND_BEST_PRACTICES.md` untuk detail lengkap

### React Best Practices

- Gunakan functional components dengan hooks
- Destructure props untuk readability
- Gunakan `clsx` untuk conditional classNames
- Simpan state di Zustand stores untuk global state

### File Organization

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── widgets/     # Feature-specific widgets
│   └── modals/      # Modal components
├── views/           # Page-level components
├── store/           # Zustand state management
├── hooks/           # Custom React hooks
└── constants/       # App constants
```

## ✅ Pre-Commit Checklist

Sebelum commit code:

1. **Syntax Check**

   - [ ] No `[var(--variable)]` syntax (use `(--variable)`)
   - [ ] No `flex-shrink-0` (use `shrink-0`)
   - [ ] No ESLint errors

2. **Functionality**

   - [ ] Test feature di browser
   - [ ] Test responsive (mobile & desktop)
   - [ ] Test dark/light theme

3. **Code Quality**

   - [ ] Remove console.logs
   - [ ] Remove unused imports
   - [ ] Meaningful variable names
   - [ ] Add comments untuk logic kompleks

4. **Git**
   - [ ] Commit message yang jelas
   - [ ] Stage hanya files yang relevant
   - [ ] Pull latest changes sebelum push

## 📝 Commit Message Format

```
type(scope): subject

[optional body]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Formatting changes
- `docs`: Documentation
- `chore`: Maintenance

**Examples:**

```bash
feat(journal): Add mood analytics widget
fix(pomodoro): Timer not resetting properly
refactor(dashboard): Update Tailwind syntax to canonical
docs(readme): Update installation instructions
```

## 🎨 Component Template

```jsx
import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import clsx from "clsx";

export const MyComponent = ({ title, onAction }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    onAction?.();
  };

  return (
    <Card className="p-4">
      <h3 className="text-(--text-main) font-serif text-xl mb-4">{title}</h3>

      <Button
        onClick={handleClick}
        className={clsx(
          "transition-colors",
          isActive
            ? "border-(--accent) text-(--accent) bg-(--accent)/10"
            : "border-(--border-color) text-(--text-muted)"
        )}
      >
        {isActive ? "Active" : "Inactive"}
      </Button>
    </Card>
  );
};
```

## 🔄 Firebase Sync Development

### Adding Sync to New Stores

Jika menambahkan store baru yang perlu sync:

```js
// 1. Import Firebase utilities
import { isSyncEnabled, syncDocToFirestore, deleteDocFromFirestore, subscribeToCollection } from '../services/firestoreService';
import { useSyncStore } from './useSyncStore';

// 2. Add initialization method
initializeSync: () => {
  if (!isSyncEnabled()) return;

  const user = useSyncStore.getState().user;
  if (!user) return;

  const unsubscribe = subscribeToCollection(
    user.uid,
    'yourCollection',
    (data) => {
      set({ items: data });
    }
  );

  set({ syncUnsubscribe: unsubscribe });
},

// 3. Add cleanup method
stopSync: () => {
  const { syncUnsubscribe } = get();
  if (syncUnsubscribe) {
    syncUnsubscribe();
    set({ syncUnsubscribe: null });
  }
},

// 4. Add sync calls in CRUD methods
addItem: (item) => {
  const newItem = { ...item, id: Date.now().toString() };
  set((state) => ({ items: [...state.items, newItem] }));

  // Sync to Firebase
  if (isSyncEnabled()) {
    const user = useSyncStore.getState().user;
    if (user) {
      syncDocToFirestore(user.uid, 'yourCollection', newItem.id, newItem);
    }
  }
},
```

Lihat `FIREBASE_SYNC_INSTRUCTIONS.md` untuk contoh lengkap.

### FirebaseSyncProvider Integration

Tambahkan store baru ke `FirebaseSyncProvider.jsx`:

```jsx
useEffect(() => {
  if (isAuthenticated) {
    setTimeout(() => useTaskStore.getState().initializeSync(), 100);
    setTimeout(() => useYourNewStore.getState().initializeSync(), 500); // Add here
  }
}, [isAuthenticated]);
```

### Testing Sync

1. **Local Development**: Enable sync di `.env.local`
2. **Multi-Device Test**: Login di 2+ devices, verify data sync
3. **Offline Test**: Disconnect internet, make changes, reconnect
4. **Migration Test**: Populate local data, run migration, verify Firestore

## 🔒 Security Reminders

- **NEVER** commit `.env` atau `.env.local` files
- **NEVER** expose Firebase credentials di public code
- **ALWAYS** validate user input before sync
- **ALWAYS** sanitize data sebelum display
- **ALWAYS** test Firestore security rules di Console

## 🐛 Debugging Tips

1. **React DevTools**: Install extension untuk inspect components
2. **Console Methods**: Gunakan `console.table()` untuk object arrays
3. **VS Code Debugger**: Set breakpoints di browser
4. **Zustand DevTools**: Monitor state changes

## 📚 Helpful Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS v4 Docs](https://tailwindcss.com)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Lucide React Icons](https://lucide.dev)

## 🤝 Contributing

1. Create feature branch dari `main`
2. Implement changes dengan best practices
3. Test thoroughly
4. Commit dengan clear messages
5. Push dan ready untuk review

---

**Remember:** Clean code is not written by following a set of rules. Clean code is written by someone who cares.
