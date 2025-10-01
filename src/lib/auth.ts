export type Role = "TenantAdmin" | "Accountant" | "Viewer";

export type SessionUser = {
  id: string | number;
  email: string;
  name?: string;
};

const TOKEN_KEY = "app:token";
const USER_KEY = "app:user";
const TENANT_KEY = "app:tenant";
const ROLES_KEY = "app:roles";

export function saveToken(token?: string) {
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | undefined {
  try {
    const t = localStorage.getItem(TOKEN_KEY);
    return t || undefined;
  } catch {
    return undefined;
  }
}

export function saveUser(user?: SessionUser) {
  if (!user) localStorage.removeItem(USER_KEY);
  else localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): SessionUser | undefined {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : undefined;
  } catch {
    return undefined;
  }
}

export function saveTenantId(tenantId?: string) {
  if (!tenantId) localStorage.removeItem(TENANT_KEY);
  else localStorage.setItem(TENANT_KEY, tenantId);
}

export function getTenantId(): string | undefined {
  try {
    const t = localStorage.getItem(TENANT_KEY);
    return t || undefined;
  } catch {
    return undefined;
  }
}

export function saveRoles(roles?: Role[]) {
  if (!roles || roles.length === 0) localStorage.removeItem(ROLES_KEY);
  else localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

export function getRoles(): Role[] {
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    return raw ? (JSON.parse(raw) as Role[]) : [];
  } catch {
    return [];
  }
}

export function clearSession() {
  saveToken(undefined);
  saveUser(undefined);
  saveTenantId(undefined);
  saveRoles(undefined);
}

