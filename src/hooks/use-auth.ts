import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/config";
import { getUser } from "@/firebase/firestore-service";
import { signOutUser } from "@/firebase/auth-service";

export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAnonymous: boolean;
  role?: "admin" | "user" | "member" | "staff" | "customer";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      if (currentUser) {
        const userData = await getUser(currentUser.uid);
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          role: userData?.role,
          isAnonymous: userData?.isAnonymous ?? currentUser.isAnonymous,
        } as AuthUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { signInWithEmail } = await import("@/firebase/auth-service");
    await signInWithEmail(email, password);
  };

  const signUp = async (email: string, password: string, role: 'customer' | 'staff') => {
    const { signUpWithEmail } = await import("@/firebase/auth-service");
    await signUpWithEmail(email, password, role);
  };

  const signInGuest = async () => {
    const { signInAsGuest } = await import("@/firebase/auth-service");
    await signInAsGuest();
  };

  const signOut = async () => {
    await signOutUser();
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signUp,
    signInGuest,
    signOut,
  };
}