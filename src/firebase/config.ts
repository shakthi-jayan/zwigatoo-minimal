import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBETyxCA3e52jo9Xt88baoZKB2448AnZxs",
  authDomain: "studio-2338088615-80638.firebaseapp.com",
  projectId: "studio-2338088615-80638",
  storageBucket: "studio-2338088615-80638.firebasestorage.app",
  messagingSenderId: "176928764815",
  appId: "1:176928764815:web:1b26363e0aa61a779e91fa",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);