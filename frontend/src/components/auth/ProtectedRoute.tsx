import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";

import { useAuth } from "../../context/AuthContext";
import type { Role } from "../../types/api";

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};
