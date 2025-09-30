export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;
// If no absolute API URL is provided, use relative "/api" (works with Vite proxy in dev)
export const API_BASE_URL = envApiUrl && envApiUrl.trim().length > 0 ? envApiUrl : "/api";

export interface ApiOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    credentials: "include", // allow cookie-based auth if backend uses it
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => undefined) : await response.text().catch(() => undefined);

  if (!response.ok) {
    const message = isJson && payload && (payload.message || payload.error) ? (payload.message || payload.error) : response.statusText;
    throw new Error(typeof message === "string" ? message : "Request failed");
  }

  return payload as T;
}

