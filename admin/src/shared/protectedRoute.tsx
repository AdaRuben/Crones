import React from "react";
import { Navigate, Outlet } from "react-router";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  isAllowed: boolean | null;
  redirectTo: string;
};

export default function ProtectedRoute({ 
  children, 
  isAllowed, 
  redirectTo 
}: ProtectedRouteProps): React.ReactNode {
  if (!isAllowed) return <Navigate to={redirectTo} replace />;
  return children ?? <Outlet />;
}