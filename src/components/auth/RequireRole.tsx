import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { Role } from "@/lib/auth";
import { useHasRole } from "@/contexts/AuthContext";

export function RequireRole({ role, children }: { role: Role | Role[]; children: ReactNode }) {
  const ok = useHasRole(role);
  const loc = useLocation();
  if (!ok) return <Navigate to="/auth" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}

