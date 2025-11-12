import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn();
      toast.success("Signed in as guest");
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      const errorMsg = `Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`;
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Auth Content */}
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
              <CardTitle className="text-xl">Get Started</CardTitle>
              <CardDescription>
                Continue as a guest to explore Zwigatoo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleGuestLogin}
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
                    <UserX className="mr-2 h-4 w-4" />
                    Continue as Guest
                  </>
                )}
              </Button>
              {error && (
                <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
              )}
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
