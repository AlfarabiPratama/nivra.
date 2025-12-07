# Firebase Hosting Deployment Guide

## 🚀 Quick Deploy

### One-time Setup (First Deployment)

1. **Install Firebase CLI** (if not installed):

```powershell
npm install -g firebase-tools
```

2. **Login to Firebase**:

```powershell
firebase login
```

3. **Initialize Firebase** (sudah dikonfigurasi, skip jika `firebase.json` ada):

```powershell
firebase init hosting
# Pilih existing project: nivra-app-581be
# Public directory: dist
# Single-page app: Yes
# Overwrite index.html: No
```

---

## 📦 Deploy Commands

### Option 1: Using npm script (Recommended)

```powershell
npm run deploy
```

### Option 2: Using PowerShell script

```powershell
.\deploy.ps1
```

### Option 3: Manual steps

```powershell
# Build production
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

---

## 🌐 Live URLs

After deployment, your app will be available at:

- **Primary**: https://nivra-app-581be.web.app
- **Alternative**: https://nivra-app-581be.firebaseapp.com

---

## 🔄 Preview Deployments (Testing Before Production)

Deploy to preview channel for testing:

```powershell
npm run deploy:preview
```

This creates a temporary URL like:

- https://nivra-app-581be--preview-xyz.web.app

---

## ⚙️ Configuration Files

- **`firebase.json`** - Hosting configuration
- **`.firebaserc`** - Project configuration
- **`deploy.ps1`** - PowerShell deployment script
- **`deploy.sh`** - Bash deployment script (for Git Bash/WSL)

---

## 🔍 Post-Deployment Checks

After deployment, verify:

1. ✅ App loads correctly
2. ✅ Google Sign-In works
3. ✅ Firebase sync working
4. ✅ Service Worker registered
5. ✅ PWA installable

Test URLs:

```
https://nivra-app-581be.web.app
```

---

## 🛠️ Troubleshooting

### Error: "Firebase command not found"

```powershell
npm install -g firebase-tools
```

### Error: "Not logged in"

```powershell
firebase login
```

### Error: "Build failed"

```powershell
# Clean install dependencies
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```

### Error: "Deployment failed"

```powershell
# Check Firebase project
firebase projects:list

# Re-initialize if needed
firebase init hosting
```

---

## 🔄 Update Deployment

To deploy updates:

```powershell
# 1. Make code changes
# 2. Test locally
npm run dev

# 3. Build and deploy
npm run deploy
```

---

## 🌍 Custom Domain (Optional)

Add custom domain di Firebase Console:

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps
4. Wait for SSL certificate (auto-provisioned)

---

## 📊 Analytics & Monitoring

Firebase Hosting provides:

- Bandwidth usage
- Request count
- Response times
- Geographic distribution

View at: Firebase Console → Hosting → Usage tab

---

## 💡 Tips

- **Cache**: Assets (JS/CSS/images) cached for 1 year
- **Service Worker**: Not cached (always fresh)
- **Rollback**: Use Firebase Console to rollback to previous version
- **Preview**: Test with `npm run deploy:preview` before production
- **CI/CD**: Automate with GitHub Actions (optional)

---

## 📝 Notes

- Environment variables (`.env.local`) are bundled during build
- Make sure `.env.local` exists before building
- Firebase Hosting is free up to 10GB storage & 360MB/day bandwidth
- Upgrade to Blaze plan if needed (pay-as-you-go)
