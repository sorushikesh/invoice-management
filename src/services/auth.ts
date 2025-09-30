import { apiFetch } from "./api";

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
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const allowDummy = (String(import.meta.env.VITE_ALLOW_DUMMY_LOGIN || "").toLowerCase() === "true") || import.meta.env.DEV;
  const emailLc = (data.email || "").toLowerCase();
  if (allowDummy && (emailLc === "admin" || emailLc === "admin@admin.com") && data.password === "admin") {
    return Promise.resolve({
      token: "dummy-admin-token",
      user: { id: "admin", email: emailLc.includes("@") ? emailLc : "admin@local", name: "Administrator" },
    });
  }
  return apiFetch<LoginResponse>("/users/login", {
    method: "POST",
    body: data,
  });
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
