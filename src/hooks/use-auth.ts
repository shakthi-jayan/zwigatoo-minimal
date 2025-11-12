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
  role?: "admin" | "user" | "member" | "staff";
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
          ...currentUser,
          role: userData?.role,
          isAnonymous: userData?.isAnonymous,
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

  const signIn = async (method: string, formData: FormData) => {
    const { sendOTPEmail, verifyOTPEmail, signInAsGuest } = await import(
      "@/firebase/auth-service"
    );

    if (method === "email-otp") {
      const email = formData.get("email") as string;
      const code = formData.get("code") as string;

      if (code) {
        // Code provided, verify it
        await verifyOTPEmail(email);
      } else {
        // No code, send OTP (which handles both signup and signin)
        await sendOTPEmail(email);
      }
    } else if (method === "anonymous") {
      await signInAsGuest();
    }
  };

  const signOut = async () => {
    await signOutUser();
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
