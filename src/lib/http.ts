type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
};

type ApiResponseWrapper<T> = {
  status: string;
  message?: string;
  data?: T;
};

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};

const buildUrl = (base: string, path: string, query?: RequestOptions["query"]) => {
  const url = new URL(path, base);
  if (query) {
    Object.entries(query)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .forEach(([key, value]) => url.searchParams.append(key, String(value)));
  }
  return url.toString();
};

export async function request<TResponse>(
  baseUrl: string,
  path: string,
  { method = "GET", headers, body, query }: RequestOptions = {},
): Promise<TResponse> {
  const url = buildUrl(baseUrl, path, query);
  const init: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(url, init);
  if (!response.ok) {
    let errorPayload: unknown;
    try {
      errorPayload = await response.json();
    } catch {
      errorPayload = await response.text();
    }

    throw new Error(
      response.status === 0
        ? "Network request failed"
        : `Request failed (${response.status}): ${JSON.stringify(errorPayload)}`,
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const payload = (await response.json()) as unknown;

  if (
    payload &&
    typeof payload === "object" &&
    "status" in payload &&
    typeof (payload as ApiResponseWrapper<unknown>).status === "string" &&
    "data" in payload
  ) {
    const apiResponse = payload as ApiResponseWrapper<TResponse>;
    if (apiResponse.status !== "SUCCESS") {
      throw new Error(apiResponse.message ?? "Request failed");
    }
    return (apiResponse.data ?? (undefined as TResponse)) as TResponse;
  }

  return payload as TResponse;
}
