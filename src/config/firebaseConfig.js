import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== "your_api_key_here"
  );
};

// Initialize Firebase only if configured
let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);

    // Initialize Firestore with persistent cache (new API)
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });

    auth = getAuth(app);

    console.log(
      "✅ Firebase initialized successfully with offline persistence"
    );
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
  }
} else {
  console.log("ℹ️ Firebase not configured. App will run in offline-only mode.");
}

// Check if sync is enabled
export const isSyncEnabled = () => {
  return (
    isFirebaseConfigured() &&
    import.meta.env.VITE_ENABLE_FIREBASE_SYNC !== "false"
  );
};

export { app, db, auth, isFirebaseConfigured };
