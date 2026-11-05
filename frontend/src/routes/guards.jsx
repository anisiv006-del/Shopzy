import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export function RoleRoute({ role, children }) {
  const { user } = useAuth();
  if (user?.role !== role)
    return (
      <Navigate to={user?.role === "admin" ? "/admin" : "/shop"} replace />
    );
  return children;
}
