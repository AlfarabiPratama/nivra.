import {
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../config/firebaseConfig";

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in anonymously
 * Perfect for personal use - no email/password required
 */
export const signInAnonymous = async () => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("Firebase not configured");
  }

  try {
    const result = await signInAnonymously(auth);
    console.log("✅ Signed in anonymously:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("❌ Anonymous sign-in error:", error);
    throw error;
  }
};

/**
 * Sign in with Google
 * Optional - if user wants to link account
 */
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("Firebase not configured");
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("✅ Signed in with Google:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("❌ Google sign-in error:", error);
    throw error;
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  if (!isFirebaseConfigured() || !auth) {
    return;
  }

  try {
    await firebaseSignOut(auth);
    console.log("✅ Signed out successfully");
  } catch (error) {
    console.error("❌ Sign-out error:", error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  if (!isFirebaseConfigured() || !auth) {
    return null;
  }
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthChange = (callback) => {
  if (!isFirebaseConfigured() || !auth) {
    return () => {}; // Return empty unsubscribe function
  }

  return onAuthStateChanged(auth, callback);
};

/**
 * Check if user is signed in
 */
export const isSignedIn = () => {
  return getCurrentUser() !== null;
};
