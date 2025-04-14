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

        // Check local storage for authentication status
        if (authStatus === "true" && userString) {
          // Set authenticated from local storage and skip Supabase check for now
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Then verify with Supabase only if not already authenticated from localStorage
        const { data, error } = await getCurrentUser();

        if (error || !data.user) {
          // User is not authenticated according to Supabase
          console.log("Auth check failed: Not authenticated in Supabase");
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

        // Authentication check failed
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
  }, [toast]); // Removed location.pathname to prevent re-checking on navigation

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
