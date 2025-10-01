import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTenants, Tenant } from "@/services/data";
import { useAuth } from "@/contexts/AuthContext";

type TenantContextValue = {
  tenants: Tenant[];
  current?: Tenant;
  applyBranding: (t: Tenant) => void;
};

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { tenantId, setTenant } = useAuth();
  const [tenants] = useState<Tenant[]>(() => getTenants());

  const current = useMemo(() => tenants.find(t => t.id === tenantId), [tenants, tenantId]);

  const applyBranding = (t: Tenant) => {
    const root = document.documentElement;
    if (t.brandColor) {
      root.style.setProperty("--primary", t.brandColor);
    }
    root.setAttribute("data-tenant", t.id);
    if (t.theme === "dark") root.classList.add("dark");
    if (t.theme === "light") root.classList.remove("dark");
    window.dispatchEvent(new CustomEvent("tenant-brand-change", { detail: { id: t.id } }));
  };

  useEffect(() => {
    if (current) applyBranding(current);
    if (!tenantId && tenants.length > 0) {
      // pick first tenant as default in mock
      setTenant(tenants[0].id);
    }
  }, [current?.id, current?.brandColor, current?.theme]);

  const value = useMemo(() => ({ tenants, current, applyBranding }), [tenants, current]);
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
