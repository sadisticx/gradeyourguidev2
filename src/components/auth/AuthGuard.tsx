import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check local storage for quick loading
        const authStatus = localStorage.getItem("isAuthenticated");
        const userString = localStorage.getItem("user");

        // Check if this is the backdoor admin login
        if (authStatus === "true" && userString) {
          const user = JSON.parse(userString);
          if (user.isBackdoorAdmin) {
            // Allow backdoor admin without Supabase verification
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }

        if (authStatus === "true") {
          setIsAuthenticated(true);
        }

        // Then verify with Supabase
        const { data, error } = await getCurrentUser();

        if (error || !data.user) {
          // Check again if it's the backdoor admin before clearing
          const userString = localStorage.getItem("user");
          if (userString) {
            const user = JSON.parse(userString);
            if (user.isBackdoorAdmin) {
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            }
          }

          // Clear local storage if server says not authenticated
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        } else {
          // Update local storage with current auth state
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(data.user));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);

        // Check if it's the backdoor admin before showing error
        const userString = localStorage.getItem("user");
        if (userString) {
          try {
            const user = JSON.parse(userString);
            if (user.isBackdoorAdmin) {
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }

        toast({
          title: "Authentication Error",
          description:
            "Failed to verify your login status. Please try logging in again.",
          variant: "destructive",
        });
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [toast, location.pathname]); // Added location.pathname to dependencies to prevent logout on navigation

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
