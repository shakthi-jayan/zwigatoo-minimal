import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

export interface User {
  _id: string;
  email?: string;
  name?: string;
  image?: string;
  role?: 'admin' | 'user' | 'member' | 'staff';
  isAnonymous?: boolean;
  createdAt?: Date;
}

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  available?: boolean;
  createdAt?: Date;
}

export interface Order {
  _id: string;
  userId: string;
  items: Array<{ itemId: string; quantity: number; price: number }>;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  outletId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Outlet {
  _id: string;
  name: string;
  location?: string;
  description?: string;
  image?: string;
  isOpen?: boolean;
  createdAt?: Date;
}

// User operations
export const getUser = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? { _id: uid, ...userDoc.data() } as User : null;
};

export const updateUser = async (uid: string, data: Partial<User>) => {
  await updateDoc(doc(db, 'users', uid), data);
};

// Menu operations
export const getMenuItems = async (filters?: QueryConstraint[]): Promise<MenuItem[]> => {
  const q = filters ? query(collection(db, 'menuItems'), ...filters) : collection(db, 'menuItems');
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: any) => ({ _id: doc.id, ...doc.data() } as MenuItem));
};

export const getMenuItem = async (id: string): Promise<MenuItem | null> => {
  const doc_ref = await getDoc(doc(db, 'menuItems', id));
  return doc_ref.exists() ? { _id: id, ...doc_ref.data() } as MenuItem : null;
};

export const createMenuItem = async (data: Omit<MenuItem, '_id'>) => {
  const newDoc = await setDoc(doc(collection(db, 'menuItems')), {
    ...data,
    createdAt: new Date(),
  });
  return newDoc;
};

export const updateMenuItem = async (id: string, data: Partial<MenuItem>) => {
  await updateDoc(doc(db, 'menuItems', id), data);
};

export const deleteMenuItem = async (id: string) => {
  await deleteDoc(doc(db, 'menuItems', id));
};

// Order operations
export const getOrders = async (filters?: QueryConstraint[]): Promise<Order[]> => {
  const q = filters ? query(collection(db, 'orders'), ...filters) : collection(db, 'orders');
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: any) => ({ _id: doc.id, ...doc.data() } as Order));
};

export const getOrder = async (id: string): Promise<Order | null> => {
  const doc_ref = await getDoc(doc(db, 'orders', id));
  return doc_ref.exists() ? { _id: id, ...doc_ref.data() } as Order : null;
};

export const createOrder = async (data: Omit<Order, '_id'>) => {
  const newDoc = await setDoc(doc(collection(db, 'orders')), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return newDoc;
};

export const updateOrder = async (id: string, data: Partial<Order>) => {
  await updateDoc(doc(db, 'orders', id), { ...data, updatedAt: new Date() });
};

export const deleteOrder = async (id: string) => {
  await deleteDoc(doc(db, 'orders', id));
};

// Outlet operations
export const getOutlets = async (filters?: QueryConstraint[]): Promise<Outlet[]> => {
  const q = filters ? query(collection(db, 'outlets'), ...filters) : collection(db, 'outlets');
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: any) => ({ _id: doc.id, ...doc.data() } as Outlet));
};

export const getOutlet = async (id: string): Promise<Outlet | null> => {
  const doc_ref = await getDoc(doc(db, 'outlets', id));
  return doc_ref.exists() ? { _id: id, ...doc_ref.data() } as Outlet : null;
};

export const createOutlet = async (data: Omit<Outlet, '_id'>) => {
  const newDoc = await setDoc(doc(collection(db, 'outlets')), {
    ...data,
    createdAt: new Date(),
  });
  return newDoc;
};

export const updateOutlet = async (id: string, data: Partial<Outlet>) => {
  await updateDoc(doc(db, 'outlets', id), data);
};

export const deleteOutlet = async (id: string) => {
  await deleteDoc(doc(db, 'outlets', id));
};
