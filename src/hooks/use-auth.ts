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
        try {
          const userData = await getUser(currentUser.uid);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: userData?.role || "customer",
            isAnonymous: userData?.isAnonymous ?? currentUser.isAnonymous,
          } as AuthUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Silently handle Firestore offline errors - use default role
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: "customer",
            isAnonymous: currentUser.isAnonymous,
          } as AuthUser);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await signOutUser();
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    signOut,
  };
}