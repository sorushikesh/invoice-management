import { apiFetch } from "./api";
import type { Role } from "@/lib/auth";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id: string | number;
    email: string;
    name?: string;
  };
  roles?: Role[];
  tenantId?: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const allowDummy = (String(import.meta.env.VITE_ALLOW_DUMMY_LOGIN || "").toLowerCase() === "true") || import.meta.env.DEV;
  const emailLc = (data.email || "").toLowerCase();
  if (allowDummy && (emailLc === "admin" || emailLc === "admin@admin.com") && data.password === "adminadmin") {
    return Promise.resolve({
      token: "dummy-admin-token",
      user: { id: "admin", email: emailLc.includes("@") ? emailLc : "admin@local", name: "Administrator" },
      roles: ["TenantAdmin"],
      tenantId: "t-acme",
    });
  }
  return apiFetch<LoginResponse>("/users/login", {
    method: "POST",
    body: data,
    showErrorToast: false,
  });
}

export async function requestPasswordReset(email: string): Promise<{ ok: true }>{
  const allowDummy = (String(import.meta.env.VITE_ALLOW_DUMMY_LOGIN || "").toLowerCase() === "true") || import.meta.env.DEV;
  if (allowDummy) {
    await new Promise((r) => setTimeout(r, 500));
    return { ok: true };
  }
  await apiFetch("/users/forgot-password", { method: "POST", body: { email }, showErrorToast: false });
  return { ok: true };
}

// Dummy email verification for staged login UX
export async function verifyEmail(email: string): Promise<{ ok: boolean; tenantId?: string; name?: string }>{
  const allowDummy = (String(import.meta.env.VITE_ALLOW_DUMMY_LOGIN || "").toLowerCase() === "true") || import.meta.env.DEV;
  if (allowDummy) {
    const lc = (email || "").toLowerCase();
    await new Promise((r) => setTimeout(r, 400));
    if (!lc || !lc.includes("@")) return { ok: false };
    if (lc.includes("admin")) return { ok: true, tenantId: "t-acme", name: "Administrator" };
    if (lc.includes("acme")) return { ok: true, tenantId: "t-acme", name: "Acme User" };
    if (lc.includes("globex")) return { ok: true, tenantId: "t-globex", name: "Globex User" };
    return { ok: false };
  }
  // When backend is ready, switch to real endpoint
  try {
    const resp = await apiFetch<{ ok: boolean; tenantId?: string; name?: string }>("/auth/verify-email", { method: "POST", body: { email }, showErrorToast: false });
    return resp;
  } catch {
    return { ok: false };
  }
}

// Dummy OTP sender for email verification flows
export async function sendOtp(email: string): Promise<{ ok: true }>{
  const allowDummy = (String(import.meta.env.VITE_ALLOW_DUMMY_LOGIN || "").toLowerCase() === "true") || import.meta.env.DEV;
  if (allowDummy) {
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true };
  }
  await apiFetch("/auth/send-otp", { method: "POST", body: { email }, showErrorToast: false });
  return { ok: true };
}

export async function verifyOtp(email: string, otp: string): Promise<{ ok: boolean }>{
  const allowDummy = (String(import.meta.env.VITE_ALLOW_DUMMY_LOGIN || "").toLowerCase() === "true") || import.meta.env.DEV;
  const isSixDigits = /^\d{4,6}$/.test(String(otp || "").trim());
  if (allowDummy) {
    await new Promise((r) => setTimeout(r, 400));
    return { ok: isSixDigits };
  }
  try {
    const resp = await apiFetch<{ ok: boolean }>("/auth/verify-otp", { method: "POST", body: { email, otp }, showErrorToast: false });
    return resp;
  } catch {
    return { ok: false };
  }
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id?: string | number;
  email?: string;
  name?: string;
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  // Default service path; if you prefer a dedicated auth service,
  // set VITE_PROXY_AUTH and switch this to "/auth/users/register".
  return apiFetch<SignupResponse>("/users/register", {
    method: "POST",
    body: data,
  });
}
