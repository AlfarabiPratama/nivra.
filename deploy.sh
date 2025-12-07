#!/bin/bash
# Deploy script for Firebase Hosting

echo "🚀 Starting Firebase Hosting deployment..."

# 1. Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# 2. Build production bundle
echo "📦 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting deployment."
    exit 1
fi

echo "✅ Build successful!"

# 3. Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌍 Your app is live at:"
    echo "   https://nivra-app-581be.web.app"
    echo "   https://nivra-app-581be.firebaseapp.com"
else
    echo "❌ Deployment failed!"
    exit 1
fi
