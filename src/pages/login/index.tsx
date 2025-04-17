import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Backdoor login for development/testing - ALWAYS ENABLED
      if (email === "admin@faculty-eval.com" && password === "admin123") {
        console.log("Using backdoor login");
        // Store auth state in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "admin-user",
            email: "admin@faculty-eval.com",
            role: "Super Admin",
          }),
        );

        // Force a delay to ensure localStorage is set before navigation
        setTimeout(() => {
          console.log("Redirecting to dashboard");
          window.location.href = "/"; // Use direct location change instead of navigate
        }, 100);
        return;
      }

      // Regular authentication through Supabase
      const { data, error } = await signIn(email, password);

      if (error) {
        console.error("Supabase auth error:", error);
        setError(error.message || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      if (data) {
        // Store auth state in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(data.user));

        // Force a delay to ensure localStorage is set before navigation
        setTimeout(() => {
          console.log("Redirecting to dashboard after Supabase login");
          window.location.href = "/"; // Use direct location change instead of navigate
        }, 100);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/images/logo/grade-your-guide-logo.png"
            alt="Grade Your Guide Logo"
            className="mx-auto h-24 mb-4"
          />
          <h1 className="text-2xl font-bold">Grade Your Guide</h1>
          <p className="text-muted-foreground">Admin Portal</p>
          <p className="text-xs text-muted-foreground mt-2">
            Faculty Evaluation System
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="admin@faculty-eval.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Enter your administrator credentials to access the system
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
