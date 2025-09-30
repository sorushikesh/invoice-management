export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;
// If no absolute API URL is provided, use relative "/api" (works with Vite proxy in dev)
export const API_BASE_URL = envApiUrl && envApiUrl.trim().length > 0 ? envApiUrl : "/api";

import { toast } from "@/hooks/use-toast";

export interface ApiOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  showErrorToast?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
      credentials: "include", // allow cookie-based auth if backend uses it
    });
  } catch (err) {
    const text = err instanceof Error ? err.message : "Network error";
    if (options.showErrorToast !== false) {
      toast({ title: "Network error", description: text, variant: "destructive" });
    }
    throw err;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => undefined) : await response.text().catch(() => undefined);

  if (!response.ok) {
    const message = (isJson && payload && (payload as any).message) || (payload as any)?.error || response.statusText;
    const text = typeof message === "string" ? message : "Request failed";
    if (options.showErrorToast !== false) {
      toast({ title: "Request failed", description: text, variant: "destructive" });
    }
    throw new Error(text);
  }

  return payload as T;
}
