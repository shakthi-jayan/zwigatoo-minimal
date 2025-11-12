import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
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

export const signInWithGoogle = async (role: 'customer' | 'staff') => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email: userCredential.user.email,
    name: userCredential.user.displayName || 'User',
    image: userCredential.user.photoURL || '',
    role,
    isAnonymous: false,
    createdAt: new Date(),
  }, { merge: true });
  return userCredential.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};