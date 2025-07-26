import { useUser } from "@clerk/clerk-react";
import { Navigate } from "@tanstack/react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "adjuster" | "clerical";
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded, user } = useUser();
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to="/signup" />;

  if (requiredRole) {
    const userRole = user?.publicMetadata?.role as string;
    if (userRole !== requiredRole && userRole !== "admin") {
      return (
        <div className="p-6 text-center">
          Access denied. Insufficient permissions.
        </div>
      );
    }
  }

  return <>{children}</>;
};
