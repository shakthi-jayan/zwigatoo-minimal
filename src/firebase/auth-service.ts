import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  User,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAnonymous: boolean;
  role?: 'admin' | 'user' | 'member' | 'staff';
}

export const sendOTPEmail = async (email: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', email));
    if (userDoc.exists()) {
      // User exists, sign in
      await signInUser(email, email);
    } else {
      // User doesn't exist, create account
      await createUser(email, email);
    }
  } catch (error) {
    throw error;
  }
};

export const verifyOTPEmail = async (email: string) => {
  // For this simplified flow, verification happens during sendOTPEmail
  // Just return success
  return { uid: email };
};

export const createUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email: userCredential.user.email,
    name: '',
    image: '',
    role: 'user',
    isAnonymous: false,
    createdAt: new Date(),
  });
  return userCredential.user;
};

export const signInUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInAsGuest = async () => {
  const userCredential = await signInAnonymously(auth);
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email: '',
    name: 'Guest User',
    image: '',
    role: 'user',
    isAnonymous: true,
    createdAt: new Date(),
  });
  return userCredential.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const getCurrentUser = async (uid: string): Promise<AuthUser | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return {
        ...currentUser,
        role: userDoc.data().role,
        isAnonymous: userDoc.data().isAnonymous,
      } as AuthUser;
    }
  }
  return null;
};
