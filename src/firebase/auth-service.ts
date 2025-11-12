import {
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, setDoc } from 'firebase/firestore';

export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAnonymous: boolean;
  role?: 'admin' | 'user' | 'member' | 'staff';
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

export const signOutUser = async () => {
  await signOut(auth);
};