import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
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

export const sendOTPEmail = async (email: string) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/auth?email=${encodeURIComponent(email)}`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', email);
};

export const verifyOTPEmail = async (email: string) => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let emailToSignIn = email;
    if (!emailToSignIn) {
      emailToSignIn = window.localStorage.getItem('emailForSignIn') || '';
    }
    const userCredential = await signInWithEmailLink(auth, emailToSignIn, window.location.href);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        name: '',
        image: '',
        role: 'user',
        isAnonymous: false,
        createdAt: new Date(),
      });
    }
    window.localStorage.removeItem('emailForSignIn');
    return userCredential.user;
  }
  throw new Error('Invalid email link');
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
