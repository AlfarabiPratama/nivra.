import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getCurrentUser } from "./authService";

/**
 * Get user's Firestore path
 */
const getUserPath = () => {
  const user = getCurrentUser();
  if (!user) throw new Error("User not authenticated");
  return `users/${user.uid}`;
};

/**
 * Sync single document to Firestore
 */
export const syncDocToFirestore = async (collectionName, docId, data) => {
  if (!db) return;

  try {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, collectionName, docId);

    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Sync to Firestore error:", error);
    return false;
  }
};

/**
 * Delete document from Firestore
 */
export const deleteDocFromFirestore = async (collectionName, docId) => {
  if (!db) return;

  try {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Delete from Firestore error:", error);
    return false;
  }
};

/**
 * Sync entire collection to Firestore (batch)
 */
export const syncCollectionToFirestore = async (collectionName, items) => {
  if (!db || !items || items.length === 0) return;

  try {
    const userPath = getUserPath();
    const batch = writeBatch(db);

    items.forEach((item) => {
      const docRef = doc(db, userPath, collectionName, item.id);
      batch.set(
        docRef,
        {
          ...item,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    await batch.commit();
    console.log(`✅ Synced ${items.length} items to ${collectionName}`);
    return true;
  } catch (error) {
    console.error("Batch sync error:", error);
    return false;
  }
};

/**
 * Get collection from Firestore
 */
export const getCollectionFromFirestore = async (collectionName) => {
  if (!db) return [];

  try {
    const userPath = getUserPath();
    const colRef = collection(db, userPath, collectionName);
    const snapshot = await getDocs(colRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Get collection error:", error);
    return [];
  }
};

/**
 * Subscribe to real-time updates for a collection
 */
export const subscribeToCollection = (collectionName, callback) => {
  if (!db) return () => {};

  try {
    const userPath = getUserPath();
    const colRef = collection(db, userPath, collectionName);
    const q = query(colRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(items);
      },
      (error) => {
        console.error("Snapshot error:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Subscribe error:", error);
    return () => {};
  }
};

/**
 * Sync user profile data
 */
export const syncUserProfile = async (userData) => {
  if (!db) return;

  try {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(
      userDocRef,
      {
        ...userData,
        lastSyncAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Sync user profile error:", error);
    return false;
  }
};

/**
 * Get user profile data
 */
export const getUserProfile = async () => {
  if (!db) return null;

  try {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Get user profile error:", error);
    return null;
  }
};

/**
 * Check sync status
 */
export const checkSyncStatus = () => {
  const user = getCurrentUser();
  return {
    isAuthenticated: !!user,
    userId: user?.uid || null,
    isOnline: navigator.onLine,
    canSync: !!user && !!db && navigator.onLine,
  };
};
