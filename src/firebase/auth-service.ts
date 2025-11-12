import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './config';
import { saveUser } from '@/lib/storage';

export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAnonymous: boolean;
  role?: 'admin' | 'user' | 'member' | 'staff' | 'customer';
}

export const signInWithGoogle = async (role: 'customer' | 'staff') => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  
  // Save user to local storage instead of Firestore
  await saveUser({
    uid: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName || 'User',
    photoURL: userCredential.user.photoURL || '',
    role,
    isAnonymous: false,
    createdAt: new Date().toISOString(),
  });
  
  return userCredential.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};