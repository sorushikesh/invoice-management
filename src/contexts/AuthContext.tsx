import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { getRoles, getTenantId, getToken, getUser, Role, saveRoles, saveTenantId, saveToken, saveUser, clearSession, SessionUser } from "@/lib/auth";
import type { LoginResponse } from "@/services/auth";

type AuthState = {
  user?: SessionUser;
  token?: string;
  roles: Role[];
  tenantId?: string;
};

type AuthContextValue = AuthState & {
  setSession: (resp: LoginResponse & { roles?: Role[]; tenantId?: string }) => void;
  logout: () => void;
  setTenant: (tenantId: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const roles = getRoles();
    const devRoles = import.meta.env.DEV && roles.length === 0 ? ["TenantAdmin"] : roles;
    return { user: getUser(), token: getToken(), roles: devRoles, tenantId: getTenantId() };
  });

  useEffect(() => {
    // Keep storage in sync (in case of external changes)
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key.includes("app:")) {
        setState({ user: getUser(), token: getToken(), roles: getRoles(), tenantId: getTenantId() });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    setSession: (resp) => {
      if (resp.token) saveToken(resp.token);
      if (resp.user) saveUser(resp.user);
      if (resp.roles) saveRoles(resp.roles);
      if (resp.tenantId) saveTenantId(String(resp.tenantId));
      setState({
        token: resp.token || getToken(),
        user: resp.user || getUser(),
        roles: resp.roles || getRoles(),
        tenantId: resp.tenantId || getTenantId(),
      });
    },
    logout: () => {
      clearSession();
      setState({ user: undefined, token: undefined, roles: [], tenantId: undefined });
    },
    setTenant: (tenantId: string) => {
      saveTenantId(tenantId);
      setState((s) => ({ ...s, tenantId }));
    },
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useHasRole(required: Role | Role[]) {
  const { roles } = useAuth();
  const list = Array.isArray(required) ? required : [required];
  return list.some((r) => roles.includes(r));
}
