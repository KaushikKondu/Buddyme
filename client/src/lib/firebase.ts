import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup,
  signInWithRedirect, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
  UserCredential,
  getRedirectResult
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Email/Password Authentication
export const loginWithEmail = (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Social Authentication
export const loginWithGoogle = (): Promise<UserCredential> => {
  return signInWithPopup(auth, googleProvider);
};

export const loginWithFacebook = (): Promise<UserCredential> => {
  return signInWithPopup(auth, facebookProvider);
};

// Check for redirect result
export const getAuthResult = (): Promise<UserCredential | null> => {
  return getRedirectResult(auth);
};

// Sign out
export const logout = (): Promise<void> => {
  return signOut(auth);
};

// Auth state observer
export const onAuthChange = (callback: (user: FirebaseUser | null) => void): () => void => {
  return onAuthStateChanged(auth, callback);
};

// Verify user with backend after social login
export const verifyUserWithBackend = async (user: FirebaseUser) => {
  const idToken = await user.getIdToken();
  
  try {
    const response = await fetch('/api/auth/provider-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        providerId: user.uid,
        provider: user.providerData[0]?.providerId || 'unknown',
        displayName: user.displayName,
        photoURL: user.photoURL
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify user with backend');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying user with backend:', error);
    throw error;
  }
};
