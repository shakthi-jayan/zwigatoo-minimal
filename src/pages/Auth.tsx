import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserX, Mail } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signInGuest, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'guest' | 'email'>('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'customer' | 'staff'>('customer');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/dashboard";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInGuest();
      toast.success("Signed in as guest");
      const redirect = redirectAfterAuth || "/dashboard";
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      const errorMsg = `Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`;
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        await signUp(email, password, role);
        toast.success("Account created successfully");
      } else {
        await signIn(email, password);
        toast.success("Signed in successfully");
      }
      const redirect = redirectAfterAuth || "/dashboard";
      navigate(redirect);
    } catch (error) {
      console.error("Email auth error:", error);
      const errorMsg = `${isSignUp ? 'Sign up' : 'Sign in'} failed: ${error instanceof Error ? error.message : "Unknown error"}`;
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
              <CardTitle className="text-xl">
                {mode === 'guest' ? 'Get Started' : isSignUp ? 'Create Account' : 'Sign In'}
              </CardTitle>
              <CardDescription>
                {mode === 'guest' 
                  ? 'Continue as a guest to explore Zwigatoo'
                  : isSignUp
                  ? 'Create an account to get started'
                  : 'Sign in to your account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mode === 'guest' ? (
                <div className="space-y-3">
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
                  <Button
                    onClick={() => setMode('email')}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Sign in with Email
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {isSignUp && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
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
                  )}
                  <Button
                    onClick={handleEmailAuth}
                    disabled={isLoading || !email || !password}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isSignUp ? 'Creating...' : 'Signing in...'}
                      </>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsSignUp(!isSignUp)}
                    variant="ghost"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </Button>
                  <Button
                    onClick={() => {
                      setMode('guest');
                      setEmail('');
                      setPassword('');
                      setError(null);
                    }}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                </div>
              )}
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