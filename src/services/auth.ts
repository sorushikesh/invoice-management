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
  return apiFetch<LoginResponse>("/auth/login", {
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
  return apiFetch<SignupResponse>("/auth/register", {
    method: "POST",
    body: data,
  });
}

