// JSON-based storage for users and menu items
// This replaces Firebase Firestore for local data persistence

export interface StoredUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'customer' | 'staff';
  isAnonymous: boolean;
  createdAt: string;
}

export interface StoredMenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  available?: boolean;
  createdAt: string;
}

export interface StoredOrder {
  _id: string;
  userId: string;
  items: Array<{ itemId: string; itemName: string; quantity: number; price: number }>;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface StorageData {
  users: StoredUser[];
  menuItems: StoredMenuItem[];
  orders: StoredOrder[];
}

const STORAGE_KEY = 'zwigatoo_data';

// Initialize default storage
const defaultData: StorageData = {
  users: [],
  menuItems: [],
  orders: [],
};

// Get all storage data
export const getStorageData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all required properties exist
      return {
        users: parsed.users || [],
        menuItems: parsed.menuItems || [],
        orders: parsed.orders || [],
      };
    }
    return defaultData;
  } catch {
    return defaultData;
  }
};

// Save all storage data
const saveStorageData = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving storage data:', error);
  }
};

// User operations
export const getUser = async (uid: string): Promise<StoredUser | null> => {
  const data = getStorageData();
  return data.users.find(u => u.uid === uid) || null;
};

export const saveUser = async (user: StoredUser): Promise<void> => {
  const data = getStorageData();
  const existingIndex = data.users.findIndex(u => u.uid === user.uid);
  
  if (existingIndex >= 0) {
    data.users[existingIndex] = user;
  } else {
    data.users.push(user);
  }
  
  saveStorageData(data);
};

// Menu item operations
export const getMenuItems = async (): Promise<StoredMenuItem[]> => {
  const data = getStorageData();
  return data.menuItems;
};

export const getMenuItem = async (id: string): Promise<StoredMenuItem | null> => {
  const data = getStorageData();
  return data.menuItems.find(item => item._id === id) || null;
};

export const createMenuItem = async (item: Omit<StoredMenuItem, '_id' | 'createdAt'>): Promise<StoredMenuItem> => {
  const data = getStorageData();
  const newItem: StoredMenuItem = {
    ...item,
    _id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  data.menuItems.push(newItem);
  saveStorageData(data);
  
  return newItem;
};

export const updateMenuItem = async (id: string, updates: Partial<StoredMenuItem>): Promise<void> => {
  const data = getStorageData();
  const index = data.menuItems.findIndex(item => item._id === id);
  
  if (index >= 0) {
    data.menuItems[index] = { ...data.menuItems[index], ...updates };
    saveStorageData(data);
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const data = getStorageData();
  data.menuItems = data.menuItems.filter(item => item._id !== id);
  saveStorageData(data);
};

// Order operations
export const getOrders = async (userId: string): Promise<StoredOrder[]> => {
  const data = getStorageData();
  return data.orders.filter(order => order.userId === userId);
};

export const getAllOrders = async (): Promise<StoredOrder[]> => {
  const data = getStorageData();
  return data.orders || [];
};

export const createOrder = async (order: Omit<StoredOrder, '_id' | 'createdAt'>): Promise<StoredOrder> => {
  const data = getStorageData();
  
  // Ensure orders array exists
  if (!data.orders) {
    data.orders = [];
  }
  
  const newOrder: StoredOrder = {
    ...order,
    _id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  data.orders.push(newOrder);
  saveStorageData(data);
  
  return newOrder;
};

export const updateOrder = async (id: string, updates: Partial<StoredOrder>): Promise<void> => {
  const data = getStorageData();
  const index = data.orders.findIndex(order => order._id === id);
  
  if (index >= 0) {
    data.orders[index] = { ...data.orders[index], ...updates };
    saveStorageData(data);
  }
};