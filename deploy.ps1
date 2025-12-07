# Deploy script for Firebase Hosting (PowerShell)

Write-Host "🚀 Starting Firebase Hosting deployment..." -ForegroundColor Cyan

# 1. Check if Firebase CLI is installed
try {
    $null = Get-Command firebase -ErrorAction Stop
    Write-Host "✅ Firebase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Firebase CLI" -ForegroundColor Red
        exit 1
    }
}

# 2. Build production bundle
Write-Host "`n📦 Building production bundle..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Aborting deployment." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# 3. Deploy to Firebase Hosting
Write-Host "`n🌐 Deploying to Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌍 Your app is live at:" -ForegroundColor Cyan
    Write-Host "   https://nivra-app-581be.web.app" -ForegroundColor White
    Write-Host "   https://nivra-app-581be.firebaseapp.com" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
