import React from 'react';
import { Navigate, Outlet } from 'react-router';

type Props = {
  children?: React.JSX.Element;
  isAllowed: boolean;
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  isAllowed,
  redirectTo = '/',
}: Props): React.JSX.Element {
  if (!isAllowed) return <Navigate to={redirectTo} replace />;
  return children ?? <Outlet />;
}
