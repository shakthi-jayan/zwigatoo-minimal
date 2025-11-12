import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'customer' | 'staff'>('customer');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/dashboard";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { signInWithGoogle } = await import("@/firebase/auth-service");
      await signInWithGoogle(role);
      toast.success("Signed in with Google");
      const redirect = redirectAfterAuth || "/dashboard";
      navigate(redirect);
    } catch (error) {
      console.error("Google login error:", error);
      const errorMsg = `Failed to sign in: ${error instanceof Error ? error.message : "Unknown error"}`;
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center h-full flex-col">
          <Card className="min-w-[350px] pb-0 border">
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <img
                  src="./logo.svg"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="rounded-lg mb-4 mt-4 cursor-pointer"
                  onClick={() => navigate("/")}
                />
              </div>
              <CardTitle className="text-xl">Sign In to Zwigatoo</CardTitle>
              <CardDescription>
                Select your role and sign in with Google
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'customer' | 'staff')}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth_providers/google.svg" alt="Google" className="mr-2 h-4 w-4" />
                      Sign in with Google
                    </>
                  )}
                </Button>
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
              </div>
            </CardContent>
            <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
              Secured by{" "}
              <a
                href="https://vly.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                vly.ai
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}