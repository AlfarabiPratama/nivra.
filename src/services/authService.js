import {
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
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
 * Uses popup - if blocked, throws error with helpful message
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

    // Provide helpful error messages
    if (error.code === "auth/popup-blocked") {
      const customError = new Error(
        "Popup diblokir browser. Izinkan popup untuk situs ini atau gunakan login Email."
      );
      customError.code = "auth/popup-blocked";
      throw customError;
    }

    if (error.code === "auth/popup-closed-by-user") {
      const customError = new Error("Popup ditutup. Coba lagi.");
      customError.code = "auth/popup-closed-by-user";
      throw customError;
    }

    throw error;
  }
};

/**
 * Handle redirect result - not used anymore due to browser restrictions
 * Kept for backwards compatibility
 */
export const handleRedirectResult = async () => {
  return null;
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

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email, password) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("Firebase not configured");
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("✅ Signed up with email:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("❌ Email sign-up error:", error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("Firebase not configured");
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Signed in with email:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("❌ Email sign-in error:", error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("Firebase not configured");
  }

  try {
    await sendPasswordResetEmail(auth, email);
    console.log("✅ Password reset email sent to:", email);
    return true;
  } catch (error) {
    console.error("❌ Password reset error:", error);
    throw error;
  }
};
