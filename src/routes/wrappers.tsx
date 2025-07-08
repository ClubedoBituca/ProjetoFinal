import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";

import { PATHS } from "./paths";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return token ? <>{children}</> : <Navigate to={PATHS.LOGIN} replace />;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return !token ? <>{children}</> : <Navigate to={PATHS.HOME} replace />;
}
