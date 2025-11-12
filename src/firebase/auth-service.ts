import {
  signInAnonymously,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, setDoc } from 'firebase/firestore';

export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAnonymous: boolean;
  role?: 'admin' | 'user' | 'member' | 'staff' | 'customer';
}

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

export const signUpWithEmail = async (email: string, password: string, role: 'customer' | 'staff') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email,
    name: email.split('@')[0],
    image: '',
    role,
    isAnonymous: false,
    createdAt: new Date(),
  });
  return userCredential.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};